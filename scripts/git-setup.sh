#!/usr/bin/env bash
# Ажиллуулахаас өмнө: GitHub CLI суулгаад `gh auth login` хийсэн байх.
set -e
git init -b main
git add package.json .gitignore README.md && git commit -m "chore: init Next.js project"
git add lib && git commit -m "feat: add mock news data"
git add app/globals.css app/layout.js components/Header.js components/Nav.js components/Footer.js && git commit -m "feat: add layout, header, nav and footer"
git add components app/page.js && git commit -m "feat: add home page with hero, latest and popular lists"
git add -A && git commit -m "feat: add category, article and search pages"

gh repo create gogo-clone --public --source=. --push

gh issue create --title "Fetch articles from a real API (MongoDB)" --body "Replace lib/data.js with a backend API and connect with fetch in server components."
gh issue create --title "Add pagination to category pages" --body "Show 10 articles per page with ?page= query param."
gh issue create --title "Add dark/light theme toggle" --body "Currently follows prefers-color-scheme only. Add a manual toggle."
gh issue create --title "Improve SEO metadata per article" --body "Use generateMetadata for article and category pages."
gh issue create --title "Add tests for data helpers" --body "Unit tests for lib/data.js (search, byCat, popular)."
