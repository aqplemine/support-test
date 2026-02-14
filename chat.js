// Create chat toggle button
const toggleBtn = document.createElement("button");
toggleBtn.id = "chat-toggle";
toggleBtn.innerText = "💬";
document.body.appendChild(toggleBtn);

// Create chat window
const chatWindow = document.createElement("div");
chatWindow.id = "chat-window";
chatWindow.innerHTML = `
  <div id="chat-header">Game Support</div>
  <div id="chat-messages"></div>
  <div id="chat-input">
    <input type="text" placeholder="Type a message..." />
    <button>Send</button>
  </div>
`;
document.body.appendChild(chatWindow);

const messagesDiv = chatWindow.querySelector("#chat-messages");
const input = chatWindow.querySelector("input");
const sendBtn = chatWindow.querySelector("button");

// Toggle open/close
toggleBtn.onclick = () => {
  chatWindow.style.display =
    chatWindow.style.display === "flex" ? "none" : "flex";
};

// Add message function
function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.innerText = text;
  messagesDiv.appendChild(msg);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Basic rule engine
function getBotReply(message) {
  const text = message.toLowerCase();

  if (text.includes("login")) {
    return "If you're having login issues, try logging out and back in.";
  }

  if (text.includes("password")) {
    return "You can reset your password from the login page.";
  }

  if (text.includes("error 403")) {
    return "Error 403 usually means your session expired. Please log in again.";
  }

  if (text.includes("progress")) {
    return "Progress is saved automatically to your account.";
  }

  return "I'm not sure about that yet. You can describe your issue in more detail.";
}

// Send message
function handleSend() {
  const text = input.value.trim();
  if (!text) return;

  addMessage("You: " + text, "user");
  input.value = "";

  setTimeout(() => {
    const reply = getBotReply(text);
    addMessage("Bot: " + reply, "bot");
  }, 500);
}

sendBtn.onclick = handleSend;
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleSend();
});

// First message
addMessage("Hi! I'm your game support assistant. How can I help?", "bot");
