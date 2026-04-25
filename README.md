# CVR P2P Resource Sharing

A peer-to-peer resource management system for college students — Buy, Sell, Borrow, and Lend resources. Built with **plain HTML, CSS & JavaScript** using `localStorage`.

## ▶️ How to Run in VS Code

1. Extract the zip into a folder.
2. Open the folder in **VS Code**.
3. Install the **"Live Server"** extension (by Ritwick Dey).
4. Right-click `login.html` → **Open with Live Server**.

That's it — no libraries, no build step.

## 📂 Files
- `login.html` — Login / Register (glassmorphism)
- `dashboard.html` — Main hub with 4 action cards
- `buy.html` — Browse items for sale (with search)
- `sell.html` — Add an item (auto-appears on Buy)
- `borrow.html` — Browse lendable items (category filters)
- `lend.html` — Add an item to lend (auto-appears on Borrow)
- `resource.html` — Details + chat + request call
- `profile.html` — User info + transaction history
- `style.css` — Shared styling
- `script.js` — Shared logic (auth, navbar, storage, cards)

## 🧠 Data
All data persists in your browser's `localStorage`:
- `cvr_user` — logged-in user
- `cvr_sells` — items for sale
- `cvr_lends` — items to lend
- `cvr_history` — bought / sold / borrowed / lent

To reset, clear site data in DevTools → Application → Local Storage.
