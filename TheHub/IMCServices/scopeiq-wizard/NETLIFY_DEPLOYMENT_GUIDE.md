# Netlify Deployment Guide for ScopeIQ Wizard

This guide implements ChatGPT's recommended 5-step checklist for deploying the ScopeIQ Wizard with Netlify Functions.

## ✅ Pre-Deployment Checklist

### 1. Netlify Configuration ✅
- `netlify.toml` is properly configured with functions directory
- Functions bundler set to `esbuild`

### 2. Dependencies ✅
- `nodemailer@^6.9.0` is included in `package.json`
- All required dependencies are available

### 3. Environment Variables Setup
Configure these in your Netlify dashboard (Site Settings > Environment Variables):

```
SMTP_HOST=smtp.titan.email
SMTP_PORT=587
SMTP_USER=admin@luis-gilberto.com
SMTP_PASS=<your_admin_password>
SMTP_FROM=admin@luis-gilberto.com
ADMIN_EMAIL=me@luis-gilberto.com
REPLY_TO=hello@luis-gilberto.com
```

### 4. Frontend Configuration ✅
- Frontend updated to use absolute Netlify Function URL
- Local development still uses `localhost:3001` backend

### 5. Function Deployment
- Function exists at `netlify/functions/scopeiq-results.js`
- Ready for deployment

## 🚀 Deployment Steps

### Step 1: Create Netlify Site
1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Click "Add new site" > "Import an existing project"
3. Connect your Git repository
4. Set build settings:
   - Build command: `ls -la && echo 'Force rebuild - Forms enabled and comment form fixed - $(date)'`
   - Publish directory: `.` (root)

### Step 2: Configure Environment Variables
1. In Netlify dashboard, go to Site Settings > Environment Variables
2. Add all variables from the checklist above
3. **Important**: Replace `<your_admin_password>` with actual password

### Step 3: Update Frontend URL
1. Note your Netlify site URL (e.g., `https://amazing-site-123.netlify.app`)
2. In `index.html`, replace `YOUR-NETLIFY-SITE` with your actual subdomain:
   ```javascript
   const endpoint = isLocal ? 'http://localhost:3001/.netlify/functions/scopeiq-results' : 'https://amazing-site-123.netlify.app/.netlify/functions/scopeiq-results';
   ```

### Step 4: Deploy
1. Commit and push your changes
2. Netlify will automatically deploy
3. Check the Functions tab in Netlify dashboard
4. Verify `scopeiq-results` function appears

### Step 5: Test
1. Visit your live site
2. Complete the ScopeIQ wizard
3. Check that emails are sent to both admin and user
4. Monitor function logs in Netlify dashboard

## 🔧 Troubleshooting

### Function Not Appearing
- Check `netlify.toml` functions directory setting
- Ensure `netlify/functions/scopeiq-results.js` exists
- Redeploy the site

### Email Not Sending
- Verify all environment variables are set correctly
- Check function logs in Netlify dashboard
- Test SMTP credentials with Titan Email

### CORS Issues
- Function already includes proper CORS headers
- Ensure you're using the absolute Netlify URL in production

## 📋 Current Architecture

- **Frontend**: Cloudflare Pages (existing)
- **Backend**: Netlify Functions
- **Email**: Titan SMTP (admin@luis-gilberto.com)
- **Local Development**: Node.js backend on port 3001

## 🎯 Next Steps

1. Deploy to Netlify following steps above
2. Test the live wizard thoroughly
3. Monitor email delivery
4. Consider adding analytics/tracking
5. Set up monitoring for function errors

---

**Note**: This setup allows your frontend to stay on Cloudflare Pages while using Netlify's serverless functions for email processing. The absolute URL approach ensures cross-platform compatibility.