import query from '../config/db.js';

const createUser = async () => {
    try {
        const createUserTable = `
        CREATE TABLE IF NOT EXISTS users(
            user_id     INT PRIMARY KEY AUTO_INCREMENT,
            email       VARCHAR(50) NOT NULL UNIQUE,
            password    TEXT NOT NULL
        )`;
        const result = await query(createUserTable);
        console.log(`User table created successfully...`);
    } catch (err) {
        console.log(err);
    }
};

createUser();
