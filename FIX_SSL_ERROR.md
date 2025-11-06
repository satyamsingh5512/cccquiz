# 🔧 Fix MongoDB SSL/TLS Error

## Error Details
```
SSL routines:ssl3_read_bytes:tlsv1 alert internal error
```

This means MongoDB Atlas is rejecting the SSL connection from Vercel.

## ✅ **Quick Fix**

### **Option 1: Update Connection String (Recommended)**

Update your `MONGODB_URI` in Vercel to include SSL parameters:

1. Go to: https://vercel.com/satyamsingh5512s-projects/cccquiz/settings/environment-variables

2. Find `MONGODB_URI` and click to edit

3. Replace with this **exact** value:
```
mongodb+srv://satym:satym123@cluster0.rxiktwk.mongodb.net/quiz-platform?retryWrites=true&w=majority&ssl=true&authSource=admin
```

4. Make sure ALL 3 environments are checked:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

5. Click "Save"

6. **Redeploy**:
   - Go to Deployments
   - Click "..." on latest
   - Click "Redeploy"

---

### **Option 2: Check MongoDB Atlas Settings**

The issue might be with MongoDB Atlas configuration:

#### **1. Check Network Access**

1. Go to: https://cloud.mongodb.com/
2. Select your cluster
3. Click "Network Access" (left sidebar)
4. Make sure you have: **`0.0.0.0/0`** (Allow access from anywhere)
5. If not, click "Add IP Address" → "Allow Access from Anywhere" → "Confirm"

#### **2. Check Database User**

1. Go to "Database Access" (left sidebar)
2. Find user: `satym`
3. Make sure:
   - Password is: `satym123`
   - Role is: "Atlas admin" or "Read and write to any database"
4. If user doesn't exist, create it:
   - Click "Add New Database User"
   - Username: `satym`
   - Password: `satym123`
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

#### **3. Get Fresh Connection String**

1. In MongoDB Atlas, click "Connect" on your cluster
2. Choose "Connect your application"
3. Driver: Node.js
4. Version: 4.1 or later
5. Copy the connection string
6. It should look like:
```
mongodb+srv://satym:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```
7. Replace `<password>` with `satym123`
8. Add `/quiz-platform` before the `?`:
```
mongodb+srv://satym:satym123@cluster0.xxxxx.mongodb.net/quiz-platform?retryWrites=true&w=majority&ssl=true
```

---

### **Option 3: Use Alternative Connection String Format**

Try this format with explicit SSL settings:

```
mongodb+srv://satym:satym123@cluster0.rxiktwk.mongodb.net/quiz-platform?retryWrites=true&w=majority&tls=true&tlsAllowInvalidCertificates=true
```

**Note**: `tlsAllowInvalidCertificates=true` is for testing only. Remove it in production once working.

---

## 🎯 **Recommended Solution**

Use this **exact** connection string in Vercel:

```
mongodb+srv://satym:satym123@cluster0.rxiktwk.mongodb.net/quiz-platform?retryWrites=true&w=majority&ssl=true&authSource=admin&tlsAllowInvalidHostnames=true
```

### **Steps:**

1. **Update in Vercel**:
   - Settings → Environment Variables
   - Edit `MONGODB_URI`
   - Paste the connection string above
   - Check all 3 environments
   - Save

2. **Redeploy**:
   - Deployments tab
   - Click "..." on latest
   - Click "Redeploy"
   - Wait 2-3 minutes

3. **Test**:
   - Visit: https://cccquiz.vercel.app
   - Hard refresh
   - Should work now!

---

## 🔍 **Verify It's Working**

After redeployment:

1. Visit your site
2. Open browser console (F12)
3. You should see:
   - ✅ No SSL errors
   - ✅ No 500 errors
   - ✅ Quizzes load (if any exist)

---

## 📝 **If Still Not Working**

### **Create a New MongoDB Atlas Cluster**

If the current cluster has issues:

1. Go to MongoDB Atlas
2. Create a new FREE cluster (M0)
3. Set up database user
4. Set up network access (0.0.0.0/0)
5. Get new connection string
6. Update in Vercel
7. Redeploy

---

## ✅ **Expected Result**

After fixing, you should see:
- ✅ Home page loads
- ✅ No errors in console
- ✅ Can login as admin
- ✅ Can create quizzes
- ✅ Quizzes appear on home page

---

**Most likely fix**: Update MONGODB_URI with SSL parameters and redeploy!
