import query from '../config/db.js';
import '../models/recipe.js';

const recipeControllers = {
    getAllRecipes: async (req, res) => {
        try {
            const getRecipesQuery = `SELECT * FROM recipes`
            const allRecipes = await query(getRecipesQuery);

            if (allRecipes.length > 0) {
                return res.status(200).json({ success: true, recipes: allRecipes })
            } else {
                return res.status(404).json({ success: false, message: `No recipes found` })
            }
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message })
        }
    },
    getOneRecipe: async (req, res) => {
        const { id } = req.params;
        try {
            const oneRecipeQuery = `SELECT * FROM recipes WHERE id=?`
            const result = await query(oneRecipeQuery, [id]);
            if (result.length > 0) {
                return res.status(200).json({ success: true, recipe: result })
            } else {
                return res.status(404).json({ success: false, message: `No recipe with id:${id} found ` })
            }
        } catch (error) {
            return res.status(500).json({ success: false, error: error })
        }
    },

    postRecipe: async (req, res) => {
        const { name, description } = req.body;
        try {
            if (!name || !description) {
                return res.status(400).json({ success: false, message: `all felids require...` })
            }
            const postRecipeQuery = `INSERT INTO recipes(name, description) VALUES(?,?)`
            const result = await query(postRecipeQuery, [name, description]);
            return res.status(200).json({ success: true, newRecipe: result })

        } catch (error) {
            return res.status(500).json({ success: false, error: error })
        }
    },

    updateRecipe: async (req, res) => {
        const { id } = req.params;
        const { name, description } = req.body;
        try {
            const updateRecipeQuery = `UPDATE recipes SET name=?, description=? WHERE id=?`
            const updateRecipe = await query(updateRecipeQuery, [name, description, id]);
            if (updateRecipe.affectedRows > 0) {
                return res.status(200).json({ success: true, message: `Recipe with id:${id} updated successfully...` });
            } else {
                return res.status(404).json({ success: true, message: `Recipe not found...` })
            }
        } catch (error) {
            return res.status(500).json({ success: false, error: error })
        }
    },
    deleteRecipe: async (req, res) => {
        const { id } = req.params;
        try {
            const deleteRecipeQuery = `DELETE FROM recipes WHERE id=?`;
            const deletedRecipe = await query(deleteRecipeQuery, [id]);
            if (deletedRecipe.affectedRows > 0) {
                return res.status(200).json({ success: true, message: `Recipe with id:${id} deleted successfully...` })
            } else {
                return res.status(404).json({ success: false, message: `Recipe with id:${id} not found` })
            }

        } catch (error) {
            return res.status(500).json({ success: false, error: error })
        }
    },
};

export default recipeControllers;
