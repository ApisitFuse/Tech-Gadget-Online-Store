const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { Product, Category } = require('../models/Product');
const { authenticateToken, authorizeRole } = require('../middleware/authenticateJWT');
const fs = require("fs");
const path = require('path');


router.post('/add_product', authenticateToken, authorizeRole(['Seller']), [
    body('productImage')
        .notEmpty().withMessage('Product image name is required.').bail()
        .custom(async (value) => {
            const product = await Product.findOne({ where: { productImage: value } });
            if (product) {
                throw new Error('The image name already exists.');
            }
            return true;
        }),
    body('productName')
        .notEmpty().withMessage('Product name is required.').bail()
        .custom(async (value) => {
            const product = await Product.findOne({ where: { productName: value } });
            if (product) {
                throw new Error('The product name already exists.');
            }
            return true;
        }),
    body('price')
        .notEmpty().withMessage('Price is required.').bail()
        .isFloat({ min: 0 }).withMessage('Price must be a positive number.').bail(),
    body('stock')
        .notEmpty().withMessage('Stock is required.').bail()
        .isInt({ min: 1 }).withMessage('Stock must be a positive number.').bail()
], async (req, res) => {
    const { productImage, productName, description, price, stock, categories } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        return res.status(400).json({ errors: errors.array() });
    }

    try {

        // Create a new product
        const newProduct = await Product.create({
            productImage,
            productName,
            description,
            price,
            stock,
        });

        // เชื่อมโยงหมวดหมู่ให้กับสินค้าหากมีหมวดหมู่ที่เลือก
        if (categories && categories.length > 0) {
            // เชื่อมโยงสินค้าเข้ากับหมวดหมู่
            await newProduct.addCategories(categories);  // categories ควรเป็น array ของ categoryIds
        }

        // Respond with the created product's id
        res.status(201).json({ message: 'Adding product successful', productId: newProduct.id });
        // const newProduct = new Product({
        //     productImage,
        //     productName,
        //     description,
        //     price,
        //     stock,
        // });

        // // Save the product to the database
        // await newProduct.save();


        // res.status(201).json({ message: 'Adding product successful', productId: newProduct });

    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/add_category', authenticateToken, authorizeRole(['Seller']), [
    body('name')
        .notEmpty().withMessage('Product category name is required.').bail()
        .custom(async (value) => {
            const category = await Category.findOne({ where: { name: value } });
            if (category) {
                throw new Error('The category name already exists.');
            }
            return true;
        }),
], async (req, res) => {
    const { name } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        // Create a new category
        const newCategory = await Category.create({
            name,
        });

        res.status(201).json({ message: 'Adding category successful', category: newCategory });

    } catch (error) {
        console.error('Error adding category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }

});

// ดึงรายการสินค้า (เฉพาะ Seller และ Customer)
router.get('/show_product', authenticateToken, authorizeRole(['Seller', 'Customer']), async (req, res) => {
    try {
        const products = await Product.findAll({
            include: {
                model: Category,
                // as: 'categories',
                through: { attributes: [] },
                attributes: ['id', 'name']
            }
        });

        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'fetching product error' });
    }
});

// ดึงหมวดหมู่สินค้า (เฉพาะ Seller และ Customer)
router.get('/show_categories', authenticateToken, authorizeRole(['Seller', 'Customer']), async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'fetching category error' });
    }
});

// อัปเดตสินค้า (เฉพาะ Seller)
router.put('/update_product', authenticateToken, authorizeRole(['Seller']), [
    body('productImage')
        .notEmpty().withMessage('Product image name is required.').bail()
        .custom(async (value, { req }) => {
            const existingProduct = await Product.findOne({ where: { productImage: value } });
            if (existingProduct && existingProduct.id !== req.body.id) {
                throw new Error('The image name already exists.');
            }
            return true;
        }),

    body('productName')
        .notEmpty().withMessage('Product name is required.').bail()
        .custom(async (value, { req }) => {
            const existingProduct = await Product.findOne({ where: { productName: value } });
            if (existingProduct && existingProduct.id !== req.body.id) {
                throw new Error('The product name already exists.');
            }
            return true;
        }),
], async (req, res) => {
    try {
        // ตรวจสอบ Validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id, productName, productImage, price, stock, categories } = req.body;

        const product = await Product.findByPk(id);

        // ถ้าไม่ใช่รูปเดิม ให้ลบรูปเดิมออก
        if (product.productImage !== productImage) {
            // ดึงชื่อไฟล์ที่เก็บในฐานข้อมูล
            const fileName = product.productImage; // สมมติว่า 'image' เป็นชื่อคอลัมน์ที่เก็บชื่อไฟล์

            // สร้างพาธไฟล์ที่ต้องการลบ
            const filePath = path.resolve(process.cwd(), 'uploads/product', fileName);

            fs.access(filePath, fs.constants.F_OK, async (err) => {
                if (!err) {
                    // ถ้าไฟล์มีอยู่ ให้ลบไฟล์
                    try {
                        await fs.promises.unlink(filePath); // ลบไฟล์จากโฟลเดอร์
                        console.log(`File ${fileName} deleted successfully.`);
                    } catch (fileError) {
                        console.error(`Error deleting file ${fileName}:`, fileError);
                        return res.status(500).json({ message: 'Error deleting file', error: fileError.message });
                    }
                } else {
                    // ถ้าไฟล์ไม่มี ก็ข้ามการลบไฟล์ไป
                    console.log(`File ${fileName} does not exist.`);
                }

            });
        }
        if (!product) return res.status(404).json({ message: 'not found' });

        await product.update({ productName, productImage, price, stock });

        if (categories && categories.length > 0) {
            // ตรวจสอบว่า categoryIds ทั้งหมดมีอยู่จริง
            const validCategories = await Category.findAll({
                where: { id: categories }, // ค้นหา categories ที่มี id ใน categories[]
            });

            if (validCategories.length !== categories.length) {
                return res.status(400).json({ message: "One or more categories do not exist" });
            }

            // ใช้ setCategories() อัปเดตหมวดหมู่ของสินค้า
            await product.setCategories(categories);
        } else {
            // ถ้าผู้ใช้เอาหมวดหมู่ออกทั้งหมด ให้เคลียร์ความสัมพันธ์
            await product.setCategories([]);
        }

        res.json({ message: 'update product successful', product });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'update product error' });
    }
});

// อัปเดตสินค้า (เฉพาะ Seller)
router.put('/update_category', authenticateToken, authorizeRole(['Seller']), [
    body('name')
        .notEmpty().withMessage('Product category name is required.').bail()
        .custom(async (value, { req }) => {
            const existingCategory = await Category.findOne({ where: { name: value } });
            if (existingCategory && existingCategory.id !== req.body.id) {
                throw new Error('The category name already exists.');
            }
            return true;
        }),
], async (req, res) => {
    try {
        // ตรวจสอบ Validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id, name } = req.body;

        const category = await Category.findByPk(id);

        if (!category) return res.status(404).json({ message: 'not found' });

        await category.update({ name });
        res.json({ message: 'update category successful', category });
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ message: 'update category error' });
    }
});

// ลบหมวดหมู่สินค้า (เฉพาะ Seller)
router.delete('/delete_product/:id', authenticateToken, authorizeRole(['Seller']), async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);


        if (!product) return res.status(404).json({ message: 'not found' });


        // ดึงชื่อไฟล์ที่เก็บในฐานข้อมูล
        const fileName = product.productImage; // สมมติว่า 'image' เป็นชื่อคอลัมน์ที่เก็บชื่อไฟล์

        // สร้างพาธไฟล์ที่ต้องการลบ
        const filePath = path.resolve(process.cwd(), 'uploads/product', fileName);

        // ตรวจสอบว่าไฟล์มีอยู่จริงหรือไม่
        fs.access(filePath, fs.constants.F_OK, async (err) => {
            if (!err) {
                // ถ้าไฟล์มีอยู่ ให้ลบไฟล์
                try {
                    await fs.promises.unlink(filePath); // ลบไฟล์จากโฟลเดอร์
                    console.log(`File ${fileName} deleted successfully.`);
                } catch (fileError) {
                    console.error(`Error deleting file ${fileName}:`, fileError);
                    return res.status(500).json({ message: 'Error deleting file', error: fileError.message });
                }
            } else {
                // ถ้าไฟล์ไม่มี ก็ข้ามการลบไฟล์ไป
                console.log(`File ${fileName} does not exist.`);
            }

            // ลบข้อมูลสินค้าจากฐานข้อมูล
            try {
                await product.destroy();
                res.json({ message: 'Product deleted successfully' });
            } catch (error) {
                console.error('Error deleting product from database:', error);
                res.status(500).json({ message: 'Error deleting product from database', error: error.message });
            }
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'delete product error' });
    }
});

// ลบหมวดหมู่สินค้า (เฉพาะ Seller)
router.delete('/delete_category/:id', authenticateToken, authorizeRole(['Seller']), async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id);


        if (!category) return res.status(404).json({ message: 'not found' });

        await category.destroy();
        res.json({ message: 'Category deleted successfully' });

    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ message: 'delete category error' });
    }
});

module.exports = router;
