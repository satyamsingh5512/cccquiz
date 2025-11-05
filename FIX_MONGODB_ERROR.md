# 🔧 Fix MongoDB 500 Error

## Current Issue

The `/api/quizzes` endpoint is returning 500 error because MongoDB connection is failing in production.

## ✅ **Quick Fix**

### **Step 1: Verify MONGODB_URI in Vercel**

1. Go to: https://vercel.com/satyamsingh5512s-projects/cccquiz/settings/environment-variables

2. Find `MONGODB_URI` and click on it

3. **Verify the value is EXACTLY:**
```
mongodb+srv://satym:satym123@cluster0.rxiktwk.mongodb.net/quiz-platform?retryWrites=true&w=majority
```

4. **Make sure ALL 3 environments are checked:**
   - ✅ Production
   - ✅ Preview
   - ✅ Development

5. If anything is wrong, **delete and re-add it**:
   - Click "..." → "Delete"
   - Click "Add New"
   - Name: `MONGODB_URI`
   - Value: (paste the exact URI above)
   - Check all 3 environments
   - Click "Save"

### **Step 2: Redeploy**

After fixing MONGODB_URI:

1. Go to: https://vercel.com/satyamsingh5512s-projects/cccquiz/deployments
2. Click "..." on latest deployment
3. Click "Redeploy"
4. Wait 2-3 minutes

### **Step 3: Check Logs**

After redeployment:

1. Click on the new deployment
2. Click "Runtime Logs"
3. Visit your site to trigger the API call
4. Look for any MongoDB error messages

---

## 🔍 **Alternative: Check MongoDB Atlas**

The MongoDB connection might be blocked. Verify in Atlas:

### **1. Check Network Access**

1. Go to: https://cloud.mongodb.com/
2. Click on your cluster
3. Go to "Network Access" (left sidebar)
4. Make sure you have: `0.0.0.0/0` (Allow access from anywhere)
5. If not, click "Add IP Address" → "Allow Access from Anywhere"

### **2. Check Database User**

1. Go to "Database Access" (left sidebar)
2. Make sure user `satym` exists
3. Password should be: `satym123`
4. Role should be: "Read and write to any database"

### **3. Check Connection String**

1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. It should look like:
```
mongodb+srv://satym:<password>@cluster0.rxiktwk.mongodb.net/?retryWrites=true&w=majority
```
5. Replace `<password>` with `satym123`
6. Add `/quiz-platform` before the `?`:
```
mongodb+srv://satym:satym123@cluster0.rxiktwk.mongodb.net/quiz-platform?retryWrites=true&w=majority
```

---

## 🎯 **Complete Environment Variables**

Make sure ALL of these are in Vercel with ALL 3 environments:

```
MONGODB_URI=mongodb+srv://satym:satym123@cluster0.rxiktwk.mongodb.net/quiz-platform?retryWrites=true&w=majority

NEXTAUTH_SECRET=8xK9mP2nQ5rT7vW0yZ3bC6eF1gH4jL8mN9pQ2sT5uW8xY1zA3bC

NEXTAUTH_URL=https://cccquiz.vercel.app

ADMIN_EMAIL=ss2628681@gmail.com

ADMIN_PASSWORD=Admin@123
```

---

## ✅ **How to Know It's Fixed**

After redeployment:

1. Visit: https://cccquiz.vercel.app
2. Open browser console (F12)
3. You should see:
   - ✅ No 500 errors
   - ✅ No "Failed to fetch quizzes" errors
   - ✅ Page loads normally

4. If you have quizzes in the database, they should appear on the home page

---

## 🚀 **Test After Fix**

1. **Home Page**: Should load without errors
2. **Admin Login**: Should work
3. **Create Quiz**: Should save to database
4. **View Quizzes**: Should appear on home page

---

## 📝 **If Still Not Working**

Check the Vercel Runtime Logs for the exact error:

1. Go to deployment
2. Click "Runtime Logs"
3. Visit your site
4. Look for MongoDB error messages
5. Share the error message for more specific help

---

**Most common issue**: MONGODB_URI not set for all 3 environments in Vercel!
