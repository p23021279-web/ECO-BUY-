# MongoDB Atlas Setup Guide

## 🔧 Fix IP Whitelist Issue

The error you're seeing is because your current IP address isn't whitelisted in MongoDB Atlas. Here's how to fix it:

### Option 1: Add Your Current IP (Recommended for Development)

1. **Go to MongoDB Atlas Dashboard**
   - Visit: https://cloud.mongodb.com/
   - Log in with your account

2. **Navigate to Network Access**
   - Click on "Network Access" in the left sidebar
   - Click "Add IP Address"

3. **Add Your IP**
   - Click "Add Current IP Address" (this will automatically detect your IP)
   - Or manually enter your IP address
   - Click "Confirm"

4. **Wait for Changes**
   - It may take 1-2 minutes for changes to take effect

### Option 2: Allow All IPs (For Development Only - NOT Recommended for Production)

1. **Go to Network Access**
2. **Click "Add IP Address"**
3. **Enter `0.0.0.0/0`** (this allows all IPs)
4. **Add a comment like "Development - Allow All"**
5. **Click "Confirm"**

⚠️ **Warning**: Option 2 is less secure and should only be used for development.

### Option 3: Check Your Current IP

If you're not sure what your IP is, run this command:

```bash
# On Windows (PowerShell)
Invoke-RestMethod -Uri "https://api.ipify.org"

# On Windows (Command Prompt)
curl https://api.ipify.org

# On Mac/Linux
curl https://api.ipify.org
```

## 🧪 Test the Connection

After whitelisting your IP, test the connection:

```bash
cd server
node test-db.js
```

You should see:
```
✅ MongoDB Connected successfully!
Database name: ecofinds
📊 Total users in database: 0
📭 No users found in database
```

## 🔐 Additional Security Notes

1. **Database User**: Make sure your database user has proper permissions
2. **Password**: Ensure your password is strong
3. **Network Access**: Regularly review and remove unused IP addresses
4. **Environment Variables**: Never commit your `.env` file to version control

## 🚀 Next Steps

Once the connection works:

1. **Install Dependencies**:
   ```bash
   cd server
   npm install
   ```

2. **Set Up Environment**:
   ```bash
   node setup-env.js
   ```

3. **Start the Server**:
   ```bash
   npm run dev
   ```

4. **Test Signup**: Try creating a new user through your frontend
