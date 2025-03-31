import { fetchRefreshTokenAPI } from '../services/authenticationService';

const HOST = process.env.REACT_APP_APP_HOST;
const PORT = process.env.REACT_APP_BN_PORT;

export const fetchAddProductAPI = async (product) => {
    try {
        const { productImage, productName, description, price, stock, categories } = product;
        const response = await fetch(`http://${HOST}:${PORT}/api/product/add_product`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productImage, productName, description, price, stock, categories }),
        });

        if (!response.ok) {
            // ถ้าสถานะ 401 หมายถึง access token หมดอายุ
            if (response.status === 401) {
                console.log("Access token expired, attempting to refresh...");

                const refreshResponse = await fetchRefreshTokenAPI();

                if (refreshResponse.ok) {
                    // ถ้า refresh token สำเร็จ ให้เรียก fetch โปรไฟล์ใหม่
                    console.log("Access token refreshed successfully, retrying email token fetch...");
                    return await fetch(`http://${HOST}:${PORT}/api/product/add_product`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        body: JSON.stringify({ productImage, productName, description, price, stock, categories }),

                    });
                } else {
                    console.error('Network response was not ok');
                    return response;
                }
            } else {

                console.error('Failed to fetch email token');
                return response;
            }

        }

        return response;

    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};

export const fetchAddCategoryAPI = async (name) => {
    try {
        const response = await fetch(`http://${HOST}:${PORT}/api/product/add_category`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({name}),
        });

        if (!response.ok) {
            // ถ้าสถานะ 401 หมายถึง access token หมดอายุ
            if (response.status === 401) {
                console.log("Access token expired, attempting to refresh...");

                const refreshResponse = await fetchRefreshTokenAPI();

                if (refreshResponse.ok) {
                    // ถ้า refresh token สำเร็จ ให้เรียก fetch โปรไฟล์ใหม่
                    console.log("Access token refreshed successfully, retrying email token fetch...");
                    return await fetch(`http://${HOST}:${PORT}/api/product/add_category`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        body: JSON.stringify({name}),

                    });
                } else {
                    console.error('Network response was not ok');
                    return response;
                }
            } else {

                console.error('Failed to fetch email token');
                return response;
            }

        }

        return response;

    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};

export const fetchProductsAPI = async () => {
    try {
        const response = await fetch(`http://${HOST}:${PORT}/api/product/show_product`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        // ตรวจสอบว่า response ok หรือไม่
        if (!response.ok) {
            // ถ้าสถานะ 401 หมายถึง access token หมดอายุ
            if (response.status === 401) {
                console.log("Access token expired, attempting to refresh...");

                const refreshResponse = await fetchRefreshTokenAPI();

                if (refreshResponse.ok) {
                    // ถ้า refresh token สำเร็จ ให้เรียก fetch โปรไฟล์ใหม่
                    console.log("Access token refreshed successfully, retrying profile fetch...");
                    return await fetch(`http://${HOST}:${PORT}/api/product/show_product`, {
                        method: 'GET',
                        credentials: 'include',
                    });
                } else {
                    throw new Error('Failed to refresh token');
                }
            } else {
                throw new Error('Failed to fetch profile');
            }
        }

        return response;
    } catch (error) {
        console.error('Error during fetching profile:', error);
        throw error;
    }
}

export const fetchCategoriesAPI = async () => {
    try {
        const response = await fetch(`http://${HOST}:${PORT}/api/product/show_categories`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        // ตรวจสอบว่า response ok หรือไม่
        if (!response.ok) {
            // ถ้าสถานะ 401 หมายถึง access token หมดอายุ
            if (response.status === 401) {
                console.log("Access token expired, attempting to refresh...");

                const refreshResponse = await fetchRefreshTokenAPI();

                if (refreshResponse.ok) {
                    // ถ้า refresh token สำเร็จ ให้เรียก fetch โปรไฟล์ใหม่
                    console.log("Access token refreshed successfully, retrying profile fetch...");
                    return await fetch(`http://${HOST}:${PORT}/api/product/show_categories`, {
                        method: 'GET',
                        credentials: 'include',
                    });
                } else {
                    throw new Error('Failed to refresh token');
                }
            } else {
                throw new Error('Failed to fetch profile');
            }
        }

        return response;
    } catch (error) {
        console.error('Error during fetching profile:', error);
        throw error;
    }
}

export const updateProductAPI = async (product) => {
    try {
        const { id, productImage, productName, description, price, stock, categories } = product;
        const response = await fetch(`http://${HOST}:${PORT}/api/product/update_product`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, productImage, productName, description, price, stock, categories }),
        });

        if (!response.ok) {
            // ถ้าสถานะ 401 หมายถึง access token หมดอายุ
            if (response.status === 401) {
                console.log("Access token expired, attempting to refresh...");

                const refreshResponse = await fetchRefreshTokenAPI();

                if (refreshResponse.ok) {
                    // ถ้า refresh token สำเร็จ ให้เรียก fetch โปรไฟล์ใหม่
                    console.log("Access token refreshed successfully, retrying email token fetch...");
                    return await fetch(`http://${HOST}:${PORT}/api/product/update_product`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        body: JSON.stringify({ id, productImage, productName, description, price, stock, categories }),

                    });
                } else {
                    console.error('Network response was not ok');
                    return response;
                }
            } else {

                console.error('Failed to fetch email token');
                return response;
            }

        }

        return response;

    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};

export const updateCategoryAPI = async (category) => {
    try {
        const { id, name } = category;
        const response = await fetch(`http://${HOST}:${PORT}/api/product/update_category`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, name }),
        });

        if (!response.ok) {
            // ถ้าสถานะ 401 หมายถึง access token หมดอายุ
            if (response.status === 401) {
                console.log("Access token expired, attempting to refresh...");

                const refreshResponse = await fetchRefreshTokenAPI();

                if (refreshResponse.ok) {
                    // ถ้า refresh token สำเร็จ ให้เรียก fetch โปรไฟล์ใหม่
                    console.log("Access token refreshed successfully, retrying email token fetch...");
                    return await fetch(`http://${HOST}:${PORT}/api/product/update_category`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        body: JSON.stringify({ id, name }),

                    });
                } else {
                    console.error('Network response was not ok');
                    return response;
                }
            } else {

                console.error('Failed to fetch email token');
                return response;
            }

        }

        return response;

    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }

};

export const deleteProductAPI = async (id) => {
    try {
        const response = await fetch(`http://${HOST}:${PORT}/api/product/delete_product/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        // ตรวจสอบว่า response ok หรือไม่
        if (!response.ok) {
            // ถ้าสถานะ 401 หมายถึง access token หมดอายุ
            if (response.status === 401) {
                console.log("Access token expired, attempting to refresh...");

                const refreshResponse = await fetchRefreshTokenAPI();

                if (refreshResponse.ok) {
                    // ถ้า refresh token สำเร็จ ให้เรียก fetch โปรไฟล์ใหม่
                    console.log("Access token refreshed successfully, retrying profile fetch...");
                    return await fetch(`http://${HOST}:${PORT}/api/product/delete_product/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',

                    });
                } else {
                    throw new Error('Failed to refresh token');
                }
            } else {
                throw new Error('Failed to fetch profile');
            }
        }

        return response;
    } catch (error) {
        console.error('Error during fetching profile:', error);
        throw error;
    }
}

export const deleteCategoryAPI = async (id) => {
    try {
        const response = await fetch(`http://${HOST}:${PORT}/api/product/delete_category/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        // ตรวจสอบว่า response ok หรือไม่
        if (!response.ok) {
            // ถ้าสถานะ 401 หมายถึง access token หมดอายุ
            if (response.status === 401) {
                console.log("Access token expired, attempting to refresh...");

                const refreshResponse = await fetchRefreshTokenAPI();

                if (refreshResponse.ok) {
                    // ถ้า refresh token สำเร็จ ให้เรียก fetch โปรไฟล์ใหม่
                    console.log("Access token refreshed successfully, retrying profile fetch...");
                    return await fetch(`http://${HOST}:${PORT}/api/product/delete_category/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',

                    });
                } else {
                    throw new Error('Failed to refresh token');
                }
            } else {
                throw new Error('Failed to fetch delete category');
            }
        }

        return response;
    } catch (error) {
        console.error('Error during fetching delete category:', error);
        throw error;
    }
}