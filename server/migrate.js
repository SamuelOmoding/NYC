const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database configuration
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function migrate() {
    console.log('Starting database migration...');

    try {
        // Read the schema file
        const schemaPath = path.join(__dirname, 'schema.sql');
        let schema = fs.readFileSync(schemaPath, 'utf8');

        // Remove the database connection line (not needed on Railway)
        schema = schema.replace(/\\c nyc_housing;/g, '');

        // Split the schema into individual statements
        const statements = schema
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('CREATE DATABASE'));

        // Execute each statement
        for (const statement of statements) {
            if (statement.trim()) {
                console.log('Executing:', statement.substring(0, 50) + '...');
                await pool.query(statement);
            }
        }

        console.log('✅ Database migration completed successfully!');

        // Check if we need to seed data
        const result = await pool.query('SELECT COUNT(*) FROM properties');
        const count = parseInt(result.rows[0].count);

        if (count === 0) {
            console.log('Database is empty. Run `npm run seed` to populate with sample data.');
        } else {
            console.log(`Database has ${count} properties.`);
        }

    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

migrate();
