import { useState } from 'react';
import {
    IoColorPaletteOutline,
    IoCheckmarkCircleOutline,
    IoSettingsOutline,
    IoImageOutline,
    IoSendOutline,
    IoHelpCircleOutline,
    IoChevronForwardOutline,
    IoRefreshOutline
} from 'react-icons/io5';
import {
    HiOutlineChatBubbleLeftRight,
    HiOutlineChatBubbleLeft,
    HiOutlineQuestionMarkCircle
} from 'react-icons/hi2';

const SettingSection = ({ title, children, icon: Icon }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
                <Icon className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            </div>
            {children}
        </div>
    );
};

const ColorPicker = ({ label, value, onChange }) => (
    <div className="flex items-center justify-between py-2">
        <span className="text-sm text-gray-600">{label}</span>
        <input
            type="color"
            value={value}
            onChange={onChange}
            className="w-10 h-10 rounded cursor-pointer border border-gray-200"
        />
    </div>
);

const Toggle = ({ label, checked, onChange }) => (
    <div className="flex items-center justify-between py-2">
        <span className="text-sm text-gray-600">{label}</span>
        <label className="relative inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
    </div>
);

const TextInput = ({ label, placeholder, icon: Icon }) => (
    <div className="flex flex-col gap-1 py-2">
        <label className="text-sm text-gray-600">{label}</label>
        <div className="flex items-center gap-2 p-2 border border-gray-200 rounded-md">
            {Icon && <Icon className="w-5 h-5 text-gray-400" />}
            <input
                type="text"
                placeholder={placeholder}
                className="w-full outline-none text-sm"
            />
        </div>
    </div>
);

const Button = ({ children, variant = 'primary', icon: Icon }) => {
    const baseClasses = "flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors";
    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
        upgrade: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
    };

    return (
        <button className={`${baseClasses} ${variants[variant]}`}>
            {Icon && <Icon className="w-5 h-5" />}
            {children}
        </button>
    );
};

const ChatBubbles = () => {
    return (
        <SettingSection title="Chat Bubbles" icon={HiOutlineChatBubbleLeftRight}>
            <div className="space-y-4">
                <TextInput
                    label="Greeting"
                    placeholder="What can I help you with?"
                    icon={IoHelpCircleOutline}
                />
                <ColorPicker label="Bot Bubble Background" value="#000000" />
                <ColorPicker label="Bot Bubble Text" value="#FFFFFF" />
                <ColorPicker label="User Bubble Background" value="#4169E1" />
                <ColorPicker label="User Bubble Text" value="#FFFFFF" />
                <Toggle label="Feedback" checked={true} />
                <Toggle label="Sound Effect" checked={false} />
                <Button variant="upgrade" icon={IoImageOutline}>
                    Upgrade for Avatar Image
                </Button>
            </div>
        </SettingSection>
    );
};

const ChatInput = () => {
    return (
        <SettingSection title="Chat Input" icon={IoSendOutline}>
            <div className="space-y-4">
                <div className="setting-item">
                    <TextInput
                        label="Text"
                        placeholder="Type your message"
                        icon={HiOutlineChatBubbleLeft}
                    />
                    <ColorPicker label="Text Color" value="#000000" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ColorPicker label="Background" value="#FFFFFF" />
                    <ColorPicker label="Border" value="#E5E5E5" />
                    <ColorPicker label="Send Button" value="#000000" />
                </div>

                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 p-3 bg-white rounded border border-gray-200">
                        <input
                            type="text"
                            placeholder="Type your message"
                            className="flex-1 text-sm outline-none"
                        />
                        <IoSendOutline className="w-5 h-5 text-blue-600" />
                    </div>
                </div>
            </div>
        </SettingSection>
    );
};

const SuggestedQuestions = () => {
    return (
        <SettingSection title="Suggested Questions" icon={HiOutlineQuestionMarkCircle}>
            <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                    <Button variant="secondary">Who Are You?</Button>
                    <Button variant="secondary">What is your purpose?</Button>
                </div>

                <Button variant="primary" icon={IoChevronForwardOutline}>
                    Add Questions
                </Button>
            </div>
        </SettingSection>
    );
};

const RemoveChatNodeBranding = () => {
    return (
        <SettingSection title="Remove ChatNode Branding" icon={IoSettingsOutline}>
            <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
                        <div className="flex items-center gap-2">
                            <img src="chatnode-logo.png" alt="ChatNode Logo" className="w-6 h-6" />
                            <span className="text-sm text-gray-600">Powered by ChatNode</span>
                        </div>
                    </div>
                </div>

                <Button variant="upgrade" icon={IoCheckmarkCircleOutline}>
                    Upgrade or Purchase Addon
                </Button>
            </div>
        </SettingSection>
    );
};

const CustomIcons = () => {
    return (
        <SettingSection title="Custom Icons" icon={IoImageOutline}>
            <div className="space-y-4">
                <p className="text-sm text-gray-600">
                    Select your own hi-res images for the popup button on your website and the avatar of your bot.
                </p>

                <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-start gap-3 max-w-md">
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                                <img src="bot-avatar.png" alt="Bot Avatar" className="w-8 h-8 rounded-full" />
                            </div>
                            <div className="flex-1 bg-white p-3 rounded-lg shadow-sm">
                                <p className="text-sm">What is your mission?</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 max-w-md ml-auto">
                            <div className="flex-1 bg-blue-600 p-3 rounded-lg shadow-sm">
                                <p className="text-sm text-white">This is ground control, do you copy?</p>
                            </div>
                        </div>
                    </div>
                </div>

                <Button variant="upgrade" icon={IoImageOutline}>
                    Upgrade
                </Button>
            </div>
        </SettingSection>
    );
};

const PopupMessage = () => {
    return (
        <SettingSection title="Popup Message" icon={HiOutlineChatBubbleLeft}>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-700">Enable</h4>
                    <Toggle checked={true} onChange={() => { }} />
                </div>

                <div className="space-y-3">
                    <TextInput
                        label="Message 1"
                        placeholder="Need help?"
                        icon={HiOutlineChatBubbleLeft}
                    />
                    <TextInput
                        label="Message 2"
                        placeholder="Type your message"
                        icon={HiOutlineChatBubbleLeft}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ColorPicker label="Text" value="#000000" />
                    <ColorPicker label="Background" value="#FFFFFF" />
                    <ColorPicker label="Border" value="#E5E5E5" />
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between p-2 border-b">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                                <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                                <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                            </div>
                        </div>
                        <div className="p-4">
                            <p className="text-sm">Need help?</p>
                        </div>
                        <div className="flex justify-end p-2">
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                                <IoSendOutline className="w-4 h-4 text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SettingSection>
    );
};

const Header = () => {
    return (
        <SettingSection title="Header" icon={IoSettingsOutline}>
            <div className='flex flex-row items-center justify-between gap-2'>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-700">Enable</h4>
                        <Toggle checked={true} onChange={() => { }} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextInput
                            label="Title"
                            placeholder="AI Chatbot"
                            icon={IoSettingsOutline}
                        />
                        <ColorPicker label="Title Color" value="#FFFFFF" />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm text-gray-600">Status Indicator</label>
                            <Toggle checked={true} onChange={() => { }} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TextInput
                                placeholder="Online"
                                icon={IoCheckmarkCircleOutline}
                            />
                            <ColorPicker label="Status Color" value="#4CAF50" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <ColorPicker label="Shadow" value="#E5E5E5" />
                        <ColorPicker label="Reset Button" value="#FFFFFF" />
                        <ColorPicker label="Background" value="#4169E1" />
                    </div>

                </div>
                <div className="mt-4 w-[50%]">
                    <div className="bg-blue-600 rounded-t-lg shadow-md">
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <h3 className="text-white font-medium">AI Chatbot</h3>
                                <div className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-green-400"></span>
                                    <span className="text-white text-sm">Online</span>
                                </div>
                            </div>
                            <button className="p-1.5 rounded-full hover:bg-white/10 transition-colors">
                                <IoRefreshOutline className="w-5 h-5 text-white" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </SettingSection>
    );
};

const UserInfo = () => {
    return (
        <SettingSection title="User Info" icon={IoSettingsOutline}>
            <div className="space-y-4">
                {['Name', 'Email', 'Phone'].map((field) => (
                    <div key={field} className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm text-gray-600">Collect {field}</label>
                            <Toggle checked={true} onChange={() => { }} />
                        </div>
                        <TextInput
                            placeholder={field}
                            icon={IoSettingsOutline}
                        />
                    </div>
                ))}

                <TextInput
                    label="Submit Button"
                    placeholder="Start Chatting"
                    icon={IoSendOutline}
                />

                <div className="mt-6 pt-4 border-t">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-700">Privacy Policy / GDPR</h4>
                        <Toggle checked={true} onChange={() => { }} />
                    </div>
                </div>
            </div>
        </SettingSection>
    );
};

const PopupButton = () => {
    return (
        <SettingSection title="Popup Button" icon={IoSettingsOutline}>
            <div className="space-y-4">
                <Toggle label="Open chat by default" checked={true} onChange={() => { }} />
                <Toggle label="Button on Right" checked={true} onChange={() => { }} />

                <div className="grid grid-cols-2 gap-4">
                    <ColorPicker label="Background" value="#4169E1" />
                    <ColorPicker label="Icon" value="#FFFFFF" />
                </div>

                <div className="flex justify-end">
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
                        <IoSendOutline className="w-6 h-6 text-white" />
                    </div>
                </div>
            </div>
        </SettingSection>
    );
};

const Customize = () => {
    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <IoColorPaletteOutline className="w-5 h-5 text-blue-600" />
                    <h2 className="text-xl font-semibold text-gray-800">Theme Generator</h2>
                </div>
                <p className="text-gray-600 mb-4">
                    This will override individual color customizations to create a harmonious and well contrasted color scheme.
                </p>
                <div className="grid grid-cols-2 gap-4">
                    <ColorPicker label="Primary Color" value="#4169E1" />
                    <ColorPicker label="Background Color" value="#FFFFFF" />
                </div>
            </div>

            <Header />
            <ChatBubbles />
            <ChatInput />
            <SuggestedQuestions />
            <RemoveChatNodeBranding />
            <CustomIcons />
            <PopupMessage />
        </div>
    );
};

export default Customize;
