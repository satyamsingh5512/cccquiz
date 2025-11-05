# 🚀 Vercel Deployment Guide

## Prerequisites

1. ✅ GitHub account
2. ✅ Vercel account (sign up at https://vercel.com)
3. ✅ MongoDB Atlas account (free tier)

## Step 1: Prepare MongoDB Atlas

### Create MongoDB Atlas Cluster (Free)

1. Go to https://www.mongodb.com/atlas
2. Sign up or login
3. Click "Build a Database"
4. Choose **FREE** tier (M0)
5. Select a cloud provider and region (closest to you)
6. Click "Create Cluster"

### Get Connection String

1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string (looks like):
   ```
   mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual password
5. Add database name at the end:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/quiz-platform?retryWrites=true&w=majority
   ```

### Setup Database Access

1. Go to "Database Access" in Atlas
2. Click "Add New Database User"
3. Create username and password
4. Set privileges to "Read and write to any database"
5. Click "Add User"

### Setup Network Access

1. Go to "Network Access" in Atlas
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

## Step 2: Push to GitHub

### Initialize Git (if not already done)

```bash
git init
git add .
git commit -m "Initial commit - Quiz Platform"
```

### Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository (e.g., "quiz-platform")
3. **Don't** initialize with README (we already have one)

### Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/quiz-platform.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

### Connect Repository

1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

### Configure Environment Variables

In Vercel project settings, add these environment variables:

#### Required Variables:

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/quiz-platform?retryWrites=true&w=majority

NEXTAUTH_URL=https://your-project-name.vercel.app

NEXTAUTH_SECRET=your_generated_secret_here

ADMIN_EMAIL=ss2628681@gmail.com

ADMIN_PASSWORD=your_secure_password_here
```

### Generate NEXTAUTH_SECRET

Run this command locally:
```bash
openssl rand -base64 32
```

Copy the output and use it as `NEXTAUTH_SECRET`

### Add Environment Variables in Vercel

1. Go to your project in Vercel
2. Click "Settings" tab
3. Click "Environment Variables"
4. Add each variable:
   - Name: `MONGODB_URI`
   - Value: Your MongoDB connection string
   - Environment: Production, Preview, Development
5. Repeat for all variables

## Step 4: Deploy

1. Click "Deploy" button in Vercel
2. Wait for build to complete (2-3 minutes)
3. Your app will be live at: `https://your-project-name.vercel.app`

## Step 5: Update NEXTAUTH_URL

After first deployment:

1. Copy your Vercel URL (e.g., `https://quiz-platform-xyz.vercel.app`)
2. Go to Vercel project settings
3. Update `NEXTAUTH_URL` environment variable with your actual URL
4. Redeploy (Vercel → Deployments → Click "..." → Redeploy)

## Step 6: Test Your Deployment

1. Visit your Vercel URL
2. Click "Admin Login"
3. Login with your credentials
4. Create a quiz and add questions
5. Test taking a quiz

## Automatic Deployments

✅ Every push to `main` branch will auto-deploy to production  
✅ Pull requests create preview deployments  
✅ Vercel handles SSL certificates automatically  

## Custom Domain (Optional)

1. Go to Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions
5. Update `NEXTAUTH_URL` to your custom domain

## Troubleshooting

### Build Fails

**Error**: "Module not found"
- **Solution**: Make sure all dependencies are in `package.json`
- Run `npm install` locally to verify

### MongoDB Connection Error

**Error**: "MongoServerError: bad auth"
- **Solution**: Check username/password in connection string
- Verify database user exists in Atlas

### Admin Login Not Working

**Error**: "Invalid credentials"
- **Solution**: Verify `ADMIN_EMAIL` and `ADMIN_PASSWORD` in Vercel env vars
- Check `NEXTAUTH_SECRET` is set

### Environment Variables Not Working

- **Solution**: After adding/changing env vars, you must redeploy
- Go to Deployments → Click "..." → Redeploy

## Environment Variables Checklist

Before deploying, make sure you have:

- [ ] `MONGODB_URI` - MongoDB Atlas connection string
- [ ] `NEXTAUTH_URL` - Your Vercel URL
- [ ] `NEXTAUTH_SECRET` - Generated secret (32+ characters)
- [ ] `ADMIN_EMAIL` - Admin email address
- [ ] `ADMIN_PASSWORD` - Secure admin password

## Post-Deployment

### First Time Setup

1. Login as admin
2. Create your first quiz
3. Add questions
4. Share access code with users

### Monitor Your App

- View logs: Vercel Dashboard → Your Project → Logs
- View analytics: Vercel Dashboard → Analytics
- Monitor errors: Check deployment logs

## Updating Your App

```bash
# Make changes locally
git add .
git commit -m "Your changes"
git push origin main
```

Vercel will automatically deploy your changes!

## Security Best Practices

1. ✅ Use strong `ADMIN_PASSWORD`
2. ✅ Keep `NEXTAUTH_SECRET` secret and random
3. ✅ Use MongoDB Atlas (not local MongoDB)
4. ✅ Enable MongoDB IP whitelist (or use 0.0.0.0/0 for Vercel)
5. ✅ Never commit `.env.local` to Git

## Cost

- **Vercel**: Free for hobby projects
- **MongoDB Atlas**: Free tier (M0) - 512MB storage
- **Total**: $0/month for small usage

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check MongoDB Atlas connection
3. Verify all environment variables are set
4. Test locally first with `npm run dev`

---

**Your app is now live! 🎉**

Share your quiz platform URL with students and start collecting responses!
