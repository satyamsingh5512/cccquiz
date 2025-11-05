# ✅ Deployment Checklist

## Before Deploying

### 1. MongoDB Atlas Setup
- [ ] Create MongoDB Atlas account
- [ ] Create free cluster (M0)
- [ ] Create database user with password
- [ ] Allow access from anywhere (0.0.0.0/0)
- [ ] Get connection string
- [ ] Test connection locally

### 2. Environment Variables Ready
- [ ] `MONGODB_URI` - Your Atlas connection string
- [ ] `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
- [ ] `ADMIN_EMAIL` - ss2628681@gmail.com
- [ ] `ADMIN_PASSWORD` - Choose a strong password
- [ ] `NEXTAUTH_URL` - Will be your Vercel URL

### 3. Test Locally
```bash
# Test database connection
npm run test:db

# Run development server
npm run dev

# Test admin login
# Test creating quiz
# Test adding questions
# Test taking quiz
```

### 4. Git Repository
```bash
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Cloud Computing Club Quiz Platform"

# Create GitHub repo and push
git remote add origin https://github.com/YOUR_USERNAME/quiz-platform.git
git branch -M main
git push -u origin main
```

## Deployment Steps

### 1. Go to Vercel
- Visit https://vercel.com
- Sign up/Login with GitHub
- Click "Add New Project"

### 2. Import Repository
- Select your GitHub repository
- Click "Import"

### 3. Configure Project
- Framework Preset: **Next.js** (auto-detected)
- Root Directory: `./` (default)
- Build Command: `npm run build` (default)
- Output Directory: `.next` (default)

### 4. Add Environment Variables

Click "Environment Variables" and add:

```
MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/quiz-platform
NEXTAUTH_SECRET = [your-generated-secret]
ADMIN_EMAIL = ss2628681@gmail.com
ADMIN_PASSWORD = [your-secure-password]
NEXTAUTH_URL = https://your-project.vercel.app
```

**Important**: Select all environments (Production, Preview, Development)

### 5. Deploy
- Click "Deploy"
- Wait 2-3 minutes
- Copy your deployment URL

### 6. Update NEXTAUTH_URL
- Go to Settings → Environment Variables
- Edit `NEXTAUTH_URL` with your actual Vercel URL
- Go to Deployments → Redeploy

## Post-Deployment

### 1. Test Your Live Site
- [ ] Visit your Vercel URL
- [ ] Test admin login
- [ ] Create a test quiz
- [ ] Add test questions
- [ ] Take the quiz as a user
- [ ] Check results in admin dashboard

### 2. Share Access
- [ ] Share your Vercel URL
- [ ] Share quiz access codes
- [ ] Monitor results

## Quick Commands

```bash
# Test database
npm run test:db

# Run locally
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Deploy to Vercel (after setup)
git push origin main
```

## Environment Variables Template

Save this for reference:

```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/quiz-platform?retryWrites=true&w=majority

# NextAuth
NEXTAUTH_URL=https://your-project-name.vercel.app
NEXTAUTH_SECRET=your_32_character_random_string_here

# Admin Credentials
ADMIN_EMAIL=ss2628681@gmail.com
ADMIN_PASSWORD=YourSecurePassword123!
```

## Troubleshooting

### Build Fails
```bash
# Test build locally first
npm run build
```

### MongoDB Connection Error
- Check connection string format
- Verify username/password
- Check IP whitelist (use 0.0.0.0/0)

### Admin Login Fails
- Verify ADMIN_EMAIL and ADMIN_PASSWORD in Vercel
- Check NEXTAUTH_SECRET is set
- Redeploy after changing env vars

### 404 Errors
- Check NEXTAUTH_URL matches your Vercel URL
- Redeploy after updating

## Success Indicators

✅ Build completes without errors  
✅ Site loads at Vercel URL  
✅ Admin login works  
✅ Can create quizzes  
✅ Can add questions  
✅ Users can take quizzes  
✅ Results appear in admin dashboard  

## Next Steps After Deployment

1. **Create Your First Quiz**
   - Login as admin
   - Create quiz with access code
   - Add multiple questions

2. **Test User Flow**
   - Open incognito window
   - Go to your site
   - Take the quiz
   - Verify results appear in admin

3. **Share With Users**
   - Share your Vercel URL
   - Share quiz access codes
   - Monitor submissions

4. **Optional: Custom Domain**
   - Buy domain (e.g., from Namecheap)
   - Add to Vercel project
   - Update NEXTAUTH_URL

---

**Ready to deploy? Follow DEPLOYMENT.md for detailed steps!**
