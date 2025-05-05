import axios from 'axios';
import { useState, useEffect } from 'react';
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

const API_BASE_URL = import.meta.env.VITE_API_URL;

const getSettings = async () => {
    const user_id = await localStorage.getItem('user_id');
    const res = await axios.get(`${API_BASE_URL}/api/settings?user_id=${user_id}`);
    return res.data;
};

const saveSettings = async (settings) => {
    const user_id = await localStorage.getItem('user_id');
    const res = await axios.post(`${API_BASE_URL}/api/settings?user_id=${user_id}`, settings);
    return res.data;
};

const updateSettings = async (settings) => {
    const user_id = await localStorage.getItem('user_id');
    const res = await axios.put(`${API_BASE_URL}/api/settings?user_id=${user_id}`, settings);
    return res.data;
};

const defaultSettings = {
    theme: {
        primaryColor: "#4169E1",
        backgroundColor: "#FFFFFF"
    },
    header: {
        enabled: true,
        title: "AI Chatbot",
        titleColor: "#FFFFFF",
        statusEnabled: true,
        statusText: "Online",
        statusColor: "#4CAF50",
        shadow: "#E5E5E5",
        resetButton: "#FFFFFF",
        background: "#4169E1"
    },
    chatBubbles: {
        greeting: "What can I help you with?",
        botBubbleBg: "#000000",
        botBubbleText: "#FFFFFF",
        userBubbleBg: "#4169E1",
        userBubbleText: "#FFFFFF",
        feedback: true,
        soundEffect: false
    },
    chatInput: {
        text: "",
        textColor: "#000000",
        background: "#FFFFFF",
        border: "#E5E5E5",
        sendButton: "#000000"
    },
    suggestedQuestions: {
        questions: ["Who Are You?", "What is your purpose?"]
    },
    popupMessage: {
        enabled: true,
        message1: "Need help?",
        message2: "Type your message",
        text: "#000000",
        background: "#FFFFFF",
        border: "#E5E5E5"
    },
    popupButton: {
        openByDefault: true,
        buttonOnRight: true,
        background: "#4169E1",
        icon: "#FFFFFF"
    },
    userInfo: {
        collectName: true,
        collectEmail: true,
        collectPhone: true,
        submitButton: "Start Chatting",
        privacyPolicy: true
    }
    // ...add for RemoveChatNodeBranding, CustomIcons if needed
};

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

const TextInput = ({ label, value, onChange, placeholder, icon: Icon }) => (
    <div className="flex flex-col gap-1 py-2">
        <label className="text-sm text-gray-600">{label}</label>
        <div className="flex items-center gap-2 p-2 border border-gray-200 rounded-md">
            {Icon && <Icon className="w-5 h-5 text-gray-400" />}
            <input
                type="text"
                value={value}
                onChange={onChange}
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

const ChatBubbles = ({ settings, onChange }) => (
    <SettingSection title="Chat Bubbles" icon={HiOutlineChatBubbleLeftRight}>
        <div className="space-y-4">
            <TextInput
                label="Greeting"
                value={settings.greeting}
                onChange={e => onChange({ ...settings, greeting: e.target.value })}
                placeholder="What can I help you with?"
                icon={IoHelpCircleOutline}
            />
            <ColorPicker label="Bot Bubble Background" value={settings.botBubbleBg} onChange={e => onChange({ ...settings, botBubbleBg: e.target.value })} />
            <ColorPicker label="Bot Bubble Text" value={settings.botBubbleText} onChange={e => onChange({ ...settings, botBubbleText: e.target.value })} />
            <ColorPicker label="User Bubble Background" value={settings.userBubbleBg} onChange={e => onChange({ ...settings, userBubbleBg: e.target.value })} />
            <ColorPicker label="User Bubble Text" value={settings.userBubbleText} onChange={e => onChange({ ...settings, userBubbleText: e.target.value })} />
            <Toggle label="Feedback" checked={settings.feedback} onChange={e => onChange({ ...settings, feedback: e.target.checked })} />
            <Toggle label="Sound Effect" checked={settings.soundEffect} onChange={e => onChange({ ...settings, soundEffect: e.target.checked })} />
            <Button variant="upgrade" icon={IoImageOutline}>Upgrade for Avatar Image</Button>
        </div>
    </SettingSection>
);

const ChatInput = ({ settings, onChange }) => {
    return (
        <SettingSection title="Chat Input" icon={IoSendOutline}>
            <div className="space-y-4">
                <div className="setting-item">
                    <TextInput
                        label="Text"
                        value={settings.text}
                        onChange={e => onChange({ ...settings, text: e.target.value })}
                        placeholder="Type your message"
                        icon={HiOutlineChatBubbleLeft}
                    />
                    <ColorPicker label="Text Color" value={settings.textColor} onChange={e => onChange({ ...settings, textColor: e.target.value })} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ColorPicker label="Background" value={settings.background} onChange={e => onChange({ ...settings, background: e.target.value })} />
                    <ColorPicker label="Border" value={settings.border} onChange={e => onChange({ ...settings, border: e.target.value })} />
                    <ColorPicker label="Send Button" value={settings.sendButton} onChange={e => onChange({ ...settings, sendButton: e.target.value })} />
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

const SuggestedQuestions = ({ settings, onChange }) => {
    return (
        <SettingSection title="Suggested Questions" icon={HiOutlineQuestionMarkCircle}>
            <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                    {settings.questions.map((question, index) => (
                        <Button key={index} variant="secondary">{question}</Button>
                    ))}
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

const PopupMessage = ({ settings, onChange }) => {
    return (
        <SettingSection title="Popup Message" icon={HiOutlineChatBubbleLeft}>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-700">Enable</h4>
                    <Toggle checked={settings.enabled} onChange={e => onChange({ ...settings, enabled: e.target.checked })} />
                </div>

                <div className="space-y-3">
                    <TextInput
                        label="Message 1"
                        value={settings.message1}
                        onChange={e => onChange({ ...settings, message1: e.target.value })}
                        placeholder="Need help?"
                        icon={HiOutlineChatBubbleLeft}
                    />
                    <TextInput
                        label="Message 2"
                        value={settings.message2}
                        onChange={e => onChange({ ...settings, message2: e.target.value })}
                        placeholder="Type your message"
                        icon={HiOutlineChatBubbleLeft}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ColorPicker label="Text" value={settings.text} onChange={e => onChange({ ...settings, text: e.target.value })} />
                    <ColorPicker label="Background" value={settings.background} onChange={e => onChange({ ...settings, background: e.target.value })} />
                    <ColorPicker label="Border" value={settings.border} onChange={e => onChange({ ...settings, border: e.target.value })} />
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

const Header = ({ settings, onChange }) => {
    return (
        <SettingSection title="Header" icon={IoSettingsOutline}>
            <div className='flex flex-row items-center justify-between gap-2'>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-700">Enable</h4>
                        <Toggle
                            checked={settings.enabled}
                            onChange={e => onChange({ ...settings, enabled: e.target.checked })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextInput
                            label="Title"
                            value={settings.title}
                            onChange={e => onChange({ ...settings, title: e.target.value })}
                            placeholder="AI Chatbot"
                            icon={IoSettingsOutline}
                        />
                        <ColorPicker
                            label="Title Color"
                            value={settings.titleColor}
                            onChange={e => onChange({ ...settings, titleColor: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm text-gray-600">Status Indicator</label>
                            <Toggle
                                checked={settings.statusEnabled}
                                onChange={e => onChange({ ...settings, statusEnabled: e.target.checked })}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TextInput
                                placeholder={settings.statusText}
                                value={settings.statusText}
                                onChange={e => onChange({ ...settings, statusText: e.target.value })}
                                icon={IoCheckmarkCircleOutline}
                            />
                            <ColorPicker
                                label="Status Color"
                                value={settings.statusColor}
                                onChange={e => onChange({ ...settings, statusColor: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <ColorPicker
                            label="Shadow"
                            value={settings.shadow}
                            onChange={e => onChange({ ...settings, shadow: e.target.value })}
                        />
                        <ColorPicker
                            label="Reset Button"
                            value={settings.resetButton}
                            onChange={e => onChange({ ...settings, resetButton: e.target.value })}
                        />
                        <ColorPicker
                            label="Background"
                            value={settings.background}
                            onChange={e => onChange({ ...settings, background: e.target.value })}
                        />
                    </div>

                </div>
                <div className="mt-4 w-[50%]">
                    <div
                        className="rounded-t-lg shadow-md"
                        style={{
                            background: settings.background,
                            boxShadow: `0 2px 8px 0 ${settings.shadow}`
                        }}
                    >
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <h3
                                    className="font-medium"
                                    style={{ color: settings.titleColor }}
                                >
                                    {settings.title}
                                </h3>
                                {settings.statusEnabled && (
                                    <div className="flex items-center gap-1">
                                        <span
                                            className="w-2 h-2 rounded-full"
                                            style={{ background: settings.statusColor, display: 'inline-block' }}
                                        ></span>
                                        <span
                                            className="text-sm"
                                            style={{ color: settings.titleColor }}
                                        >
                                            {settings.statusText}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <button
                                className="p-1.5 rounded-full transition-colors"
                                style={{ background: settings.resetButton }}
                            >
                                <IoRefreshOutline className="w-5 h-5" style={{ color: settings.titleColor }} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </SettingSection>
    );
};

const UserInfo = ({ settings, onChange }) => {
    return (
        <SettingSection title="User Info" icon={IoSettingsOutline}>
            <div className="space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm text-gray-600">Collect Name</label>
                        <Toggle checked={settings.collectName} onChange={e => onChange({ ...settings, collectName: e.target.checked })} />
                    </div>
                    <TextInput
                        placeholder="Name"
                        value={settings.name || ''}
                        onChange={e => onChange({ ...settings, name: e.target.value })}
                        icon={IoSettingsOutline}
                    />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm text-gray-600">Collect Email</label>
                        <Toggle checked={settings.collectEmail} onChange={e => onChange({ ...settings, collectEmail: e.target.checked })} />
                    </div>
                    <TextInput
                        placeholder="Email"
                        value={settings.email || ''}
                        onChange={e => onChange({ ...settings, email: e.target.value })}
                        icon={IoSettingsOutline}
                    />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm text-gray-600">Collect Phone</label>
                        <Toggle checked={settings.collectPhone} onChange={e => onChange({ ...settings, collectPhone: e.target.checked })} />
                    </div>
                    <TextInput
                        placeholder="Phone"
                        value={settings.phone || ''}
                        onChange={e => onChange({ ...settings, phone: e.target.value })}
                        icon={IoSettingsOutline}
                    />
                </div>
                <TextInput
                    label="Submit Button"
                    value={settings.submitButton}
                    onChange={e => onChange({ ...settings, submitButton: e.target.value })}
                    icon={IoSendOutline}
                />
                <div className="mt-6 pt-4 border-t">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-700">Privacy Policy / GDPR</h4>
                        <Toggle checked={settings.privacyPolicy} onChange={e => onChange({ ...settings, privacyPolicy: e.target.checked })} />
                    </div>
                </div>
            </div>
        </SettingSection>
    );
};

const PopupButton = ({ settings, onChange }) => {
    return (
        <SettingSection title="Popup Button" icon={IoSettingsOutline}>
            <div className="space-y-4">
                <Toggle label="Open chat by default" checked={settings.openByDefault} onChange={e => onChange({ ...settings, openByDefault: e.target.checked })} />
                <Toggle label="Button on Right" checked={settings.buttonOnRight} onChange={e => onChange({ ...settings, buttonOnRight: e.target.checked })} />

                <div className="grid grid-cols-2 gap-4">
                    <ColorPicker label="Background" value={settings.background} onChange={e => onChange({ ...settings, background: e.target.value })} />
                    <ColorPicker label="Icon" value={settings.icon} onChange={e => onChange({ ...settings, icon: e.target.value })} />
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
    const [settings, setSettings] = useState(defaultSettings);
    const [savedSettings, setSavedSettings] = useState(defaultSettings);

    useEffect(() => {
        getSettings()
            .then(data => {
                const merged = { ...defaultSettings, ...data };
                setSettings(merged);
                setSavedSettings(merged);
            });
    }, []);

    const handleSave = (newSettings) => {
        const apiCall = savedSettings ? updateSettings : saveSettings;
        apiCall(newSettings)
            .then(data => {
                setSettings(data);
                setSavedSettings(data);
            });
    };

    const hasUnsavedChanges = JSON.stringify(settings) !== JSON.stringify(savedSettings);

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
                    <ColorPicker
                        label="Primary Color"
                        value={settings.theme.primaryColor}
                        onChange={e => {
                            const newSettings = { ...settings, theme: { ...settings.theme, primaryColor: e.target.value } };
                            setSettings(newSettings);
                        }}
                    />
                    <ColorPicker
                        label="Background Color"
                        value={settings.theme.backgroundColor}
                        onChange={e => {
                            const newSettings = { ...settings, theme: { ...settings.theme, backgroundColor: e.target.value } };
                            setSettings(newSettings);
                        }}
                    />
                </div>
            </div>

            <Header
                settings={settings.header}
                onChange={headerSettings => {
                    const newSettings = { ...settings, header: headerSettings };
                    setSettings(newSettings);
                }}
            />
            <ChatBubbles
                settings={settings.chatBubbles}
                onChange={chatBubblesSettings => {
                    const newSettings = { ...settings, chatBubbles: chatBubblesSettings };
                    setSettings(newSettings);
                }}
            />
            <ChatInput
                settings={settings.chatInput}
                onChange={chatInputSettings => {
                    const newSettings = { ...settings, chatInput: chatInputSettings };
                    setSettings(newSettings);
                }}
            />
            <SuggestedQuestions
                settings={settings.suggestedQuestions}
                onChange={suggestedQuestionsSettings => {
                    const newSettings = { ...settings, suggestedQuestions: suggestedQuestionsSettings };
                    setSettings(newSettings);
                }}
            />
            <RemoveChatNodeBranding />
            <CustomIcons />
            <PopupMessage
                settings={settings.popupMessage}
                onChange={popupMessageSettings => {
                    const newSettings = { ...settings, popupMessage: popupMessageSettings };
                    setSettings(newSettings);
                }}
            />
            <PopupButton
                settings={settings.popupButton}
                onChange={popupButtonSettings => {
                    const newSettings = { ...settings, popupButton: popupButtonSettings };
                    setSettings(newSettings);
                }}
            />
            <UserInfo
                settings={settings.userInfo}
                onChange={userInfoSettings => {
                    const newSettings = { ...settings, userInfo: userInfoSettings };
                    setSettings(newSettings);
                }}
            />
            {hasUnsavedChanges && (
                <div className="fixed bottom-0 left-0 w-full bg-white border-t p-4 flex justify-end gap-2 z-50">
                    <Button variant="secondary" onClick={() => setSettings(savedSettings)}>Discard</Button>
                    <Button variant="primary" onClick={() => handleSave(settings)}>Save</Button>
                </div>
            )}
        </div>
    );
};

export default Customize;
