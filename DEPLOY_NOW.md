# 🚀 Deploy to Vercel NOW - Step by Step

Follow these exact steps to deploy your quiz platform to Vercel.

## Step 1: Prepare MongoDB Atlas (5 minutes)

### 1.1 Create Account
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google or email
3. Choose **FREE** tier

### 1.2 Create Cluster
1. Click "Build a Database"
2. Choose **M0 FREE** tier
3. Select **AWS** and closest region
4. Cluster Name: `Cluster0` (default)
5. Click "Create"
6. Wait 3-5 minutes for cluster creation

### 1.3 Create Database User
1. Click "Database Access" (left sidebar)
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `quizadmin`
5. Password: Click "Autogenerate Secure Password" (SAVE THIS!)
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### 1.4 Allow Network Access
1. Click "Network Access" (left sidebar)
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere"
4. Confirm: `0.0.0.0/0`
5. Click "Confirm"

### 1.5 Get Connection String
1. Go back to "Database" (left sidebar)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string:
   ```
   mongodb+srv://quizadmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your saved password
6. Add `/quiz-platform` before the `?`:
   ```
   mongodb+srv://quizadmin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/quiz-platform?retryWrites=true&w=majority
   ```
7. **SAVE THIS CONNECTION STRING!**

## Step 2: Generate Secrets (1 minute)

### 2.1 Generate NEXTAUTH_SECRET

**On Mac/Linux:**
```bash
openssl rand -base64 32
```

**On Windows (PowerShell):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**Or use online generator:**
https://generate-secret.vercel.app/32

**SAVE THIS SECRET!**

### 2.2 Choose Admin Password
Choose a strong password for admin login.
Example: `CloudQuiz2024!Secure`

**SAVE THIS PASSWORD!**

## Step 3: Push to GitHub (2 minutes)

### 3.1 Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `quiz-platform`
3. Description: `Cloud Computing Club Quiz Platform`
4. Choose **Public** or **Private**
5. **DO NOT** check "Initialize with README"
6. Click "Create repository"

### 3.2 Push Your Code
```bash
# Commit your code
git add .
git commit -m "Initial commit - Quiz Platform by Satym"

# Add GitHub remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/quiz-platform.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 4: Deploy to Vercel (5 minutes)

### 4.1 Sign Up for Vercel
1. Go to https://vercel.com/signup
2. Click "Continue with GitHub"
3. Authorize Vercel

### 4.2 Import Project
1. Click "Add New..." → "Project"
2. Find your `quiz-platform` repository
3. Click "Import"

### 4.3 Configure Project
1. Framework Preset: **Next.js** (auto-detected)
2. Root Directory: `./` (leave default)
3. Click "Environment Variables" to expand

### 4.4 Add Environment Variables

Add these **5 variables** (click "Add" after each):

**Variable 1:**
- Name: `MONGODB_URI`
- Value: `mongodb+srv://quizadmin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/quiz-platform?retryWrites=true&w=majority`
- Environments: Check all 3 boxes

**Variable 2:**
- Name: `NEXTAUTH_SECRET`
- Value: Your generated secret from Step 2.1
- Environments: Check all 3 boxes

**Variable 3:**
- Name: `ADMIN_EMAIL`
- Value: `ss2628681@gmail.com`
- Environments: Check all 3 boxes

**Variable 4:**
- Name: `ADMIN_PASSWORD`
- Value: Your chosen password from Step 2.2
- Environments: Check all 3 boxes

**Variable 5:**
- Name: `NEXTAUTH_URL`
- Value: `https://your-project-name.vercel.app` (we'll update this)
- Environments: Check all 3 boxes

### 4.5 Deploy
1. Click "Deploy"
2. Wait 2-3 minutes
3. You'll see "Congratulations!" when done
4. Click "Continue to Dashboard"

### 4.6 Get Your URL
1. Copy your deployment URL (e.g., `quiz-platform-abc123.vercel.app`)
2. Go to "Settings" → "Environment Variables"
3. Find `NEXTAUTH_URL`
4. Click "Edit"
5. Update value to: `https://quiz-platform-abc123.vercel.app` (your actual URL)
6. Click "Save"

### 4.7 Redeploy
1. Go to "Deployments" tab
2. Click "..." on the latest deployment
3. Click "Redeploy"
4. Click "Redeploy" to confirm
5. Wait 1-2 minutes

## Step 5: Test Your Live Site (3 minutes)

### 5.1 Visit Your Site
Open your Vercel URL in browser

### 5.2 Login as Admin
1. Click "Admin Login"
2. Email: `ss2628681@gmail.com`
3. Password: Your admin password
4. Click "Sign In"

### 5.3 Create First Quiz
1. Click "Create New Quiz"
2. Title: `Test Quiz`
3. Description: `My first quiz`
4. Access Code: `TEST123`
5. Time Limit: `10` minutes
6. Click "Create Quiz"

### 5.4 Add Questions
1. Click "Manage Questions"
2. Click "Add Question"
3. Question: `What is 2 + 2?`
4. Options:
   - Option 1: `3`
   - Option 2: `4` ← Select this as correct
   - Option 3: `5`
   - Option 4: `6`
5. Click "Add Question"
6. Add 2-3 more questions

### 5.5 Test Taking Quiz
1. Open incognito/private window
2. Go to your Vercel URL
3. Click on "Test Quiz"
4. Enter access code: `TEST123`
5. Fill in your information
6. Take the quiz
7. Submit and see results

### 5.6 Check Admin Dashboard
1. Go back to admin window
2. Click "View All Results"
3. You should see your test attempt!

## 🎉 Success!

Your quiz platform is now live at: `https://your-project-name.vercel.app`

## What's Next?

1. **Create Real Quizzes**
   - Login as admin
   - Create quizzes for your students
   - Add questions

2. **Share with Students**
   - Share your Vercel URL
   - Share quiz access codes
   - Monitor results in real-time

3. **Automatic Updates**
   - Make changes locally
   - `git push origin main`
   - Vercel auto-deploys!

## Quick Reference

**Your URLs:**
- Live Site: `https://your-project-name.vercel.app`
- Admin Login: `https://your-project-name.vercel.app/auth/signin`
- Admin Dashboard: `https://your-project-name.vercel.app/admin`

**Your Credentials:**
- Admin Email: `ss2628681@gmail.com`
- Admin Password: [Your chosen password]

**MongoDB:**
- Connection String: [Your saved connection string]
- Database: `quiz-platform`

## Troubleshooting

**Can't login as admin?**
- Check ADMIN_EMAIL and ADMIN_PASSWORD in Vercel env vars
- Make sure NEXTAUTH_SECRET is set
- Redeploy after changing env vars

**MongoDB connection error?**
- Verify connection string in MONGODB_URI
- Check IP whitelist is 0.0.0.0/0
- Verify database user credentials

**Need help?**
- Check Vercel logs: Dashboard → Logs
- Check MongoDB Atlas: Metrics tab
- Test locally first: `npm run dev`

---

**Made by Satym for Cloud Computing Club** 🎓

Your quiz platform is ready to use! Share it with your students and start collecting quiz responses.
