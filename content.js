let highlightPopup = null;

function removeHighlightPopup() {
  if (highlightPopup && highlightPopup.parentNode) {
    highlightPopup.parentNode.removeChild(highlightPopup);
    highlightPopup = null;
  }
}

function createHighlightPopup(selectedText, rect) {
  removeHighlightPopup();

  highlightPopup = document.createElement("div");
  highlightPopup.className = "highlight-saver-popup";
  highlightPopup.textContent = "Save highlight?";

  const saveButton = document.createElement("button");
  saveButton.textContent = "Save";
  highlightPopup.appendChild(saveButton);

  // Position near selection
  const top = window.scrollY + rect.top - 35;
  const left = window.scrollX + rect.left;

  highlightPopup.style.top = `${top}px`;
  highlightPopup.style.left = `${left}px`;

  document.body.appendChild(highlightPopup);

  saveButton.addEventListener("mousedown", () => {
    console.log("selectedText:", selectedText);
    saveHighlight(selectedText);
    removeHighlightPopup();
    window.getSelection().removeAllRanges();
  });
}

// Save highlight to chrome.storage.local
function saveHighlight(text) {
  const pageUrl = window.location.href;
  const pageTitle = document.title || pageUrl;
  const createdAt = new Date().toISOString();

  chrome.storage.local.get(["highlights"], (result) => {
    const highlights = result.highlights || [];
    const newHighlight = {
      id: Date.now(), // simple unique id
      text,
      url: pageUrl,
      title: pageTitle,
      createdAt,
    };
    highlights.push(newHighlight);
    chrome.storage.local.set({ highlights }, () => {
      // Optional: small toast / console log
      console.log("Highlight saved:", newHighlight);
    });
  });
}

// Listen for mouseup to detect text selection
document.addEventListener("mouseup", () => {
  const selection = window.getSelection();
  if (!selection) {
    removeHighlightPopup();
    return;
  }

  const selectedText = selection.toString().trim();
  console.log("selectedText on mouseup:", selectedText);

  if (!selectedText) {
    removeHighlightPopup();
    return;
  }

  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  if (rect && rect.width && rect.height) {
    createHighlightPopup(selectedText, rect);
  } else {
    removeHighlightPopup();
  }
});

// Clicking elsewhere removes popup
document.addEventListener("mousedown", (e) => {
  console.log("above removeHighlightPopup on document click");
  console.log("e:", e.target);
  if (highlightPopup && !highlightPopup.contains(e.target)) {
    console.log("e:", e.target);
    console.log("removeHighlightPopup on document click");
    removeHighlightPopup();
  }
});
