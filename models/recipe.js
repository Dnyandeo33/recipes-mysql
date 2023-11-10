import query from '../config/db.js';

const createRecipe = async () => {
    try {
        const createRecipeTable = `
        CREATE TABLE IF NOT EXISTS recipes(
            id          INT PRIMARY KEY AUTO_INCREMENT,
            name        VARCHAR(50) NOT NULL,
            description TEXT NOT NULL
        )`;
        const result = await query(createRecipeTable);
        console.log(`Recipe table created successfully...`);
    } catch (err) {
        console.log(err);
    }
};

createRecipe();
