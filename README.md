<div align="center">

# 🌐 Pabitra Lenka — Portfolio & Techfolio

[![Website Status](https://img.shields.io/badge/status-active-brightgreen?style=for-the-badge)](https://pabitralenka.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Zero Dependency](https://img.shields.io/badge/Runtime-Zero%20Dependency-orange?style=for-the-badge)](#-tech-stack--architecture)
[![Vercel Ready](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)

**A high-performance, interactive, multi-disciplinary personal portfolio website crafted for the modern web.**

[Live Preview](https://pabitralenka.com) • [Explore Disciplines](#-the-5-disciplines) • [Tech Stack](#-tech-stack--architecture) • [Getting Started](#-getting-started) • [Contact](#-connect--socials)

</div>

---

## 📖 Overview

This repository houses the source code for **Pabitra Lenka's** interactive portfolio website. Built with a **zero-framework runtime philosophy**, the application achieves sub-second load times and 100 Lighthouse performance metrics by leveraging pure semantic HTML5, modern CSS3 tokens, and vanilla ES6+ JavaScript.

Rather than relying on heavy client-side JavaScript frameworks, the site delivers bespoke 3D perspective visuals, Canvas-based physics projections, smooth inertia scrolling, and View Transitions API-driven theme switches directly on native browser primitives.

---

## ✨ Key Features

- **🚪 5 Interactive Discipline Portals**: Immersive 3D perspective door navigation showcasing tailored work across 5 distinct domains.
- **🎨 View Transitions Theme Switcher**: GPU-accelerated full-page crossfading between an organic light stone palette and a charcoal dark mode (`data-mode="dark"`).
- **⏳ 3D Time-Tunnel Canvas**: Scroll-driven Canvas 2D projection rendering rotating clock dials, hour markers, and drifting dust particles as you travel backward through career milestones.
- **📸 2.5D Infinite Draggable Photography Wall**: Physics-driven endless gallery canvas with momentum inertia, depth scaling, base64 WebP blur placeholders (LQIP), and a lightbox viewer.
- **🔄 Infinite Responsive Tech Stack Marquee**: Custom `LogoLoop` component with smooth infinite scrolling, hover pauses, and gradient mask fading.
- **📱 Fluid Viewport-Adaptive Layout**: Dynamic `@media (max-width: ...vw)` rem scaling ensuring identical visual proportions across ultra-wide monitors, laptops, tablets, and smartphones.
- **⚡ Static Routing Resilience**: Built-in fallback routes (`/home/`, `/work/`, `/my-story/`) ensuring smooth URL reloads and hash preservation on static hosts (Vercel, Netlify, GitHub Pages).
- **🛡️ Privacy & Cookie Consent**: Fully gated Google Analytics integration that respects user choice and complies with GDPR/CCPA standards.

---

## 🎯 The 5 Disciplines

| Discipline | Route | Highlights |
| :--- | :--- | :--- |
| **💻 Web Developer** | [`/web-developer/`](./web-developer/) | Full-stack applications, interactive UI/UX, Zerodha & Tax P&L case studies, high-performance web engineering. |
| **🤖 AI/ML Engineer** | [`/ai-ml-engineer/`](./ai-ml-engineer/) | Deep learning architectures, smart application engines (Vault, Brick, Dice, Expense), interactive demo cards. |
| **🐍 Python Developer** | [`/python-developer/`](./python-developer/) | Financial engineering, automated workflow systems, algorithmic tooling, and robust backend microservices. |
| **📊 Data Scientist** | [`/data-scientist/`](./data-scientist/) | Visual analytics, model performance dashboards, big data storytelling, and enterprise research. |
| **📷 Photographer** | [`/photographer/`](./photographer/) | Architecture, Concert, Nature, Product, and Sports photography in an endless 2.5D draggable spatial canvas. |

---

## 🛠️ Tech Stack & Architecture

### Core Technologies
- **Markup**: Pure Semantic HTML5, SVG vector iconography, WebP image formats, responsive MP4 inline demo reels.
- **Styling**: Modern CSS3 Custom Properties (Design Tokens), Flexbox, CSS Grid, Fluid `vw` Rem Grid, View Transitions API (`::view-transition`).
- **Scripting**: Vanilla ES6+ JavaScript (zero runtime dependencies like React, Vue, or Angular).
- **Typography**: Local self-hosted variable font `Onest` (`fonts/onest-latin.woff2`) preloaded for instantaneous First Contentful Paint (FCP).
- **Animation & Physics**: Native HTML5 Canvas 2D projections, Lenis smooth scrolling, mathematical momentum easing (`cubic-bezier`).

---

## 📁 Repository Structure

```text
lenka-codes/
├── index.html                 # Main landing page (Hero, 5 Doors, Story Canvas, Contact)
├── robots.txt                 # Search engine crawler instructions
├── sitemap.xml                # SEO index map for Google / Bing
├── resume.pdf                 # Direct-link downloadable resume
├── og.jpg                     # OpenGraph preview banner for social sharing
│
├── web-developer/             # Web development discipline showcase & case studies
├── ai-ml-engineer/            # AI & Machine Learning project gallery & video previews
├── python-developer/          # Python development, scripts & backend solutions
├── data-scientist/            # Data science case studies, analytics & visual posters
├── photographer/              # Endless 2.5D spatial draggable photography wall
│   ├── index.html             # Gallery interface & physics engine
│   ├── photos.js              # Catalog metadata with base64 LQIP blur placeholders
│   └── p/                     # High-resolution optimized WebP assets
│
├── components/                # Modular UI components
│   ├── LogoLoop.js            # Standalone Vanilla JS infinite marquee engine
│   ├── LogoLoop.css           # Styling & gradient fade masks
│   └── techData.js            # Technology metadata & SVG icons
│
├── fonts/                     # Self-hosted variable Onest webfonts (woff2)
├── vendor/                    # Minified smooth-scroll utilities (Lenis)
└── home/, work/, my-story/    # Static host URL fallback redirects
```

---

## 🚀 Getting Started

### Prerequisites
Any static file server or standard web browser. No build steps, `npm install`, or bundlers are required!

### 1. Clone the repository
```bash
git clone https://github.com/pabitralenka07/Lenka_techfolio.git
cd Lenka_techfolio
```

### 2. Run locally

You can run the project using any local HTTP server:

**Using Python (Recommended):**
```bash
# Python 3
python3 -m http.server 8000
```
Then visit [`http://localhost:8000`](http://localhost:8000) in your browser.

**Using Node.js (`npx serve`):**
```bash
npx serve .
```

**Using VS Code Live Server:**
Right-click on `index.html` and select **"Open with Live Server"**.

---

## 🌐 Deployment

### Deploy to Vercel
1. Import this repository directly into [Vercel](https://vercel.com).
2. Framework Preset: **Other** (Plain Static HTML).
3. Build Command: *Leave blank*.
4. Output Directory: `.`
5. Click **Deploy**!

### Deploy to GitHub Pages
1. Navigate to **Settings > Pages** in your GitHub repository.
2. Under **Build and deployment > Source**, select **Deploy from a branch**.
3. Choose the `main` branch and `/ (root)` folder.
4. Click **Save**.

---

## 📬 Connect & Socials

- **GitHub**: [@pabitralenka07](https://github.com/pabitralenka07)
- **LinkedIn**: [Pabitra Lenka](https://www.linkedin.com/in/pabitra-lenka-777423324/)
- **X / Twitter**: [@PabitraLenka777](https://x.com/PabitraLenka777)
- **Instagram**: [@\_\_lenka\_babu.\_](https://www.instagram.com/__lenka_babu._?igsh=MXZyODBoenlvOHZ1dQ==)

---

<div align="center">
  <sub>Designed & Developed with ❤️ by <strong>Pabitra Lenka</strong>.</sub>
</div>
