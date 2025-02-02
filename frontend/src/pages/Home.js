// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';
// import axios from 'axios';
// import { handleError, handleSuccess } from '../utils';
// import './Home.css';

// function Home() {
//     const [loggedInUser, setLoggedInUser] = useState('');
//     const [userId, setUserId] = useState('');
//     const [files, setFiles] = useState([]);
//     const [selectedFile, setSelectedFile] = useState(null);
//     const [fileName, setFileName] = useState('Choose File');
//     const navigate = useNavigate();

//     useEffect(() => {
//         const storedUser = localStorage.getItem('loggedInUser');
//         const storedUserId = localStorage.getItem('userId'); // Ensure this key matches what you set during login
//         const token = localStorage.getItem('token');
    
//         if (!storedUser || !token || !storedUserId) {
//             navigate('/login');
//         } else {
//             setLoggedInUser(storedUser);
//             setUserId(storedUserId);
    
//             // Fetch files only if storedUserId is valid
//             if (storedUserId) {
//                 fetchUserFiles(storedUserId); // Pass the userId here
//             }
//         }
//     }, [navigate]);

//     useEffect(() => {
//         if (userId) {
//             fetchUserFiles(userId);
//         }
//     }, [userId]);


//     const fetchUserFiles = async (userId) => {
//         try {
//             const token = localStorage.getItem("token");
//             if (!token) {
//                 handleError("Authentication failed. Please log in again.");
//                 return;
//             }
    
//             const response = await axios.get(`http://localhost:8080/api/files/fetch/${userId}`, {
//                 // const response = await axios.get(`http://localhost:8080/api/files/fetch/679cc7ab5dc2cf66b54793d5`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
    
//             if (response.data.success) {
//                 setFiles(response.data.files || []); // Ensure `files` is set correctly
//             } else {
//                 handleError("Failed to fetch files.");
//             }
//         } catch (error) {
//             console.error("Error fetching files:", error);
//             handleError("Error fetching files");
//         }
//     };
    

//     // ✅ Handle file upload
//     const handleFileUpload = async (e) => {
//         e.preventDefault();
//         if (!selectedFile) {
//             handleError('Please select a file to upload');
//             return;
//         }

//         const fileName = selectedFile.name;
//         const fileType = selectedFile.type;
//         const fileSize = selectedFile.size;

//         try {
//             // Step 1: Get Pre-Signed URL
//             const response = await axios.post('http://localhost:8080/api/files/generate-upload-url',
//                 { fileName, fileType },
//                 { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
//             );

//             if (!response.data.success) {
//                 handleError('Failed to generate upload URL');
//                 return;
//             }

//             const { uploadUrl, fileKey } = response.data;

//             // Step 2: Upload File to S3
//             await axios.put(uploadUrl, selectedFile, { headers: { 'Content-Type': fileType } });

//             // Step 3: Save Metadata in MongoDB
//             await axios.post('http://localhost:8080/api/files/save-metadata',
//                 { fileName, fileKey, fileSize, fileType, uploadedBy: userId },
//                 { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
//             );

//             handleSuccess('File uploaded successfully');
//             setSelectedFile(null);
//             setFileName('Choose File');
//             fetchUserFiles(userId);

//         } catch (error) {
//             console.error("File Upload Error:", error);
//             handleError('Failed to upload file');
//         }
//     };

//     // ✅ Handle file deletion
//     const handleFileDelete = async (fileId) => {
//         try {
//             await axios.delete(`http://localhost:8080/api/files/${fileId}`, {
//                 headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//             });
//             handleSuccess('File deleted successfully');
//             fetchUserFiles(userId);
//         } catch (error) {
//             handleError('Failed to delete file');
//         }
//     };

//     // ✅ Handle logout
//     const handleLogout = () => {
//         localStorage.clear();
//         handleSuccess('Logged out successfully');
//         navigate('/login');
//     };

//     // ✅ Handle preview of file
//     const handlePreview = (url) => {
//         window.open(url, '_blank');
//     };

//     return (
//         <div className="home-full-page">
//             <div className="home-content">
//                 <h1>Welcome, {loggedInUser}!</h1>
//                 <form onSubmit={handleFileUpload} className="file-upload-form">
//                     <label htmlFor="file-upload" className="custom-file-btn">
//                         {fileName}
//                     </label>
//                     <input
//                         id="file-upload"
//                         type="file"
//                         onChange={(e) => {
//                             setSelectedFile(e.target.files[0]);
//                             setFileName(e.target.files[0]?.name || 'Choose File');
//                         }}
//                         className="file-input"
//                     />
//                     <button type="submit" className="upload-btn">
//                         Upload File
//                     </button>
//                 </form>
//                 <div className="file-list">
//                     <h2>Your Files:</h2>
//                     {files.length > 0 ? (
//                         <ul>
//                         {files.map((file) => (
//                             <li key={file._id} className="file-item">
//                                 <span>{file.fileName}</span>
//                                 <button className="preview-btn" onClick={() => window.open(file.s3Url, '_blank')}>
//                                     Preview
//                                 </button>
//                                 <button className="delete-btn" onClick={() => handleFileDelete(file._id)}>
//                                     Delete
//                                 </button>
//                             </li>
//                         ))}
//                     </ul>
                    
//                     ) : (
//                         <p>No files uploaded yet.</p>
//                     )}
//                 </div>
//                 <button onClick={handleLogout} className="logout-btn">Logout</button>
//             </div>
//             <ToastContainer />
//         </div>
//     );
// }

// export default Home;


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import { handleError, handleSuccess } from '../utils';
import './Home.css';

function Home() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [userId, setUserId] = useState('');
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState('Choose File');
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('loggedInUser');
        const storedUserId = localStorage.getItem('userId'); // Ensure this key matches what you set during login
        const token = localStorage.getItem('token');
  
        if (!storedUser || !token || !storedUserId) {
            navigate('/login');
        } else {
            setLoggedInUser(storedUser);
            setUserId(storedUserId);
  
            // Fetch files only if storedUserId is valid
            if (storedUserId) {
                fetchUserFiles(storedUserId); // Pass the userId here
            }
        }
    }, [navigate]);

    useEffect(() => {
        // Avoid making the API call if userId is not set
        if (userId) {
            fetchUserFiles(userId);
        }
    }, [userId]);

    const fetchUserFiles = async (userId) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                handleError("Authentication failed. Please log in again.");
                return;
            }

            if (!userId) {
                handleError("User ID is not available.");
                return;
            }

            const response = await axios.get(`http://localhost:8080/api/files/fetch/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.success) {
                setFiles(response.data.files || []); // Ensure `files` is set correctly
            } else {
                handleError("Failed to fetch files.");
            }
        } catch (error) {
            console.error("Error fetching files:", error);
            handleError("Error fetching files");
        }
    };

    // ✅ Handle file upload
    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            handleError('Please select a file to upload');
            return;
        }

        const fileName = selectedFile.name;
        const fileType = selectedFile.type;
        const fileSize = selectedFile.size;

        try {
            // Step 1: Get Pre-Signed URL
            const response = await axios.post('http://localhost:8080/api/files/generate-upload-url',
                { fileName, fileType },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );

            if (!response.data.success) {
                handleError('Failed to generate upload URL');
                return;
            }

            const { uploadUrl, fileKey } = response.data;

            // Step 2: Upload File to S3
            await axios.put(uploadUrl, selectedFile, { headers: { 'Content-Type': fileType } });

            // Step 3: Save Metadata in MongoDB
            await axios.post('http://localhost:8080/api/files/save-metadata',
                { fileName, fileKey, fileSize, fileType, uploadedBy: userId },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );

            handleSuccess('File uploaded successfully');
            setSelectedFile(null);
            setFileName('Choose File');
            fetchUserFiles(userId);

        } catch (error) {
            console.error("File Upload Error:", error);
            handleError('Failed to upload file');
        }
    };

    // ✅ Handle file deletion
    const handleFileDelete = async (fileId) => {
        try {
            await axios.delete(`http://localhost:8080/api/files/${fileId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            handleSuccess('File deleted successfully');
            fetchUserFiles(userId);
        } catch (error) {
            handleError('Failed to delete file');
        }
    };

    // ✅ Handle logout
    const handleLogout = () => {
        localStorage.clear();
        handleSuccess('Logged out successfully');
        navigate('/login');
    };

    // ✅ Handle preview of file
    const handlePreview = (url) => {
        window.open(url, '_blank');
    };

    return (
        <div className="home-full-page">
            <div className="home-content">
                <h1>Welcome, {loggedInUser}!</h1>
                <form onSubmit={handleFileUpload} className="file-upload-form">
                    <label htmlFor="file-upload" className="custom-file-btn">
                        {fileName}
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        onChange={(e) => {
                            setSelectedFile(e.target.files[0]);
                            setFileName(e.target.files[0]?.name || 'Choose File');
                        }}
                        className="file-input"
                    />
                    <button type="submit" className="upload-btn">
                        Upload File
                    </button>
                </form>
                <div className="file-list">
                    <h2>Your Files:</h2>
                    {files.length > 0 ? (
                        <ul>
                            {files.map((file) => (
                                <li key={file._id} className="file-item">
                                    <span>{file.fileName}</span>
                                    <button className="preview-btn" onClick={() => window.open(file.s3Url, '_blank')}>
                                        Preview
                                    </button>
                                    <button className="delete-btn" onClick={() => handleFileDelete(file._id)}>
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No files uploaded yet.</p>
                    )}
                </div>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Home;
