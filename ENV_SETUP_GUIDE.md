# Environment Variables Setup Guide

## Quick Setup Checklist

- [ ] MongoDB URI configured
- [ ] NEXTAUTH_SECRET generated
- [ ] NEXTAUTH_URL set correctly
- [ ] Google OAuth credentials added
- [ ] Admin credentials set (optional)

---

## 1. MongoDB URI (MONGODB_URI)

**Current Status**: ✅ Already configured in your .env.local

Your MongoDB connection string is already set up:
```
mongodb+srv://satyamsingh5512:EnHmC0gL9RoZ0DJD@back551219.ns43ruz.mongodb.net/quizdb
```

**No action needed** unless you want to use a different database.

---

## 2. NextAuth Secret (NEXTAUTH_SECRET)

**Current Status**: ⚠️ Needs to be generated

### Generate a secure secret:

**Option 1: Using OpenSSL (Recommended)**
```bash
openssl rand -base64 32
```

**Option 2: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Option 3: Online Generator**
Visit: https://generate-secret.vercel.app/32

### Then update your .env.local:
```env
NEXTAUTH_SECRET=your-generated-secret-here
```

**Example:**
```env
NEXTAUTH_SECRET=8xK9mP2nQ5rT7vW0yZ3bC6eF1gH4jL8mN9pQ2sT5uW8xY1zA3bC=
```

---

## 3. NextAuth URL (NEXTAUTH_URL)

**Current Status**: ✅ Already set for local development

### For Local Development:
```env
NEXTAUTH_URL=http://localhost:3000
```

### For Production (Vercel):
```env
NEXTAUTH_URL=https://your-app-name.vercel.app
```

**Note**: Update this when you deploy to Vercel!

---

## 4. Google OAuth Credentials

**Current Status**: ⚠️ Needs to be set up

### Step-by-Step:

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create a new project**
   - Name it "Quizo" or any name you prefer

3. **Enable Google+ API**
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. **Configure OAuth Consent Screen**
   - Go to "APIs & Services" > "OAuth consent screen"
   - Select "External"
   - Fill in:
     - App name: Quizo
     - User support email: Your email
     - Developer contact: Your email
   - Add scopes: `userinfo.email` and `userinfo.profile`
   - Add yourself as a test user

5. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Select "Web application"
   - Add Authorized redirect URIs:
     ```
     http://localhost:3000/api/auth/callback/google
     https://your-app.vercel.app/api/auth/callback/google
     ```
   - Click "Create"
   - **Copy the Client ID and Client Secret**

6. **Add to .env.local**
   ```env
   GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnop
   ```

**Detailed guide**: See `GOOGLE_OAUTH_SETUP.md`

---

## 5. Admin Credentials (Optional)

**Current Status**: ✅ Already configured

These are for the legacy admin login system:
```env
ADMIN_EMAIL=ss2628681@gmail.com
ADMIN_PASSWORD=muhmelega
```

**Security Note**: Change the password to something more secure!

---

## Complete .env.local Template

Here's what your complete `.env.local` should look like:

```env
# ============================================
# DATABASE
# ============================================
MONGODB_URI=mongodb+srv://satyamsingh5512:EnHmC0gL9RoZ0DJD@back551219.ns43ruz.mongodb.net/quizdb?retryWrites=true&w=majority

# ============================================
# NEXTAUTH CONFIGURATION
# ============================================
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=8xK9mP2nQ5rT7vW0yZ3bC6eF1gH4jL8mN9pQ2sT5uW8xY1zA3bC=

# ============================================
# GOOGLE OAUTH
# ============================================
GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnop

# ============================================
# ADMIN CREDENTIALS
# ============================================
ADMIN_EMAIL=ss2628681@gmail.com
ADMIN_PASSWORD=your-secure-password-here
```

---

## Testing Your Setup

### 1. Generate NEXTAUTH_SECRET
```bash
openssl rand -base64 32
```
Copy the output and paste it into your `.env.local`

### 2. Set up Google OAuth
Follow the steps in section 4 above or see `GOOGLE_OAUTH_SETUP.md`

### 3. Restart your dev server
```bash
npm run dev
```

### 4. Test the application
1. Go to http://localhost:3000
2. Click "Login"
3. Try "Continue with Google" - should work if OAuth is set up
4. Try email/password signup - should work immediately

---

## Vercel Deployment

When deploying to Vercel, add these environment variables:

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add each variable:
   - `MONGODB_URI`
   - `NEXTAUTH_URL` (use your Vercel URL)
   - `NEXTAUTH_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`

4. Select all environments: Production, Preview, Development
5. Click "Save"
6. Redeploy your application

---

## Troubleshooting

### "Invalid NEXTAUTH_SECRET"
- Make sure you generated a proper secret
- Check for extra spaces or line breaks
- Restart your dev server after adding it

### "Google OAuth not working"
- Verify Client ID and Secret are correct
- Check redirect URIs match exactly
- Make sure Google+ API is enabled
- Add yourself as a test user in OAuth consent screen

### "Database connection failed"
- Check MongoDB URI is correct
- Verify your IP is whitelisted in MongoDB Atlas
- Check database name is included in the URI

---

## Security Best Practices

1. **Never commit .env.local to Git** (it's already in .gitignore)
2. **Use different secrets for development and production**
3. **Rotate secrets regularly**
4. **Use strong admin passwords**
5. **Keep Google OAuth credentials private**
6. **Enable 2FA on your Google Cloud account**

---

## Need Help?

- Google OAuth Setup: See `GOOGLE_OAUTH_SETUP.md`
- MongoDB Issues: Check MongoDB Atlas dashboard
- NextAuth Issues: Check https://next-auth.js.org/errors

---

**Once you complete these steps, your app will be fully functional with Google OAuth!**
