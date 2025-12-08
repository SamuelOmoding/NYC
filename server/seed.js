import dotenv from "dotenv";
dotenv.config();


const { Pool } = require('pg');



const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const properties = [
  // Manhattan Properties
  {
    address: '123 East 42nd Street, Apt 5B',
    neighborhood: 'Midtown East',
    county: 'Manhattan',
    price: 550000,
    bedrooms: 2,
    bathrooms: 1.5,
    square_feet: 850,
    property_type: 'Condo',
    year_built: 1985,
    latitude: 40.7520,
    longitude: -73.9745,
    image_url: 'placeholder-image-1.jpg',
    description: 'Charming 2-bedroom condo in the heart of Midtown. Close to Grand Central and excellent restaurants.'
  },
  {
    address: '789 Amsterdam Avenue, Unit 12C',
    neighborhood: 'Upper West Side',
    county: 'Manhattan',
    price: 675000,
    bedrooms: 3,
    bathrooms: 2,
    square_feet: 1100,
    property_type: 'Co-op',
    year_built: 1975,
    latitude: 40.7870,
    longitude: -73.9754,
    image_url: 'placeholder-image-2.jpg',
    description: 'Spacious 3-bedroom co-op near Central Park. Perfect for families with great school district.'
  },
  {
    address: '456 West 125th Street, Apt 8A',
    neighborhood: 'Harlem',
    county: 'Manhattan',
    price: 425000,
    bedrooms: 2,
    bathrooms: 1,
    square_feet: 900,
    property_type: 'Condo',
    year_built: 2005,
    latitude: 40.8116,
    longitude: -73.9465,
    image_url: 'placeholder-image-3.jpg',
    description: 'Modern condo in historic Harlem. Walking distance to subway and local amenities.'
  },
  {
    address: '321 Broadway, Apt 4D',
    neighborhood: 'Financial District',
    county: 'Manhattan',
    price: 625000,
    bedrooms: 1,
    bathrooms: 1,
    square_feet: 750,
    property_type: 'Condo',
    year_built: 2010,
    latitude: 40.7089,
    longitude: -74.0104,
    image_url: 'placeholder-image-4.jpg',
    description: 'Luxury 1-bedroom with stunning views. Building has gym, doorman, and rooftop terrace.'
  },
  
  // Brooklyn Properties
  {
    address: '234 Bedford Avenue',
    neighborhood: 'Williamsburg',
    county: 'Brooklyn',
    price: 520000,
    bedrooms: 2,
    bathrooms: 1,
    square_feet: 950,
    property_type: 'Condo',
    year_built: 2015,
    latitude: 40.7178,
    longitude: -73.9573,
    image_url: 'placeholder-image-5.jpg',
    description: 'Hip Williamsburg condo near trendy cafes and nightlife. Easy commute to Manhattan.'
  },
  {
    address: '567 Flatbush Avenue, Apt 7B',
    neighborhood: 'Prospect Heights',
    county: 'Brooklyn',
    price: 465000,
    bedrooms: 2,
    bathrooms: 1.5,
    square_feet: 1000,
    property_type: 'Co-op',
    year_built: 1980,
    latitude: 40.6745,
    longitude: -73.9565,
    image_url: 'placeholder-image-6.jpg',
    description: 'Beautiful co-op near Prospect Park. Quiet tree-lined street with great community feel.'
  },
  {
    address: '890 Court Street, Apt 4C',
    neighborhood: 'Carroll Gardens',
    county: 'Brooklyn',
    price: 545000,
    bedrooms: 2,
    bathrooms: 1.5,
    square_feet: 1050,
    property_type: 'Condo',
    year_built: 2010,
    latitude: 40.6804,
    longitude: -73.9996,
    image_url: 'placeholder-image-7.jpg',
    description: 'Charming condo in historic Carroll Gardens. Updated finishes and original details.'
  },
  {
    address: '123 Atlantic Avenue, Unit 15F',
    neighborhood: 'Downtown Brooklyn',
    county: 'Brooklyn',
    price: 480000,
    bedrooms: 2,
    bathrooms: 2,
    square_feet: 900,
    property_type: 'Condo',
    year_built: 2018,
    latitude: 40.6884,
    longitude: -73.9857,
    image_url: 'placeholder-image-8.jpg',
    description: 'New construction condo with modern finishes. Multiple subway lines nearby.'
  },
  {
    address: '456 5th Avenue',
    neighborhood: 'Park Slope',
    county: 'Brooklyn',
    price: 535000,
    bedrooms: 2,
    bathrooms: 1,
    square_feet: 950,
    property_type: 'Co-op',
    year_built: 1965,
    latitude: 40.6710,
    longitude: -73.9845,
    image_url: 'placeholder-image-9.jpg',
    description: 'Classic Park Slope co-op. High ceilings, hardwood floors, near F and R trains.'
  },
  
  // Queens Properties
  {
    address: '789 Queens Boulevard, Apt 3C',
    neighborhood: 'Forest Hills',
    county: 'Queens',
    price: 395000,
    bedrooms: 2,
    bathrooms: 1,
    square_feet: 950,
    property_type: 'Co-op',
    year_built: 1955,
    latitude: 40.7210,
    longitude: -73.8448,
    image_url: 'placeholder-image-10.jpg',
    description: 'Affordable co-op in desirable Forest Hills. Close to shops, restaurants, and LIRR.'
  },
  {
    address: '234 Main Street, Unit 6B',
    neighborhood: 'Flushing',
    county: 'Queens',
    price: 425000,
    bedrooms: 3,
    bathrooms: 2,
    square_feet: 1100,
    property_type: 'Condo',
    year_built: 2012,
    latitude: 40.7598,
    longitude: -73.8303,
    image_url: 'placeholder-image-11.jpg',
    description: 'Spacious 3-bedroom condo in vibrant Flushing. Excellent Asian cuisine and shopping.'
  },
  {
    address: '567 Steinway Street',
    neighborhood: 'Astoria',
    county: 'Queens',
    price: 445000,
    bedrooms: 2,
    bathrooms: 1.5,
    square_feet: 1000,
    property_type: 'Condo',
    year_built: 2008,
    latitude: 40.7644,
    longitude: -73.9200,
    image_url: 'placeholder-image-12.jpg',
    description: 'Modern Astoria condo. Walkable neighborhood with diverse restaurants and cafes.'
  },
  {
    address: '890 21st Street, Apt 4A',
    neighborhood: 'Long Island City',
    county: 'Queens',
    price: 515000,
    bedrooms: 2,
    bathrooms: 2,
    square_feet: 950,
    property_type: 'Condo',
    year_built: 2016,
    latitude: 40.7470,
    longitude: -73.9418,
    image_url: 'placeholder-image-13.jpg',
    description: 'Waterfront condo with Manhattan skyline views. Amenities include pool and gym.'
  },
  {
    address: '123 Metropolitan Avenue',
    neighborhood: 'Rego Park',
    county: 'Queens',
    price: 385000,
    bedrooms: 2,
    bathrooms: 1,
    square_feet: 900,
    property_type: 'Co-op',
    year_built: 1970,
    latitude: 40.7265,
    longitude: -73.8614,
    image_url: 'placeholder-image-14.jpg',
    description: 'Well-maintained co-op near shopping centers. Good transportation options.'
  },
  
  // Bronx Properties
  {
    address: '456 Grand Concourse, Apt 9D',
    neighborhood: 'Concourse',
    county: 'Bronx',
    price: 315000,
    bedrooms: 2,
    bathrooms: 1,
    square_feet: 850,
    property_type: 'Co-op',
    year_built: 1940,
    latitude: 40.8304,
    longitude: -73.9208,
    image_url: 'placeholder-image-15.jpg',
    description: 'Classic Bronx co-op with pre-war charm. Near Yankee Stadium and subway.'
  },
  {
    address: '789 Riverdale Avenue',
    neighborhood: 'Riverdale',
    county: 'Bronx',
    price: 425000,
    bedrooms: 3,
    bathrooms: 2,
    square_feet: 1200,
    property_type: 'Co-op',
    year_built: 1960,
    latitude: 40.8978,
    longitude: -73.9096,
    image_url: 'placeholder-image-16.jpg',
    description: 'Spacious Riverdale co-op with river views. Quiet residential area with good schools.'
  },
  {
    address: '234 Fordham Road, Unit 5B',
    neighborhood: 'Fordham',
    county: 'Bronx',
    price: 295000,
    bedrooms: 2,
    bathrooms: 1,
    square_feet: 800,
    property_type: 'Condo',
    year_built: 2000,
    latitude: 40.8623,
    longitude: -73.8985,
    image_url: 'placeholder-image-17.jpg',
    description: 'Affordable condo near Fordham University. Shopping and dining at your doorstep.'
  },
  {
    address: '567 Pelham Parkway, Apt 7C',
    neighborhood: 'Pelham Parkway',
    county: 'Bronx',
    price: 335000,
    bedrooms: 2,
    bathrooms: 1.5,
    square_feet: 900,
    property_type: 'Co-op',
    year_built: 1955,
    latitude: 40.8570,
    longitude: -73.8670,
    image_url: 'placeholder-image-18.jpg',
    description: 'Well-maintained co-op near beautiful parkway. Family-friendly neighborhood.'
  },
  
  // Staten Island Properties
  {
    address: '890 Victory Boulevard, Unit 5C',
    neighborhood: 'St. George',
    county: 'Staten Island',
    price: 345000,
    bedrooms: 2,
    bathrooms: 1.5,
    square_feet: 1100,
    property_type: 'Condo',
    year_built: 2008,
    latitude: 40.6437,
    longitude: -74.0776,
    image_url: 'placeholder-image-19.jpg',
    description: 'Waterfront condo near ferry terminal. Convenient commute to Manhattan with harbor views.'
  },
  {
    address: '123 Forest Avenue, Unit 2A',
    neighborhood: 'West Brighton',
    county: 'Staten Island',
    price: 325000,
    bedrooms: 2,
    bathrooms: 1,
    square_feet: 950,
    property_type: 'Condo',
    year_built: 1995,
    latitude: 40.6347,
    longitude: -74.1123,
    image_url: 'placeholder-image-20.jpg',
    description: 'Comfortable condo in quiet neighborhood. Parking included, near shopping.'
  },
  {
    address: '456 Hylan Boulevard, Apt 8B',
    neighborhood: 'Great Kills',
    county: 'Staten Island',
    price: 365000,
    bedrooms: 3,
    bathrooms: 2,
    square_feet: 1250,
    property_type: 'Co-op',
    year_built: 1985,
    latitude: 40.5547,
    longitude: -74.1496,
    image_url: 'placeholder-image-21.jpg',
    description: 'Spacious co-op near beach and parks. Well-maintained building with low maintenance fees.'
  },
  {
    address: '789 Richmond Avenue, Unit 12D',
    neighborhood: 'New Springville',
    county: 'Staten Island',
    price: 355000,
    bedrooms: 2,
    bathrooms: 2,
    square_feet: 1100,
    property_type: 'Condo',
    year_built: 2005,
    latitude: 40.5947,
    longitude: -74.1654,
    image_url: 'placeholder-image-22.jpg',
    description: 'Modern condo near Staten Island Mall. Updated kitchen and bathrooms.'
  },
  
  // Additional affordable options across boroughs
  {
    address: '321 Jerome Avenue, Apt 11F',
    neighborhood: 'Highbridge',
    county: 'Bronx',
    price: 275000,
    bedrooms: 1,
    bathrooms: 1,
    square_feet: 650,
    property_type: 'Condo',
    year_built: 2010,
    latitude: 40.8405,
    longitude: -73.9254,
    image_url: 'placeholder-image-23.jpg',
    description: 'Affordable starter condo. Perfect for first-time buyers, near express subway.'
  },
  {
    address: '654 Broadway, Unit 3B',
    neighborhood: 'Bushwick',
    county: 'Brooklyn',
    price: 405000,
    bedrooms: 2,
    bathrooms: 1,
    square_feet: 850,
    property_type: 'Condo',
    year_built: 2014,
    latitude: 40.7006,
    longitude: -73.9283,
    image_url: 'placeholder-image-24.jpg',
    description: 'Trendy Bushwick condo. Up-and-coming area with great art scene and nightlife.'
  },
  {
    address: '987 Northern Boulevard',
    neighborhood: 'Jackson Heights',
    county: 'Queens',
    price: 365000,
    bedrooms: 2,
    bathrooms: 1,
    square_feet: 900,
    property_type: 'Co-op',
    year_built: 1935,
    latitude: 40.7527,
    longitude: -73.8842,
    image_url: 'placeholder-image-25.jpg',
    description: 'Historic co-op in diverse Jackson Heights. Excellent international food scene.'
  }
];

async function seedDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('Starting database seed...');
    
    // Clear existing properties (optional - comment out if you want to keep existing data)
    await client.query('DELETE FROM saved_properties');
    await client.query('DELETE FROM properties WHERE id > 0');
    await client.query('ALTER SEQUENCE properties_id_seq RESTART WITH 1');
    
    // Insert properties
    for (const property of properties) {
      await client.query(
        `INSERT INTO properties 
        (address, neighborhood, county, price, bedrooms, bathrooms, square_feet, property_type, year_built, latitude, longitude, image_url, description) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [
          property.address,
          property.neighborhood,
          property.county,
          property.price,
          property.bedrooms,
          property.bathrooms,
          property.square_feet,
          property.property_type,
          property.year_built,
          property.latitude,
          property.longitude,
          property.image_url,
          property.description
        ]
      );
    }
    
    console.log(`✓ Successfully seeded ${properties.length} properties`);
    console.log('✓ Database seed completed!');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

seedDatabase();