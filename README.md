# Cœur de Jane — GitHub Pages + Firebase

The shop runs on **GitHub Pages** (free hosting). Dresses, photos and the owner's login live in **Firebase** (free, no card needed).

- Shop: `index.html`
- Owner admin: `admin.html` (also linked as **Owner login** in the menu and footer)

## 1. Create the Firebase project

1. Go to <https://console.firebase.google.com> → **Add project** → name it `coeur-de-jane` → finish (Google Analytics can be off).
2. **Build → Firestore Database → Create database** → pick a location (e.g. `asia-southeast1`) → **Start in production mode**.
3. **Build → Authentication → Get started → Email/Password → Enable → Save**.
4. **Authentication → Users → Add user** → enter the owner's email and a strong password. This is the admin login.

## 2. Lock it so only the owner can edit

1. **Firestore Database → Rules**.
2. Delete what's there and paste the contents of `firestore.rules`.
3. Replace `OWNER_EMAIL_HERE` with the owner's email from step 1.4 → **Publish**.

Anyone can view dresses; only that email can add, edit or delete them.

## 3. Connect the website to Firebase

1. **Project settings (⚙) → General → Your apps → Web (`</>`)** → register an app (no hosting needed).
2. Copy the `firebaseConfig` values into `assets/firebase-config.js`.

The config isn't a secret — it's meant to be public. The rules from step 2 are what protect the shop.

## 4. Put it on GitHub Pages

1. Create a new **public** repository, e.g. `coeur-de-jane`.
2. **Add file → Upload files** → drag in everything from this folder (keep the `assets` folder) → **Commit**.
3. **Settings → Pages → Source: Deploy from a branch → Branch: `main` / root → Save**.
4. After a minute, the site is live at `https://YOUR-USERNAME.github.io/coeur-de-jane/`.

## 5. Allow the admin login on that address

**Firebase → Authentication → Settings → Authorized domains → Add domain** → `YOUR-USERNAME.github.io`.
(Add your .com / .me later too, if you connect one.)

## 6. Load the dresses

Open `…/admin.html`, log in, and tap **Load the starter dresses**. Then upload photos with **Edit**.

## Using the admin

- **Add a dress:** + Add dress → choose a **category** (On hand, Wedding Gown or Collections) → name, color, sizes, price, photo → Add dress.
- **Categories:** customers see tabs for All, On hand, Wedding Gown and Collections. A category with no dresses yet shows “coming soon”. The starter list has 17 dresses in **On hand** plus the wedding gowns **Betina** and **Zebi** (₱10,000) in **Wedding Gown**.
- **Photos:** any JPG/PNG/WEBP; they're resized automatically to fit Firebase's free storage.
- **Most rented:** ☆ / ★ — up to 3 show in the arches at the top of the homepage.
- **Hide / Show:** take a dress down for a while.
- **Reorder:** ↑ / ↓.
- **Forgot password:** use the link on the login page (reset email goes to the owner).

## Custom domain later

Buy the domain, then GitHub → **Settings → Pages → Custom domain**, follow GitHub's DNS steps, and add the domain to Firebase **Authorized domains**.

- **Size guide:** in Edit, one size per line as `Size | Height | Weight | Bust | Waist`. Customers see it on the dress page.
- **Short note:** e.g. “Limited no. of brides only”, shown on the dress card and page.

## Rentals, fittings and payments

**Rental Booking Form** (on every dress page): size, usage date, name, contact number, complete address, preferred courier (Lalamove or Pick-up), and a GCash payment screenshot.

**Availability calendar:** a reserved dress + date is blocked automatically. Customers see it crossed out and can't pick it, and the database refuses a second booking for the same dress and date.

**Fitting Service** (homepage section and the hanger icon at the top): ₱200 for 5–10 dresses, returned right after fitting. Form: name, dresses to try on (5–10), usage date, fitting date, contact number, complete address, courier, GCash screenshot.

**Admin → Settings:** GCash number, GCash account name, payment note and fitting fee. If the GCash number is empty, customers aren't asked for a screenshot.

**Admin → Bookings:** every rental and fitting, with all details and **View screenshot** for the GCash payment. Set Pending → Confirmed → Returned, or Cancelled. Cancelling or deleting a rental frees its date.

**Admin → Edit a dress → Booked dates:** see upcoming booked dates, free a date, or block one yourself (for bookings taken on Instagram or in person).

**More photos per dress:** Admin → Edit a dress → **+ Add photos** (pick several at once). They show as small pictures under the main photo on the dress page; customers tap them, use the ‹ › arrows, or swipe on phones. Use ◀ ▶ to change the order, ✕ to remove, and **Make main photo** to swap one with the main picture.

**Dress text:** name, color, price, sizes, category, short note, description and size guide are all editable in Edit.
