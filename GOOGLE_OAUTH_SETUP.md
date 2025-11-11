# Google OAuth Setup Guide for Quizo

## Overview
Google OAuth is already integrated into your code. You just need to get credentials from Google Cloud Console and add them to your environment variables.

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "New Project"
4. Enter project name: `Quizo` (or any name you prefer)
5. Click "Create"
6. Wait for the project to be created (takes a few seconds)

## Step 2: Enable Google+ API

1. In the Google Cloud Console, make sure your new project is selected
2. Go to "APIs & Services" > "Library" (from the left sidebar)
3. Search for "Google+ API"
4. Click on it and click "Enable"
5. Wait for it to enable

## Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Select "External" (unless you have a Google Workspace)
3. Click "Create"

### Fill in the required fields:
- **App name**: `Quizo`
- **User support email**: Your email (e.g., ss2628681@gmail.com)
- **App logo**: (Optional - you can skip this)
- **Application home page**: `http://localhost:3000` (for now)
- **Authorized domains**: Leave empty for now
- **Developer contact information**: Your email

4. Click "Save and Continue"
5. On "Scopes" page, click "Add or Remove Scopes"
6. Select these scopes:
   - `userinfo.email`
   - `userinfo.profile`
7. Click "Update" then "Save and Continue"
8. On "Test users" page, add your email as a test user
9. Click "Save and Continue"
10. Review and click "Back to Dashboard"

## Step 4: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Select "Web application"
4. Name it: `Quizo Web Client`

### Add Authorized JavaScript origins:
```
http://localhost:3000
https://your-app-name.vercel.app
```

### Add Authorized redirect URIs:
```
http://localhost:3000/api/auth/callback/google
https://your-app-name.vercel.app/api/auth/callback/google
```

5. Click "Create"
6. **IMPORTANT**: Copy the Client ID and Client Secret that appear

## Step 5: Add Credentials to Local Environment

1. Open your `.env.local` file
2. Add these lines (replace with your actual credentials):

```env
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-here
```

3. Save the file
4. Restart your development server:
```bash
npm run dev
```

## Step 6: Add Credentials to Vercel (Production)

1. Go to your Vercel dashboard: https://vercel.com/
2. Select your project
3. Go to "Settings" > "Environment Variables"
4. Add these two variables:

**Variable 1:**
- Key: `GOOGLE_CLIENT_ID`
- Value: `your-client-id-here.apps.googleusercontent.com`
- Environments: ✅ Production ✅ Preview ✅ Development

**Variable 2:**
- Key: `GOOGLE_CLIENT_SECRET`
- Value: `your-client-secret-here`
- Environments: ✅ Production ✅ Preview ✅ Development

5. Click "Save"
6. Redeploy your application

## Step 7: Update Authorized Redirect URIs (After Deployment)

Once you know your Vercel URL:

1. Go back to Google Cloud Console > "Credentials"
2. Click on your OAuth 2.0 Client ID
3. Update the Authorized redirect URIs to include your actual Vercel URL:
```
https://your-actual-app.vercel.app/api/auth/callback/google
```
4. Click "Save"

## Step 8: Test Google OAuth

### Local Testing:
1. Go to http://localhost:3000
2. Click "Login" or "Sign Up"
3. Click "Continue with Google"
4. Sign in with your Google account
5. You should be redirected to the onboarding page to enter your organization

### Production Testing:
1. Go to your Vercel URL
2. Follow the same steps as local testing

## Troubleshooting

### Error: "redirect_uri_mismatch"
- Make sure the redirect URI in Google Console exactly matches your app URL
- Check for trailing slashes
- Verify the URL is correct (http vs https)

### Error: "Access blocked: This app's request is invalid"
- Make sure you've enabled Google+ API
- Check that OAuth consent screen is configured
- Add yourself as a test user if the app is not published

### Error: "invalid_client"
- Double-check your Client ID and Client Secret
- Make sure there are no extra spaces in your .env.local file
- Restart your dev server after adding credentials

### Google Sign-In Button Not Working
- Check browser console for errors
- Verify NEXTAUTH_URL is set correctly in .env.local
- Make sure NEXTAUTH_SECRET is set

## Publishing Your App (Optional)

If you want anyone to use Google Sign-In (not just test users):

1. Go to "OAuth consent screen" in Google Cloud Console
2. Click "Publish App"
3. Confirm the publishing
4. Note: Google may require verification if you request sensitive scopes

## Current Implementation Status

✅ Google OAuth provider added to NextAuth
✅ Sign-in page has "Continue with Google" button
✅ Sign-up page has "Continue with Google" button
✅ User creation in database on first Google sign-in
✅ Onboarding flow for organization setup
✅ Session management

## What Happens When User Signs In with Google?

1. User clicks "Continue with Google"
2. Redirected to Google sign-in page
3. User authorizes the app
4. Google redirects back to your app
5. NextAuth creates/updates user in database
6. If new user → redirected to onboarding page
7. If existing user → redirected to dashboard

## Security Notes

- Never commit `.env.local` to Git (it's already in .gitignore)
- Keep your Client Secret private
- Use environment variables in Vercel for production
- Regularly rotate your secrets if compromised

## Need Help?

If you encounter issues:
1. Check the browser console for errors
2. Check your terminal/server logs
3. Verify all environment variables are set correctly
4. Make sure redirect URIs match exactly
5. Ensure Google+ API is enabled

---

**Your app is ready for Google OAuth! Just add the credentials and test it out.**
