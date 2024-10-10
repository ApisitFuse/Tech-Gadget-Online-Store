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

        // console.log("1.1");
        // if (!response.ok) {
        //     console.log("1.2");
        //     throw new Error('Network response was not ok');
        // }
        // else if (response.status === 401) {
        //     console.log("Access Token expired, requesting Refresh Token...");

        //     // ขอ refresh token
        //     const refreshResponse = await fetchRefreshTokenAPI();

        //     if (refreshResponse.ok) {
        //         // เรียก API อีกครั้งด้วย access token ใหม่
        //         fetchProfile();
        //     } else {
        //         console.log("Failed to refresh token");
        //         setMessage('Failed to refresh token');
        //     }
        // }


        return response;
    } catch (error) {
        console.error('Error during fetching profile:', error);
        throw error;
    }
}