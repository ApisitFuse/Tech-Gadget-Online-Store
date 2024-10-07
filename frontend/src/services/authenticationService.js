const HOST = process.env.REACT_APP_APP_HOST;
const PORT = process.env.REACT_APP_BN_PORT;

export const fetchLoginAPI = async (email, password) => {
    try {
        console.log("HOST: ", HOST)
        console.log("PORT: ", PORT)
        const response = await fetch(`http://${HOST}:${PORT}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        return result;

    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};
export const fetchRegisterAPI = async (GID, glocbalName, email, password, roleId) => {
    try {
        const response = await fetch(`http://${HOST}:${PORT}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ GID, glocbalName, email, password, roleId }),
            });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        return result;

    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};

// export const fetchLoginAPI = async (email, password) => {
//     try {
//         console.log("email: ", email, "password: ", password);
//         const response = await fetch('http://localhost:8000/api/auth/login', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 email: email,
//                 password: password
//             }),
//         });

//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }

//         const result = await response.json();
//         return result;

//     } catch (error) {
//         console.error('Error during login:', error);
//         throw error;
//     }
// };