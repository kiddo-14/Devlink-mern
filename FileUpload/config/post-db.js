import pg from 'pg'; // Import the entire pg module
const { Pool } = pg; // Destructure the Pool class from the imported pg module

// Configure the connection pool to your database
const pool = new Pool({
    user: 'postgres',     
    host: 'localhost',
    database: 'profieluploaddb',
    password: 'Nikks@2825', 
    port: 5432,                     
});

// Export the pool as default
export default pool;
