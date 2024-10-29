const safetySettings = [
    {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_NONE"
    },
    {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_NONE"
    },
    {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_NONE"
    },
    {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_NONE"
    }
];

const DEFAULT_API_KEY = atob("QUl6YVN5RGU3cmRGVDFlTXFlZ0h0ZFVoTEwwRW9CbUM4WUhOdE9J");
let currentConversation = [];
let conversations = {};
let currentConversationId = null;
let selectedImages = [];
let userSettings = {
    apiKey: DEFAULT_API_KEY,
    model: 'gemini-1.5-flash',
    temperature: 0.7,
    topP: 0.95,
    topK: 40,
    maxTokens: 8192,
    isPremium: false
};

const DAILY_MESSAGE_LIMIT = 50;
const DAILY_IMAGE_LIMIT = 5;
let dailyMessageCount = 0;
let dailyImageCount = 0;
let lastResetDate = new Date().toDateString();

function resetDailyLimits() {
    const today = new Date().toDateString();
    if (today !== lastResetDate) {
        dailyMessageCount = 0;
        dailyImageCount = 0;
        lastResetDate = today;
    }
}

function loadConversations() {
    const savedConversations = localStorage.getItem('conversations');
    if (savedConversations) {
        conversations = JSON.parse(savedConversations);
        updateConversationList();
    }
}

function saveConversations() {
    localStorage.setItem('conversations', JSON.stringify(conversations));
}

function sendMessage() {
    resetDailyLimits();
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();
    if (message || selectedImages.length > 0) {
        if (!checkLimits()) return;

        addMessageToChat('user', message);

        const userMessage = { role: "user", parts: [] };
        if (message) {
            userMessage.parts.push({ text: message });
        }
        selectedImages.forEach(image => {
            userMessage.parts.push({
                inline_data: {
                    mime_type: "image/jpeg",
                    data: image
                }
            });
        });

        currentConversation.push(userMessage);
        userInput.value = '';
        clearImagePreviews();

        dailyMessageCount++;
        dailyImageCount += selectedImages.length;

        showTypingIndicator();
        fetchBotResponse(currentConversation);
    }
}

function addMessageToChat(sender, message, image = null) {
    const chatMessages = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', `${sender}-message`);
    let content = `<div class="message-content">${formatMessage(message) || ""}</div>`;

    if (image) {
        content += `<img src="data:image/jpeg;base64,${image}" alt="Uploaded image" class="image-preview">`;
    }

    content += `
        <div class="message-time">${new Date().toLocaleTimeString()}</div>
        <div class="message-actions">
            <button class="message-action-btn edit-btn" title="Düzenle"><i class="fas fa-edit"></i></button>
            <button class="message-action-btn regenerate-btn" title="Yeniden Oluştur"><i class="fas fa-sync-alt"></i></button>
            <button class="message-action-btn delete-btn" title="Sil"><i class="fas fa-trash"></i></button>
        </div>
        <div class="feedback-buttons">
            <button class="feedback-btn like-btn" title="Beğen"><i class="fas fa-thumbs-up"></i></button>
            <button class="feedback-btn dislike-btn" title="Beğenme"><i class="fas fa-thumbs-down"></i></button>
        </div>
    `;
    messageElement.innerHTML = content;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    messageElement.querySelector('.edit-btn').addEventListener('click', () => editMessage(messageElement));
    messageElement.querySelector('.regenerate-btn').addEventListener('click', () => regenerateMessage(messageElement));
    messageElement.querySelector('.delete-btn').addEventListener('click', () => deleteMessage(messageElement));
    messageElement.querySelector('.like-btn').addEventListener('click', () => handleFeedback(messageElement, 'like'));
    messageElement.querySelector('.dislike-btn').addEventListener('click', () => handleFeedback(messageElement, 'dislike'));

    const imagePreview = messageElement.querySelector('.image-preview');
    if (imagePreview) {
        imagePreview.addEventListener('click', () => showFullSizeImage(imagePreview.src));
    }
}

function formatMessage(message) {
    if (!message) return '';
    
    // Bold
    message = message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Italic
    message = message.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Strikethrough
    message = message.replace(/~~(.*?)~~/g, '<del>$1</del>');
    
    // Code
    message = message.replace(/`(.*?)`/g, '<code>$1</code>');
    
    // Headers
    message = message.replace(/^# (.*$)/gm, '<h1>$1</h1>');
    message = message.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    message = message.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    
    // Lists
    message = message.replace(/^\s*\d+\.\s(.+)/gm, '<ol><li>$1</li></ol>');
    message = message.replace(/^\s*[\-*]\s(.+)/gm, '<ul><li>$1</li></ul>');
    
    // Links
    message = message.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    
    return message;
}

function editMessage(messageElement) {
    const messageContent = messageElement.querySelector('.message-content');
    const originalText = messageContent.textContent;
    messageContent.contentEditable = true;
    messageContent.focus();

    function saveEdit() {
        const newText = messageContent.textContent.trim();
        if (newText !== originalText) {
            updateConversation(messageElement, newText);
            fetchBotResponse(currentConversation);
        }
        messageContent.contentEditable = false;
        messageContent.removeEventListener('blur', saveEdit);
        messageContent.removeEventListener('keydown', handleKeyDown);
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            saveEdit();
        }
    }

    messageContent.addEventListener('blur', saveEdit);
    messageContent.addEventListener('keydown', handleKeyDown);
}

function regenerateMessage(messageElement) {
    const index = Array.from(messageElement.parentNode.children).indexOf(messageElement);
    currentConversation = currentConversation.slice(0, index + 1);
    fetchBotResponse(currentConversation);
}

function deleteMessage(messageElement) {
    const index = Array.from(messageElement.parentNode.children).indexOf(messageElement);
    currentConversation.splice(index, 1);
    messageElement.remove();
    saveConversation();
}

function handleFeedback(messageElement, feedbackType) {
    if (feedbackType === 'dislike') {
        alert('Modeli değiştirmeyi deneyin. Pro veya Pro Plus modeline geçerek daha iyi sonuçlar alabilirsiniz.');
    }
    // Burada feedback'i kaydetme veya işleme mantığı eklenebilir
}

function updateConversation(messageElement, newText) {
    const index = Array.from(messageElement.parentNode.children).indexOf(messageElement);
    currentConversation[index].parts[0].text = newText;
    saveConversation();
}

function showTypingIndicator() {
    document.querySelector('.typing-indicator').style.display = 'flex';
}

function hideTypingIndicator() {
    document.querySelector('.typing-indicator').style.display = 'none';
}

async function fetchBotResponse(conversation) {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${userSettings.model}:generateContent?key=${userSettings.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: conversation,
                generationConfig: {
                    temperature: userSettings.temperature,
                    topK: userSettings.topK,
                    topP: userSettings.topP,
                    maxOutputTokens: userSettings.maxTokens,
                },
                safetySettings: safetySettings
            }),
        });

        const data = await response.json();
        hideTypingIndicator();

        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const botMessageParts = data.candidates[0].content.parts;
            let botMessageText = "";
            let botMessageImage = null;

            for (const part of botMessageParts) {
                if (part.text) {
                    botMessageText += part.text;
                } else if (part.inline_data) {
                    botMessageImage = part.inline_data.data;
                }
            }
            addMessageToChat('bot', botMessageText, botMessageImage);
            currentConversation.push({ role: "model", parts: data.candidates[0].content.parts });
            saveConversation();
        } else {
            console.error("Invalid or missing API response:", data);
            throw new Error('Invalid response from API');
        }
    } catch (error) {
        console.error('API Error:', error);
        hideTypingIndicator();
        
    }
}

function saveConversation() {
    if (!currentConversationId) {
        currentConversationId = Date.now().toString();
    }
    conversations[currentConversationId] = {
        messages: currentConversation,
        lastUpdated: new Date().toISOString(),
        title: `Sohbet ${new Date().toLocaleString()}`
    };
    saveConversations();
    updateConversationList();
}

function updateConversationList() {
    const list = document.getElementById('conversation-list');
    list.innerHTML = '';
    Object.entries(conversations)
        .sort((a, b) => new Date(b[1].lastUpdated) - new Date(a[1].lastUpdated))
        .forEach(([id, convo]) => {
            const li = document.createElement('div');
            li.classList.add('conversation-item');
            
            const titleSpan = document.createElement('span');
            titleSpan.textContent = convo.title;
            titleSpan.contentEditable = true;
            titleSpan.addEventListener('blur', () => {
                conversations[id].title = titleSpan.textContent;
                saveConversations();
            });
            
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.classList.add('delete-btn');
            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                deleteConversation(id);
            };
            
            li.appendChild(titleSpan);
            li.appendChild(deleteBtn);
            li.onclick = () => loadConversation(id);
            list.appendChild(li);
        });
}

function loadConversation(id) {
    currentConversationId = id;
    currentConversation = conversations[id].messages;
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = '';

    currentConversation.forEach(message => {
        if (message.role === 'user') {
            let userMessageText = "";
            let userMessageImage = null;

            for (const part of message.parts) {
                if(part.text) {
                    userMessageText += part.text;
                } else if (part.inline_data) {
                    userMessageImage = part.inline_data.data;
                }
            }
            addMessageToChat('user', userMessageText, userMessageImage);
        } else {
            let botMessageText = "";
            let botMessageImage = null;

            for (const part of message.parts) {
                if(part.text) {
                    botMessageText += part.text;
                } else if (part.inline_data) {
                    botMessageImage = part.inline_data.data;
                } 
            }
            addMessageToChat('bot', botMessageText, botMessageImage);
        }
    });

    closeSidebar();
}

function deleteConversation(id) {
    delete conversations[id];
    saveConversations();
    updateConversationList();
    if (id === currentConversationId) {
        startNewChat();
    }
}

function startNewChat() {
    currentConversation = [];
    currentConversationId = null;
    document.getElementById('chat-messages').innerHTML = '';
    closeSidebar();
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('open');
    const menuToggle = document.querySelector('.menu-toggle');
    menuToggle.innerHTML = sidebar.classList.contains('open') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
}

function closeSidebar() {
    document.querySelector('.sidebar').classList.remove('open');
    document.querySelector('.menu-toggle').innerHTML = '<i class="fas fa-bars"></i>';
}

function handleImageUpload(event) {
    const files = event.target.files;
    const previewContainer = document.querySelector('.image-preview-container');
    previewContainer.innerHTML = '';
    selectedImages = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = function (e) {
            selectedImages.push(e.target.result.split(',')[1]);
            const preview = document.createElement('img');
            preview.src = e.target.result;
            preview.classList.add('image-preview');
            preview.addEventListener('click', () => showFullSizeImage(e.target.result));
            previewContainer.appendChild(preview);
        }
        reader.readAsDataURL(file);
    }
}

function clearImagePreviews() {
    selectedImages = [];
    document.querySelector('.image-preview-container').innerHTML = '';
}

function showFullSizeImage(src) {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('full-size-image');
    modal.style.display = "block";
    modalImg.src = src;
}

function showSettingsModal() {
    const modal = document.getElementById('settings-modal');
    modal.style.display = 'block';
    document.getElementById('api-key').value = userSettings.apiKey === DEFAULT_API_KEY ? '' : userSettings.apiKey;
    document.getElementById('model').value = userSettings.model;
    document.getElementById('temperature').value = userSettings.temperature;
    document.getElementById('top-p').value = userSettings.topP;
    document.getElementById('top-k').value = userSettings.topK;
    document.getElementById('max-tokens').value = userSettings.maxTokens;
}

function saveSettings(event) {
    event.preventDefault();
    const newApiKey = document.getElementById('api-key').value.trim();
    userSettings = {
        apiKey: newApiKey || DEFAULT_API_KEY,
        model: document.getElementById('model').value,
        temperature: parseFloat(document.getElementById('temperature').value),
        topP: parseFloat(document.getElementById('top-p').value),
        topK: parseInt(document.getElementById('top-k').value),
        maxTokens: parseInt(document.getElementById('max-tokens').value),
        isPremium: userSettings.isPremium
    };
    localStorage.setItem('userSettings', JSON.stringify(userSettings));
    document.getElementById('settings-modal').style.display = 'none';
}

function checkLimits() {
    if (!userSettings.isPremium) {
        if (dailyMessageCount >= DAILY_MESSAGE_LIMIT) {
            showPremiumModal();
            return false;
        }
        if (dailyImageCount >= DAILY_IMAGE_LIMIT) {
            showPremiumModal();
            return false;
        }
    }
    return true;
}

function showPremiumModal() {
    document.getElementById('premium-modal').style.display = 'block';
}

document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
document.getElementById('new-chat').addEventListener('click', startNewChat);
document.getElementById('toggle-mode').addEventListener('click', toggleDarkMode);
document.querySelector('.menu-toggle').addEventListener('click', toggleSidebar);
document.getElementById('image-input').addEventListener('change', handleImageUpload);
document.getElementById('settings-btn').addEventListener('click', showSettingsModal);
document.getElementById('settings-form').addEventListener('submit', saveSettings);
document.getElementById('premium-btn').addEventListener('click', showPremiumModal);
document.getElementById('upgrade-now-btn').addEventListener('click', () => {
    userSettings.isPremium = true;
    localStorage.setItem('userSettings', JSON.stringify(userSettings));
    alert('PyroAI Premium\'a yükseltildiniz! Tüm premium özelliklere erişebilirsiniz.');
    document.getElementById('premium-modal').style.display = 'none';
});

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

// Close button functionality for modals
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', function() {
        this.closest('.modal').style.display = 'none';
    });
});

// Image modal close functionality
document.querySelector('.image-modal-close').addEventListener('click', function() {
    document.getElementById('image-modal').style.display = 'none';
});

// Initialize dark mode
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}

// Load conversations and settings on page load
window.addEventListener('load', () => {
    loadConversations();
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
        userSettings = JSON.parse(savedSettings);
    }
    if (Object.keys(conversations).length > 0) {
        const lastConversationId = Object.keys(conversations).sort((a, b) => 
            new Date(conversations[b].lastUpdated) - new Date(conversations[a].lastUpdated)
        )[0];
        loadConversation(lastConversationId);
    }
});
