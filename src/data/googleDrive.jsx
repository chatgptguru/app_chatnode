import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaAlignLeft, FaGoogle, FaFileUpload, FaFile, FaFolder, FaFolderOpen, FaArrowLeft, FaDownload, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import GoogleDrivePicker from './googleDrivePicker';

const GoogleDrive = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [isDriveConnected, setIsDriveConnected] = useState(false);
    const [driveFiles, setDriveFiles] = useState([]);
    const [currentFolder, setCurrentFolder] = useState('root');
    const [folderPath, setFolderPath] = useState([{ id: 'root', name: 'My Drive' }]);
    const [selectedFiles, setSelectedFiles] = useState([]);

    useEffect(() => {
        fetchDriveFiles();
    }, []);

    const fetchDriveFiles = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/drive-files`, {
                user_id: localStorage.getItem('user_id'),
            });
            setDriveFiles(response.data.files);
        } catch (error) {
            setError('Failed to fetch Google Drive files');
            console.error('Error fetching files:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = async (file) => {
        setSelectedFiles(prev => [...prev, file]);
        setSuccessMessage(`File "${file.name}" selected successfully`);
        setTimeout(() => setSuccessMessage(''), 3000);
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
                    <FaAlignLeft className='text-3xl text-blue-500' />
                    <h1 className='text-3xl font-bold text-gray-800'>Google Drive Integration</h1>
                </div>
            </div>

            {/* Main Content */}
            <div className='flex gap-6'>
                {/* Left Panel - File Picker */}
                <div className='w-1/2'>
                    <GoogleDrivePicker
                        onFileSelect={handleFileSelect}
                        className="w-full"
                    />

                    {/* Selected Files */}
                    {selectedFiles.length > 0 && (
                        <div className='mt-6 p-4 bg-white rounded-lg shadow-md'>
                            <h3 className='mb-4 text-lg font-semibold text-gray-700'>Selected Files</h3>
                            <div className='space-y-3'>
                                {selectedFiles.map(file => (
                                    <div key={file.id} className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                                        <div className='flex items-center gap-3'>
                                            <span className='text-sm font-medium text-gray-700 truncate max-w-[200px]'>
                                                {file.file_name}
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
                                    className={`hover:text-blue-500 ${index === folderPath.length - 1 ? 'font-semibold text-blue-500' : ''
                                        }`}
                                >
                                    {folder.name}
                                </button>
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Files Grid */}
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                        {driveFiles.map((file) => (
                            <div
                                key={file.id}
                                onClick={() => file.type === 'folder' ? handleFolderClick(file) : handleFileSelect(file)}
                                className='flex flex-col p-4 space-y-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-all duration-200'
                            >
                                <div className='flex items-center justify-center h-20'>
                                    {file.type === 'folder' ? (
                                        <FaFolder className='text-4xl text-yellow-500' />
                                    ) : (
                                        <FaFile className='text-4xl text-blue-500' />
                                    )}
                                </div>
                                <div className='text-center'>
                                    <p className='font-medium text-gray-700 truncate'>{file.file_name}</p>
                                    <p className='text-xs text-gray-500'>
                                        {file.modifiedTime && new Date(file.modifiedTime).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {driveFiles.length === 0 && !loading && (
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

export default GoogleDrive;