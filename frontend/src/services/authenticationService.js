
export const fetchLoginAPI = async (email, password) => {
    try {
        console.log("email: ", email, "password: ", password);
        const response = await fetch('http://localhost:8000/api/auth/login', {
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