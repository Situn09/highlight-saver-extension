# 📌 Website Highlight Saver – Chrome Extension

A Chrome Extension that lets you **highlight text on any website**, save highlights locally, view them in a popup UI, delete them, and optionally generate an **AI Summary** using OpenAI’s API.

---

## 🚀 Features

### ✔ Highlight on Any Webpage

Select any text → a small floating popup appears: **“Save highlight?”**

### ✔ Save Highlights Locally

Saved in Chrome’s `chrome.storage.local`.

### ✔ View Saved Highlights

Click the extension toolbar icon → scrollable list of all saved highlights.

### ✔ Delete Any Highlight

Each highlight has a delete button.

### ✔ Optional: AI Summary

In the popup, enter your OpenAI API key and click **Summarize** to generate a concise summary of all highlights.

---

## 📁 Project Structure

```
highlight-saver-extension/
│
├── manifest.json
├── content.js
├── content.css
├── popup.html
├── popup.js
└── popup.css
```

---

# 🛠 Installation (Local Setup)

Follow these steps to load the extension locally into Chrome.

---

## 1️⃣ Clone or Download the Project

```
git clone https://github.com/<yourname>/highlight-saver-extension.git
cd highlight-saver-extension
```

Or manually create a folder and copy the provided files.

---

## 2️⃣ Enable Developer Mode in Chrome

1. Open Chrome
2. Go to:

   ```
   chrome://extensions/
   ```

3. Turn ON **Developer mode** (top-right toggle)

---

## 3️⃣ Load the Extension

1. Click **Load unpacked**
2. Select the `highlight-saver-extension` folder
3. Chrome will load the extension instantly
4. Pin it if you want:
   Click the 📌 icon next to “Website Highlight Saver”

---

## 4️⃣ Test the Extension

1. Open any website (e.g., [https://example.com](https://example.com))
2. Select text → a popup appears: **Save highlight?**
3. Click **Save**
4. Open the extension popup → highlights appear
5. Delete a highlight if needed

---

# ⚠️ IMPORTANT NOTES

### ✔ You MUST refresh the webpage after reloading the extension

Content scripts only run on newly loaded pages.

### ✔ Highlights appear only after saving

Popup won't show anything until you save a highlight.

### ✔ Content scripts **do not run** on some restricted pages

Chrome blocks extensions from running on:

- `chrome://*` pages
- Chrome Web Store (`https://chrome.google.com/*`)
- PDF Viewer
- New Tab (`chrome://newtab`)
- Some pages with restrictive CSP policies

Test on normal websites (Wikipedia, blogs, news sites, etc).

---

# 🤖 AI Summary (Optional Feature)

To use the summarizer inside the popup:

1. Open the extension popup
2. Enter your **OpenAI API Key**
3. Click **Summarize**
4. A short summary of all highlights will appear

> Your API key is stored only inside `chrome.storage.local`, not sent to any server.

You can use any model you have access to:

```js
model: "gpt-4o-mini";
```

---

# 🔒 Permissions Explained

### `"storage"`

Required to save highlights locally.

### `"activeTab"`

Allows the popup to read webpage information.

### `"host_permissions": ["<all_urls>"]`

Allows content script to run on all websites.

### `"all_frames": true`

(Recommended) Enables functionality inside iframes (YouTube, Gmail, etc).

---
