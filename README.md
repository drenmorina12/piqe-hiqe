# Piqe-Hiqe 📱

A mobile educational app designed to help students learn more effectively using **flashcards** and **interactive quizzes**.  
The app allows users to create, organize, and review flashcards by subject, and track their progress in a simple way.

---

## 👥 Team Members

- Erëza Temaj
- Dituri Kodra
- Djellza Jasiqi
- Dren Morina
- Nora Morina
- Riga Ferati

---

### 🎯 Core Features

- **User Authentication:** Login and sign-up screens (structure prepared).
- **Subjects:** View and manage subjects (two default subjects added for now).
- **Collections:** Each subject opens a collections page showing flashcard groups.
- **Flashcards:** Components and layout for creating and displaying flashcards.
- **Profile Screen:** Basic user info page.

---

### 🧭 Main Screens

- **Login / Sign Up** – authentication pages
- **Home** – displays subjects list
- **Collections** – shows collections based on selected subject
- **Flashcards** – displays flashcards for a collection
- **Profile** – simple profile management screen

---

## 🚀 Getting Started

These instructions will help you get a copy of the project running locally.

### 1. Clone the repo

```bash
git git@github.com:drenmorina12/piqe-hiqe.git
cd <piqe-hiqe>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the project

Start the Expo development server:

```bash
npx expo start
```

- This opens the Expo Dev Tools in your browser.
- You can run the app on:
  - **Android emulator:** press `a`
  - **iOS simulator:** press `i`
  - **Physical device:** scan the QR code in the Expo Dev Tools with the Expo Go app

---

## 🗂️ Folder Structure

```
app/          → main app screens (each screen in its own folder)
assets/       → images, icons, fonts, etc.
components/   → reusable UI parts (buttons, cards, etc.)
config/       → app-wide configuration (API setup, constants, etc.)
constants/    → static values like colors, route names, etc.
hooks/        → custom React hooks
scripts/      → automation or build scripts
utils/        → helper functions and utilities
```

---
