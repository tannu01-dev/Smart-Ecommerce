const Category = require("../models/Category");
const Product = require("../models/Product");


const getCategories = async (req, res) => {
    try {

        const categories = await Category.find()
            .sort({ createdAt: -1 });

        const categoriesWithCount = await Promise.all(

            categories.map(async (category) => {

                const productCount =
                    await Product.countDocuments({
                        category: category._id
                    });

                return {
                    ...category.toObject(),
                    productCount
                };

            })

        );

        res.status(200).json({
            success: true,
            count: categoriesWithCount.length,
            categories: categoriesWithCount
        });

    } catch (error) {

        console.log(
            "GET CATEGORIES ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


const createCategory = async (req, res) => {
    try {

        const {
            name,
            description
        } = req.body;


        if (!name || name.trim() === "") {

            return res.status(400).json({
                success: false,
                message: "Category name is required"
            });

        }


        const existingCategory =
            await Category.findOne({
                name: name.trim()
            });


        if (existingCategory) {

            return res.status(400).json({
                success: false,
                message: "Category already exists"
            });

        }


        const category =
            await Category.create({

                name: name.trim(),

                description:
                    description?.trim() || ""

            });


        res.status(201).json({

            success: true,

            message:
                "Category created successfully",

            category

        });

    } catch (error) {

        console.log(
            "CREATE CATEGORY ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const updateCategory = async (req, res) => {
    try {

        const {
            categoryId
        } = req.params;

        const {
            name,
            description,
            isActive
        } = req.body;


        const category =
            await Category.findById(
                categoryId
            );


        if (!category) {

            return res.status(404).json({
                success: false,
                message: "Category not found"
            });

        }


        if (name) {

            const existingCategory =
                await Category.findOne({
                    name: name.trim(),
                    _id: {
                        $ne: categoryId
                    }
                });


            if (existingCategory) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Category name already exists"
                });

            }

            category.name =
                name.trim();

        }


        if (description !== undefined) {

            category.description =
                description.trim();

        }


        if (isActive !== undefined) {

            category.isActive =
                isActive;

        }


        await category.save();


        res.status(200).json({

            success: true,

            message:
                "Category updated successfully",

            category

        });

    } catch (error) {

        console.log(
            "UPDATE CATEGORY ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const deleteCategory = async (req, res) => {
    try {

        const {
            categoryId
        } = req.params;


        const category =
            await Category.findById(
                categoryId
            );


        if (!category) {

            return res.status(404).json({
                success: false,
                message:
                    "Category not found"
            });

        }


        const productCount =
            await Product.countDocuments({
                category: categoryId
            });


        if (productCount > 0) {

            return res.status(400).json({

                success: false,

                message:
                    `Cannot delete category. ${productCount} product(s) are using this category.`

            });

        }


        await Category.findByIdAndDelete(
            categoryId
        );


        res.status(200).json({

            success: true,

            message:
                "Category deleted successfully"

        });

    } catch (error) {

        console.log(
            "DELETE CATEGORY ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


module.exports = {

    getCategories,
    createCategory,
    updateCategory,
    deleteCategory

};