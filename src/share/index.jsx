import { MdContentCopy } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import { useState } from 'react';

const ComponentWrapper = ({ title, children }) => {
    return (
        <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
            {children}
        </div>
    )
}

const CopyButton = ({ value, dark }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
        } catch (err) {
            // Optionally handle error
        }
    };
    return (
        <button
            className={`p-2 rounded-md transition-colors ${dark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
            onClick={handleCopy}
            title={copied ? 'Copied!' : 'Copy to clipboard'}
            aria-label="Copy to clipboard"
        >
            {copied ? (
                <span className={`text-xs ${dark ? 'text-white' : 'text-gray-600'}`}>Copied!</span>
            ) : (
                <MdContentCopy className={`w-5 h-5 ${dark ? 'text-white' : 'text-gray-600'}`} />
            )}
        </button>
    );
};

const WebPage = () => {
    const { botId } = useParams();
    const url = `${import.meta.env.VITE_APP_URL}/chatbot/${botId}`;
    return (
        <ComponentWrapper title="Web Page">
            <div className="flex items-center gap-2 bg-white p-4 rounded-lg border border-gray-200">
                <a
                    href={url}
                    className="text-blue-600 hover:text-blue-800 truncate flex-1 font-mono text-sm"
                >
                    {url}
                </a>
                <CopyButton value={url} />
            </div>
        </ComponentWrapper>
    )
}

const PopupChat = () => {
    const { botId } = useParams();
    const code = `<script\n    src=\"${import.meta.env.VITE_APP_URL}/popup.js?bot_id=${botId}\"\n></script>`;
    return (
        <ComponentWrapper title="Popup Chat">
            <div className="bg-gray-900 p-4 rounded-md">
                <pre className="text-gray-100 font-mono text-sm">
                    <code>
                        {code}
                    </code>
                </pre>
                <div className="flex justify-between items-center mt-3">
                    <p className="text-sm text-gray-400">Place this code in your &lt;head&gt; tag or in your google tag manager</p>
                    <CopyButton value={code} dark />
                </div>
            </div>
            <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Customize
            </button>
        </ComponentWrapper>
    )
}

const Embedded = () => {
    const { botId } = useParams();
    const code = `<iframe src=\"${import.meta.env.VITE_APP_URL}/chatbot/${botId}\" width=\"100%\" height=\"700\"></iframe>`;
    return (
        <ComponentWrapper title="Embedded (iframe)">
            <div className="bg-gray-900 p-4 rounded-md">
                <pre className="text-gray-100 font-mono text-sm">
                    <code>
                        {code}
                    </code>
                </pre>
                <div className="flex justify-between items-center mt-3">
                    <p className="text-sm text-gray-400">Place this code wherever you'd like the iframe to appear on your website.</p>
                    <CopyButton value={code} dark />
                </div>
            </div>
        </ComponentWrapper>
    )
}

const PopupChat2 = () => {
    const code = `<script\n    type=\"text/javascript\"\n    src=\"https://embed.chatnode.ai/9f857a40-5175-4aee-bacf-ba32b49606fe/popup.js\"\n    async\n    data-name=\"{{ string | null }}\"\n    data-email=\"{{ string | null }}\"\n    data-phone=\"{{ string | null }}\"\n    data-info=\"{{ string | null }}\"\n></script>`;
    return (
        <ComponentWrapper title="Popup Chat (with Additional Data Attributes)">
            <p className="text-sm text-gray-600 mb-4">
                These attributes map user data from your app to their chat history and are not utilized for AI messaging purposes.
            </p>
            <div className="bg-gray-900 p-4 rounded-md">
                <pre className="text-gray-100 font-mono text-sm">
                    <code>
                        {code}
                    </code>
                </pre>
                <div className="flex justify-between items-center mt-3">
                    <p className="text-sm text-gray-400">Place this code in your &lt;head&gt; tag or in your google tag manager</p>
                    <CopyButton value={code} dark />
                </div>
            </div>
            <div className="mt-4 space-y-2">
                <div className="flex">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono text-sm">[data-name]</span>
                    <span className="ml-4 text-sm text-gray-600">The user's name in your app.</span>
                </div>
                <div className="flex">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono text-sm">[data-email]</span>
                    <span className="ml-4 text-sm text-gray-600">The user's email in your app.</span>
                </div>
                <div className="flex">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono text-sm">[data-phone]</span>
                    <span className="ml-4 text-sm text-gray-600">The user's phone in your app.</span>
                </div>
                <div className="flex">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono text-sm">[data-info]</span>
                    <span className="ml-4 text-sm text-gray-600">The user's info in your app.</span>
                </div>
            </div>
        </ComponentWrapper>
    )
}

const Embedded2 = () => {
    const code = `<iframe\n    src=\"https://embed.chatnode.ai/9f857a40-5175-4aee-bacf-ba32b49606fe?data-name={{ string | null }}\"\n    width=\"100%\"\n    height=\"700\"\n    style=\"visibility: hidden; border: none\"\n    onload=\"this.style.visibility='visible';\"\n    allow=\"autoplay; clipboard-read; clipboard-write\"\n></iframe>`;
    return (
        <ComponentWrapper title="Embedded (iframe) (with Additional Data Attributes)">
            <p className="text-sm text-gray-600 mb-4">
                These attributes map user data from your app to their chat history and are not utilized for AI messaging purposes.
            </p>
            <div className="bg-gray-900 p-4 rounded-md">
                <pre className="text-gray-100 font-mono text-sm">
                    <code>
                        {code}
                    </code>
                </pre>
                <div className="flex justify-between items-center mt-3">
                    <p className="text-sm text-gray-400">Place this code wherever you'd like the iframe to appear on your website.</p>
                    <CopyButton value={code} dark />
                </div>
            </div>
            <div className="mt-4 space-y-2">
                <div className="flex">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono text-sm">[data-name]</span>
                    <span className="ml-4 text-sm text-gray-600">The user's name in your app.</span>
                </div>
                <div className="flex">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono text-sm">[data-email]</span>
                    <span className="ml-4 text-sm text-gray-600">The user's name in your app.</span>
                </div>
                <div className="flex">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono text-sm">[data-phone]</span>
                    <span className="ml-4 text-sm text-gray-600">The user's phone in your app.</span>
                </div>
                <div className="flex">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono text-sm">[data-info]</span>
                    <span className="ml-4 text-sm text-gray-600">The user's info in your app.</span>
                </div>
            </div>
        </ComponentWrapper>
    )
}

const CodeBlock = ({ children, instruction }) => {
    return (
        <div className="space-y-4">
            <div className="bg-gray-900 p-4 rounded-lg">
                <pre className="text-gray-100 font-mono text-sm overflow-x-auto">
                    <code>{children}</code>
                </pre>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-800">
                    <p className="text-sm text-gray-400">{instruction}</p>
                    <CopyButton value={typeof children === 'string' ? children : ''} dark />
                </div>
            </div>
        </div>
    )
}

const DataAttribute = ({ name, description }) => {
    return (
        <div className="flex items-center">
            <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-md font-mono text-sm">{name}</span>
            <span className="ml-4 text-sm text-gray-600">{description}</span>
        </div>
    )
}

const Share = () => {
    return (
        <div className="py-8 px-4 w-full">
            <div className="space-y-8">
                <div className="space-y-6">
                    <WebPage />
                    <PopupChat />
                    <Embedded />
                </div>

                {/* <div className="space-y-6">
                    <PopupChat2 />
                    <Embedded2 />
                </div> */}
            </div>

            <div className="mt-12 text-center">
                <p className="text-sm text-gray-600">
                    Need help with integration? <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Contact Support</a>
                </p>
            </div>
        </div>
    )
}

export default Share;
