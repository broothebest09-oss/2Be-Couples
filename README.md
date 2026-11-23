# 2Be — The Private World for Two 💕

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Android SDK](https://img.shields.io/badge/Android-SDK%2035-brightgreen.svg)](https://developer.android.com/)

**2Be** is an intimate, end-to-end encrypted private space designed exclusively for two people in a relationship. Built with both a modern **React/TypeScript/Tailwind** web companion and an **Android Jetpack Compose** native app.

---

## ✨ Features

- **🔒 End-to-End Encrypted Intimate Messaging**: Real-time messaging, view-once photos/videos, voice notes, stickers, reactions, and reply threading.
- **💌 Sealed Locked Letters**: Time-capsule letters locked by date/time, partner affection actions (e.g. *unlocks after 10 kisses*), or geo-radius distance.
- **✨ Scratch-Off Secret Messages**: Interactive scratch-off canvas messages for surprises and intimacy.
- **💋 Real-time Tactile Kiss & Hug Sync**: Hold-to-sync tactile affection with haptic pulses and celebration animations.
- **🏺 Gratitude Jar**: Drop appreciations and shake the jar to draw memories.
- **🌟 Bucket List & Dreams**: Collaborative list of shared aspirations, categories, and memories.
- **🌸 Period & Cycle Care Tracker**: Sensitive cycle phase tracking, mood logs, and partner care alerts.
- **🔐 Mutual Memory Lock**: 4-digit PIN lock agreed mutually between partners with lockout protection.
- **💬 "We Need to Talk" Resolution Mode**: Non-violent structured conversation prompts for gentle conflict resolution.
- **🔔 Google Play 8-Channel Notifications**: Importance levels, custom pulse vibration patterns, LED colors, lockscreen biometric privacy masking, and DND bypass for emergency consent notices.
- **🛡️ Legal & Privacy Framework**: Age gate (13+ / 18+), GDPR/CCPA Consent Center, DSAR Data Export, 72-Hour Unpair Cooling-off Period, and Mutual Data Deletion flow.
- **📊 Firebase Analytics (GA4) Tracking**: Standardized GA4 event tracking, drop-off funnels, cohort retention, and in-app live analytics dashboard.

---

## 🚀 Instant Deployment (Free to Host & Share)

### Option 1: GitHub Pages (Automatic via GitHub Actions)

1. **Create a new repository on GitHub**:
   - Go to [github.com/new](https://github.com/new)
   - Repository name: `2Be-Couples` (or any name you like)
   - Set to **Public**
2. **Push your code**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of 2Be"
   git branch -M main
   git remote add origin https://github.com/<YOUR-USERNAME>/<REPO-NAME>.git
   git push -u origin main
   ```
3. **Enable GitHub Pages**:
   - Go to your repo **Settings > Pages**.
   - Under **Build and deployment > Source**, select **GitHub Actions**.
   - The workflow in `.github/workflows/deploy.yml` will automatically build and publish your app to:
     `https://<YOUR-USERNAME>.github.io/<REPO-NAME>/`

---

### Option 2: 1-Click Free Hosting on Vercel (Fastest!)

1. Install Vercel CLI (or connect GitHub repository):
   ```bash
   npx vercel
   ```
2. Press **Enter** to accept all defaults.
3. Your app will be instantly live on a free permanent URL (e.g. `https://2be-couples.vercel.app`) that you can share with anyone!

---

### Option 3: Netlify (Drag & Drop Zero-Install)

1. Build the production files:
   ```bash
   npm run build
   ```
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop) in your browser.
3. Drag and drop the `dist/` folder into the browser window.
4. Your app is live in 10 seconds with a free `.netlify.app` link!

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

The dev server runs on `http://localhost:3000`.

---

## 📱 Android App Build

The native Android app resides in the `app/` directory:
- Minimum SDK: **API 26 (Android 8.0)**
- Target SDK: **API 35 (Android 15)**
- Language: **Kotlin** + **Jetpack Compose** + **Material 3**

Open the root folder in **Android Studio** and click **Run** or build a signed release bundle via:
```bash
./gradlew assembleRelease
```

---

## 📄 License

MIT License. Open source and free for personal and commercial use.
