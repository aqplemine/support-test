const toggleBtn = document.getElementById("chat-toggle");
const chatWindow = document.getElementById("chat-window");
const messagesDiv = document.getElementById("chat-messages");
const input = document.getElementById("chat-text");
const sendBtn = document.getElementById("chat-send");

toggleBtn.onclick = () => {
  chatWindow.style.display =
    chatWindow.style.display === "flex" ? "none" : "flex";
};

function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  messagesDiv.appendChild(msg);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function getBotReply(message) {
  const text = message.toLowerCase();

  if (text.includes("login")) {
    return "If you're having login issues, try logging out and back in.";
  }

  if (text.includes("password")) {
    return "You can reset your password from the login page.";
  }

  if (text.includes("progress")) {
    return "Your progress is saved automatically to your account.";
  }

  if (text.includes("error 403")) {
    return "Error 403 usually means your session expired. Try logging in again.";
  }

  return "I'm not sure about that yet. Try explaining in more detail.";
}

function handleSend() {
  const text = input.value.trim();
  if (!text) return;

  addMessage("You: " + text, "user");
  input.value = "";

  setTimeout(() => {
    const reply = getBotReply(text);
    addMessage("Bot: " + reply, "bot");
  }, 400);
}

sendBtn.onclick = handleSend;

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleSend();
  }
});

addMessage("Hi! I'm your game support assistant. How can I help?", "bot");
