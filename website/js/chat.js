// LoopsAI Chat Widget
(function() {
    // Configuration - Update this URL after deploying the worker
    const WORKER_URL = 'https://loopsai.bawtman.workers.dev';
    
    // Elements
    const widget = document.getElementById('loopsai-widget');
    const toggleBtn = document.getElementById('chat-toggle');
    const closeBtn = document.getElementById('chat-close');
    const chatWindow = document.getElementById('chat-window');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    
    // Chat history for context
    let chatHistory = [];
    
    // Toggle chat window
    toggleBtn.addEventListener('click', () => {
        chatWindow.classList.add('active');
        toggleBtn.classList.add('hidden');
        chatInput.focus();
    });
    
    closeBtn.addEventListener('click', () => {
        chatWindow.classList.remove('active');
        toggleBtn.classList.remove('hidden');
    });
    
    // Handle form submission
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Add user message to UI
        addMessage(message, 'user');
        chatInput.value = '';
        
        // Add to history
        chatHistory.push({ role: 'user', content: message });
        
        // Show typing indicator
        const typingId = showTyping();
        
        try {
            const response = await fetch(WORKER_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    history: chatHistory.slice(-10)
                }),
            });
            
            const data = await response.json();
            
            // Remove typing indicator
            removeTyping(typingId);
            
            if (data.error) {
                addMessage('Sorry, I encountered an error. Please try again.', 'bot');
            } else {
                addMessage(data.response, 'bot');
                chatHistory.push({ role: 'assistant', content: data.response });
            }
        } catch (error) {
            removeTyping(typingId);
            addMessage('Unable to connect. Please check your connection and try again.', 'bot');
            console.error('Chat error:', error);
        }
    });
    
    // Add message to chat
    function addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;
        messageDiv.innerHTML = `<div class="message-content">${escapeHtml(content)}</div>`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Show typing indicator
    function showTyping() {
        const id = 'typing-' + Date.now();
        const typingDiv = document.createElement('div');
        typingDiv.id = id;
        typingDiv.className = 'chat-message bot typing';
        typingDiv.innerHTML = `
            <div class="message-content">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return id;
    }
    
    // Remove typing indicator
    function removeTyping(id) {
        const typing = document.getElementById(id);
        if (typing) typing.remove();
    }
    
    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
})();
