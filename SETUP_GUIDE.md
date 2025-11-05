# Quick Setup Guide

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.local.example` to `.env.local` and fill in the values:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/quiz-platform

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_secret_here

# Admin Credentials
ADMIN_EMAIL=ss2628681@gmail.com
ADMIN_PASSWORD=YourSecurePassword123!
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 3. Start MongoDB

**Option A - Local MongoDB:**
```bash
mongod
```

**Option B - MongoDB Atlas:**
- Sign up at https://www.mongodb.com/atlas
- Create a free cluster
- Get connection string
- Update `MONGODB_URI` in `.env.local`

### 4. Run the Application
```bash
npm run dev
```

Visit: http://localhost:3000

## 📋 Features Checklist

✅ Email/Password Admin Authentication  
✅ Quiz Access Code System  
✅ Timer Management (optional per quiz)  
✅ User Information Collection (Name, Email, Roll Number)  
✅ Admin Dashboard with Quiz Management  
✅ Results Analytics Dashboard  
✅ CSV Export  
✅ Dark/Light Mode  
✅ Animated Backgrounds  
✅ Responsive Design  

## 🔑 Admin Login

1. Go to http://localhost:3000
2. Click "Admin Login"
3. Enter:
   - Email: `ss2628681@gmail.com`
   - Password: (from your `.env.local`)

## 👥 User Flow

1. Visit home page
2. Click on a quiz
3. Enter access code (provided by admin)
4. Fill in personal information
5. Take quiz (with optional timer)
6. View results

## 🛠️ Troubleshooting

**MongoDB Connection Error:**
- Check if MongoDB is running
- Verify `MONGODB_URI` in `.env.local`

**Admin Login Failed:**
- Verify `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env.local`
- Make sure `NEXTAUTH_SECRET` is set

**Quiz Not Loading:**
- Check browser console for errors
- Verify MongoDB connection
- Check if quiz has questions added

## 📦 Tech Stack

- Next.js 14 (App Router)
- TypeScript
- MongoDB
- NextAuth.js
- Tailwind CSS
- Framer Motion
- Lucide React Icons

## 🎯 Key Files

- `lib/auth.ts` - Authentication configuration
- `app/api/` - API routes
- `app/admin/` - Admin dashboard
- `app/quiz/[quizId]/` - Quiz taking page
- `types/quiz.ts` - TypeScript interfaces

---

**Made by Satym for Cloud Computing Club**
