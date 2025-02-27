import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaFile } from "react-icons/fa";
import axios from "axios";
import Modal from "react-modal"; // Import a modal library

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root'); // Assuming your app is mounted on an element with id 'root'

const Document = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [documentContent, setDocumentContent] = useState("");

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const getDocuments = async () => {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/documents`, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        setDocuments(response.data.documents);
    };

    useEffect(() => {
        getDocuments();
    }, []);

    const handleUpload = async () => {
        if (!file) {
            setMessage("Please select a PDF file.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        setLoading(true);
        setMessage("");

        try {
            const response = await fetch("http://127.0.0.1:5000/api/upload-pdf", {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer YOUR_JWT_TOKEN`, // Replace with actual token
                },
            });

            const data = await response.json();
            if (response.ok) {
                setMessage("PDF uploaded and processed successfully!");
                getDocuments(); // Refresh the document list
            } else {
                setMessage(data.error || "Failed to upload PDF.");
            }
        } catch (error) {
            setMessage("Error uploading file. Please try again.");
        }

        setLoading(false);
    };

    const handlePreview = async (document) => {
        setSelectedDocument(document);
        setIsModalOpen(true);
    };

    const handleDelete = async (documentId) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/documents/${documentId}`, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            getDocuments(); // Refresh the document list
        } catch (error) {
            setMessage("Error deleting document.");
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedDocument(null);
        setDocumentContent("");
    };

    return (
        <div className="flex flex-col justify-center w-full gap-6 p-8 h-fit bg-gray-50">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <FaFile className="text-3xl text-blue-500" />
                    <h1 className="text-3xl font-bold text-gray-800">Documents</h1>
                </div>
                <button
                    className="flex items-center gap-2 px-6 py-3 text-lg font-semibold text-white transition duration-200 bg-blue-500 rounded-full hover:bg-blue-600"
                    onClick={() => {
                        document.getElementById("fileInput").click();
                    }}
                >
                    <span>+</span> Add Document
                </button>
            </div>

            <div className="min-h-[300px] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-white p-6">
                {documents.map((document, index) => (
                    <div key={document.id} className="flex items-center justify-between p-3 mb-2 transition-shadow bg-white rounded-lg shadow-sm hover:shadow-md">
                        <div className="font-medium text-gray-700 truncate w-[500px]">
                            <strong>{index + 1}. </strong>{document.file_name}
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                className="px-3 py-1 text-white transition-colors bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                onClick={() => handlePreview(document)}
                                aria-label={`Preview ${document.file_name}`}
                            >
                                Preview
                            </button>
                            <button
                                className="px-3 py-1 text-white transition-colors bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                onClick={() => handleDelete(document.id)}
                                aria-label={`Delete ${document.file_name}`}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
                <input
                    id="fileInput"
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                />
                <button
                    className="px-6 py-3 text-lg font-semibold text-white transition duration-200 bg-blue-500 rounded-full hover:bg-blue-600 disabled:bg-gray-400"
                    onClick={handleUpload}
                    disabled={loading}
                >
                    {loading ? "Uploading..." : "Upload PDF"}
                </button>
                {message && <p className="mt-4 text-gray-700">{message}</p>}
            </div>
            {/* Modal for Document Preview */}
            {isModalOpen && selectedDocument && (
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    contentLabel="Document Preview"
                    className="fixed inset-0 z-50 flex items-center justify-center" // Full-screen modal
                    overlayClassName="fixed inset-0 bg-black bg-opacity-50" // Overlay with opacity
                >
                    <div className="flex flex-col w-full h-full p-6 bg-white rounded-lg shadow-lg">
                        <h2 className="mb-4 text-2xl font-bold text-gray-800">Preview: {selectedDocument?.file_name}</h2>
                        <embed
                            src={`${import.meta.env.VITE_API_URL}/api/documents/${selectedDocument.id}/preview`}
                            className="flex-1 w-full h-full" // Full width and height
                        />
                        <button
                            className="px-4 py-2 mt-4 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                            onClick={closeModal}
                        >
                            Close
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Document;