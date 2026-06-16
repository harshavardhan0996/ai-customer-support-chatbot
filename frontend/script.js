const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const clearBtn = document.getElementById('clearBtn');

function addMessage(message, isUser) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.classList.add(isUser ? 'user-message' : 'bot-message');
    div.textContent = message;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addTyping() {
    const div = document.createElement('div');
    div.classList.add('message', 'bot-message');
    div.id = 'typing';
    div.textContent = '⏳ Typing...';
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTyping() {
    const typing = document.getElementById('typing');
    if (typing) typing.remove();
}

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    addMessage(message, true);
    userInput.value = '';
    addTyping();

    try {
        const response = await fetch('http://localhost:5000/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });

        const data = await response.json();
        removeTyping();

        if (data.status === 'success') {
            addMessage(data.response, false);
        } else {
            addMessage('Sorry, something went wrong!', false);
        }
    } catch (error) {
        removeTyping();
        addMessage('Cannot connect to server!', false);
    }
}

sendBtn.addEventListener('click', sendMessage);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

clearBtn.addEventListener('click', async () => {
    await fetch('http://localhost:5000/clear', { method: 'POST' });
    chatMessages.innerHTML = '';
    addMessage('Chat cleared! How can I help you? 😊', false);
});