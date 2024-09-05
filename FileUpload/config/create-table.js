import pool from "./post-db.js"; // Import your database connection

const createTables = async () => {
    try {
        const client = await pool.connect();
        
        // Define SQL statements for creating tables
        const createAuthUserTable = `
            CREATE TABLE IF NOT EXISTS authuser (
                authuserid SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                password VARCHAR(100) NOT NULL
            );
        `;

        const createUserTable = `
            CREATE TABLE IF NOT EXISTS "user" (
                userid SERIAL PRIMARY KEY,
                firstname VARCHAR(100) NOT NULL,
                lastname VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                photo TEXT,
                authuserid INTEGER REFERENCES authuser(authuserid)
            );
        `;

        const createLinkTable = `
            CREATE TABLE IF NOT EXISTS link (
                linkid SERIAL PRIMARY KEY,
                platform VARCHAR(100) NOT NULL,
                url TEXT NOT NULL,
                userid INTEGER REFERENCES "user"(userid)
            );
        `;

        // Execute SQL statements
        await client.query(createAuthUserTable);
        await client.query(createUserTable);
        await client.query(createLinkTable);

        console.log('Tables created successfully.');
        
        client.release(); // Release the client back to the pool
    } catch (err) {
        console.error('Error creating tables', err.stack);
    }
};

// Run the function
createTables();
