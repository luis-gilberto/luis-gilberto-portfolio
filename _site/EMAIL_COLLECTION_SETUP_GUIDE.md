# ScopeIQ Email Collection Setup Guide

## Overview
This guide will help you set up the complete email collection process for the ScopeIQ wizard, including environment configuration, email service setup, and testing.

## ✅ Completed Steps
- [x] **Frontend Integration**: ScopeIQ wizard now connects to Netlify function
- [x] **Backend Function**: Netlify function ready to handle email submissions
- [x] **CORS Configuration**: Proper cross-origin request handling

## 🔧 Required Setup Steps

### Step 1: Choose an Email Service Provider

You need to set up an email service to send emails. Here are the recommended options:

#### Option A: Gmail (Easiest for testing)
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Save this password securely

**Gmail Settings:**
- SMTP_HOST: `smtp.gmail.com`
- SMTP_PORT: `587`
- SMTP_USER: `your-email@gmail.com`
- SMTP_PASS: `your-app-password`

#### Option B: SendGrid (Recommended for production)
1. Sign up at sendgrid.com
2. Create an API key
3. Verify your sender domain

**SendGrid Settings:**
- SMTP_HOST: `smtp.sendgrid.net`
- SMTP_PORT: `587`
- SMTP_USER: `apikey`
- SMTP_PASS: `your-sendgrid-api-key`

#### Option C: Mailgun
1. Sign up at mailgun.com
2. Add and verify your domain
3. Get SMTP credentials from dashboard

### Step 2: Configure Environment Variables in Netlify

1. **Access Netlify Dashboard:**
   - Go to [netlify.com](https://netlify.com)
   - Navigate to your site dashboard
   - Go to Site settings → Environment variables

2. **Add Required Variables:**
   Click "Add a variable" for each of these:

   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM=your-email@gmail.com
   ADMIN_EMAIL=luis@luis-gilberto.com
   ```

   **Important:** Replace the values with your actual email service credentials.

3. **Deploy Changes:**
   - After adding variables, trigger a new deployment
   - Go to Deploys → Trigger deploy → Deploy site

### Step 3: Install Required Dependencies

The Netlify function needs the `nodemailer` package. Add this to your `package.json`:

```json
{
  "dependencies": {
    "nodemailer": "^6.9.0"
  }
}
```

Or run: `npm install nodemailer`

### Step 4: Test the Email Collection Flow

1. **Deploy Your Changes:**
   ```bash
   git add .
   git commit -m "Set up email collection for ScopeIQ wizard"
   git push origin main
   ```

2. **Test the Wizard:**
   - Visit your ScopeIQ wizard: `https://luis-gilberto.com/IMCServices/scopeiq-wizard/`
   - Complete the assessment
   - Enter a test email address
   - Submit the form
   - Check both your admin email and the test email for messages

3. **Check Netlify Function Logs:**
   - Go to Netlify Dashboard → Functions → scopeiq-results
   - Check the logs for any errors

## 🔍 Troubleshooting

### Common Issues:

1. **"Authentication failed" error:**
   - Double-check your email credentials
   - For Gmail, ensure you're using an App Password, not your regular password
   - Verify 2FA is enabled on your Gmail account

2. **CORS errors:**
   - Already handled in the function code
   - If issues persist, check browser console for specific errors

3. **Function timeout:**
   - Check Netlify function logs
   - Verify email service is responding
   - Consider using a different email provider

4. **Environment variables not working:**
   - Ensure variables are set in Netlify dashboard
   - Trigger a new deployment after adding variables
   - Check variable names match exactly (case-sensitive)

### Testing Commands:

Test the function directly:
```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/scopeiq-results \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "score": 25,
    "recommendation": "Quick-Start Sprint",
    "results": {"test": true}
  }'
```

## 📧 Email Templates

The system sends two types of emails:

1. **Admin Notification**: Sent to `ADMIN_EMAIL` with lead details
2. **User Confirmation**: Sent to the user with their recommendation

Both templates are customizable in the Netlify function code.

## 🔒 Security Notes

- Never commit email credentials to your repository
- Use environment variables for all sensitive data
- Consider using OAuth2 for Gmail instead of App Passwords for production
- Regularly rotate your email service credentials

## 📊 Analytics Integration

The wizard includes analytics tracking hooks:
- `trackWizardCompletion()` function logs successful submissions
- Add your Google Analytics or other tracking code as needed

## 🚀 Next Steps (Optional)

1. **Database Storage**: Add lead storage to a database (Airtable, Notion, etc.)
2. **CRM Integration**: Connect to HubSpot, Salesforce, or similar
3. **Advanced Email Templates**: Use a template service like SendGrid templates
4. **Lead Scoring**: Implement more sophisticated scoring algorithms
5. **Follow-up Automation**: Set up email sequences based on recommendations

## 📞 Support

If you encounter issues:
1. Check the Netlify function logs first
2. Verify all environment variables are set correctly
3. Test with a simple email service like Gmail first
4. Check the browser console for frontend errors

---

**Status**: Frontend integration complete ✅ | Environment setup required ⏳ | Testing pending ⏳