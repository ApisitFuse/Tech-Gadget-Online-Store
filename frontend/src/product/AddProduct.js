import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { fetchUploadImageAPI } from '../services/Image';
import { fetchAddProductAPI } from '../services/Product';
import { SuccessModal, LoadingModal } from '../layout/Modal';

export default function AddProductForm() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [customFileName, setCustomFileName] = useState("");
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSuccess, setIsSuccess] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [product, setProduct] = useState({
        productImage: "",
        productName: "",
        description: "",
        price: "",
        stock: 0,
        imagePreview: null,
    });

    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            setSelectedFile(file);
            setCustomFileName(file.name);
            setProduct(prev => ({
                ...prev,
                productImage: file.name,
                imagePreview: URL.createObjectURL(file),
            }));
        }
    };

    useEffect(() => {
        if (customFileName) {
            setProduct(prev => ({
                ...prev,
                productImage: customFileName
            }));
        }
    }, [customFileName]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: "image/*",
        multiple: false
    });

    // const handleUpload = async () => {
    //     if (!selectedFile) return;

    //     const formData = new FormData();
    //     formData.append("image", selectedFile, customFileName);

    //     const response = await fetchUploadImageAPI(formData);
    //     const data = await response.json();
    //     console.log("Image uploaded:", data);
    // };

    const handleUpload = async (productId) => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append("image", selectedFile);
        formData.append("customFileName", customFileName);

        console.log("FormData entries:");
        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

        console.log([...formData]);
        try {
            const response = await fetchUploadImageAPI(formData);
            const data = await response.json();

            if (response.ok) {
                setProduct(prev => ({ ...prev, productImage: data.filename }));
            }
        } catch (error) {
            console.error("Upload failed:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: value }));
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setMessage('');
        setIsLoading(true);

        try {
            const response = await fetchAddProductAPI(product);
            const data = await response.json();

            if (response.ok) {
                if (selectedFile) {
                    await handleUpload(data.productId);
                }
                setIsSuccess(true);

                setProduct({
                    productImage: "",
                    productName: "",
                    description: "",
                    price: "",
                    stock: 0,
                    imagePreview: null,
                });
                setSelectedFile(null);
                setCustomFileName("");

                setMessage('Adding product successful!');
            } else {
                setErrors(data.errors.reduce((acc, err) => ({ ...acc, [err.path]: err.msg }), {}));
                setIsSuccess(false);
                setMessage('Adding product failed');
            }
        } catch (error) {
            console.error('Error adding product:', error);
            setMessage('Error occurred');
            setIsSuccess(false);
        } finally {
            setIsLoading(false);
            setIsModalOpen(true);

            setTimeout(() => {
                setIsModalOpen(false);
            }, 4000);
        }
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setErrors({});
    //     setMessage('');
    //     setIsLoading(true);

    //     try {
    //         const response = await fetchAddProductAPI(product);
    //         const data = await response.json();

    //         if (response.ok) {
    //             await handleUpload();
    //             setIsSuccess(true);
    //             setMessage('Adding product successful!');
    //         } else {
    //             setErrors(data.errors.reduce((acc, err) => ({ ...acc, [err.path]: err.msg }), {}));
    //             setIsSuccess(false);
    //             setMessage('Adding product failed');
    //         }
    //     } catch (error) {
    //         console.error('Error adding product:', error);
    //         setMessage('Error occurred');
    //         setIsSuccess(false);
    //     } finally {
    //         setIsLoading(false);
    //         setIsModalOpen(true);

    //         setTimeout(() => {
    //             setIsModalOpen(false);
    //         }, 4000);
    //     }
    // };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">เพิ่มสินค้าเข้า Stock</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer 
                    ${isDragActive ? "border-blue-500 bg-blue-100" : "border-gray-300 bg-gray-50 hover:border-blue-500 hover:bg-blue-50"}
                `}>
                    <input {...getInputProps()} />
                    {product.imagePreview ? (
                        <img src={product.imagePreview} alt="Product Preview" className="w-full h-auto max-h-40 object-contain rounded" />
                    ) : (
                        <p className="text-gray-500">ลากและวางรูปที่นี่ หรือคลิกเพื่อเลือก</p>
                    )}
                </div>

                {selectedFile && (
                    <input
                        type="text"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={customFileName}
                        onChange={(e) => setCustomFileName(e.target.value)}
                        placeholder="เปลี่ยนชื่อไฟล์ (รวม .jpg .png เป็นต้น)"
                    />
                )}

                <div className="mb-4">
                    <input
                        type="text"
                        name="productName"
                        placeholder="ชื่อสินค้า"
                        // className="w-full p-3 border border-gray-300 rounded-md"
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.productName ? 'border-b-2 border-b-red-600' : ''}`}
                        value={product.productName} onChange={handleChange}
                    />
                    {errors.productName && (
                        <p className="text-red-600 text-sm mt-1">{errors.productName}</p>
                    )}
                </div>
                <div className="mb-4">
                    <input
                        type="text"
                        name="description"
                        placeholder="รายละเอียด"
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.description ? 'border-b-2 border-b-red-600' : ''}`}
                        value={product.description} onChange={handleChange}
                    />
                    {errors.description && (
                        <p className="text-red-600 text-sm mt-1">{errors.description}</p>
                    )}
                </div>
                <div className="mb-4">
                    <input
                        type="number"
                        name="price"
                        placeholder="ราคา"
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.price ? 'border-b-2 border-b-red-600' : ''}`}
                        value={product.price} onChange={handleChange}
                    />
                    {errors.price && (
                        <p className="text-red-600 text-sm mt-1">{errors.price}</p>
                    )}
                </div>
                <div className="mb-4">
                    <input
                        type="number"
                        name="stock"
                        placeholder="จำนวน"
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.stock ? 'border-b-2 border-b-red-600' : ''}`}
                        value={product.stock} onChange={handleChange}
                    />
                    {errors.stock && (
                        <p className="text-red-600 text-sm mt-1">{errors.stock}</p>
                    )}
                </div>

                <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">เพิ่มสินค้า</button>
            </form>
            {/* {message && <p className="text-red-500 text-center mt-4">{message}</p>} */}

            <LoadingModal isOpen={isLoading} />
            <SuccessModal isOpen={isModalOpen} isSuccess={isSuccess} message={message} onClose={closeModal} />
        </div>
    );
}




// import { useState } from "react";
// import { fetchUploadImageAPI } from '../services/Image';
// import { fetchAddProductAPI } from '../services/Product';

// export default function AddProductForm() {
//     const [selectedFile, setSelectedFile] = useState(null);
//     const [message, setMessage] = useState('');
//     const [errors, setErrors] = useState({});
//     const [product, setProduct] = useState({
//         productImage: null,
//         productName: "",
//         description: "",
//         price: "",
//         stock: 0,
//         imagePreview: null,
//     });

//     const handleFileChange = (event) => {
//         const file = event.target.files[0];
//         if (file) {
//             setSelectedFile(file);
//             setProduct((prev) => ({
//                 ...prev,
//                 productImage: file.name,
//             }));

//             setProduct((prev) => ({
//                 ...prev,
//                 imagePreview: URL.createObjectURL(file),
//             }));
//         }
//     };

//     const handleUpload = async () => {
//         if (!selectedFile) return;

//         const formData = new FormData();
//         formData.append("image", selectedFile);

//         const response = await fetchUploadImageAPI(formData);
//         const data = await response.json();

//         console.log("Image uploaded:", data);

//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setProduct((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setErrors({});

//         try {

//             const response = await fetchAddProductAPI(product);

//             const data = await response.json();

//             if (response.ok) {
//                 handleUpload();

//                 setMessage('Adding product successful!');
//             } else {
//                 setErrors(data.errors.reduce((acc, err) => ({ ...acc, [err.path]: err.msg }), {}));
//                 setMessage('Adding product failed');
//                 return;
//             }
//         } catch (error) {
//             console.error('Error adding product:', error);
//             setMessage('Error occurred');
//         }

//         console.log("Adding product:", product);
//     };

//     return (
//         <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
//             <h2 className="text-xl font-bold mb-4">เพิ่มสินค้าเข้า Stock</h2>
//             <form onSubmit={handleSubmit} className="space-y-4">

//                 {product.imagePreview && (
//                     <img src={product.imagePreview} alt="Product Preview" className="w-full h-40 object-cover rounded" />
//                 )}
//                 <input type="file" onChange={handleFileChange} className="w-full p-2 border rounded" />

//                 <div className="mb-4">
//                     <input
//                         type="text"
//                         name="productName"
//                         placeholder="ชื่อสินค้า"
//                         // className="w-full p-2 border rounded"
//                         className={`w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-b-2 border-b-red-600' : ''}`}
//                         value={product.productName}
//                         onChange={handleChange}
//                     />
//                     {errors.productName && (
//                         <p className="text-red-600 text-sm mt-1">{errors.productName}</p>
//                     )}
//                 </div>

//                 <div className="mb-4">
//                     <input
//                         type="text"
//                         name="description"
//                         placeholder="รายละเอียด"
//                         // className="w-full p-2 border rounded"
//                         className={`w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-b-2 border-b-red-600' : ''}`}
//                         value={product.description}
//                         onChange={handleChange}
//                     />
//                     {errors.description && (
//                         <p className="text-red-600 text-sm mt-1">{errors.description}</p>
//                     )}
//                 </div>

//                 <div className="mb-4">
//                     <input
//                         type="number"
//                         name="price"
//                         placeholder="ราคา"
//                         className={`w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-b-2 border-b-red-600' : ''}`}
//                         value={product.price}
//                         onChange={handleChange}
//                     />
//                     {errors.price && (
//                         <p className="text-red-600 text-sm mt-1">{errors.price}</p>
//                     )}
//                 </div>

//                 <div className="mb-4">
//                     <input
//                         type="number"
//                         name="stock"
//                         placeholder="จำนวน"
//                         className={`w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-b-2 border-b-red-600' : ''}`}
//                         value={product.stock}
//                         onChange={handleChange}
//                     />
//                     {errors.stock && (
//                         <p className="text-red-600 text-sm mt-1">{errors.stock}</p>
//                     )}
//                 </div>

//                 <button
//                     type="submit"
//                     className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                 >
//                     เพิ่มสินค้า
//                 </button>
//             </form>
//             {message && <p className="text-red-500 text-center mt-4">{message}</p>}
//         </div>
//     );
// }