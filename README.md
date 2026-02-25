📊 Habit Intelligence Dashboard

A premium, analytics-driven habit tracking dashboard built with Next.js (App Router) and deployed-ready for Vercel.

This is not just a basic habit tracker — it includes 6 levels of behavioral analytics, streak intelligence, momentum detection, and monthly growth insights.

🚀 Live Demo

Add your deployed Vercel link here after deployment:

https://your-app-name.vercel.app
✨ Features
🔥 1. Interactive Habit Heatmap

Monthly habit matrix

One-click daily tracking

Real-time UI updates

Persistent storage using localStorage

Google Sheets logging via Apps Script

📊 2. Discipline Score (Level 1 Analytics)

Monthly completion percentage

Total actions completed

Performance classification

Real-time score calculation

📈 3. Habit Performance (Level 2 Analytics)

Best performing habit detection

Weakest habit identification

Per-habit percentage calculation

Visual performance bars

🔥 4. Streak Analysis (Level 3 Analytics)

Current streak tracking

Longest streak detection

Streak comparison per habit

Longest streak across all habits

🧠 5. Habit Intelligence (Level 4 Analytics)

Weakest habit targeting

Discipline type classification:

Elite Discipline

Strong Builder

Inconsistent Performer

Struggling Phase

Behavioral improvement insight

📊 6. Momentum & Risk Engine (Level 5 Analytics)

Detects high momentum habits (≥3 day streak)

Detects habits at risk (streak broken after ≥3 days)

Risk categorization logic

Early warning system for behavioral breakdown

📈 7. Monthly Growth Trend (Level 6 Analytics)

Compares current month vs previous month

Calculates growth percentage

Displays improvement or decline

Encourages performance accountability

🏗 Tech Stack
Technology	Purpose
Next.js 16 (App Router)	Frontend Framework
React	UI State Management
TypeScript	Type Safety
Tailwind CSS	Premium UI Styling
LocalStorage	Client-side persistence
Google Apps Script	External habit logging
Vercel	Deployment
📂 Project Structure
app/
 ├── page.tsx              → Root redirect
 └── tracker/
      └── page.tsx         → Main dashboard
public/
package.json
tsconfig.json
🧠 Architecture Overview

This project follows a local-first architecture:

Data stored in localStorage

Optional logging to Google Sheets

No backend required

Fully client-side execution

Deployable on Vercel without configuration

Future upgrade path:

Supabase integration

Neon/PostgreSQL backend

User authentication

Cross-device sync

🖥 Local Development

Clone the repository:

git clone https://github.com/YOUR_USERNAME/DailyTracker.git
cd DailyTracker

Install dependencies:

npm install

Run development server:

npm run dev

Open:

http://localhost:3000

The root automatically redirects to:

/tracker
🚀 Deployment (Vercel)

Push to GitHub

Go to https://vercel.com

Import repository

Click Deploy

No environment variables required.

📈 Analytics Philosophy

This tracker is designed around 3 behavioral principles:

Visibility drives consistency

Streak momentum builds identity

Weakness targeting improves discipline

Instead of simple completion tracking, this dashboard:

Identifies weak points

Highlights performance trends

Encourages incremental improvement

Prevents streak collapse

🎯 Why This Project Is Different

Most habit trackers:

Track checkboxes

Show simple streaks

This dashboard:

Computes discipline score

Detects risk behavior

Measures momentum

Calculates monthly growth

Provides actionable intelligence

It’s designed as a behavioral performance system, not just a tracker.

🔮 Future Enhancements

📊 Radial discipline chart

📈 Chart.js growth visualization

🔐 User authentication

☁️ Cross-device sync

🤖 AI habit recommendation engine

📱 Mobile-first redesign

🏆 Achievement system

🌙 Theme customization

👤 Author

Navneet Prasad
Engineer | Discipline Builder | Systems Thinker

📜 License

This project is open-source and available under the MIT License.

⭐ If You Like This Project

Star the repository

Fork it

Improve it

Build your own intelligence layer
