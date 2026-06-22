# 🎬 Movies For Your Mood

A cross-platform app that curates movie recommendations based on your current emotional vibe. Built with Expo and React Native, the app features a sleek, dark-themed UI, an interactive mood picker, personal library management, and a built-in journal to log your thoughts on what you watch.

Live: https://movies-for-your-mood.vercel.app/

## 🛠️ Tech Stack

* **Framework:** React Native / [Expo](https://expo.dev/)
* **Styling:** Tailwind CSS (via NativeWind)
* **State Management:** [Zustand](https://github.com/pmndrs/zustand) (Global Store) & [TanStack Query](https://tanstack.com/query/latest) (Server State/Caching)
* **Backend / Database:** [Supabase](https://supabase.com/)
* **Movie Data:** [TMDB API](https://www.themoviedb.org/)
* **Deployment:** Vercel (Web)


## ✨ Features

* **Vibe Check Engine:** Select from 6 distinct moods (Laugh, Adrenaline, Think, Cry, Scare, Chill) to instantly generate a curated list of movies.
* **Deep Movie & Cast Details:** Powered by the TMDB API, view full movie synopses, ratings, release years, and explore cast members to see their entire filmography.
* **My Library:** Bookmark your favorite movies to your personal library, synced seamlessly via Supabase.
* **Journal Composer:** A quick-access floating action button that lets you jot down reviews, thoughts, and film critiques on the fly.
* **Cross-Platform:** Run as a native app on iOS/Android or as a snappy web application.

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone

```

### 2. Install dependencies

```bash
npm install

```

### 3. Set up Environment Variables

Create a `.env.local` file in the root of the project and add your API keys:

```env
# TMDB API (Read Access Token)
EXPO_PUBLIC_TMDB_API_TOKEN=your_tmdb_token_here

# Supabase Project Details
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key

```

### 4. Run the app

Start the Expo development server:

```bash
npx expo start

```

* Press `w` to open it in your web browser.
* Press `i` to open it on an iOS simulator.
* Press `a` to open it on an Android emulator.
* Or scan the QR code with the Expo Go app on your physical device.

## 🔮 Future Features & Recommendations

This project is continuously evolving. Here is the roadmap for upcoming features and architectural improvements:

* **Global Social Feed:** Expand the app from a personal utility to a community platform. Implement a public feed where users can publish their journal entries, share what they are currently watching.
* **SEO & Deep Linking (Expo Router):** Migrate from the current state-based Single Page App (SPA) routing to Expo Router. This will introduce file-based routing, enabling shareable URLs for specific movies (e.g., `.../movie/123`), dynamic metadata, and vastly improved SEO for the web deployment.
* **Evolved Design System:** Abstract the current Tailwind/NativeWind utility classes into a strict, reusable design system component library.
* **Performance & Asset Optimization:** Continue optimizing the web build.
* **Advanced Journaling:** Add rich text formatting to the journal composer, allowing users to tag specific actors, rate movies on a granular scale, and export their reviews.
