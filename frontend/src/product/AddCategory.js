import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SuccessModal, LoadingModal, ConfirmDeleteModal } from '../layout/Modal';
import { fetchAddCategoryAPI, fetchCategoriesAPI, updateCategoryAPI, deleteCategoryAPI } from '../services/Product';

const AddCategory = () => {
    const [categoryName, setCategoryName] = useState('');
    const [categories, setCategories] = useState([]);
    const [editCategory, setEditCategory] = useState(null);
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSuccess, setIsSuccess] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    // useEffect(() => {
    //     const fetchCategories = async () => {
    //         try {
    //             const response = await fetchCategorysAPI();
    //             const data = await response.json();
    //             setCategories(data);
    //         } catch (error) {
    //             console.error('Error fetching categories:', error);
    //         }
    //     };
    //     fetchCategories();
    // }, []);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const response = await fetchCategoriesAPI();
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // ฟังก์ชันสำหรับการเพิ่มหมวดหมู่
    const handleAddCategory = async (e) => {
        e.preventDefault();
        setErrors({});
        setIsLoading(true);
        try {
            const response = await fetchAddCategoryAPI(categoryName);
            const data = await response.json();

            if (response.ok) {
                setIsSuccess(true);
                setCategoryName('');

                // รีเฟรชข้อมูลหมวดหมู่หลังจากเพิ่มสำเร็จ
                setCategories((prevCategories) => [...prevCategories, data.category]);
                setMessage('Adding product successful!');
            } else {
                setErrors(data.errors.reduce((acc, err) => ({ ...acc, [err.path]: err.msg }), {}));
                setIsSuccess(false);
                setMessage('Adding category failed');
            }

        } catch (error) {
            console.error('Error adding category:', error);
        } finally {
            setIsLoading(false);
            setIsModalOpen(true);

            setTimeout(() => {
                setIsModalOpen(false);
            }, 4000);
        }
    };

    const handleDelete = (id) => {
        setCategoryToDelete(id);
        setIsConfirmDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!categoryToDelete) return;

        setIsLoading(true);
        try {
            await deleteCategoryAPI(categoryToDelete);
            setMessage("Delete complete!");
            setIsSuccess(true);
            loadCategories();
        } catch (error) {
            console.error("Error deleting product:", error);
            setMessage("Delete not complete!");
            setIsSuccess(false);
        } finally {
            setIsLoading(false);
            setIsConfirmDeleteModalOpen(false);
            setIsModalOpen(true);
        }
    };

    const cancelDelete = () => {
        setIsConfirmDeleteModalOpen(false);
    };

    const handleEditCategory = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await updateCategoryAPI(editCategory);
            setCategories(categories.map(cat => cat.id === editCategory.id ? editCategory : cat));
            setEditCategory(null);
            setMessage('update successful!');
            setIsSuccess(true);
        } catch (error) {
            console.error('Error updating category:', error);
        } finally {
            setIsLoading(false);
            setIsModalOpen(true);
            setTimeout(() => setIsModalOpen(false), 3000);
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <div className="bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">เพิ่มหมวดหมู่สินค้า</h2>
                {/* <form onSubmit={handleAddCategory} className="space-y-4">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            name="name"
                            placeholder="ชื่อหมวดหมู่"
                            className={`border rounded-lg w-full py-2 px-4 focus:ring-2 focus:ring-green-400 
                            ${errors.name ? 'border-red-600' : 'border-gray-300'}`}
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                        />
                        {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}

                        <button
                            type="submit"
                            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                        >เพิ่ม</button>
                    </div>

                </form> */}

                <form onSubmit={handleAddCategory} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="categoryName" className="text-gray-700 font-medium">ชื่อหมวดหมู่</label>
                        <input
                            type="text"
                            id="categoryName"
                            name="name"
                            placeholder="กรอกชื่อหมวดหมู่"
                            className={`border rounded-lg w-full py-2 px-4 focus:ring-2 focus:ring-green-400 
                ${errors.name ? 'border-red-600' : 'border-gray-300'}`}
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                        />
                        {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
                    >เพิ่มหมวดหมู่</button>
                </form>
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">รายการหมวดหมู่</h3>
                <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-3">ลำดับ</th>
                            <th className="border p-3">ชื่อหมวดหมู่</th>
                            <th className="border p-3">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length > 0 ? (
                            categories.map((category, index) => (
                                <tr key={category.id} className="hover:bg-gray-50 transition">
                                    <td className="border p-3 text-center">{index + 1}</td>
                                    <td className="border p-3">{category.name}</td>
                                    <td className="border p-3 flex gap-2 justify-center">
                                        <button onClick={() => setEditCategory(category)} className="px-4 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">แก้ไข</button>
                                        <button onClick={() => handleDelete(category.id)} className="px-4 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600">ลบ</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2" className="border p-3 text-center text-gray-500">
                                    ไม่มีหมวดหมู่ที่เพิ่ม
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {editCategory && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg">
                        <h3 className="text-xl font-semibold mb-4">แก้ไขหมวดหมู่</h3>
                        <form onSubmit={handleEditCategory} className="flex gap-4">
                            <input type="text" className="border rounded-lg py-2 px-4" value={editCategory.name} onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })} />
                            <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">บันทึก</button>
                        </form>
                        <button onClick={() => setEditCategory(null)} className="mt-4 block text-center text-red-500">ยกเลิก</button>
                    </div>
                </div>
            )}

            {/* <div className="mt-6 text-center">
                <Link to="/table_product" className="text-blue-500 hover:underline">
                    ← ย้อนกลับ
                </Link>
            </div> */}

            <div className="mt-6 text-center">
                <Link
                    to="/table_product"
                    className="inline-flex items-center gap-2 text-blue-500 font-medium hover:text-blue-600 transition-all duration-300"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    ย้อนกลับ
                </Link>
            </div>

            <LoadingModal isOpen={isLoading} />
            <SuccessModal isOpen={isModalOpen} isSuccess={isSuccess} message={message} onClose={() => setIsModalOpen(false)} />
            <ConfirmDeleteModal
                isOpen={isConfirmDeleteModalOpen}
                message="คุณต้องการลบหมวดหมู่นี้หรือไม่?"
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
        </div>
    );
};

export default AddCategory;


// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { SuccessModal, LoadingModal } from '../layout/Modal';
// import { fetchAddCategoryAPI, fetchCategorysAPI } from '../services/Product';

// const AddCategory = () => {
//     // สร้าง state สำหรับชื่อหมวดหมู่
//     const [categoryName, setCategoryName] = useState('');
//     const [categories, setCategories] = useState([]);
//     const [message, setMessage] = useState('');
//     const [errors, setErrors] = useState({});
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [isSuccess, setIsSuccess] = useState(true);
//     const [isLoading, setIsLoading] = useState(false);
//     // const [category, setCategory] = useState({
//     //     name: '',
//     // });

//     // ดึงข้อมูลหมวดหมู่จากฐานข้อมูลเมื่อโหลดหน้า
//     useEffect(() => {
//         const fetchCategories = async () => {
//             try {
//                 const response = await fetchCategorysAPI();
//                 const data = await response.json();
//                 setCategories(data);
//             } catch (error) {
//                 console.error('Error fetching categories:', error);
//             }
//         };
//         fetchCategories();
//     }, []);

//     // ฟังก์ชันสำหรับการเพิ่มหมวดหมู่
//     const handleAddCategory = async (e) => {
//         e.preventDefault();
//         setErrors({});
//         setIsLoading(true);
//         try {
//             const response = await fetchAddCategoryAPI(categoryName);
//             const data = await response.json();

//             if (response.ok) {
//                 setIsSuccess(true);
//                 setCategoryName('');
//                 setMessage('Adding product successful!');
//             } else {
//                 setErrors(data.errors.reduce((acc, err) => ({ ...acc, [err.path]: err.msg }), {}));
//                 setIsSuccess(false);
//                 setMessage('Adding category failed');
//             }

//             // รีเฟรชข้อมูลหมวดหมู่หลังจากเพิ่มสำเร็จ
//             console.log("Adding category:", data);
//             setCategories((prevCategories) => [...prevCategories, data.category]);
//         } catch (error) {
//             console.error('Error adding category:', error);
//         } finally {
//             setIsLoading(false);
//             setIsModalOpen(true);

//             setTimeout(() => {
//                 setIsModalOpen(false);
//             }, 4000);
//         }
//     };
//     const closeModal = () => {
//         setIsModalOpen(false);
//     };

//     return (
//         <div className="p-4">
//             <h2 className="text-2xl font-bold mb-4">เพิ่มหมวดหมู่สินค้า</h2>

//             {/* ฟอร์มเพิ่มหมวดหมู่ */}
//             <form onSubmit={handleAddCategory} className="mb-6">
//                 <div className="flex mb-4">

//                     <div className="w-full max-w-sm">
//                         <input
//                             type="text"
//                             placeholder="ชื่อหมวดหมู่"
//                             className={shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight
//                     focus:outline-none focus:ring-2 focus:ring-green-400
//                     ${errors.name ? 'border-red-600' : 'border-gray-300'}}
//                             value={categoryName}
//                             onChange={(e) => setCategoryName(e.target.value)}
//                         />
//                         {errors.name && (
//                             <p className="text-red-600 text-sm mt-1">{errors.name}</p>
//                         )}
//                     </div>


//                     <button
//                         type="submit"
//                         className="ml-4 px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
//                     >
//                         เพิ่มหมวดหมู่สินค้า
//                     </button>
//                 </div>
//             </form>

//             {/* ตารางแสดงหมวดหมู่ที่ถูกเพิ่มแล้ว */}
//             <h3 className="text-xl font-semibold mb-4">รายการหมวดหมู่ที่เพิ่มแล้ว</h3>
//             <table className="w-full border-collapse border border-gray-200 mb-4">
//                 <thead>
//                     <tr>
//                         <th className="border p-2">ลำดับ</th>
//                         <th className="border p-2">ชื่อหมวดหมู่</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {categories && categories.length > 0 ? (
//                         categories.map((category, index) => (
//                             <tr key={category.id}>
//                                 <td className="border p-2">{index + 1}</td>
//                                 <td className="border p-2">{category.name}</td>
//                             </tr>
//                         ))
//                     ) : (
//                         <tr>
//                             <td colSpan="2" className="border p-2 text-center">
//                                 ไม่มีหมวดหมู่ที่เพิ่ม
//                             </td>
//                         </tr>
//                     )}
//                 </tbody>
//             </table>

//             {/* ปุ่มย้อนกลับ */}
//             <Link to="/table_product" className="text-blue-500 hover:text-blue-700">
//                 ← ย้อนกลับ
//             </Link>

//             <LoadingModal isOpen={isLoading} />
//             <SuccessModal isOpen={isModalOpen} isSuccess={isSuccess} message={message} onClose={closeModal} />
//         </div>
//     );
// };

// export default AddCategory;
