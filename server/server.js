const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const allowedOrigins = [
  'http://localhost:5173',
  'https://mellow-flow-production-f594.up.railway.app',
  process.env.CLIENT_URL, // Add client URL from environment variable 
].filter(Boolean); // Remove undefined values 

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const app = express();
const PORT = process.env.PORT || 4000;

// Database configuration 
// const pool = new Pool({ 
// user: 'postgres', 
// host: 'localhost', 
// database: 'nyc_housing', 
// password: 'yosemite', 
// port: 5432, 
// }); 

// Middleware 
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc) 
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS not allowed'), false);
    } return callback(null, true);
  },
  credentials: true
}));
app.use(express.json());

// Health check 
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Auth routes 
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists 
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        error: 'User already exists'
      });
    }

    // Insert new user (in production, hash the password!) 
    const result = await pool.query(
      'INSERT INTO users (name, email, password, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id, name, email',
      [name, email, password]
    );

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      'SELECT id, name, email FROM users WHERE email = $1 AND password = $2',
      [email, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Property routes 
app.get('/api/properties', async (req, res) => {
  try {
    const { minPrice, maxPrice, bedrooms, county, limit } = req.query;
    let query = 'SELECT * FROM properties WHERE 1=1'; const params = []; let paramCount = 1;
    if (minPrice) {
      query += ' AND price >= $${paramCount}';
      params.push(parseFloat(minPrice));
      paramCount++;
    }
    if (maxPrice) {
      query += ' AND price <= $${paramCount}';
      params.push(parseFloat(maxPrice));
      paramCount++;
    }

    if (bedrooms) {
      query += ' AND bedrooms = $${paramCount}';
      params.push(parseInt(bedrooms));
      paramCount++;
    }
    if (county) {
      query += ' AND county = $${paramCount}';
      params.push(county); paramCount++;
    }

    query += ' ORDER BY price ASC';

    if (limit) {
      query += ' LIMIT $${paramCount}';
      params.push(parseInt(limit));
    }

    const result = await pool.query(query, params);

    // Calculate total monthly cost for each property 
    const properties = result.rows.map(property => {
      const costs = calculateMonthlyCosts(property);
      return {
        ...property,
        total_monthly_cost: costs.total,
        cost_breakdown: costs.breakdown
      };
    });

    res.json(properties);
  } catch (error) {
    console.error('Properties fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch properties'
    });
  }
});

app.get('/api/properties/stats', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT COUNT(*) as total, AVG(price) as avg_price, MIN(price) as min_price, MAX(price) as max_price, AVG(bedrooms) as avg_bedrooms FROM properties');

    const stats = result.rows[0];
    res.json({
      total: parseInt(stats.total),
      avgPrice: Math.round(parseFloat(stats.avg_price)),
      minPrice: Math.round(parseFloat(stats.min_price)),
      maxPrice: Math.round(parseFloat(stats.max_price)),
      avgBedrooms: parseFloat(stats.avg_bedrooms)
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Budget calculator 
app.post('/api/calculator/budget', (req, res) => {
  try {
    const { annualSalary, monthlyDebts, downPayment,
      interestRate, loanTerm } = req.body;

    const monthlyGrossIncome = parseFloat(annualSalary) / 12;
    const monthlyDebt = parseFloat(monthlyDebts);
    const down = parseFloat(downPayment);
    const rate = parseFloat(interestRate) / 100 / 12;
    // Monthly interest rate 
    const term = parseInt(loanTerm) * 12; // Loan term in months 

    // DTI calculation (max 43% for housing + debts) 
    // const maxMonthlyPayment = monthlyGrossIncome * 0.43 - monthlyDebt; 

    // Calculate max loan amount using mortgage formula 
    // M = P * [r(1+r)^n] / [(1+r)^n - 1] 
    // Rearranged: P = M * [(1+r)^n - 1] / [r(1+r)^n] 
    const maxLoanAmount = maxMonthlyPayment * (Math.pow(1 + rate, term) - 1) / (rate * Math.pow(1 + rate, term));
    const maxHomePrice = maxLoanAmount + down;
    const minHomePrice = maxHomePrice * 0.5; // Suggest a range 

    const dti = ((monthlyDebt / monthlyGrossIncome) * 100).toFixed(2);

    res.json({
      maxMonthlyBudget:
        Math.round(maxMonthlyPayment),
      affordablePriceRange: {
        min: Math.round(minHomePrice),
        max: Math.round(maxHomePrice)
      },
      monthlyGrossIncome:
        Math.round(monthlyGrossIncome),
      dti: parseFloat(dti)
    });
  } catch (error) {
    console.error('Budget calculation error:', error);
    res.status(500).json({
      error: 'Budget calculation failed'
    });
  }
});

// Helper function to calculate monthly costs 
function calculateMonthlyCosts(property) {
  const price = property.price;
  const downPayment = price * 0.2; // 20% down 
  const loanAmount = price - downPayment;
  const interestRate = 0.065 / 12; // 6.5% annual, monthly 
  const loanTermMonths = 30 * 12; // 30 years 

  // Mortgage payment calculation 
  const mortgage = loanAmount * (interestRate * Math.pow(1 + interestRate, loanTermMonths)) /
    (Math.pow(1 + interestRate, loanTermMonths) - 1);

  // Property tax (estimated 1.5% annual, divided by 12)
  const propertyTax = (price * 0.015) / 12;

  // Insurance (estimated 0.5% annual, divided by 12) 
  const insurance = (price * 0.005) / 12;

  // Commute cost (estimated based on distance from Manhattan) 
  const commuteCosts = {
    'Manhattan': 150,
    'Brooklyn': 200,
    'Queens': 250,
    'Bronx': 200,
    'Staten Island': 300
  };
  const commute = commuteCosts[property.county] || 200;
  const total = Math.round(mortgage + propertyTax + insurance + commute);
  return {
    total,
    breakdown: {
      mortgage: Math.round(mortgage),
      property_tax: Math.round(propertyTax),
      insurance: Math.round(insurance),
      commute: commute
    }
  };
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



