# NetCertPrep 🎓

**Interactive study companion for CompTIA Network+ (N10-009) and AWS Certified Cloud Practitioner (CLF-C02)**

Modern, mobile-friendly flashcards, concept summaries, practice questions, and interactive tools — built for quick review and deep understanding.

[![NetCertPrep Demo](https://img.shields.io/badge/Live%20Demo-Click%20Here-blue?style=for-the-badge&logo=github)](https://glunaa.github.io/netcertprep/)  
*(replace with your actual GitHub Pages URL once deployed)*

## ✨ Features

- **Structured Study Guides**  
  Full coverage of exam domains with tables, mnemonics, comparisons, tips & warnings

- **Interactive Flashcards**  
  Tap-to-flip cards with smooth 3D animation – perfect for mobile

- **Practice Exams** (coming soon)  
  Timed, domain-weighted questions with instant scoring & explanations

- **Specialized Tools**  
  - VLSM subnet calculator  
  - Cisco IOS CLI simulator  
  - AWS VPC drag-and-drop builder  
  - More tools planned (subnet calculator mobile fix, subnet visualizer, etc.)

- **Mobile-first design**  
  Responsive layout, touch-friendly interactions, large tap targets

- **Zero build hassle option**  
  Single-file HTML version runs directly in browser (great for quick demos)

## 📚 Currently Supported Certifications

| Certification                        | Code     | Status              | Focus Areas                              |
|--------------------------------------|----------|---------------------|------------------------------------------|
| CompTIA Network+                     | N10-009  | Active              | OSI/TCP-IP, ports, routing, switching, wireless, security, troubleshooting |
| AWS Certified Cloud Practitioner     | CLF-C02  | Active              | Cloud concepts, core services, security, billing & pricing |

## 🚀 Quick Start (Single-File Version)

1. Download [`index.html`](index.html) from this repo  
2. Open it in any browser (phone or desktop)  
→ Instant flashcards + basic app shell — no installation needed

Perfect for studying on the go without internet after first load.

## 🛠️ Development Setup (Full Version)

```bash
# 1. Clone the repo
git clone https://github.com/valicuh/netcertprep.git
cd netcertprep

# 2. Use Vite (recommended) or Parcel / plain React
npm create vite@latest . -- --template react
# or
npm install --save-dev parcel

# 3. Install dependencies
npm install

# 4. Run locally
npm run dev     # Vite
# or
npx parcel index.html   # Parcel
