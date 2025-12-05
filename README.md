# NYC Affordable Housing Finder – Full‑Stack Web Application

A comprehensive web application designed to help home buyers analyze affordable housing options across New York City. The system goes beyond simple price listings to provide total cost of ownership analysis, including property taxes, commute expenses, insurance, and other hidden costs.

## Problem Statement

The NYC housing market presents significant challenges for home buyers:
- Housing costs vary dramatically across neighborhoods and boroughs
- True affordability involves more than listing prices
- No single platform consolidates all cost factors for comprehensive analysis
- Buyers struggle to compare options across different locations

## Solution Overview

This application serves as an IT consulting solution that helps home buyers make informed decisions by:
- Calculating true affordability based on comprehensive financial factors
- Providing visual representations through interactive maps and charts
- Enabling side-by-side property comparisons
- Factoring in location-based cost variations including commute costs

---

## Core Features

### Implemented Features

#### FR-1: User Registration & Profile Management
- User registration with email and password
- Secure login system
- Create an account to test locally

#### FR-2: Budget Calculator
- Annual salary input
- Monthly debt calculation
- Down payment consideration
- Work address input for commute cost estimation
- Interest rate and loan term configuration
- Calculates maximum monthly housing budget using 43% DTI ratio
- Provides recommended affordable price range
- Displays comprehensive financial breakdown

#### FR-3: Property Search & Filtering
- Filter by minimum/maximum price
- Filter by number of bedrooms
- Filter by county/borough
- Real-time search results
- Grid and map view options
- 25+ pre-seeded affordable housing units across all 5 NYC boroughs

#### FR-4: Total Cost Calculation
- Mortgage payment calculation (20% down, configurable rate)
- Property tax estimation (1.5% annually)
- Homeowner's insurance (0.5% annually)
- Commute cost estimation by borough
- Complete monthly cost breakdown displayed on each property card

#### FR-5: Interactive Map Visualization
- SVG-based NYC borough map
- Property markers positioned by location
- Hover tooltips showing property details
- Visual representation of all 5 boroughs
- Legend showing unit count per borough

#### FR-6: Property Comparison Tool
- Add up to 3 properties for side-by-side comparison
- Comprehensive comparison table
- Price and cost breakdown comparison
- Property specifications comparison
- Visual insights showing best value options
- Badge notification showing number of properties in comparison

#### FR-7: Saved Searches & Favorites (UI Ready)
- Save/favorite button on property cards
- Dedicated "Saved Units" page
- (Backend integration pending)

#### FR-8: Commute Cost Estimation
- Integrated into total monthly cost calculation
- Borough-based commute cost estimation
- Manhattan: $150/mo
- Brooklyn/Bronx: $200/mo
- Queens: $250/mo
- Staten Island: $300/mo

---

## Tech Stack

### Frontend
- **React 18** - Modern component-based UI
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icon system

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **PostgreSQL** - Relational database
- **pg** - PostgreSQL client for Node.js

### Architecture
Three-tier architecture:
1. **Presentation Layer**: React SPA with responsive design
2. **Application Layer**: Express REST API with business logic
3. **Data Layer**: PostgreSQL database with seed data

---

## Project Structure

```
nyc-housing-finder/
├── client/                          # Frontend React application
│   ├── src/
│   │   ├── App.jsx                 # Main application component
│   │   ├── main.jsx                # React entry point
│   │   └── index.css               # Global styles + Tailwind
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── server/                          # Backend Express API
    ├── server.js                   # Main Express server
    ├── seed.js                     # Database seeding script
    ├── schema.sql                  # PostgreSQL schema
    └── package.json
```

---

## Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 12+

### Database Setup

```bash
# Create the database
psql -U postgres
CREATE DATABASE nyc_housing;
\q

# Run the schema
cd server
psql -U postgres -d nyc_housing -f schema.sql
```

### Backend Setup

```bash
cd server
npm install
npm run seed      # Seed the database with 25 properties
npm run dev       # Start server on port 4000
```

### Frontend Setup

```bash
cd client
npm install
npm run dev       # Start dev server on port 5173
```

### Access the Application

Open your browser to: `http://localhost:5173`

Login with demo account:
- **Email**: demo@demo.com
- **Password**: password123

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - User authentication

### Properties
- `GET /api/properties` - Search properties with filters
  - Query params: `minPrice`, `maxPrice`, `bedrooms`, `county`, `limit`
- `GET /api/properties/stats` - Get property statistics

### Budget Calculator
- `POST /api/calculator/budget` - Calculate affordable budget
  - Body: `annualSalary`, `monthlyDebts`, `downPayment`, `interestRate`, `loanTerm`, `workAddress`

### Health Check
- `GET /api/health` - Server health status

---

## Key Algorithms & Calculations

### Budget Calculation (43% DTI Rule)
```
monthlyGrossIncome = annualSalary / 12
maxMonthlyPayment = (monthlyGrossIncome × 0.43) - monthlyDebts
maxLoanAmount = maxMonthlyPayment × [(1+r)^n - 1] / [r(1+r)^n]
maxHomePrice = maxLoanAmount + downPayment
```

### Mortgage Calculation
```
M = P × [r(1+r)^n] / [(1+r)^n - 1]
Where:
  M = Monthly mortgage payment
  P = Loan amount (price - down payment)
  r = Monthly interest rate (annual rate / 12)
  n = Total number of payments (years × 12)
```

### Total Monthly Cost
```
Total = Mortgage + PropertyTax + Insurance + Commute
PropertyTax = (price × 0.015) / 12
Insurance = (price × 0.005) / 12
Commute = Borough-based estimate
```

---

## Non-Functional Requirements

### NFR-1: Usability - Responsive Web Interface
- Fully responsive design using Tailwind CSS
- Works on desktop, tablet, and mobile
- Collapsible sidebar navigation
- Intuitive user interface with clear visual hierarchy

### NFR-2: Performance - Fast Response Times
- In-memory data processing for quick calculations
- Efficient PostgreSQL queries with proper indexing
- Vite for optimized frontend bundling
- Client-side filtering and sorting

### NFR-3: Security - User Data Protection
- Basic password authentication (prototype level)
- CORS enabled for API security
- Input validation on forms
- Note: Production will be changed to password hashing using (bcrypt), JWT tokens, HTTPS

### NFR-4: Reliability
- Error handling throughout application
- Try-catch blocks for API calls
- Fallback UI states for missing data
- Database constraints and validations

### NFR-5: Compatibility - Cross-Browser Support
- Modern browsers (Chrome, Firefox, Edge, Safari)
- ES6+ JavaScript with polyfills via Vite
- Responsive CSS using Tailwind utilities

---

## User Stories & Acceptance Criteria

### Story 1: Budget Calculation
**As a home buyer, I want to enter my financial information to see what I can afford**
- System calculates mortgage using standard formulas
- Displays maximum monthly budget
- Shows affordable price range
- Includes debt-to-income ratio calculation

### Story 2: Interactive Map
**As a home buyer, I want to see properties on a map to understand location context**
- Map displays all 5 NYC boroughs
- Properties shown as markers
- Hover tooltips show property details
- Map updates with filter changes

### Story 3: Cost Comparison
**As a cost-conscious buyer, I want to compare total monthly costs across different areas**
- Cost breakdown shows individual components clearly
- Each property card displays complete cost details
- Comparison view shows side-by-side analysis

### Story 4: Commute Filtering
**As a commuter, I want to factor in commute costs to my workplace**
- Work address input in budget calculator
- Borough-based commute cost estimation
- Commute costs included in total monthly calculation

---

## Data Sources

| Data Type | Source | Status |
|-----------|--------|--------|
| Property Listings | Seeded Database (25 units) | Implemented |
| Tax Information | Estimated at 1.5% annually | Implemented |
| Commute Data | Borough-based estimates | Implemented |
| Insurance Rates | Estimated at 0.5% annually | Implemented |

**Future Enhancement**: Integration with real APIs (Zillow, Google Maps, GreatSchools)

---

## System Constraints & Assumptions

### Constraints
- 4-week development timeline (prototype)
- Single developer resource
- Web-only platform (no mobile app yet)
- Local database
- Open-source technologies only

### Assumptions
- Users have reliable internet access
- Mortgage rates fixed at 6.5% (configurable)
- Property tax rates based on 1.5% average
- Commute costs estimated using standard rates
- 20% down payment standard for calculations
- Basic user data privacy compliance

---

## Testing Recommendations

### Unit Testing
- Budget calculation formulas
- Mortgage payment calculations
- Filter logic validation
- Cost breakdown accuracy

### Integration Testing
- API endpoint responses
- Database query results
- Frontend-backend communication

### User Acceptance Testing
- Budget calculator workflow
- Property search and filtering
- Property comparison feature
- Map interaction and visualization

---

## Future Enhancements

### Phase 2 Features
- Real-time property data via Zillow API
- Google Maps integration for accurate commute times
- School district ratings integration
- Advanced filtering (property type, year built, square footage)
- User profile management
- Persistent saved searches and favorites
- Email notifications for new listings
- Mortgage pre-qualification integration

### Technical Improvements
- Redis caching layer for improved performance
- JWT authentication with refresh tokens
- Password hashing with bcrypt
- API rate limiting and throttling
- Comprehensive error logging
- Automated testing suite
- CI/CD pipeline
- Docker containerization

---

## Deployment Strategy

### Development
- Backend: Node.js on port 4000
- Frontend: Vite dev server on port 5173
- Database: PostgreSQL local instance

### Production Options

**Option 1: Separate Deployment**
- Frontend → Vercel/Netlify (static hosting)
- Backend → Render/Railway (Node.js hosting)
- Database → Heroku Postgres/AWS RDS

**Option 2: Combined Deployment**
- Build React app: `npm run build`
- Serve from Express using `express.static`
- Deploy to single hosting platform

---

## Documentation

### User Documentation
- **About Page**: Comprehensive mission statement and feature overview
- **Help Page**: Detailed guides on using each feature
- **In-App Tooltips**: Contextual help throughout the application

### Technical Documentation
- **Code Comments**: Inline documentation in all major components
- **API Documentation**: Endpoint descriptions in this README
- **Database Schema**: Documented in schema.sql

---

## License

MIT License - Free for educational and commercial use

---

## Support & Contact

For issues or questions:
- Email: support@nycaffordablehousing.com
- GitHub: [Project Repository]

---

## Acknowledgments

- Built as a proof-of-concept IT consulting solution
- NYC housing data for educational purposes
- Icons by Lucide React
- UI framework by Tailwind CSS
