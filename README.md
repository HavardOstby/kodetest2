# Leaked Data Viewer

A React application that fetches and displays "leaked" posts from [JSONPlaceholder](https://jsonplaceholder.typicode.com), built as a code test.

## Features

- **Fetch & Display Posts** — Loads posts from JSONPlaceholder with user information and images from [placehold.co](https://placehold.co)
- **Danger Score** — Each post shows a "danger" score based on the number of vowels in its content, with color-coded badges (green/orange/red)
- **Dynamic Filtering** — Filter posts by user, search by text, and sort by content length or danger score
- **Expandable Comments** — Click to load and view comments on any post
- **Hide Posts** — "Permanently" hide posts from the main feed (persisted in localStorage)
- **Hidden Posts Page** — View and manage all hidden posts on a dedicated page, with the ability to unhide them

## Getting Started

```bash
npm install
npm run dev
```

## Tech Stack

- React 19 + TypeScript
- Vite
- React Router DOM
- JSONPlaceholder API
- placehold.co for images

