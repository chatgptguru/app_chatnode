import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { FaGoogle, FaFile, FaImage, FaFilePdf } from 'react-icons/fa';

const GoogleDrivePicker = ({ onFileSelect, className }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadGooglePicker = (accessToken) => {
        setIsLoading(true);
        setError(null);

        // Load the Google API client library
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = () => {
            window.gapi.load('picker', () => {
                createPicker(accessToken);
            });
        };
        script.onerror = () => {
            setError('Failed to load Google Drive Picker');
            setIsLoading(false);
        };
        document.body.appendChild(script);
    };

    const createPicker = (accessToken) => {
        if (window.google && window.google.picker) {
            // Create multiple views
            const docsView = new window.google.picker.DocsView()
                .setIncludeFolders(true)
                .setMimeTypes('application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document')
                .setSelectFolderEnabled(true);

            //   const imagesView = new window.google.picker.DocsView()
            //     .setIncludeFolders(true)
            //     .setMimeTypes('image/jpeg,image/png,image/gif')
            //     .setSelectFolderEnabled(true);

            const picker = new window.google.picker.PickerBuilder()
                .enableFeature(window.google.picker.Feature.NAV_HIDDEN)
                .enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED)
                .addView(docsView)
                // .addView(imagesView)
                .addView(new window.google.picker.DocsUploadView())
                .setOAuthToken(accessToken)
                .setDeveloperKey(import.meta.env.VITE_GOOGLE_API_KEY)
                .setCallback(async (data) => {
                    if (data.action === window.google.picker.Action.PICKED) {
                        const file = data.docs[0];
                        setIsLoading(true);
                        setError(null);

                        try {
                            // Fetch the actual file content using Google Drive API
                            const response = await fetch(`https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`, {
                                headers: {
                                    'Authorization': `Bearer ${accessToken}`
                                }
                            });

                            if (!response.ok) {
                                throw new Error('Failed to fetch file content');
                            }

                            // Get the file content as a blob
                            const blob = await response.blob();
                            
                            // Create a File object from the blob
                            const actualFile = new File([blob], file.name, {
                                type: file.mimeType,
                                lastModified: file.lastEditedUtc
                            });

                            const formData = new FormData();
                            formData.append("file", actualFile);
                            const user_id = await localStorage.getItem('user_id');
                            const token = await localStorage.getItem('token');
                            formData.append("user_id", user_id);
                            formData.append("type", "google_drive");

                            const uploadResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/upload-pdf`, {
                                method: "POST",
                                body: formData,
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            });

                            if (!uploadResponse.ok) {
                                throw new Error('Failed to upload file');
                            }

                            // Call the onFileSelect callback with the file information
                            onFileSelect({
                                id: file.id,
                                name: file.name,
                                url: file.url,
                                mimeType: file.mimeType,
                                sizeBytes: file.sizeBytes,
                                iconUrl: file.iconUrl,
                                lastModified: file.lastEditedUtc
                            });
                        } catch (error) {
                            setError(error.message);
                            console.error('Error:', error);
                        } finally {
                            setIsLoading(false);
                        }
                    }
                })
                .setTitle('Select a file from Google Drive')
                .setSize(800, 600)
                .build();

            picker.setVisible(true);
        }
    };

    const login = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            loadGooglePicker(tokenResponse.access_token);
        },
        onError: (error) => {
            setError('Failed to authenticate with Google');
            setIsLoading(false);
            console.error('Login Failed:', error);
        },
        scope: 'https://www.googleapis.com/auth/drive.readonly',
    });

    return (
        <div className={`flex flex-col items-center gap-4 ${className}`}>
            <button
                onClick={() => login()}
                disabled={isLoading}
                className={`
          flex items-center gap-3 px-6 py-3
          text-lg font-semibold text-white
          transition duration-200 bg-blue-500 rounded-lg
          hover:bg-blue-600 disabled:bg-gray-400
          shadow-md hover:shadow-lg
          ${isLoading ? 'cursor-not-allowed opacity-70' : ''}
        `}
            >
                {isLoading ? (
                    <>
                        <span className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></span>
                        <span>Loading...</span>
                    </>
                ) : (
                    <>
                        <FaGoogle className="text-xl" />
                        <span>Select from Google Drive</span>
                    </>
                )}
            </button>
            {error && (
                <div className="p-4 text-red-700 bg-red-100 rounded-lg">
                    {error}
                </div>
            )}
            <div className="flex gap-6 p-6 mt-4 bg-white rounded-lg shadow-md">
                <div className="flex flex-col items-center gap-2">
                    <FaFilePdf className="text-3xl text-red-500" />
                    <span className="text-sm text-gray-600">PDF Files</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <FaFile className="text-3xl text-blue-500" />
                    <span className="text-sm text-gray-600">Documents</span>
                </div>
            </div>
        </div>
    );
};

export default GoogleDrivePicker;