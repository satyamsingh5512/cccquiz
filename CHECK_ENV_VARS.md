# 🔍 Environment Variables Checklist for Vercel

## Current Error: Function Invocation 500

This means the environment variables are not being read correctly in production.

## ✅ **EXACT Steps to Fix**

### **Step 1: Go to Vercel Environment Variables**

Direct link: https://vercel.com/satyamsingh5512s-projects/cccquiz/settings/environment-variables

### **Step 2: Verify Each Variable**

Click on each variable and make sure:
- The value is NOT empty
- ALL 3 environments are checked (Production, Preview, Development)

### **Step 3: Required Variables (Copy-Paste These)**

Delete all existing variables and add them fresh:

#### 1. MONGODB_URI
```
mongodb+srv://satym:satym123@cluster0.rxiktwk.mongodb.net/quiz-platform?retryWrites=true&w=majority
```
- Environments: ✅ Production ✅ Preview ✅ Development

#### 2. NEXTAUTH_SECRET
```
8xK9mP2nQ5rT7vW0yZ3bC6eF1gH4jL8mN9pQ2sT5uW8xY1zA3bC
```
- Environments: ✅ Production ✅ Preview ✅ Development

#### 3. NEXTAUTH_URL
```
https://cccquiz.vercel.app
```
- Environments: ✅ Production ✅ Preview ✅ Development

#### 4. ADMIN_EMAIL
```
ss2628681@gmail.com
```
- Environments: ✅ Production ✅ Preview ✅ Development

#### 5. ADMIN_PASSWORD
```
Admin@123
```
- Environments: ✅ Production ✅ Preview ✅ Development

### **Step 4: After Adding All Variables**

1. Go to Deployments: https://vercel.com/satyamsingh5512s-projects/cccquiz/deployments
2. Click "..." on latest deployment
3. Click "Redeploy"
4. Wait 3 minutes

---

## 🎯 **Quick Fix: Delete and Re-add All Variables**

Sometimes Vercel has issues with environment variables. Try this:

1. **Delete ALL environment variables** in Vercel
2. **Add them back one by one** using the values above
3. Make sure to check **ALL 3 environments** for each
4. **Redeploy**

---

## 🔧 **Alternative: Use Vercel CLI**

If the UI isn't working, use CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Add environment variables
vercel env add NEXTAUTH_SECRET production
# Paste: 8xK9mP2nQ5rT7vW0yZ3bC6eF1gH4jL8mN9pQ2sT5uW8xY1zA3bC

vercel env add NEXTAUTH_SECRET preview
vercel env add NEXTAUTH_SECRET development

# Repeat for all variables
```

---

## ⚠️ **Common Mistakes**

1. ❌ Forgetting to check all 3 environments
2. ❌ Having spaces in the variable value
3. ❌ Not redeploying after adding variables
4. ❌ Using wrong variable names (check spelling!)

---

## ✅ **How to Verify It's Working**

After redeployment:
1. Go to deployment logs
2. Look for "NO_SECRET" error - should be GONE
3. Visit your site - should load without errors
4. Try to login - should work

---

**The key issue is that environment variables MUST have all 3 environments selected!**
