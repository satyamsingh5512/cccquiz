# Cloud Computing Club - Quiz Platform

A modern, full-stack quiz platform built with Next.js 14, featuring secure admin authentication, quiz management, and beautiful dark/light mode UI with animated backgrounds.

**Made by Satym**

## Features

- 🔐 **Admin Authentication** - Secure email/password authentication for admin access
- 🔑 **Access Code System** - Secure quiz access with unique codes per quiz
- ⏱️ **Timer Management** - Set time limits for quizzes with live countdown
- 👨‍💼 **Admin Dashboard** - Create and manage quizzes with custom access codes
- 📊 **Results Analytics** - Comprehensive dashboard with filtering, search, and CSV export
- 📝 **Interactive Quiz Taking** - Smooth, animated quiz experience for all users
- 👤 **User Information Collection** - Collect name, email, and roll number for records
- 🌓 **Dark/Light Mode** - Beautiful animated backgrounds in both themes
- 🎨 **Modern UI** - Built with Tailwind CSS and Framer Motion
- 📱 **Responsive Design** - Works on all devices
- 📈 **Performance Tracking** - View scores, percentages, and statistics
- 🚨 **Auto-Submit** - Quizzes automatically submit when time expires

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Authentication**: NextAuth.js with Credentials Provider
- **Database**: MongoDB
- **Icons**: Lucide React

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up MongoDB

You can use either:
- **Local MongoDB**: Install MongoDB locally
- **MongoDB Atlas**: Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/quiz-platform
# or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/quiz-platform

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_here

# Admin Credentials
ADMIN_EMAIL=ss2628681@gmail.com
ADMIN_PASSWORD=your_secure_password_here
```

To generate `NEXTAUTH_SECRET`, run:
```bash
openssl rand -base64 32
```

**Important**: Set a strong password for `ADMIN_PASSWORD`!

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### For Admin

1. Click "Admin Login" in the navbar
2. Sign in with your admin email and password
3. Access the admin dashboard
4. **Create Quiz**: 
   - Add title and description
   - Set access code (or auto-generate)
   - Set time limit in minutes (0 for no limit)
5. **Add Questions**: Create questions with 4 options and mark correct answer
6. **View Results**: Click "View All Results" to see analytics dashboard
   - View all quiz attempts with scores
   - Filter by quiz or search by name/email/roll number
   - Export data to CSV
   - See statistics and performance metrics
7. Share the access code with users who should take the quiz

### For Users (No Sign-In Required!)

1. Visit the home page to see available quizzes
2. Click on a quiz you want to take
3. Enter the **access code** provided by your instructor/admin
4. Provide your information:
   - Full Name
   - Email Address
   - Roll Number / Student ID
5. **Start Quiz** - Timer starts automatically if quiz has time limit
6. Answer all questions with smooth navigation
   - Live countdown timer shows remaining time (if applicable)
   - Timer changes color when time is running low
7. Submit quiz or wait for auto-submission when time expires
8. See instant results with percentage score
9. Retake anytime if needed!

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   ├── admin/            # Admin dashboard pages
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # User dashboard
│   ├── quiz/             # Quiz taking pages
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── providers.tsx     # Context providers
├── components/           # Reusable components
├── lib/                  # Utility functions
├── types/                # TypeScript types
└── public/               # Static assets
```

## Features in Detail

### Admin Features
- Create unlimited quizzes with custom or auto-generated access codes
- **Timer Management** - Set time limits (in minutes) for each quiz
- Add questions with multiple choice options
- Mark correct answers
- View all quizzes with their access codes and time limits
- **Results Dashboard** - View all quiz attempts with detailed analytics
- Filter results by quiz or search by name/email/roll number
- Export results to CSV for further analysis
- View statistics: total attempts, average scores, unique users
- Secure email/password authentication

### User Features
- No sign-in required - completely open access
- Browse available quizzes on home page
- Enter quiz access code to unlock quiz
- Provide personal information (name, email, roll number) before starting
- **Live Timer** - See countdown timer during timed quizzes
- Automatic submission when time expires
- Take quizzes with smooth navigation
- See instant results with percentage scores
- Retake quizzes anytime

### UI/UX Features
- Animated gradient backgrounds
- Smooth page transitions
- Dark/light mode toggle
- Responsive design
- Loading states
- Progress indicators

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `MONGODB_URI`
   - `NEXTAUTH_URL` (your production URL)
   - `NEXTAUTH_SECRET`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
4. Deploy!

## License

MIT License - feel free to use this project for learning or production.

---

**Made with ❤️ by Satym for Cloud Computing Club**
# cccquiz
# Trigger redeploy
