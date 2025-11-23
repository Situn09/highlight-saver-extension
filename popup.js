const highlightsContainer = document.getElementById("highlights-container");
const summarizeBtn = document.getElementById("summarizeBtn");
const summaryResult = document.getElementById("summaryResult");
const apiKeyInput = document.getElementById("apiKey");

// Load saved API key (optional convenience)
chrome.storage.local.get(["openaiApiKey"], (res) => {
  if (res.openaiApiKey) {
    apiKeyInput.value = res.openaiApiKey;
  }
});

// Save API key when changed
apiKeyInput.addEventListener("change", () => {
  chrome.storage.local.set({ openaiApiKey: apiKeyInput.value.trim() });
});

// Load and render highlights
function loadHighlights() {
  chrome.storage.local.get(["highlights"], (result) => {
    console.log("Popup loaded highlights:", result.highlights);
    const highlights = result.highlights || [];
    renderHighlights(highlights);
  });
}

function renderHighlights(highlights) {
  highlightsContainer.innerHTML = "";

  if (highlights.length === 0) {
    highlightsContainer.textContent = "No highlights saved yet.";
    return;
  }

  highlights
    .slice()
    .reverse() // show newest first
    .forEach((h) => {
      const item = document.createElement("div");
      item.className = "highlight-item";

      const textEl = document.createElement("div");
      textEl.className = "highlight-text";
      textEl.textContent = h.text;
      item.appendChild(textEl);

      const metaEl = document.createElement("div");
      metaEl.className = "highlight-meta";
      metaEl.textContent = `${new URL(h.url).hostname} • ${new Date(
        h.createdAt
      ).toLocaleString()}`;
      item.appendChild(metaEl);

      const actions = document.createElement("div");
      actions.className = "highlight-actions";

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", () => deleteHighlight(h.id));
      actions.appendChild(deleteBtn);

      item.appendChild(actions);

      highlightsContainer.appendChild(item);
    });
}

function deleteHighlight(id) {
  chrome.storage.local.get(["highlights"], (result) => {
    const highlights = result.highlights || [];
    const updated = highlights.filter((h) => h.id !== id);
    chrome.storage.local.set({ highlights: updated }, () => {
      loadHighlights();
    });
  });
}

// Optional: AI Summary using OpenAI
async function summarizeHighlights() {
  summaryResult.textContent = "Summarizing...";
  const apiKey = apiKeyInput.value.trim();

  if (!apiKey) {
    summaryResult.textContent = "Please enter your OpenAI API key first.";
    return;
  }

  chrome.storage.local.get(["highlights"], async (result) => {
    const highlights = result.highlights || [];
    if (!highlights.length) {
      summaryResult.textContent = "No highlights to summarize.";
      return;
    }

    const joinedText = highlights
      .map((h, idx) => `${idx + 1}. ${h.text}`)
      .join("\n");

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini", // or any model you have access to
            messages: [
              {
                role: "system",
                content:
                  "You are a helpful assistant that summarizes user notes.",
              },
              {
                role: "user",
                content:
                  "Here are some text highlights I saved from various web pages. Please give me a short summary in 4-6 bullet points:\n\n" +
                  joinedText,
              },
            ],
            temperature: 0.5,
            max_tokens: 250,
          }),
        }
      );
      console.log("response:", response);
      if (!response.ok) {
        const errText = await response.text();
        console.error("OpenAI error:", errText);
        summaryResult.textContent = "Error from OpenAI API. Check console.";
        return;
      }

      const data = await response.json();
      const summary =
        data.choices?.[0]?.message?.content?.trim() || "No summary generated.";

      summaryResult.textContent = summary;
    } catch (err) {
      console.error(err);
      summaryResult.textContent = "Failed to call OpenAI API.";
    }
  });
}

summarizeBtn.addEventListener("click", summarizeHighlights);
document.addEventListener("DOMContentLoaded", loadHighlights);
// In MV3 popup, DOMContentLoaded usually already fired, so call directly:
loadHighlights();
