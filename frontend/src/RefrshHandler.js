// import React, { useEffect } from 'react'
// import { useLocation, useNavigate } from 'react-router-dom'

// function RefrshHandler({ setIsAuthenticated }) {
//     const location = useLocation();
//     const navigate = useNavigate();

//     useEffect(() => {
//         if (localStorage.getItem('token')) {
//             setIsAuthenticated(true);
//             if (location.pathname === '/' ||
//                 location.pathname === '/login' ||
//                 location.pathname === '/signup'
//             ) {
//                 navigate('/home', { replace: false });
//             }
//         }
//     }, [location, navigate, setIsAuthenticated])

//     return (
//         null
//     )
// }

// export default RefrshHandler

import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function RefrshHandler({ setIsAuthenticated }) {
    const location = useLocation();
    const navigate = useNavigate();
    const hasNavigated = useRef(false); // Track if navigation has already occurred

    useEffect(() => {
        if (localStorage.getItem('token')) {
            setIsAuthenticated(true);

            // Prevent repeated navigation
            if (
                !hasNavigated.current && 
                (location.pathname === '/' || 
                 location.pathname === '/login' || 
                 location.pathname === '/signup')
            ) {
                hasNavigated.current = true; // Mark navigation as completed
                navigate('/home', { replace: true }); // Use `replace` to avoid navigation loops
            }
        }
    }, [location.pathname, navigate, setIsAuthenticated]);

    return null;
}

export default RefrshHandler;
