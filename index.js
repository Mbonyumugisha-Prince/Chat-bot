const chatsContainer = document.querySelector(".chats-container");
const promptForm = document.querySelector(".prompt-form");
const promptInput = document.querySelector(".prompt-input");
const appHeader = document.querySelector(".app-header");
const suggestions = document.querySelector(".suggestions");
const deleteBtn = document.getElementById("delete-chats-btn");
const themeToggleBtn = document.getElementById("theme-toggle-btn");

// Theme management
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateThemeIcon();
}

function updateThemeIcon() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    themeToggleBtn.textContent = currentTheme === "light" ? "dark_mode" : "light_mode";
}

function loadTheme() {
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
    updateThemeIcon();
}

// Chat management
function updateUI() {
    const hasMessages = chatsContainer.children.length > 0;
    appHeader.classList.toggle("hidden", hasMessages);
    suggestions.classList.toggle("hidden", hasMessages);
}

function clearChats() {
    if (chatsContainer.children.length === 0) return;
    
    if (confirm("Are you sure you want to clear all chats?")) {
        chatsContainer.innerHTML = "";
        updateUI();
    }
}

const createMsgElement = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
};

const generateResponse = async (text) => {
    try {
        const response = await fetch('https://chatbot-h0x5.onrender.com/api/chat', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text }),
        });

        if (!response.ok) throw new Error(`API Error: ${response.status}`);

        const data = await response.json();
        const botMessage = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                         "I'm not sure how to respond to that.";

        document.querySelector(".loading")?.remove();

        const botResponseHTML = `
            <div class="message-content">
                <div class="message-header">
                    <img src="loader.png" alt="Bot" class="bot-icon">
                    <span class="sender-name">Bot</span>
                </div>
                <div class="message-text">${botMessage}</div>
            </div>
        `;

        chatsContainer.appendChild(createMsgElement(botResponseHTML, "bot-message"));
    } catch (error) {
        console.error("Error:", error);
        document.querySelector(".loading")?.remove();
        
        const errorHTML = `
            <div class="message-content">
                <div class="message-header">
                    <img src="loader.png" alt="Bot" class="bot-icon">
                    <span class="sender-name">Bot</span>
                </div>
                <div class="message-text">Sorry, I encountered an error. Please try again.</div>
            </div>
        `;
        
        chatsContainer.appendChild(createMsgElement(errorHTML, "bot-message"));
    } finally {
        updateUI();
        chatsContainer.scrollTop = chatsContainer.scrollHeight;
    }
};

const handleFormSubmit = (e) => {
    e.preventDefault();
    const userMessage = promptInput.value.trim();
    if (!userMessage) return;

    const userHTML = `
        <div class="message-content">
            <div class="message-text">${userMessage}</div>
        </div>
    `;
    
    chatsContainer.appendChild(createMsgElement(userHTML, "user-message"));
    promptInput.value = "";
    updateUI();
    chatsContainer.scrollTop = chatsContainer.scrollHeight;

    const loaderHTML = `
        <div class="message-content">
            <div class="message-header">
                <img src="loader.png" alt="Loading" class="loader-icon">
                <span class="sender-name">Bot is typing...</span>
            </div>
        </div>
    `;
    
    chatsContainer.appendChild(createMsgElement(loaderHTML, "bot-message", "loading"));
    chatsContainer.scrollTop = chatsContainer.scrollHeight;
    
    generateResponse(userMessage);
};

function init() {
    loadTheme();
    updateUI();
    
    promptForm.addEventListener("submit", handleFormSubmit);
    deleteBtn.addEventListener("click", clearChats);
    themeToggleBtn.addEventListener("click", toggleTheme);
    
    document.querySelectorAll(".suggestions-item").forEach(item => {
        item.addEventListener("click", () => {
            const text = item.querySelector(".text").textContent;
            promptInput.value = text;
            promptForm.dispatchEvent(new Event("submit"));
        });
    });
}

init();