# 🎂 Birthday Surprise Website

A stunning birthday surprise website made with love — featuring a cinematic envelope intro, floating particles, photo/video gallery powered by Cloudinary, and a secret admin panel.

## ✨ Features

- **Cinematic Envelope Intro** — Opens on click to reveal the birthday surprise
- **"Do You Love Me?" Popup** — Fun popup where the "No" button runs away! 😂
- **Heart Explosion** — When she clicks "Yes", hearts explode across the screen
- **Particle System** — Floating hearts and sparkles across the screen
- **Typewriter Effect** — Hero text types out "Happy Birthday, My Love!"
- **Love Timeline** — Scroll-animated story of your journey together
- **Photo & Video Gallery** — Dynamic masonry grid powered by Cloudinary
- **Lightbox Viewer** — Fullscreen viewing with keyboard navigation
- **Love Letter Section** — Animated handwritten-style letter with falling petals
- **Birthday Countdown** — Live countdown to April 4th with "IT'S YOUR BIRTHDAY!" banner
- **Birthday Wishes** — Animated counters and confetti effects
- **Fun Quiz** — 5 romantic questions ("How well do you know me?")
- **Background Music** — Romantic music with floating toggle button
- **Fireworks** — Canvas fireworks on the birthday day (April 4)
- **Admin Panel** — Hidden dashboard at `/admin.html` for uploading photos/videos
- **Responsive Design** — Looks beautiful on phone, tablet, and desktop

## 🔧 Setup

### 1. Cloudinary (Already Configured)
- **Cloud Name**: `dnsyvxggn`
- **Upload Preset**: `birthday-wife` (unsigned)
- **Folder**: `birthday-wife`

### 2. Admin Panel
- Navigate to `yoursite.com/admin.html`
- **Password**: `iloveyou`
- Upload photos and videos through the drag-and-drop interface

### 3. Deploy to Netlify
1. Push this repo to GitHub
2. Connect to [Netlify](https://netlify.com)
3. Deploy — no build step needed!

## 📁 Project Structure

```
mylifephotos/
├── index.html          # Main birthday website
├── admin.html          # Admin panel (hidden)
├── css/
│   ├── style.css       # Main design system
│   └── admin.css       # Admin panel styles
├── js/
│   ├── main.js         # Animations & gallery logic
│   ├── cloudinary.js   # Cloudinary integration
│   └── admin.js        # Admin panel logic
├── netlify.toml        # Netlify config
└── README.md           # This file
```

## 💝 Personalization

Edit `index.html` to customize:
- **Wife's name** — Change the typewriter text in `js/main.js` (line with `'Happy Birthday, My Love!'`)
- **Timeline events** — Edit the timeline section in `index.html`
- **Love letter** — Edit the letter content in `index.html`
- **Birthday date** — Change April 4 in `js/main.js` `initCountdown()` function
- **Quiz questions** — Edit the `questions` array in `js/main.js`
- **Admin password** — Change in `js/admin.js` (default: `iloveyou`)
- **Counter numbers** — Edit `data-target` attributes in the wishes section

## 🚀 Tech Stack

- Pure HTML, CSS, JavaScript (no frameworks)
- Cloudinary for media hosting & optimization
- Netlify for deployment
- Google Fonts (Great Vibes, Outfit, Dancing Script)
