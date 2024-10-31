import { fetchRefreshTokenAPI } from '../services/authenticationService';


const HOST = process.env.REACT_APP_APP_HOST;
const PORT = process.env.REACT_APP_BN_PORT;

export const fetchSupSendEmailTokenAPI = async (email, role) => {
    try {
        const response = await fetch(`http://${HOST}:${PORT}/api/email/sup_email_token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ email, role }),
        });

        // ตรวจสอบว่า response ok หรือไม่
        if (!response.ok) {
            // ถ้าสถานะ 401 หมายถึง access token หมดอายุ
            if (response.status === 401) {
                console.log("Access token expired, attempting to refresh...");

                const refreshResponse = await fetchRefreshTokenAPI();

                if (refreshResponse.ok) {
                    // ถ้า refresh token สำเร็จ ให้เรียก fetch โปรไฟล์ใหม่
                    console.log("Access token refreshed successfully, retrying email token fetch...");
                    return await fetch(`http://${HOST}:${PORT}/api/email/sup_email_token`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        body: JSON.stringify({ email, role }),

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
        console.error('Error during fetching email token:', error);
        throw error;
    }
}
export const fetchAdminSendEmailTokenAPI = async (email, role) => {
    try {
        const response = await fetch(`http://${HOST}:${PORT}/api/email/admin_email_token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ email }),
        });

        // ตรวจสอบว่า response ok หรือไม่
        if (!response.ok) {
            // ถ้าสถานะ 401 หมายถึง access token หมดอายุ
            if (response.status === 401) {
                console.log("Access token expired, attempting to refresh...");

                const refreshResponse = await fetchRefreshTokenAPI();

                if (refreshResponse.ok) {
                    // ถ้า refresh token สำเร็จ ให้เรียก fetch โปรไฟล์ใหม่
                    console.log("Access token refreshed successfully, retrying email token fetch...");
                    return await fetch(`http://${HOST}:${PORT}/api/email/admin_email_token`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        body: JSON.stringify({ email }),

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
        console.error('Error during fetching email token:', error);
        throw error;
    }
}
export const fetchDecryptEmailAPI = async (encryptedEmail) => {
    try {
        const response = await fetch(`http://${HOST}:${PORT}/api/email/decrypt`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ encryptedEmail }),
        });

        if (!response.ok) {
            console.error('Failed to decrypt email token');
            return response;
        }

        return response;
    } catch (error) {
        console.error('Error during fetching email token:', error);
        throw error;
    }

}