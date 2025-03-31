import { useState, useEffect } from "react";
import { fetchProductsAPI, deleteProductAPI, updateProductAPI, fetchCategoriesAPI } from "../services/Product";
import { LoadingModal, SuccessModal, ConfirmDeleteModal, ImageModal } from "../layout/Modal";
import { useDropzone } from "react-dropzone";
import { fetchUploadImageAPI } from '../services/Image';
import { Link } from "react-router-dom";
import Select from "react-select";
// import { FaPlus } from 'react-icons/fa';


export default function ProductManagement() {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isSuccess, setIsSuccess] = useState(true);
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [errors, setErrors] = useState({});
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [product, setProduct] = useState({
        id: 0,
        productImage: "",
        productName: "",
        description: "",
        price: "",
        stock: 0,
        Categories: []
        // categories: selectedCategories,

    });
    const [imagePreview, setImagePreview] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [customFileName, setCustomFileName] = useState("");

    useEffect(() => {
        loadProducts();
    }, []);

    useEffect(() => {
        if (selectedProduct) {
            setProduct(selectedProduct);
            setImagePreview(selectedProduct.productImage);
        }
    }, [selectedProduct]);

    useEffect(() => {
        if (selectedFile) {
            setImagePreview(URL.createObjectURL(selectedFile));
        }
    }, [selectedFile]);

    useEffect(() => {
        const loadCategories = async () => {
            const response = await fetchCategoriesAPI();
            const data = await response.json();
            setCategories(data.map(cat => ({ value: cat.id, label: cat.name })));
        };
        loadCategories();
    }, []);

    // เมื่อเปิด Modal ให้โหลดค่าหมวดหมู่ของสินค้ามาแสดง
    useEffect(() => {
        if (product.Categories.length > 0 && categories.length > 0) {
            // หา category ที่ตรงกับ product.categories
            const categoryIds = product.Categories.map(cat => cat.id);
            const preselected = categories.filter(cat => categoryIds.includes(cat.value));

            setSelectedCategories(preselected);
        }
    }, [product.Categories, categories]); // ใช้ useEffect เมื่อ product หรือ categories เปลี่ยนค่า

    const onDrop = (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];

            setSelectedFile(file);
            setImagePreview(URL.createObjectURL(file)); // ใช้ preview รูปใหม่
            setSelectedProduct(prev => ({
                ...prev,
                productImage: file.name // อัปเดตชื่อไฟล์ใหม่
            }));
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: "image/*" });

    const loadProducts = async () => {
        setIsLoading(true);
        try {
            const response = await fetchProductsAPI();
            const data = await response.json();
            setProducts(data);
            console.log("Products:", data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = (id) => {
        setProductToDelete(id);  // เก็บข้อมูลสินค้าที่จะลบ
        setIsConfirmDeleteModalOpen(true);  // เปิด ConfirmModal
    };

    const confirmDelete = async () => {
        if (!productToDelete) return;

        setIsLoading(true);
        try {
            await deleteProductAPI(productToDelete);
            setMessage("Delete complete!");
            setIsSuccess(true);
            loadProducts();
        } catch (error) {
            console.error("Error deleting product:", error);
            setMessage("Delete not complete!");
            setIsSuccess(false);
        } finally {
            setIsLoading(false);
            setIsConfirmDeleteModalOpen(false);  // ปิด ConfirmModal
            setIsModalOpen(true);  // เปิด SuccessModal
        }
    };

    const cancelDelete = () => {
        setIsConfirmDeleteModalOpen(false);  // ปิด ConfirmModal
    };

    const handleCategoryChange = (selected) => {
        setSelectedCategories(selected);
        setProduct((prevProduct) => ({
            ...prevProduct,
            categories: selected ? selected.map(option => option.value) : [], // เก็บแค่ categoryId
        }));
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setIsEditModalOpen(true);
    };

    const handleUpdate = async () => {
        if (!selectedProduct) return;
        setErrors({});

        try {
            setIsLoading(true);
            const response = await updateProductAPI(product);
            const data = await response.json();

            if (response.ok) {
                setIsSuccess(true);
                setIsLoading(false);
                setIsEditModalOpen(false);

                setMessage("Update complete!");
                setIsSuccess(true);
                loadProducts();
                setIsModalOpen(true);
            } else {
                setErrors(data.errors.reduce((acc, err) => ({ ...acc, [err.path]: err.msg }), {}));
                setIsSuccess(false);
                setIsLoading(false);
                setMessage('Adding product failed');
            }

            // อัปโหลดรูปใหม่ถ้ามี
            if (selectedFile) {
                const formData = new FormData();
                // formData.append("image", selectedFile, customFileName || selectedFile.name);
                formData.append("image", selectedFile);
                formData.append("customFileName", customFileName);


                const response = await fetchUploadImageAPI(formData);
                const data = await response.json();

                if (response.ok) {
                    setProduct(prev => ({ ...prev, productImage: data.filename }));
                } else {
                    throw new Error("Image upload failed");
                }
            }


        } catch (error) {
            console.error("Error updating product:", error);
            setMessage("Update not complete!");
            setIsSuccess(false);
        }
    };

    const handleCancel = () => {
        setSelectedCategories([]);
        setSelectedFile(null);
        setImagePreview(product.image); // เซ็ตกลับไปที่รูปของ product เอง
        setIsEditModalOpen(false);
    };

    // **old filter**
    // const filteredProducts = products.filter(product =>
    //     product.productName.toLowerCase().includes(searchTerm.toLowerCase())
    // );

    const filteredProducts = products.filter(product => {
        // ตรวจสอบการตรงกับคำค้นหาในทั้ง 3 ฟิลด์
        const matchesProductName = product.productName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPrice = product.price.toString().includes(searchTerm);
        const matchesStock = product.stock.toString().includes(searchTerm);

        // คืนค่าผลลัพธ์ที่ตรงกับเงื่อนไขใดๆ จากทั้ง 3 ฟิลด์
        return matchesProductName || matchesPrice || matchesStock;
    });

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">จัดการสินค้า</h2>

            {/* ค้นหาสินค้า */}
            <div className="flex items-center mb-4">
                <input
                    type="text"
                    placeholder="ค้นหาสินค้า..."
                    className="w-full p-2 mr-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Link
                    to="/add_product"
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 flex-shrink-0"
                >
                    เพิ่มสินค้า
                </Link>
            </div>

            {/* ตารางสินค้า */}
            <table className="w-full border-collapse border border-gray-200">
                <thead>
                    {/* <tr className="bg-gray-100">
                        <th className="border p-2">รูป</th>
                        <th className="border p-2">ชื่อสินค้า</th>
                        <th className="border p-2">ราคา</th>
                        <th className="border p-2">จำนวน</th>
                        <th className="border p-2 flex items-center justify-between">
                            หมวดหมู่
                            <Link
                                to="/add_category"
                                className="ml-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-blue-600"
                            >
                                +
                            </Link>
                        </th>
                        <th className="border p-2">จัดการ</th>
                    </tr> */}

                    <tr className="bg-gray-100 text-gray-700">
                        <th className="border px-4 py-2">รูป</th>
                        <th className="border px-4 py-2">ชื่อสินค้า</th>
                        <th className="border px-4 py-2">ราคา</th>
                        <th className="border px-4 py-2">จำนวน</th>
                        <th className="border px-4 py-2 flex items-center justify-center">
                            หมวดหมู่
                            <Link
                                to="/add_category"
                                className="ml-2 bg-blue-500 text-white rounded-lg px-2 py-1 text-sm font-bold shadow-md hover:bg-blue-600 transition-all"
                                // className="ml-2 bg-blue-500 text-white rounded-lg px-2 py-1 text-sm font-bold shadow-md hover:bg-blue-600 transition-all flex items-center"
                            >
                                +
                                {/* <i className="fas fa-plus mr-2"></i> */}
                            </Link>
                        </th>
                        <th className="border px-4 py-2">จัดการ</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.map(product => (
                        <tr key={product.id} className="text-center">
                            <td className="border p-2">
                                {/* <img src={`http://localhost:8000/uploads/product/${product.productImage}`} alt={product.productImage} className="w-12 h-12 object-cover mx-auto" /> */}
                                <ImageModal
                                    imageUrl={`http://localhost:8000/uploads/product/${product.productImage}`}
                                    altText={product.productImage}
                                />
                            </td>
                            <td className="border p-2">{product.productName}</td>
                            <td className="border p-2">{product.price} บาท</td>
                            <td className="border p-2">{product.stock}</td>
                            <td className="border p-2">
                                {product.Categories?.map(cat => cat.name).join(', ') || '-'}
                            </td>
                            <td className="border p-2 space-x-2">
                                <button
                                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                                    onClick={() => handleEdit(product)}
                                >
                                    แก้ไข
                                </button>
                                <button
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                    onClick={() => handleDelete(product.id)}
                                >
                                    ลบ
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal แก้ไขสินค้า */}
            {isEditModalOpen && selectedProduct && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h3 className="text-lg font-bold mb-4">แก้ไขสินค้า</h3>

                        {/* อัปโหลดรูป */}
                        <div
                            {...getRootProps()}
                            className={`mb-2 border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer
                ${isDragActive ? "border-blue-500 bg-blue-100" : "border-gray-300 bg-gray-50 hover:border-blue-500 hover:bg-blue-50"}`}
                        >
                            <input {...getInputProps()} />
                            {/* {imagePreview ? (
                                <img src={`http://localhost:8000/uploads/product/${imagePreview}`} alt="Product Preview" className="w-full h-40 object-cover rounded" />
                            ) : (
                                <p className="text-gray-500">ลากและวางรูปที่นี่ หรือคลิกเพื่อเลือก</p>
                            )} */}

                            {selectedFile ? (
                                <img src={URL.createObjectURL(selectedFile)} alt="New Preview" className="w-full h-auto max-h-40 object-contain rounded" />
                            ) : imagePreview ? (
                                <img src={`http://localhost:8000/uploads/product/${imagePreview}`} alt="Product Preview" className="w-full h-auto max-h-40 object-contain rounded" />
                            ) : (
                                <p className="text-gray-500">ลากและวางรูปที่นี่ หรือคลิกเพื่อเลือก</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <input
                                type="text"
                                // className="w-full p-2 border border-gray-300 rounded mb-2"
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.productImage ? 'border-b-2 border-b-red-600' : ''}`}
                                value={selectedProduct.productImage}
                                onChange={(e) => setCustomFileName(e.target.value)}
                                placeholder="เปลี่ยนชื่อไฟล์ (รวม .jpg .png เป็นต้น)"
                            />
                            {errors.productImage && (
                                <p className="text-red-600 text-sm mt-1">{errors.productImage}</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <input
                                type="text"
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.productName ? 'border-b-2 border-b-red-600' : ''}`}
                                value={selectedProduct.productName}
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, productName: e.target.value })}
                            />
                            {errors.productName && (
                                <p className="text-red-600 text-sm mt-1">{errors.productName}</p>
                            )}
                        </div>


                        <input
                            type="number"
                            className="w-full p-2 border border-gray-300 rounded mb-2"
                            value={selectedProduct.price}
                            onChange={(e) => setSelectedProduct({ ...selectedProduct, price: e.target.value })}
                        />
                        <input
                            type="number"
                            className="w-full p-2 border border-gray-300 rounded mb-2"
                            value={selectedProduct.stock}
                            onChange={(e) => setSelectedProduct({ ...selectedProduct, stock: e.target.value })}
                        />

                        <Select
                            isMulti
                            options={categories} // หมวดหมู่ทั้งหมด
                            value={selectedCategories} // หมวดหมู่ที่ถูกเลือก
                            onChange={handleCategoryChange}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            placeholder="เลือกหมวดหมู่สินค้า..."
                            closeMenuOnSelect={false}
                            // menuPlacement="auto"
                            // menuPortalTarget={document.body}
                            styles={{
                                menuPortal: base => ({ ...base, zIndex: 9999 }),
                                menu: base => ({
                                    ...base,
                                    maxHeight: "120px", // กำหนดความสูงสูงสุดของ dropdown
                                    overflowY: "auto"  // เปิดให้ dropdown มี scrollbar
                                })
                            }}
                            maxMenuHeight={120}
                        />

                        <div className="flex justify-end space-x-2 mt-2">
                            <button
                                className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                                // onClick={() => setIsEditModalOpen(false)}
                                onClick={handleCancel}
                            >
                                ยกเลิก
                            </button>
                            <button
                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                onClick={handleUpdate}
                            >
                                บันทึก
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modals */}
            <LoadingModal isOpen={isLoading} />
            <SuccessModal isOpen={isModalOpen} isSuccess={isSuccess} message={message} onClose={() => setIsModalOpen(false)} />
            <ConfirmDeleteModal
                isOpen={isConfirmDeleteModalOpen}
                message="คุณต้องการลบสินค้านี้หรือไม่?"
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
        </div>
    );
}
