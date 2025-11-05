# 🚀 Quick Start Guide

## Current Status

✅ MongoDB is connected  
✅ Database has 1 quiz  
⚠️ Quiz has 0 questions (needs to be added)

## Step-by-Step Setup

### 1. Test Database Connection
```bash
npm run test:db
```

### 2. Start the Development Server
```bash
npm run dev
```

### 3. Login as Admin

1. Open http://localhost:3000
2. Click "Admin Login" button
3. Enter credentials:
   - **Email**: `ss2628681@gmail.com`
   - **Password**: (from your `.env.local` file)

### 4. Add Questions to Your Quiz

1. After logging in, you'll see your quiz on the admin dashboard
2. Click "Manage Questions" button
3. Click "Add Question"
4. Fill in:
   - Question text
   - 4 options
   - Select the correct answer (radio button)
5. Click "Add Question"
6. Repeat to add more questions

### 5. Test Taking a Quiz

1. Go back to home page (click "Home" in navbar)
2. Click on the quiz
3. Enter the access code (shown in admin dashboard)
4. Fill in your information:
   - Name
   - Email
   - Roll Number
5. Take the quiz!

## Troubleshooting

### "Quiz is loading forever"
- **Cause**: Quiz has no questions
- **Solution**: Add questions from admin dashboard

### "Cannot login as admin"
- **Cause**: Wrong password or not set
- **Solution**: Check `ADMIN_PASSWORD` in `.env.local`

### "MongoDB connection error"
- **Cause**: MongoDB not running or wrong URI
- **Solution**: 
  - Check if MongoDB is running: `mongod` (for local)
  - Verify `MONGODB_URI` in `.env.local`
  - Run `npm run test:db` to test connection

### "Quiz not found"
- **Cause**: Invalid quiz ID or quiz deleted
- **Solution**: Go to home page and select a quiz from the list

## Admin Features

### Create a New Quiz
1. Go to Admin Dashboard
2. Click "Create New Quiz"
3. Fill in:
   - **Title**: Name of the quiz
   - **Description**: Brief description
   - **Access Code**: Custom code or leave empty for auto-generation
   - **Time Limit**: Minutes (0 = no limit)
4. Click "Create Quiz"

### View Results
1. Go to Admin Dashboard
2. Click "View All Results"
3. Features:
   - Search by name, email, or roll number
   - Filter by specific quiz
   - Export to CSV
   - View statistics

## Environment Variables

Make sure your `.env.local` has:

```env
MONGODB_URI=mongodb://localhost:27017/quiz-platform
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generated-secret>
ADMIN_EMAIL=ss2628681@gmail.com
ADMIN_PASSWORD=<your-password>
```

## Next Steps

1. ✅ Login as admin
2. ✅ Add questions to existing quiz
3. ✅ Create more quizzes
4. ✅ Share access codes with users
5. ✅ View results and analytics

---

**Need Help?** Check the full README.md for detailed documentation.
