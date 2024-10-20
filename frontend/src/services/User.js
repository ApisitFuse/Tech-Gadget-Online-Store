import { fetchRefreshTokenAPI } from '../services/authenticationService';


const HOST = process.env.REACT_APP_APP_HOST;
const PORT = process.env.REACT_APP_BN_PORT;


export const fetchProfileAPI = async () => {
    try {
        const response = await fetch(`http://${HOST}:${PORT}/api/user/profile`, {
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
                    return await fetch(`http://${HOST}:${PORT}/api/user/profile`, {
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

export const fetchUserProfileAPI = async () => {
    try {
        const response = await fetch(`http://${HOST}:${PORT}/api/user/user_profile`, {
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
                    return await fetch(`http://${HOST}:${PORT}/api/user/user_profile`, {
                        method: 'GET',
                        credentials: 'include',
                    });
                } else {
                    throw new Error('Failed to refresh token');
                }
            } else {
                throw new Error('Failed to fetch user profile');
            }
        }

        return response;
    } catch (error) {
        console.error('Error during fetching user profile:', error);
        throw error;
    }
}