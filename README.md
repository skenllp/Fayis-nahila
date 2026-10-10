# Raneem & Nahila — Wedding Invitation

Static site: HTML + CSS + vanilla JS. No frameworks, no build step. Upload this folder as-is to any static host
(Netlify, Cloudflare Pages, GitHub Pages, Vercel *as a new project*, cPanel). Open `index.html` locally to preview.

## Edit content
Everything lives in `js/config.js`: names, parents, events, story, timeline, gallery, family block, music path, API endpoints.
- **Photos:** drop files in `assets/images/`, then change paths in `config.js`. Gallery entries with `src: ""` show a replaceable slot.
- **Story chapter 1 / 2:** chapter 1 shows a phone-frame placeholder — put your Instagram story screenshot in `assets/images/` and set `photo` for it (and remove `slot: "story"`). Chapter 2 has no photo yet; set `photo`.
- **Music:** replace `assets/music/music.mp3` (7 MB — compressing to ~128 kbps will load faster on mobile data). Music only starts after "Open the Invitation"; the floating button toggles it.
- **Event times:** edit `events` and `timeline` in config; countdown target is `weddingDate` (IST, ISO format).

## Before sharing on WhatsApp
1. In `index.html` replace every `https://raneem-nahila.vercel.app/` (canonical, og:url, og:image, twitter:image) with your real URL. `og-image.jpg` (1200×630) is already included; WhatsApp needs the absolute URL.
2. WhatsApp caches previews — if you change the image later, add `?v=2` to the og:image URL.

## Connect RSVP (Google Sheet) and Wishes (Firebase)
Until these are filled in `js/config.js`, both forms say "not connected — nothing was sent". Success is shown only when the server confirms.

### A) RSVP -> Google Sheet
1. Create a Google Sheet. Rename the first tab to `RSVP` and add headers in row 1: `Time | Name | Attending | Guests | Message`.
2. Extensions -> Apps Script. Replace the code with:
```js
function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    if (!d.name || !d.attending) throw new Error('missing fields');
    SpreadsheetApp.getActive().getSheetByName('RSVP').appendRow([
      new Date(), String(d.name).slice(0, 80), d.attending, Number(d.guests) || 0, String(d.message || '').slice(0, 400)]);
    return out({ ok: true });
  } catch (err) { return out({ ok: false, error: String(err) }); }
}
function out(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
```
3. Deploy -> New deployment -> type **Web app** -> Execute as **Me**, Who has access **Anyone** -> Deploy, authorise, copy the `/exec` URL.
4. Paste it as `rsvpEndpoint` in `js/config.js`. Submit a test RSVP and check the sheet. (After editing the script later, create a *new version* of the deployment.)

### B) Wishes -> Firebase Firestore
1. console.firebase.google.com -> Add project (Analytics not needed).
2. Build -> **Firestore Database** -> Create database (production mode, any region near you).
3. Project settings -> General -> Your apps -> **Web app** (</>) -> register. Copy `apiKey` and `projectId` into `firebase: { apiKey, projectId, collection: "wishes" }` in `js/config.js`. (The web apiKey is safe to be public; the rules below are what protect your data.)
4. Firestore -> **Rules** -> paste and Publish:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /wishes/{id} {
      allow read: if resource.data.approved == true;
      allow create: if request.resource.data.keys().hasOnly(['name','message','approved','createdAt'])
                    && request.resource.data.approved == false
                    && request.resource.data.name is string && request.resource.data.name.size() <= 60
                    && request.resource.data.message is string && request.resource.data.message.size() <= 300;
      allow update, delete: if false;
    }
  }
}
```
5. **Approving wishes:** guests' messages arrive in the `wishes` collection with `approved: false`. Open the document in the Firebase console and change `approved` to `true` — it then appears on the site.

## Files
`css/` style, animations, responsive · `js/` one module per feature · `assets/` images, icons, music · `og-image.jpg` share card.
