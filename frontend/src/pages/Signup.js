// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';
// import { handleError, handleSuccess } from '../utils';
// import './Signup.css'; // Import custom styles

// function Signup() {
//     const [signupInfo, setSignupInfo] = useState({
//         name: '',
//         email: '',
//         password: ''
//     });

//     const navigate = useNavigate();

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setSignupInfo((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleSignup = async (e) => {
//         e.preventDefault();
//         const { name, email, password } = signupInfo;
//         if (!name || !email || !password) {
//             return handleError('Name, email, and password are required');
//         }
//         try {
//             const url = `${process.env.REACT_APP_API_URL}/auth/signup`;
//             const response = await fetch(url, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(signupInfo),
//             });
//             const result = await response.json();
//             const { success, message, error } = result;
//             if (success) {
//                 handleSuccess(message);
//                 setTimeout(() => {
//                     navigate('/login');
//                 }, 1000);
//             } else if (error) {
//                 const details = error?.details[0]?.message;
//                 handleError(details);
//             } else if (!success) {
//                 handleError(message);
//             }
//         } catch (err) {
//             handleError(err.message);
//         }
//     };

//     return (
//         <div className="signup-full-page">
//             <div className="signup-container">
//                 <h1>Signup</h1>
//                 <form onSubmit={handleSignup}>
//                     <div className="form-group">
//                         <label htmlFor="name">Name</label>
//                         <input
//                             type="text"
//                             name="name"
//                             placeholder="Enter your name..."
//                             autoFocus
//                             value={signupInfo.name}
//                             onChange={handleChange}
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label htmlFor="email">Email</label>
//                         <input
//                             type="email"
//                             name="email"
//                             placeholder="Enter your email..."
//                             value={signupInfo.email}
//                             onChange={handleChange}
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label htmlFor="password">Password</label>
//                         <input
//                             type="password"
//                             name="password"
//                             placeholder="Enter your password..."
//                             value={signupInfo.password}
//                             onChange={handleChange}
//                         />
//                     </div>
//                     <button type="submit" className="signup-btn">Signup</button>
//                     <p className="login-text">
//                         Already have an account?{' '}
//                         <Link to="/login" className="login-link">Login</Link>
//                     </p>
//                 </form>
//                 <ToastContainer />
//             </div>
//         </div>
//     );
// }

// export default Signup;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import './Signup.css'; // Import custom styles

function Signup() {
    const [signupInfo, setSignupInfo] = useState({
        name: '',
        email: '',
        password: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignupInfo((prev) => ({ ...prev, [name]: value }));
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        const { name, email, password } = signupInfo;

        if (!name || !email || !password) {
            return handleError('All fields are required');
        }

        try {
            const url = `${process.env.REACT_APP_API_URL}/auth/signup`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(signupInfo),
            });

            const result = await response.json();
            const { success, message, error, user, token } = result;

            if (success) {
                localStorage.setItem('userId', user._id); // Store user ID
                localStorage.setItem('token', token); // Store token
                localStorage.setItem('loggedInUser', user.name); // Store username

                handleSuccess(message); // Show success toast
                setTimeout(() => {
                    navigate('/login'); // Navigate after showing toast
                }, 2000); // Delay navigation by 2 seconds
            } else {
                handleError(error?.details[0]?.message || message);
            }
        } catch (err) {
            handleError('An unexpected error occurred. Please try again.');
        }
    };

    return (
        <div className="signup-full-page">
            <div className="signup-container">
                <h1>Signup</h1>
                <form onSubmit={handleSignup}>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name..."
                            autoFocus
                            value={signupInfo.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email..."
                            value={signupInfo.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password..."
                            value={signupInfo.password}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="signup-btn">Signup</button>
                    <p className="login-text">
                        Already have an account?{' '}
                        <Link to="/login" className="login-link">Login</Link>
                    </p>
                </form>
                <ToastContainer />
            </div>
        </div>
    );
}

export default Signup;
