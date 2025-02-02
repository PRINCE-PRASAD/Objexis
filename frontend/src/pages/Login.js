// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';
// import { handleError, handleSuccess } from '../utils';
// import './Login.css'; // Add styles here

// function Login() {
//     const [loginInfo, setLoginInfo] = useState({
//         email: '',
//         password: ''
//     });

//     const navigate = useNavigate();

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setLoginInfo((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleLogin = async (e) => {
//         e.preventDefault();
//         const { email, password } = loginInfo;
//         if (!email || !password) {
//             return handleError('Email and password are required');
//         }
//         try {
//             const url = `${process.env.REACT_APP_API_URL}/auth/login`;
//             const response = await fetch(url, {
//                 method: "POST",
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(loginInfo)
//             });
//             const result = await response.json();
//             const { success, message, jwtToken, name, error } = result;
//             if (success) {
//                 handleSuccess(message);
//                 localStorage.setItem('token', jwtToken);
//                 localStorage.setItem('loggedInUser', name);
//                 setTimeout(() => {
//                     navigate('/home');
//                 }, 1000);
//             } else if (error) {
//                 const details = error?.details[0].message;
//                 handleError(details);
//             } else if (!success) {
//                 handleError(message);
//             }
//         } catch (err) {
//             handleError(err.message);
//         }
//     };

//     return (
//         <div className="login-full-page">
//             <div className="login-container">
//                 <h1>Login</h1>
//                 <form onSubmit={handleLogin}>
//                     <div className="form-group">
//                         <label htmlFor="email">Email</label>
//                         <input
//                             type="email"
//                             name="email"
//                             placeholder="Enter your email..."
//                             value={loginInfo.email}
//                             onChange={handleChange}
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label htmlFor="password">Password</label>
//                         <input
//                             type="password"
//                             name="password"
//                             placeholder="Enter your password..."
//                             value={loginInfo.password}
//                             onChange={handleChange}
//                         />
//                     </div>
//                     <button type="submit" className="login-btn">Login</button>
//                     <p className="signup-text">
//                         Don't have an account? <Link to="/signup" className="signup-link">Signup</Link>
//                     </p>
//                 </form>
//                 <ToastContainer />
//             </div>
//         </div>
//     );
// }

// export default Login;


import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import './Login.css'; // Add styles here

function Login() {
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginInfo((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;
        if (!email || !password) {
            return handleError('Email and password are required');
        }
        try {
            const url = `${process.env.REACT_APP_API_URL}/auth/login`;
            // const url = "http://localhost:8080/auth/login";

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginInfo)
            });
            const result = await response.json();
            const { success, message, jwtToken, name, userId, error } = result;

            if (success) {
                // Store required information in localStorage
                localStorage.setItem('token', jwtToken);
                localStorage.setItem('loggedInUser', name);
                localStorage.setItem('userId', userId); // Store userId for later use

                handleSuccess(message);
                setTimeout(() => {
                    navigate('/home');
                }, 1000);
            } else if (error) {
                const details = error?.details[0]?.message || message;
                handleError(details);
            } else if (!success) {
                handleError(message);
            }
        } catch (err) {
            handleError(err.message);
        }
    };

    return (
        <div className="login-full-page">
            <div className="login-container">
                <h1>Login</h1>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email..."
                            value={loginInfo.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password..."
                            value={loginInfo.password}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="login-btn">Login</button>
                    <p className="signup-text">
                        Don't have an account? <Link to="/signup" className="signup-link">Signup</Link>
                    </p>
                </form>
                <ToastContainer />
            </div>
        </div>
    );
}

export default Login;
