import React, { useState } from 'react';
import Chatbot from '../chats/Chatbot';
import { IoChatbubbleEllipsesOutline, IoCloseOutline } from 'react-icons/io5';

const PopupChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {/* Chat Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-600 transition-colors"
            >
                {isOpen ? (
                    <IoCloseOutline className="text-2xl" />
                ) : (
                    <IoChatbubbleEllipsesOutline className="text-2xl" />
                )}
            </button>

            {/* Popup Chat Window */}
            {isOpen && (
                <div className="absolute bottom-16 right-0 w-[400px] h-[600px] rounded-lg shadow-xl overflow-hidden">
                    <Chatbot />
                </div>
            )}
        </div>
    );
};

export default PopupChatbot; 