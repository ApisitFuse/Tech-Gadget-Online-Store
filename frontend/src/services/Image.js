import { fetchRefreshTokenAPI } from '../services/authenticationService';

const HOST = process.env.REACT_APP_APP_HOST;
const PORT = process.env.REACT_APP_BN_PORT;


export const fetchUploadImageAPI = async (formData) => {
    try {
        const response = await fetch(`http://${HOST}:${PORT}/api/image/upload_product_image`, {
            method: 'POST',
            credentials: 'include',
            body: formData,
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
                    return await fetch(`http://${HOST}:${PORT}/api/image/upload_product_image`, {
                        method: 'POST',
                        credentials: 'include',
                        body: formData,

                    });
                } else {
                    throw new Error('Failed to refresh token');
                }
            } else {
                throw new Error('Failed to fetch upload image');
            }
        }

        return response;
    } catch (error) {
        console.error('Error during fetching upload image:', error);
        throw error;
    }
}