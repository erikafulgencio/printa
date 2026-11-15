# Printa

Printa is the online shop for PRINTA. It is two websites that share one database:

| Site | Who it's for | Built from | Example link |
|---|---|---|---|
| **Customer View** | Customers on their phones: upload, choose print options, pay, track orders, chat | `src/shop` | `https://printa.pages.dev` |
| **CMS** | Shop staff: orders, services, add-ons and stock, pick-up points, couriers, chat, accounts, settings | `src/cms` | `https://printa-cms.pages.dev` |

Whatever you change in the CMS (prices, availability, pick-up points, shop open/closed, order status) shows on the Customer View straight away. Customer orders, sign-ups and messages show in the CMS straight away.

Both sites are plain static files. There is nothing to install. The data and logins live in **Firebase** (free plan), and the sites are hosted on **Cloudflare Pages** (free plan).

Until Firebase is set up, both sites run as a **demo**: they work, but changes stay on that device and don't sync.

---

## Setup

### 1. Firebase (database and logins)

1. In the [Firebase console](https://console.firebase.google.com), click **Add project** and name it `printa`. Google Analytics can stay off.
2. Go to **Build › Firestore Database › Create database**. Pick the location `asia-southeast1` (Singapore) and choose **production mode**.
3. Go to **Firestore › Rules**, replace everything with the contents of [`firestore.rules`](firestore.rules), then click **Publish**.
4. Go to **Build › Authentication › Get started**, then **Sign-in method**. Turn on **Email/Password** and **Anonymous**.
5. Go to **Authentication › Users › Add user**. Enter the email and password the owner will use to sign in to the CMS. Copy that user's **User UID**.
6. Go to **Firestore › Data › Start collection**:
   - **Collection ID:** `admins`
   - **Document ID:** paste the User UID from step 5
   - **Field:** `role` (string) = `owner`

   Click **Save**. Each staff member who needs the CMS gets their own user (step 5) and their own document here.
7. Click the gear icon, then **Project settings › Your apps**, then the **Web** icon (`</>`). Register the app as `printa-web`. Copy the `firebaseConfig` values into [`src/shared/firebase-config.js`](src/shared/firebase-config.js), then commit.

### 2. Cloudflare Pages (two sites from this repo)

Create **two** Pages projects. For each one, go to **Workers & Pages › Create › Pages › Connect to Git** and pick this repo.

| Setting | Customer View | CMS |
|---|---|---|
| Project name | `printa` | `printa-cms` |
| Production branch | `main` | `main` |
| Framework preset | None | None |
| Build command | `node scripts/build.mjs shop` | `node scripts/build.mjs cms` |
| Build output directory | `dist/shop` | `dist/cms` |

Every push to `main` redeploys both sites.

### 3. Allow the sites in Firebase

Go to **Firebase › Authentication › Settings › Authorized domains** and add both Pages domains, for example `printa.pages.dev` and `printa-cms.pages.dev`.

### 4. First sign-in

Open the CMS link and sign in with the user from step 1.5. The first time, the shop is empty: click **Load starter data** to add the sample catalog and orders, then edit them to match your shop.

---

## How access works

- **Customer View:** each visitor is signed in anonymously. They see the catalog plus only their own orders, chat and account.
- **CMS:** only users listed in the `admins` collection can open it. Anyone else who signs in sees "No access" and their User UID.
- **[`firestore.rules`](firestore.rules):** these rules enforce the access above on the server. They also block customers from:
  - ordering while the shop is closed
  - confirming their own orders, unless auto-confirm is on
  - changing order status, refunds, prices or their own account status
  - sending messages once they are blocked

## Project layout

```
src/shared/   files both sites use: data store, starter data, Firebase config, page runtime, photos
src/shop/     Customer View (index.html + PrintaShop.dc.html)
src/cms/      CMS (index.html with the sign-in screen + PrintaAdmin.dc.html)
scripts/      build.mjs copies shared + site files into dist/<site>
firestore.rules
```

The `.dc.html` files are the screens exported from Claude Design. `support.js` renders them in the browser. It loads React from unpkg.

## Preview locally

```
node scripts/build.mjs shop && node scripts/build.mjs cms
npx serve dist        # then open /shop/ and /cms/
```

## Not real yet

- File upload and GCash payment are simulated, as in the design: "Choose file" picks sample documents and payment always succeeds.
- Revenue charts count orders stored in Printa only.
