# 🚀 Deploy to Vercel - Visual Guide

## Your code is already committed to Git! ✅

Now follow these 3 simple steps:

---

## 📤 STEP 1: Push to GitHub (if not already done)

Check if you have a remote:
```bash
git remote -v
```

If you see a GitHub URL, skip to Step 2.

If not, create a GitHub repo:

1. Go to: **https://github.com/new**
2. Name: `quiz-platform`
3. Click: **"Create repository"**
4. Run these commands:

```bash
git remote add origin https://github.com/YOUR_USERNAME/quiz-platform.git
git push -u origin main
```

---

## 🌐 STEP 2: Deploy to Vercel

### A. Go to Vercel
👉 **https://vercel.com/new**

### B. Sign in with GitHub
- Click "Continue with GitHub"
- Authorize Vercel

### C. Import Your Repository
1. Find `quiz-platform` in the list
2. Click **"Import"**
3. Click **"Deploy"** (don't change anything yet)
4. ⏳ Wait 2-3 minutes...

### D. Copy Your URL
After deployment, you'll see:
```
🎉 Your project is live at: https://quiz-platform-xyz.vercel.app
```
**Copy this URL!**

---

## ⚙️ STEP 3: Add Environment Variables

### A. Go to Settings
1. In Vercel dashboard, click **"Settings"**
2. Click **"Environment Variables"**

### B. Add These 5 Variables

For each variable:
- Click **"Add New"**
- Enter Name and Value
- Select **ALL environments** (Production, Preview, Development)
- Click **"Save"**

#### Variable 1: MONGODB_URI
```
Name: MONGODB_URI
Value: mongodb+srv://satym:satym123@cluster0.rxiktwk.mongodb.net/quiz-platform?retryWrites=true&w=majority
```

#### Variable 2: NEXTAUTH_SECRET
First, generate a secret:
```bash
openssl rand -base64 32
```
Then:
```
Name: NEXTAUTH_SECRET
Value: [paste the generated secret]
```

#### Variable 3: ADMIN_EMAIL
```
Name: ADMIN_EMAIL
Value: ss2628681@gmail.com
```

#### Variable 4: ADMIN_PASSWORD
```
Name: ADMIN_PASSWORD
Value: Admin@123
```
(Change to your preferred password)

#### Variable 5: NEXTAUTH_URL
```
Name: NEXTAUTH_URL
Value: https://quiz-platform-xyz.vercel.app
```
(Use YOUR actual Vercel URL from Step 2D)

### C. Redeploy
1. Go to **"Deployments"** tab
2. Click **"..."** on the latest deployment
3. Click **"Redeploy"**
4. ⏳ Wait 2-3 minutes...

---

## ✅ DONE! Test Your Site

### 1. Visit Your URL
Go to: `https://your-project.vercel.app`

### 2. Login as Admin
- Click **"Admin Login"**
- Email: `ss2628681@gmail.com`
- Password: `Admin@123`

### 3. Create Your First Quiz
- Click **"Create New Quiz"**
- Fill in details
- Set access code (e.g., `QUIZ123`)
- Click **"Create Quiz"**

### 4. Add Questions
- Click **"Manage Questions"**
- Add 5-10 questions
- Each with 4 options
- Mark correct answer

### 5. Test as User
- Open **incognito window**
- Go to your Vercel URL
- Click on the quiz
- Enter access code
- Fill in your info
- Take the quiz!

---

## 🎯 Quick Commands Reference

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Check git status
git status

# Push updates (after making changes)
git add .
git commit -m "Update"
git push origin main
```

---

## 🔧 Troubleshooting

### "Build Failed"
- Check Vercel logs for errors
- Make sure all files are committed
- Try: `npm run build` locally first

### "Can't Login"
- Verify all 5 environment variables are set
- Check ADMIN_EMAIL and ADMIN_PASSWORD match
- Redeploy after adding env vars

### "MongoDB Error"
- Check MONGODB_URI is correct
- Verify MongoDB Atlas allows all IPs (0.0.0.0/0)

### "404 Error"
- Check NEXTAUTH_URL matches your Vercel URL exactly
- Redeploy after updating

---

## 📱 Share Your Platform

Once everything works:

1. **Share URL**: `https://your-project.vercel.app`
2. **Share Access Codes**: From admin dashboard
3. **Monitor Results**: Admin → View All Results

---

## 🔄 Future Updates

Every time you make changes:

```bash
git add .
git commit -m "Your update message"
git push origin main
```

Vercel automatically redeploys! 🚀

---

## 📊 Your Environment Variables Summary

| Variable | Value |
|----------|-------|
| MONGODB_URI | `mongodb+srv://satym:satym123@cluster0...` |
| NEXTAUTH_SECRET | Generate with `openssl rand -base64 32` |
| ADMIN_EMAIL | `ss2628681@gmail.com` |
| ADMIN_PASSWORD | `Admin@123` (or your choice) |
| NEXTAUTH_URL | Your Vercel URL |

---

**That's it! Your quiz platform is now live! 🎉**

**Made with ❤️ by Satym for Cloud Computing Club**
