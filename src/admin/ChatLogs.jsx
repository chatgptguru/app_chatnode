import React, { useState, useEffect } from 'react';
import {
  FiSearch,
  FiEye,
  FiTrash2
} from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-toastify';
import Modal from 'react-modal';

const ChatLogs = () => {
  const [chatLogs, setChatLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const fetchChatLogs = async () => {
    try {
      setIsLoading(true);
      const token = await localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/chat-logs`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      setChatLogs(response.data.logs);
    } catch (error) {
      console.error('Error fetching chat logs:', error);
      toast.error('Failed to fetch chat logs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChatLogs();
  }, []);

  useEffect(() => {
    const filtered = chatLogs.filter(log =>
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.model.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredLogs(filtered);
  }, [searchQuery, chatLogs]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const deleteChatLog = async (logId) => {
    try {
      const token = await localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/chat-logs/${logId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      toast.success('Chat log deleted successfully');
      fetchChatLogs(); // Refresh the list
    } catch (error) {
      console.error('Error deleting chat log:', error);
      toast.error('Failed to delete chat log');
    }
  };

  const clearAllLogs = async () => {
    if (window.confirm('Are you sure you want to delete all chat logs? This action cannot be undone.')) {
      try {
        const token = await localStorage.getItem('token');
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/chat-logs`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
        toast.success('All chat logs cleared successfully');
        fetchChatLogs(); // Refresh the list
      } catch (error) {
        console.error('Error clearing chat logs:', error);
        toast.error('Failed to clear chat logs');
      }
    }
  };

  const openModal = (log) => {
    console.log(log);
    setModalContent(log);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Chat Logs</h1>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search chats..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="flex justify-end p-4">
          <button
            onClick={clearAllLogs}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Clear All Logs
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Model
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Messages
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
                    </div>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No chat logs found
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.timestamp}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.user}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.model}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.duration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(log.status)}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.messageCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => openModal(log)}
                        >
                          <FiEye className="h-5 w-5" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => deleteChatLog(log.id)}
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
            width: '650px',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
            border: 'none',
          }
        }}
      >
        <h2 className="text-xl font-bold text-center mb-4">Chat Log Details</h2>
        {modalContent && (
          <div className="space-y-2">
            <p><strong>Timestamp:</strong> {modalContent.timestamp}</p>
            <p><strong>User:</strong> {modalContent.user}</p>
            <p><strong>Model:</strong> {modalContent.model}</p>
            <p><strong>Status:</strong> {modalContent.status}</p>
            <div>
              <p><strong>Query:</strong></p>
              <div className="max-h-[200px] overflow-y-auto">
                <p className={`${isExpanded ? '' : 'line-clamp-3 truncate'}`}>{modalContent.query}</p>
              </div>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-blue-600 hover:underline mt-1"
              >
              </button>
            </div>
            <div>
              <p><strong>Response:</strong></p>
              <div className="max-h-[200px] overflow-y-auto">
                <p className={`${isExpanded ? '' : 'line-clamp-3 truncate'}`}>{modalContent.response}</p>
              </div>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-blue-600 hover:underline mt-1"
              >
                {isExpanded ? 'Show Less' : 'Show More'}
              </button>
            </div>
          </div>
        )}
        <button
          onClick={closeModal}
          className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Close
        </button>
      </Modal>
    </div>
  );
};

export default ChatLogs; 