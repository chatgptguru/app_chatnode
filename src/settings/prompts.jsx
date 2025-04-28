import { FiEdit2 } from 'react-icons/fi';
import { RiRobot2Line } from 'react-icons/ri';
import { IoMdLink } from 'react-icons/io';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { setBot } from '../store/reducers/layoutReducer';
import { useDispatch } from 'react-redux';
const Prompt = () => {
    const bot = useSelector((state) => state.layout.bot);
    const dispatch = useDispatch();
    const [isChanged, setIsChanged] = useState(false);
    const [systemPrompt, setSystemPrompt] = useState(bot?.system_prompt);
    const [creativity, setCreativity] = useState(bot?.creativity);
    const [showUrls, setShowUrls] = useState(bot?.show_urls);
    const [isSaving, setIsSaving] = useState(false);
    useEffect(() => {
        setSystemPrompt(bot?.system_prompt);
        setCreativity(bot?.creativity);
        setShowUrls(bot?.show_urls);
    }, [bot]);
    const handleSave = async () => {
        try {
            setIsSaving(true);
            // Make API call to save settings
            const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/bots/${bot.id}/prompts`, {
                systemPrompt,
                creativity,
                showUrls,
            });
            setIsChanged(false);
            // dispatch(setBot(response.data.bot));
        } catch (error) {
            console.error('Failed to save settings:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDiscard = () => {
        // Reset all values to their original state
        setSystemPrompt('');
        setCreativity(0);
        setShowUrls(false);
        setIsChanged(false);
    };

    // Add onChange handlers to inputs
    const handlePromptChange = (e) => {
        setSystemPrompt(e.target.value);
        setIsChanged(true);
    };

    const handleCreativityChange = (e) => {
        setCreativity(parseInt(e.target.value));
        setIsChanged(true);
    };

    const handleUrlsChange = (e) => {
        setShowUrls(e.target.checked);
        setIsChanged(true);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8 relative pb-24">
            {/* AI Assist Section */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
                <div className="flex items-center gap-2 text-2xl font-bold mb-3">
                    <RiRobot2Line className="text-3xl" />
                    Introducing AI Assist
                </div>
                <div className="text-gray-100 mb-4">
                    AI Assist will use ChatGPT to ask you about how you will use your bot and then generate a prompt for you.
                </div>
                <div>
                    <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                        Try AI Assist
                    </button>
                </div>
            </div>

            {/* System Prompt Section */}
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
                <div className="text-xl font-semibold mb-4">
                    System Prompt
                </div>
                <div className="mb-4">
                    <div className="text-gray-600 mb-2">
                        The system prompt sets the tone of your bot and directly changes the response of the model.
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-blue-600 font-medium">AI Assist</span>
                        <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                            <FiEdit2 /> Edit
                        </button>
                    </div>
                </div>
                <div>
                    <textarea 
                        defaultValue={systemPrompt}
                        onChange={handlePromptChange}
                        className="w-full h-[300px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Enter your system prompt here..."
                    ></textarea>
                </div>
            </div>

            {/* Creativity Section */}
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
                <div className="text-xl font-semibold mb-4">
                    Creativity
                </div>
                <div className="text-gray-600 mb-4">
                    A higher value will result in more random and "creative" responses, while a lower value will produce more focused and deterministic responses.
                </div>
                <div className="space-y-4">
                    <div>
                        <input 
                            type="range" 
                            min="0" 
                            max="100"
                            defaultValue={creativity}
                            onChange={handleCreativityChange}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>More Focused</span>
                        <span className="text-blue-600 font-medium">0</span>
                        <span>More Creative</span>
                    </div>
                </div>
            </div>

            {/* Source URLs Section */}
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
                <div className="flex items-center gap-2 text-xl font-semibold mb-4">
                    <IoMdLink className="text-blue-600" />
                    Source URLs
                </div>
                <div className="text-gray-600 mb-4">
                    Add context URLs if exists in the chatbot answer
                </div>
                <div className="flex items-center gap-4">
                    <input 
                        type="radio" 
                        name="urls" 
                        checked={!showUrls}
                        onChange={() => handleUrlsChange({ target: { checked: false }})}
                        className="form-radio text-blue-600" 
                    />
                    <input 
                        type="radio" 
                        name="urls" 
                        checked={showUrls}
                        onChange={() => handleUrlsChange({ target: { checked: true }})}
                        className="form-radio text-blue-600" 
                    />
                </div>
            </div>

            {/* Add buttons bar */}
            {isChanged && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
                    <div className="max-w-4xl mx-auto flex justify-end gap-4">
                        <button
                            onClick={handleDiscard}
                            className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                        >
                            Discard
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {isSaving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Saving...
                                </>
                            ) : 'Save'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Prompt;
