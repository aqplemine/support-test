const toggleBtn = document.getElementById("chat-toggle");
const chatWindow = document.getElementById("chat-window");
const messagesDiv = document.getElementById("chat-messages");
const input = document.getElementById("chat-text");
const sendBtn = document.getElementById("chat-send");
const apiKeyInput = document.getElementById("chat-api-key");
const saveKeyBtn = document.getElementById("chat-save-key");

const OPENAI_API_URL = "https://api.openai.com/v1/responses";
const OPENAI_MODEL = "gpt-4.1-mini";
const STORAGE_KEY = "openai_api_key";

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

function getSavedApiKey() {
  return localStorage.getItem(STORAGE_KEY) || "";
}

function saveApiKey() {
  const key = apiKeyInput.value.trim();

  if (!key) {
    localStorage.removeItem(STORAGE_KEY);
    addMessage("Bot: API key removed.", "bot");
    return;
  }

  localStorage.setItem(STORAGE_KEY, key);
  addMessage("Bot: API key saved in your browser storage.", "bot");
}

async function getBotReply(message) {
  const apiKey = getSavedApiKey();

  if (!apiKey) {
    return "Please add your OpenAI API key before sending a message.";
  }

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      input: [
        {
          role: "system",
          content:
            "You are a concise game support assistant. Give practical troubleshooting help.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI request failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.output_text || "I couldn't generate a response.";
}

async function handleSend() {
  const text = input.value.trim();
  if (!text) return;

  addMessage("You: " + text, "user");
  input.value = "";
  sendBtn.disabled = true;

  try {
    const reply = await getBotReply(text);
    addMessage("Bot: " + reply, "bot");
  } catch (error) {
    addMessage("Bot: Sorry, I couldn't reach OpenAI. " + error.message, "bot");
  } finally {
    sendBtn.disabled = false;
  }
}

saveKeyBtn.onclick = saveApiKey;
sendBtn.onclick = handleSend;

apiKeyInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    saveApiKey();
  }
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleSend();
  }
});

apiKeyInput.value = getSavedApiKey();
addMessage("Hi! I'm your game support assistant. Add your OpenAI API key to start.", "bot");
