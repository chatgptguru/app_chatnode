import { MdContentCopy } from 'react-icons/md';
import { useParams } from 'react-router-dom';
const ComponentWrapper = ({ title, children }) => {
    return (
        <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
            {children}
        </div>
    )
}

const WebPage = () => {
    const { botId } = useParams();
    return (
        <ComponentWrapper title="Web Page">
            <div className="flex items-center gap-2 bg-white p-4 rounded-lg border border-gray-200">
                <a
                    href={`${import.meta.env.VITE_APP_URL}/chatbot/${botId}`}
                    className="text-blue-600 hover:text-blue-800 truncate flex-1 font-mono text-sm"
                >
                    {`${import.meta.env.VITE_APP_URL}/chatbot/${botId}`}
                </a>
                <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
                    <MdContentCopy className="w-5 h-5 text-gray-600" />
                </button>
            </div>
        </ComponentWrapper>
    )
}

const PopupChat = () => {
    return (
        <ComponentWrapper title="Popup Chat">
            <div className="bg-gray-900 p-4 rounded-md">
                <pre className="text-gray-100 font-mono text-sm">
                    <code>
                        {`<script
    src="${import.meta.env.VITE_APP_URL}/popup.js"
></script>`}
                    </code>
                </pre>
                <div className="flex justify-between items-center mt-3">
                    <p className="text-sm text-gray-400">Place this code in your &lt;head&gt; tag or in your google tag manager</p>
                    <button className="p-2 hover:bg-gray-800 rounded-md">
                        <MdContentCopy className="w-5 h-5 text-white" />
                    </button>
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
    return (
        <ComponentWrapper title="Embedded (iframe)">
            <div className="bg-gray-900 p-4 rounded-md">
                <pre className="text-gray-100 font-mono text-sm">
                    <code>
                        {`<iframe src="${import.meta.env.VITE_APP_URL}/chatbot/${botId}" width="100%" height="700" style="visibility: hidden; border: none;"></iframe>`}
                    </code>
                </pre>
                <div className="flex justify-between items-center mt-3">
                    <p className="text-sm text-gray-400">Place this code wherever you'd like the iframe to appear on your website.</p>
                    <button className="p-2 hover:bg-gray-800 rounded-md">
                        <MdContentCopy className="w-5 h-5 text-white" />
                    </button>
                </div>
            </div>
        </ComponentWrapper>
    )
}

const PopupChat2 = () => {
    return (
        <ComponentWrapper title="Popup Chat (with Additional Data Attributes)">
            <p className="text-sm text-gray-600 mb-4">
                These attributes map user data from your app to their chat history and are not utilized for AI messaging purposes.
            </p>
            <div className="bg-gray-900 p-4 rounded-md">
                <pre className="text-gray-100 font-mono text-sm">
                    <code>
                        {`<script
    type="text/javascript"
    src="https://embed.chatnode.ai/9f857a40-5175-4aee-bacf-ba32b49606fe/popup.js"
    async
    data-name="{{ string | null }}"
    data-email="{{ string | null }}"
    data-phone="{{ string | null }}"
    data-info="{{ string | null }}"
></script>`}
                    </code>
                </pre>
                <div className="flex justify-between items-center mt-3">
                    <p className="text-sm text-gray-400">Place this code in your &lt;head&gt; tag or in your google tag manager</p>
                    <button className="p-2 hover:bg-gray-800 rounded-md">
                        <MdContentCopy className="w-5 h-5 text-white" />
                    </button>
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
    return (
        <ComponentWrapper title="Embedded (iframe) (with Additional Data Attributes)">
            <p className="text-sm text-gray-600 mb-4">
                These attributes map user data from your app to their chat history and are not utilized for AI messaging purposes.
            </p>
            <div className="bg-gray-900 p-4 rounded-md">
                <pre className="text-gray-100 font-mono text-sm">
                    <code>
                        {`<iframe
    src="https://embed.chatnode.ai/9f857a40-5175-4aee-bacf-ba32b49606fe?data-name={{ string | null }}"
    width="100%"
    height="700"
    style="visibility: hidden; border: none"
    onload="this.style.visibility='visible';"
    allow="autoplay; clipboard-read; clipboard-write"
></iframe>`}
                    </code>
                </pre>
                <div className="flex justify-between items-center mt-3">
                    <p className="text-sm text-gray-400">Place this code wherever you'd like the iframe to appear on your website.</p>
                    <button className="p-2 hover:bg-gray-800 rounded-md">
                        <MdContentCopy className="w-5 h-5 text-white" />
                    </button>
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
                    <button className="p-2 hover:bg-gray-800 rounded-md transition-colors">
                        <MdContentCopy className="w-5 h-5 text-white" />
                    </button>
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
