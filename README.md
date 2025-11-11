# Quizo - Interactive Quiz Platform

A modern, full-stack quiz platform built with Next.js 14, featuring Google OAuth authentication, real-time quiz management, and a beautiful UI.

## ✨ Features

### 🔐 Authentication
- **Google OAuth Integration** - Sign in with Google for seamless authentication
- **Email/Password Login** - Traditional authentication for admin users
- **User Onboarding** - Collect user profile information (name, college, club)
- **Session Management** - Secure JWT-based sessions with NextAuth.js

### 📝 Quiz Management
- **Create Quizzes** - Easy-to-use interface for creating quizzes with multiple questions
- **Custom Access Codes** - Set custom or auto-generated access codes for quiz access
- **Question Builder** - Add multiple-choice questions with 4 options
- **Quiz Organization** - Organize quizzes by college and club affiliation
- **My Quizzes** - View and manage all your created quizzes

### 🎯 Quiz Taking
- **Browse Quizzes** - Discover quizzes from different colleges and clubs
- **Search Functionality** - Find quizzes by title or description
- **Access Code Entry** - Secure quiz access with unique codes
- **Real-time Feedback** - Instant results after quiz completion

### 👥 User Features
- **User Dashboard** - Personalized dashboard with quick actions
- **Profile Management** - Update name, college, and club information
- **Quiz History** - Track your quiz attempts and scores
- **Leaderboards** - View top performers (coming soon)

### 🎨 UI/UX
- **Modern Design** - Beautiful gradient backgrounds and animations
- **Dark Mode Support** - Automatic dark/light theme switching
- **Responsive Layout** - Works perfectly on desktop, tablet, and mobile
- **Smooth Animations** - Framer Motion powered transitions
- **Glass Morphism** - Modern glassmorphic design elements

### 🔧 Admin Features
- **Admin Dashboard** - Comprehensive admin panel
- **Quiz Management** - Edit, delete, and manage all quizzes
- **User Management** - View and manage user accounts
- **Analytics** - Track quiz participation and performance
- **Maintenance Mode** - Enable/disable platform access

### 🛠️ Technical Features
- **Next.js 14** - Latest App Router with Server Components
- **TypeScript** - Full type safety throughout the application
- **MongoDB** - Scalable NoSQL database with Mongoose ODM
- **Tailwind CSS** - Utility-first CSS framework
- **NextAuth.js** - Complete authentication solution
- **API Routes** - RESTful API endpoints
- **Environment Variables** - Secure configuration management

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- Google Cloud Console project (for OAuth)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/satyamsingh5512/cccquiz.git
cd cccquiz
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quizdb?retryWrites=true&w=majority

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Admin Credentials (optional)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-admin-password
```

4. **Generate NextAuth Secret**
```bash
openssl rand -base64 32
```

5. **Set up Google OAuth**
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Create a new project
- Enable Google+ API
- Create OAuth 2.0 credentials
- Add authorized redirect URIs:
  - `http://localhost:3000/api/auth/callback/google`
  - `https://your-domain.vercel.app/api/auth/callback/google`

6. **Run the development server**
```bash
npm run dev
```

7. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Project Structure

```
quizo/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── quizzes/         # Quiz CRUD operations
│   │   ├── questions/       # Question management
│   │   ├── attempts/        # Quiz attempts
│   │   └── user/            # User profile management
│   ├── admin/               # Admin dashboard
│   ├── auth/                # Authentication pages
│   ├── browse/              # Browse quizzes
│   ├── create-quiz/         # Quiz creation
│   ├── dashboard/           # User dashboard
│   ├── leaderboards/        # Leaderboards
│   ├── my-quizzes/          # User's quizzes
│   ├── onboarding/          # User onboarding
│   └── quiz/                # Quiz taking interface
├── components/              # Reusable components
│   ├── AnimatedBackground.tsx
│   ├── Footer.tsx
│   ├── Navbar.tsx
│   └── ThemeProvider.tsx
├── lib/                     # Utility functions
│   ├── auth.ts             # NextAuth configuration
│   └── mongodb.ts          # MongoDB connection
├── public/                  # Static assets
├── .env.local              # Environment variables
├── tailwind.config.js      # Tailwind configuration
└── package.json            # Dependencies

```

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `NEXTAUTH_SECRET` | Secret for JWT encryption | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Yes |
| `ADMIN_EMAIL` | Admin email for login | Optional |
| `ADMIN_PASSWORD` | Admin password | Optional |

## 🚢 Deployment

### Deploy to Vercel

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Import to Vercel**
- Go to [Vercel](https://vercel.com)
- Click "New Project"
- Import your GitHub repository
- Add environment variables
- Deploy!

3. **Update Google OAuth**
- Add your Vercel URL to authorized redirect URIs
- Format: `https://your-app.vercel.app/api/auth/callback/google`

## 🛡️ Security

- All API routes are protected with authentication
- Passwords are hashed with bcrypt
- JWT tokens for session management
- Environment variables for sensitive data
- CORS protection on API routes
- Input validation and sanitization

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Satyam Singh**
- GitHub: [@satyamsingh5512](https://github.com/satyamsingh5512)
- Email: ss2628681@gmail.com

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting
- MongoDB for the database
- All contributors and users

## 📞 Support

For support, email ss2628681@gmail.com or open an issue on GitHub.

---

Made with ❤️ by Satyam Singh
