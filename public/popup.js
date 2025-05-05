class ChatWidget {
    constructor(config = {}) {
        this.apiUrl = config.apiUrl || 'YOUR_DEFAULT_API_URL';
        this.botId = config.botId;
        this.container = null;
        this.messages = [];
        this.isOpen = false;
        this.isLoading = false;
        this.socket = null;
        this.isNew = true;
        this.topicId = null;
        this.messageLimit = config.messageLimit || 0;
        this.currentPlan = config.currentPlan || 'Free';

        // Wait for DOM to be ready before initializing
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }

        // Load marked library
        this.loadMarkedLibrary();
    }

    async initialize() {
        this.injectStyles();
        this.createWidget();
        await this.loadSocketIO();
        this.initializeSocket();
        this.setupEventListeners();
    }

    injectStyles() {
        const styles = `
            .chat-widget-container { 
                position: fixed; 
                bottom: 20px; 
                right: 20px; 
                z-index: 1000; 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            }
            
            .chat-widget-button { 
                width: 56px; 
                height: 56px; 
                border-radius: 50%; 
                background: #3B82F6; 
                border: none; 
                cursor: pointer; 
                display: flex; 
                align-items: center; 
                justify-content: center;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                transition: transform 0.2s, background-color 0.2s;
            }
            
            .chat-widget-button:hover {
                transform: scale(1.05);
                background: #2563EB;
            }
            
            .chat-widget-popup { 
                position: fixed; 
                bottom: 100px; 
                right: 20px; 
                width: 384px; 
                height: 600px; 
                background: white; 
                border-radius: 16px; 
                box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
                display: none;
                overflow: hidden;
                transition: all 0.3s ease;
                opacity: 0;
                transform: translateY(20px);
            }
            
            .chat-widget-popup.active {
                opacity: 1;
                transform: translateY(0);
            }
            
            .chat-widget-header { 
                padding: 20px; 
                background: white;
                border-bottom: 1px solid #f0f0f0; 
                display: flex; 
                justify-content: space-between; 
                align-items: center;
            }
            
            .chat-widget-messages { 
                height: calc(100% - 170px); 
                overflow-y: auto; 
                padding: 20px;
                background: #f8fafc;
            }
            
            .chat-widget-messages::-webkit-scrollbar {
                width: 6px;
            }
            
            .chat-widget-messages::-webkit-scrollbar-track {
                background: #f1f1f1;
            }
            
            .chat-widget-messages::-webkit-scrollbar-thumb {
                background: #c1c1c1;
                border-radius: 3px;
            }
            
            .chat-widget-input-container { 
                padding: 16px; 
                background: white;
                border-top: 1px solid #f0f0f0; 
                display: flex; 
                gap: 12px;
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
            }
            
            .chat-widget-input { 
                flex: 1; 
                padding: 12px; 
                border: 1px solid #e2e8f0; 
                border-radius: 24px;
                font-size: 14px;
                transition: border-color 0.2s;
                outline: none;
            }
            
            .chat-widget-input:focus {
                border-color: #3B82F6;
            }
            
            .chat-widget-send-button { 
                padding: 8px;
                width: 40px;
                height: 40px;
                background: #3B82F6; 
                color: white; 
                border: none; 
                border-radius: 50%; 
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background-color 0.2s;
            }
            
            .chat-widget-send-button:hover {
                background: #2563EB;
            }
            
            .message { 
                max-width: 85%; 
                padding: 12px 16px; 
                margin: 8px 0; 
                border-radius: 16px;
                font-size: 14px;
                line-height: 1.5;
                animation: messageAppear 0.3s ease;
            }
            
            .message.user { 
                background: #3B82F6; 
                color: white;
                margin-left: auto; 
                border-bottom-right-radius: 4px;
            }
            
            .message.ai { 
                background: white; 
                color: #1f2937;
                border-bottom-left-radius: 4px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            }
            
            .message.ai code {
                background-color: #f3f4f6;
                padding: 2px 6px;
                border-radius: 4px;
                font-family: monospace;
                font-size: 0.9em;
            }
            
            .message.ai pre {
                background-color: #f3f4f6;
                padding: 12px;
                border-radius: 8px;
                overflow-x: auto;
                margin: 8px 0;
            }
            
            .message.ai pre code {
                background-color: transparent;
                padding: 0;
                border-radius: 0;
            }
            
            .message.ai p {
                margin: 8px 0;
            }
            
            .message.ai ul, .message.ai ol {
                margin: 8px 0;
                padding-left: 20px;
            }
            
            .message.ai a {
                color: #3B82F6;
                text-decoration: underline;
            }
            
            .message.ai blockquote {
                border-left: 4px solid #e5e7eb;
                margin: 8px 0;
                padding-left: 16px;
                color: #4b5563;
            }
            
            .message.ai table {
                border-collapse: collapse;
                margin: 8px 0;
                width: 100%;
            }
            
            .message.ai th, .message.ai td {
                border: 1px solid #e5e7eb;
                padding: 8px;
                text-align: left;
            }
            
            .message.ai th {
                background-color: #f9fafb;
            }
            
            .loading-dots { 
                display: flex; 
                gap: 4px; 
                padding: 16px;
                align-items: center;
            }
            
            .dot { 
                width: 8px; 
                height: 8px; 
                background: #94a3b8; 
                border-radius: 50%; 
                animation: bounce 0.5s infinite; 
            }
            
            .chat-widget-header-title { 
                display: flex; 
                align-items: center; 
                gap: 8px;
            }
            
            .online-indicator { 
                width: 8px; 
                height: 8px; 
                background: #22c55e; 
                border-radius: 50%;
                position: relative;
            }
            
            .online-indicator::after {
                content: '';
                position: absolute;
                width: 12px;
                height: 12px;
                background: rgba(34, 197, 94, 0.3);
                border-radius: 50%;
                left: -2px;
                top: -2px;
                animation: pulse 2s infinite;
            }
            
            .message-count {
                font-size: 13px;
                color: #64748b;
            }
            
            .refresh-button, .close-button {
                padding: 8px;
                border: none;
                background: none;
                cursor: pointer;
                border-radius: 50%;
                transition: background-color 0.2s;
            }
            
            .refresh-button:hover, .close-button:hover {
                background: #f1f5f9;
            }
            
            @keyframes messageAppear {
                from { 
                    opacity: 0;
                    transform: translateY(10px);
                }
                to { 
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-4px); }
            }
            
            @keyframes pulse {
                0% { transform: scale(1); opacity: 1; }
                100% { transform: scale(2); opacity: 0; }
            }
        `;
        const styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    }

    createWidget() {
        this.container = document.createElement('div');
        this.container.className = 'chat-widget-container';

        // Create chat button
        const button = document.createElement('button');
        button.className = 'chat-widget-button';
        button.innerHTML = `<svg width="24" height="24" fill="none" stroke="white" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
        </svg>`;
        button.onclick = () => this.toggleChat();

        // Create chat popup
        const popup = this.createChatPopup();

        this.container.appendChild(button);
        this.container.appendChild(popup);
        document.body.appendChild(this.container);
    }

    createChatPopup() {
        const popup = document.createElement('div');
        popup.className = 'chat-widget-popup';

        popup.innerHTML = `
            <div class="chat-widget-header">
                <div class="chat-widget-header-title">
                    <h3 style="margin: 0; font-size: 16px; font-weight: 600;">AI Chatbot</h3>
                    <div class="online-indicator"></div>
                    <span style="color: #22c55e; font-size: 14px;">Online</span>
                </div>
                <div style="display: flex; gap: 8px; align-items: center;">
                    <span class="message-count"></span>
                    <button class="refresh-button">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                    <button class="close-button">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
            <div class="chat-widget-messages" style="padding-bottom: 80px;"></div>
            <div class="chat-widget-input-container">
                <input type="text" class="chat-widget-input" placeholder="Type your message...">
                <button class="chat-widget-send-button">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                </button>
            </div>
        `;

        return popup;
    }

    setupEventListeners() {
        const input = this.container.querySelector('.chat-widget-input');
        const sendButton = this.container.querySelector('.chat-widget-send-button');
        const refreshButton = this.container.querySelector('.refresh-button');
        const closeButton = this.container.querySelector('.close-button');

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSendMessage();
        });

        sendButton.addEventListener('click', () => this.handleSendMessage());
        refreshButton.addEventListener('click', () => this.resetChat());
        closeButton.addEventListener('click', () => this.toggleChat());
    }

    initializeSocket() {
        this.socket = io(this.apiUrl);

        this.socket.on('connect', () => {
            console.log('Connected to chat server');
        });

        this.socket.on('response', (data) => {
            this.addMessage('AI', data.response);
            this.isLoading = false;
            this.isNew = false;
            if (data.topic_id) {
                this.topicId = data.topic_id;
            }
        });

        this.socket.on('error', (error) => {
            console.error('Socket error:', error);
            this.isLoading = false;
            this.addMessage('AI', 'An error occurred while getting the response.', true);
        });
    }

    handleSendMessage() {
        const input = this.container.querySelector('.chat-widget-input');
        const message = input.value.trim();

        if (message) {
            if ((this.messages.length / 2) >= this.messageLimit && this.currentPlan === 'Free') {
                alert(`You have reached the message limit (${this.messageLimit}) for the Free plan. Please upgrade to continue chatting.`);
                return;
            }

            this.addMessage('user', message);
            input.value = '';
            this.isLoading = true;
            this.showLoadingIndicator();

            this.socket.emit('query', {
                query: message,
                is_new: this.isNew,
                topic_id: this.topicId,
                user_id: '20302020102030203',
                bot_id: this.botId,
                conversation_id: this.topicId || null,
                metadata: {
                    source: 'widget',
                    platform: 'web'
                }
            });
        }
    }

    addMessage(type, content, isError = false) {
        const messagesContainer = this.container.querySelector('.chat-widget-messages');
        // Remove loading indicator if it exists
        const loadingIndicator = messagesContainer.querySelector('.loading-dots');
        if (loadingIndicator) {
            loadingIndicator.remove();
        }

        const messageElement = document.createElement('div');
        messageElement.className = `message ${type.toLowerCase()}`;
        if (isError) messageElement.style.backgroundColor = '#EF4444';
        
        // Parse markdown for AI messages
        if (type.toLowerCase() === 'ai' && window.marked) {
            messageElement.innerHTML = window.marked.parse(content);
        } else {
            messageElement.textContent = content;
        }

        // Add security measures for links
        if (type.toLowerCase() === 'ai') {
            const links = messageElement.getElementsByTagName('a');
            Array.from(links).forEach(link => {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
            });
        }

        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Update message count after adding new message
        this.messages.push({ type, content });
        this.updateMessageCount();
    }

    showLoadingIndicator() {
        const messagesContainer = this.container.querySelector('.chat-widget-messages');
        const loadingElement = document.createElement('div');
        loadingElement.className = 'loading-dots';
        loadingElement.innerHTML = `
            <div class="dot" style="animation-delay: 0ms"></div>
            <div class="dot" style="animation-delay: 300ms"></div>
            <div class="dot" style="animation-delay: 600ms"></div>
        `;
        messagesContainer.appendChild(loadingElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    resetChat() {
        this.isNew = true;
        this.topicId = null;
        this.messages = [];
        const messagesContainer = this.container.querySelector('.chat-widget-messages');
        messagesContainer.innerHTML = '';
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const popup = this.container.querySelector('.chat-widget-popup');
        popup.style.display = this.isOpen ? 'block' : 'none';

        // Add animation class after display is set
        if (this.isOpen) {
            setTimeout(() => {
                popup.classList.add('active');
            }, 10);
        } else {
            popup.classList.remove('active');
        }
    }

    updateMessageCount() {
        const countElement = this.container.querySelector('.message-count');
        countElement.textContent = `Messages: ${Math.ceil(this.messages.length / 2)}/${this.messageLimit}`;
    }

    loadMarkedLibrary() {
        if (!window.marked) {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
            script.onload = () => {
                // Configure marked options
                window.marked.setOptions({
                    breaks: true,
                    gfm: true,
                    headerIds: false,
                    mangle: false
                });
            };
            document.head.appendChild(script);
        }
    }

    loadSocketIO() {
        return new Promise((resolve, reject) => {
            if (!window.io) {
                const script = document.createElement('script');
                script.src = 'https://cdn.socket.io/4.5.4/socket.io.min.js';
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            } else {
                resolve();
            }
        });
    }
}

function getBotIdFromScript() {
    // Find the script tag that loaded this file
    const scripts = document.getElementsByTagName('script');
    for (let script of scripts) {
        if (script.src && script.src.includes('popup.js')) {
            const url = new URL(script.src, window.location.origin);
            return url.searchParams.get('bot_id');
        }
    }
    return null;
}

// Make it available globally and initialize
window.ChatWidget = ChatWidget;
window.addEventListener('DOMContentLoaded', () => {
    const botId = getBotIdFromScript() || 'YOUR_BOT_ID';
    new ChatWidget({
        apiUrl: 'https://testragapi.exrelay.com',
        botId: botId,
        messageLimit: 10,
        currentPlan: 'Free'
    });
});
