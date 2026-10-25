# Relate World

**Relate World** is a comprehensive, multi-platform ecosystem built to empower youth development across sports clubs, skill labs, and community programs. 

The platform bridges web and mobile access, featuring a [Next.js](https://nextjs.org/) web application and an **Expo (React Native)** mobile application optimized for seamless performance across all devices.

---

## 🚀 Tech Stack

* **Frontend Web:** [Next.js](https://nextjs.org/) (React, TypeScript, Tailwind CSS)
* **Mobile App:** [Expo](https://expo.dev/) / React Native (Android APK distribution via [GitHub Releases](https://github.com/Kummirai/learnmore/releases))
* **Backend & Database:** [Supabase](https://supabase.com/) (PostgreSQL, Authentication, Row Level Security)
* **Media Management:** [Cloudinary](https://cloudinary.com/) (Automated image optimization, fast WebP delivery, profile avatars, and media galleries)
* **Communications & Support:** [Brevo](https://www.brevo.com/) (Transactional emails for system alerts, store orders, and support tickets sent to `info@relateworld.org`)

---

## 📱 Mobile Application & Updates

The mobile app is distributed directly via Android APK builds hosted on GitHub Releases:
* **Current Version:** `v1.0.1`
* **Download Latest APK:** [Relate World App v1.0.1 Release](https://github.com/Kummirai/learnmore/releases/tag/v1.0.1)
* **In-App Updates:** The app automatically checks your Next.js API endpoint on startup and prompts users when a new APK build is available.

---

## ⚙️ Performance & Optimization Highlights

* **Low-RAM Android Support:** Configured with the **Hermes JavaScript engine**, hardware acceleration, and memory-efficient list recycling via **FlashList** to ensure smooth 60 FPS performance on entry-level 2 GB RAM devices.
* **Optimized Image Delivery:** Leverages `expo-image` and Cloudinary URL transformations (`w_auto,f_auto,q_auto`) to prevent Out-Of-Memory (OOM) crashes on budget smartphones.
* **Centralized Communications:** Routes support issues, store orders, and user queries directly to `info@relateworld.org` via **Brevo** transactional APIs.

---

## 🛠️ Getting Started Locally

### Prerequisites
Ensure you have **Node.js** installed on your machine.

### 1. Clone the Repository
```bash
git clone [https://github.com/Kummirai/learnmore.git](https://github.com/Kummirai/learnmore.git)
cd learnmore
