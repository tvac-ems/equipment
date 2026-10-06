# TVAC Equipment Tracker

QR equipment sign-in/out for Teaneck Volunteer Ambulance Corps. Members scan a sticker on an item and sign it out or in.

## Stack
- **Frontend:** a static PWA, with `index.html` (all UI and JS), `sw.js`, `manifest.json`, `logo.png` and icons. No build step.
- **Hosting:** GitHub Pages at https://tvac-ems.github.io/equipment/. It's served from `main` and goes live about 1 minute after a push.
- **Backend:** Google Apps Script (`Code.gs`) bound to a Google Sheet on `equipmenttracking@teaneckambulance.org`.
  - Apps Script project ID: `12H_9gv1GnA8S8v-0ra0qQfIjrPBznMihCoDi3_A-7zhFE_x05PcT8tzV`
  - Web app URL (hardcoded in `index.html`): `https://script.google.com/macros/s/AKfycbxEZyMAzgTEBhZhQ7bpifXX3P3sojxhjsn69vTFJPMBI4rsmAjxpTInBUMIAe7WB02W/exec`
- **Libraries:** loaded from cdnjs: qrcode, jsPDF (sticker PDFs) and JSZip (sticker PNGs).

## Rules
- **Never create a new Apps Script deployment.** Update the existing one (Manage deployments → Edit → New version) so the `/exec` URL stays the same.
- **Never change the QR URL format** (`qrUrlFor`). Printed stickers point at it, and a change means reprinting every sticker.
- Push backend changes with `clasp push`, then redeploy the existing deployment ID.
- Keep it simple and inventory-focused. Inspections and checklists live in a different app.
- The app must feel fast. Use cached data and fixed-height sheets so buttons don't jump when fresh data loads.
- Sign in and sign out must work offline (queued).

## Data model
- Item types are First Responder Bag, Portable Oxygen Tank and AED. FR bag kinds: Blue (with O2 and AED) or Red (without). AEDs and O2 tanks are signed out separately, not linked to bags.
- Item IDs are sequential 4-digit numbers, with room for 200 items. Blank pre-printed "spare" stickers can be set up later by an admin.
- The three statuses are **Available**, **Signed out** and **Needs attention**. Only admins clear Needs attention.
- Members log in with a PIN (Line # = Member # = PIN). There are admin and member roles.
- The Sheet has tabs for Items, Members, Vehicles and Bag Kinds, among others. It syncs both ways with the app every 60 seconds and when the app returns to the foreground.
- Vehicles: ambulances 71, 72, 74, 75, 76; 78 (borrowed ambulance); 701 fly car; 702 special ops truck; 711 Gator; 712 spare 1; 713 spare 2; 721 special ops trailer; 722 staging trailer.

## Stickers
- The design is a 3 × 1 in sticker with the QR code, logo and ID only, and no names, so names can change without reprinting.
- There are two modes, a label printer (one per page) and a sticker sheet (`SHEET_DEF` / `sheetCfg`, with a test-fit page and a start-at-label option).
- Labels print on a laser printer (Brother HL-L2460DW) using Avery 5520 waterproof labels (1 × 2⅝ in, 30 per sheet).

## Workflow
- Test on a phone-sized viewport before pushing.
- Commit straight to `main` with clear messages.
- When a change touches both repos, apply the same change in the Chaverim tracker too.
