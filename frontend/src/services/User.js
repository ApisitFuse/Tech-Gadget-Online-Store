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

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return response;
    } catch (error) {
        console.error('Error during fetching profile:', error);
        throw error;
    }
}