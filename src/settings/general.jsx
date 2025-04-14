import { FiUser, FiShare2, FiCopy, FiMessageSquare, FiClock, FiRefreshCw, FiTrash2 } from 'react-icons/fi';
import { IoLockClosed, IoGlobeOutline } from 'react-icons/io5';

const General = () => {
    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            {/* Bot Name Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                    <FiUser className="text-gray-600 w-5 h-5" />
                    <h2 className="text-lg font-semibold text-gray-800">Bot Name</h2>
                </div>
                <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
            </div>

            {/* Sharing & Bot ID Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 space-y-6">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <FiShare2 className="text-gray-600 w-5 h-5" />
                        <h2 className="text-lg font-semibold text-gray-800">Sharing</h2>
                    </div>
                    <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="sharing" className="w-4 h-4 text-blue-600" />
                            <span className="flex items-center gap-1">
                                <IoLockClosed className="text-gray-600 w-4 h-4" />
                                Private
                            </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="sharing" className="w-4 h-4 text-blue-600" />
                            <span className="flex items-center gap-1">
                                <IoGlobeOutline className="text-gray-600 w-4 h-4" />
                                Public
                            </span>
                        </label>
                    </div>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">Bot ID</h2>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-md bg-gray-50" 
                            readOnly
                        />
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition">
                            <FiCopy className="w-4 h-4" />
                            Copy
                        </button>
                    </div>
                </div>
            </div>

            {/* Message Limit Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                    <FiMessageSquare className="text-gray-600 w-5 h-5" />
                    <h2 className="text-lg font-semibold text-gray-800">Enable Monthly Message Limit</h2>
                </div>
                <p className="text-gray-600 mb-4">Limit the number of messages this bot can send within each usage period</p>
                <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="messageLimit" className="w-4 h-4 text-blue-600" />
                        <span>Off</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="messageLimit" className="w-4 h-4 text-blue-600" />
                        <span>On</span>
                    </label>
                </div>
            </div>

            {/* Rate Limit Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                    <FiClock className="text-gray-600 w-5 h-5" />
                    <h2 className="text-lg font-semibold text-gray-800">Enable Rate Limit</h2>
                </div>
                <p className="text-gray-600 mb-4">Limit the number of requests this bot can make within a custom defined usage period.</p>
                <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="rateLimit" className="w-4 h-4 text-blue-600" />
                        <span>Off</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="rateLimit" className="w-4 h-4 text-blue-600" />
                        <span>On</span>
                    </label>
                </div>
            </div>

            {/* Auto Retrain Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <FiRefreshCw className="text-gray-600 w-5 h-5" />
                            <h2 className="text-lg font-semibold text-gray-800">Auto Retrain</h2>
                        </div>
                        <p className="text-gray-600">Keep your chatbot up-to-date automatically. No manual updates needed.</p>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                            Upgrade
                        </button>
                    </div>
                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                        <img src="" alt="" className="w-16 h-16" />
                    </div>
                </div>
            </div>

            {/* Delete Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                    <FiTrash2 className="text-red-600 w-5 h-5" />
                    <h2 className="text-lg font-semibold text-red-600">Delete Chatbot</h2>
                </div>
                <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition flex items-center gap-2">
                    <FiTrash2 className="w-4 h-4" />
                    Delete Permanently
                </button>
            </div>
        </div>
    );
}

export default General;

