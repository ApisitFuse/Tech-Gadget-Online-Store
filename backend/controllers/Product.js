const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { Product } = require('../models/Product');
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
    const { productImage, productName, description, price, stock } = req.body;
    const errors = validationResult(req);

    console.log("errors: ", errors);
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

        console.log("Product created: ", newProduct);

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

// ดึงรายการสินค้า (เฉพาะ Seller และ Customer)
router.get('/show_product', authenticateToken, authorizeRole(['Seller', 'Customer']), async (req, res) => {
    try {
        const products = await Product.findAll(); // ดึงสินค้าทั้งหมด
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'fetching product error' });
    }
});

// อัปเดตสินค้า (เฉพาะ Seller)
router.put('/update_product', authenticateToken, authorizeRole(['Seller']), [
    body('productImage')
        .notEmpty().withMessage('Product image name is required.').bail()
        .custom(async (value, { req }) => {
            const existingProduct = await Product.findOne({ where: { productImage: value } });
            console.log("11111111111111111111111111111");
            console.log("existingProduct: ", existingProduct);
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

        const { id, productName, productImage, price, stock } = req.body;

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
        res.json({ message: 'update product successful', product });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'update product error' });
    }
});

// ลบสินค้า (เฉพาะ Seller)
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

module.exports = router;
