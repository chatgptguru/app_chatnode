import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaAlignLeft, FaMicrosoft, FaFileUpload, FaFile, FaFolder, FaFolderOpen, FaArrowLeft, FaDownload, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import * as msal from '@azure/msal-browser';

const OneDrive = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [isOneDriveConnected, setIsOneDriveConnected] = useState(false);
    const [oneDriveFiles, setOneDriveFiles] = useState([]);
    const [currentFolder, setCurrentFolder] = useState('root');
    const [folderPath, setFolderPath] = useState([{ id: 'root', name: 'OneDrive' }]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const msalInstance = useRef(null);

    useEffect(() => {
        // MSAL configuration
        const msalConfig = {
            auth: {
                clientId: import.meta.env.VITE_AZURE_CLIENT_ID,
                authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID || 'common'}`,
                redirectUri: window.location.origin,
            },
            cache: {
                cacheLocation: 'sessionStorage',
                storeAuthStateInCookie: false,
            },
        };

        // Initialize MSAL instance
        msalInstance.current = new msal.PublicClientApplication(msalConfig);
        msalInstance.current.initialize().then(() => {
            console.log('MSAL initialized successfully');
        }).catch(error => {
            console.error('MSAL initialization failed:', error);
            setError('Failed to initialize Microsoft authentication');
        });
    }, []);

    const signIn = useCallback(async () => {
        try {
            if (!msalInstance.current) {
                throw new Error('Authentication not initialized');
            }

            setLoading(true);
            setError(null);

            const loginRequest = {
                scopes: ['Files.Read', 'Files.ReadWrite', 'User.Read'],
            };
            
            const authResult = await msalInstance.current.loginPopup(loginRequest);
            setIsOneDriveConnected(true);
            return authResult.accessToken;
        } catch (error) {
            setError('Authentication failed. Please try again.');
            console.error('Login failed:', error);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchOneDriveFiles = async () => {
        setLoading(true);
        try {
            const accessToken = await signIn();
            if (!accessToken) return;

            const response = await fetch('https://graph.microsoft.com/v1.0/me/drive/root/children', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch OneDrive files');
            }

            const data = await response.json();
            setOneDriveFiles(data.value.map(file => ({
                id: file.id,
                name: file.name,
                type: file.folder ? 'folder' : 'file',
                modifiedTime: file.lastModifiedDateTime,
                size: file.size,
                webUrl: file.webUrl
            })));
        } catch (error) {
            setError('Failed to fetch OneDrive files');
            console.error('Error fetching files:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = async (file) => {
        try {
            const accessToken = await signIn();
            if (!accessToken) return;

            // Get the file content
            const response = await fetch(`https://graph.microsoft.com/v1.0/me/drive/items/${file.id}/content`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch file content');
            }

            const blob = await response.blob();
            const formData = new FormData();
            formData.append("file", new File([blob], file.name));
            formData.append("user_id", localStorage.getItem('user_id'));
            formData.append("type", "onedrive");

            const uploadResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/upload-pdf`, {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!uploadResponse.ok) {
                throw new Error('Failed to upload file');
            }

            setSelectedFiles(prev => [...prev, file]);
            setSuccessMessage(`File "${file.name}" selected successfully`);
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            setError(error.message);
            console.error('Error selecting file:', error);
        }
    };

    const handleFolderClick = (folder) => {
        setCurrentFolder(folder.id);
        setFolderPath(prev => [...prev, { id: folder.id, name: folder.name }]);
    };

    const handleBreadcrumbClick = (index) => {
        const newPath = folderPath.slice(0, index + 1);
        setFolderPath(newPath);
        setCurrentFolder(newPath[newPath.length - 1].id);
    };

    const handleRemoveFile = (fileId) => {
        setSelectedFiles(prev => prev.filter(f => f.id !== fileId));
    };

    return (
        <div className='flex flex-col w-full gap-6 p-8 min-h-screen bg-gray-50'>
            {/* Header Section */}
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    <FaMicrosoft className='text-3xl text-blue-500' />
                    <h1 className='text-3xl font-bold text-gray-800'>OneDrive Integration</h1>
                </div>
            </div>

            {/* Main Content */}
            <div className='flex gap-6'>
                {/* Left Panel - Selected Files */}
                <div className='w-1/2'>
                    <div className='p-4 bg-white rounded-lg shadow-md'>
                        <div className='flex items-center gap-3 mb-4'>
                            <FaMicrosoft className='text-xl text-blue-500' />
                            <h3 className='text-lg font-semibold text-gray-700'>Connect to OneDrive</h3>
                        </div>
                        <button
                            onClick={signIn}
                            disabled={loading}
                            className='w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed'
                        >
                            <FaMicrosoft />
                            {loading ? 'Connecting...' : 'Connect OneDrive Account'}
                        </button>
                    </div>
                    
                    {/* Selected Files */}
                    {selectedFiles.length > 0 && (
                        <div className='mt-6 p-4 bg-white rounded-lg shadow-md'>
                            <h3 className='mb-4 text-lg font-semibold text-gray-700'>Selected Files</h3>
                            <div className='space-y-3'>
                                {selectedFiles.map(file => (
                                    <div key={file.id} className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                                        <div className='flex items-center gap-3'>
                                            <FaFile className='text-blue-500' />
                                            <span className='text-sm font-medium text-gray-700 truncate max-w-[200px]'>
                                                {file.name}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveFile(file.id)}
                                            className='text-red-500 hover:text-red-600'
                                        >
                                            <FaTrash size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Panel - File Browser */}
                <div className='flex-1 bg-white rounded-lg shadow-md p-6'>
                    {/* Breadcrumb Navigation */}
                    <div className='flex items-center gap-2 mb-6 text-sm text-gray-600'>
                        {folderPath.map((folder, index) => (
                            <React.Fragment key={folder.id}>
                                {index > 0 && <span>/</span>}
                                <button
                                    onClick={() => handleBreadcrumbClick(index)}
                                    className={`hover:text-blue-500 ${
                                        index === folderPath.length - 1 ? 'font-semibold text-blue-500' : ''
                                    }`}
                                >
                                    {folder.name}
                                </button>
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Files Grid */}
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                        {oneDriveFiles.map((file) => (
                            <div
                                key={file.id}
                                onClick={() => file.type === 'folder' ? handleFolderClick(file) : handleFileSelect(file)}
                                className='flex flex-col p-4 space-y-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-all duration-200'
                            >
                                <div className='flex items-center justify-center h-20'>
                                    {file.type === 'folder' ? (
                                        <FaFolder className='text-4xl text-blue-500' />
                                    ) : (
                                        <FaFile className='text-4xl text-blue-500' />
                                    )}
                                </div>
                                <div className='text-center'>
                                    <p className='font-medium text-gray-700 truncate'>{file.name}</p>
                                    <p className='text-xs text-gray-500'>
                                        {file.modifiedTime && new Date(file.modifiedTime).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {oneDriveFiles.length === 0 && !loading && (
                        <div className='flex flex-col items-center justify-center p-8 text-gray-500'>
                            <FaFolder className='text-4xl mb-4 text-gray-400' />
                            <p>This folder is empty</p>
                        </div>
                    )}

                    {loading && (
                        <div className='flex justify-center p-8'>
                            <span className="w-8 h-8 border-t-2 border-blue-500 rounded-full animate-spin"></span>
                        </div>
                    )}
                </div>
            </div>

            {/* Messages */}
            {error && (
                <div className='p-4 text-red-700 bg-red-100 rounded-lg'>
                    {error}
                </div>
            )}
            {successMessage && (
                <div className='p-4 text-green-700 bg-green-100 rounded-lg'>
                    {successMessage}
                </div>
            )}
        </div>
    );
};

export default OneDrive;