

const HOST = process.env.REACT_APP_APP_HOST;
const PORT = process.env.REACT_APP_BN_PORT;

export const fetchLoginAPI = async (email, password) => {
    try {
        const response = await fetch(`http://${HOST}:${PORT}/api/auth/login`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            }),
        });

        if (!response.ok) {
            console.error('Network response was not ok');
            return response;
        }

        // const result = await response.json();
        return response;

    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};

export const fetchRegisterAPI = async (GID, globalName, email, password, confirmPassword) => {
    try {
        const response = await fetch(`http://${HOST}:${PORT}/api/auth/register`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ GID, globalName, email, password, confirmPassword }),
        });

        if (!response.ok) {
            console.error('Network response was not ok');
            return response;
        }

        return response;

    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};

export const fetchAdminRegisterAPI = async (token, GID, globalName, email, password, confirmPassword) => {
    try {
        const response = await fetch(`http://${HOST}:${PORT}/api/auth/admin_register`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, GID, globalName, email, password, confirmPassword }),
        });

        if (!response.ok) {
            console.error('Network response was not ok');
            return response;
        }

        // const result = await response.json();
        return response;

    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};

export const fetchSellerRegisterAPI = async (token, GID, globalName, email, password, confirmPassword) => {
    try {
        const response = await fetch(`http://${HOST}:${PORT}/api/auth/seller_register`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, GID, globalName, email, password, confirmPassword }),
        });

        if (!response.ok) {
            console.error('Network response was not ok');
            return response;
        }

        // const result = await response.json();
        return response;

    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};

export const fetchChangePasswordAPI = async (oldPassword, newPassword, confirmNewPassword) => {
    try {
        const response = await fetch(`http://${HOST}:${PORT}/api/auth/change_password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ oldPassword, newPassword, confirmNewPassword }),
        });

        // ตรวจสอบว่า response ok หรือไม่
        if (!response.ok) {
            // ถ้าสถานะ 401 หมายถึง access token หมดอายุ
            if (response.status === 401) {
                console.log("Access token expired, attempting to refresh...");

                const refreshResponse = await fetchRefreshTokenAPI();

                if (refreshResponse.ok) {
                    
                    console.log("Access token refreshed successfully, retrying change password fetch...");
                    return await fetch(`http://${HOST}:${PORT}/api/auth/change_password`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        body: JSON.stringify({ oldPassword, newPassword, confirmNewPassword }),
                    });
                } else {
                    console.error('Failed to refresh token');
                    return response;
                }
            } else {
                console.error('Network response was not ok');
                return response;
            }
        }

        return response;
    } catch (error) {
        console.error('Error during fetching change password:', error);
        throw error;
    }
}

export const fetchLogoutAPI = async () => {
    try {

        const response = await fetch(`http://${HOST}:${PORT}/api/auth/logout`, {
            method: 'POST',
            credentials: 'include',
        });

        return response;

    } catch (error) {
        console.error('Error during log out:', error);
        throw error;
    }

}

export const fetchRefreshTokenAPI = async () => {
    try {

        const response = await fetch(`http://${HOST}:${PORT}/api/auth/refresh_token`, {
            method: 'GET',
            credentials: 'include',
        });

        // ตรวจสอบ response status code และจัดการกับสถานะที่ไม่ใช่ 2xx
        if (!response.ok) {
            if (response.status === 403) {
                console.log("Refresh token invalid or expired.");
                return response;
            } else {
                console.log(`Request refresh token failed with status: ${response.status}`);
            }
            return null; // คืนค่า null หากเกิดปัญหา
        }

        // ดึงข้อมูลจาก response หากการเรียกสำเร็จ
        // const data = await response.json();
        console.log("New Access Token received:", response.json().accessToken);
        // return data;
        return response;

    } catch (error) {
        console.error('Error during get refresh token:', error);
        throw error;
    }

}
export const fetchRequestTokenAPI = async (email) => {
    try {

        const response = await fetch(`http://${HOST}:${PORT}/api/auth/request_token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        // ตรวจสอบ response status code และจัดการกับสถานะที่ไม่ใช่ 2xx
        if (!response.ok) {
            console.error('Network response was not ok');
            return response;
        }
        
        return response;

    } catch (error) {
        console.error('Error during get token:', error);
        throw error;
    }


}

export const fetchCheckAuthAPI = async () => {
    try {
        const response = await fetch(`http://${HOST}:${PORT}/api/auth/check_auth`, {
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
                    return await fetch(`http://${HOST}:${PORT}/api/auth/check_auth`, {
                        method: 'GET',
                        credentials: 'include',
                    });
                } else if (refreshResponse.status === 403) {
                    return refreshResponse;
                } else {
                    throw new Error('Failed to refresh token');
                }
            } else {
                throw new Error('Failed to fetch check auth');
            }
        }

        return response;
    } catch (error) {
        console.error('Error during fetching check auth:', error);
        throw error;
    }
}
