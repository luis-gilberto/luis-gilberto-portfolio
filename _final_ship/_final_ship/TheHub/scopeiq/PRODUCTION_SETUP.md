# ScopeIQ Wizard - Production Setup Guide

## Overview
This guide explains how to deploy the ScopeIQ wizard to production with proper email functionality using Netlify Functions and SMTP email service.

## Current Setup

### Local Development
- **Frontend**: Served via Python HTTP server on port 8082
- **Backend**: Local Node.js server on port 3001 (for testing only)
- **Data Storage**: Local `submissions.json` file

### Production Architecture
- **Frontend**: Hosted on Netlify CDN
- **Backend**: Netlify Functions (serverless)
- **Email Service**: SMTP provider (Gmail, SendGrid, etc.)
- **Data Storage**: Email notifications to admin

## Production Deployment Steps

### 1. Choose an Email Service Provider

Recommended options:

#### Option A: Gmail SMTP (Easiest)
- **Cost**: Free
- **Setup**: Use your existing Gmail account
- **Limitations**: 500 emails/day

#### Option B: SendGrid (Recommended)
- **Cost**: Free tier (100 emails/day)
- **Setup**: Professional email service
- **Benefits**: Better deliverability, analytics

#### Option C: Mailgun
- **Cost**: Free tier (5,000 emails/month)
- **Setup**: Developer-friendly
- **Benefits**: High deliverability

### 2. Get SMTP Credentials

#### For Gmail:
1. Enable 2-factor authentication on your Google account
2. Generate an "App Password" for your application
3. Use these credentials:
   - **Host**: `smtp.gmail.com`
   - **Port**: `587`
   - **Username**: Your Gmail address
   - **Password**: The generated app password

#### For SendGrid:
1. Sign up at sendgrid.com
2. Create an API key
3. Use these credentials:
   - **Host**: `smtp.sendgrid.net`
   - **Port**: `587`
   - **Username**: `apikey`
   - **Password**: Your SendGrid API key

### 3. Configure Netlify Environment Variables

1. Go to your Netlify dashboard
2. Select your site
3. Go to **Site settings** → **Environment variables**
4. Add these variables:

```bash
# SMTP Configuration
SMTP_HOST=smtp.gmail.com          # or smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=your-email@gmail.com     # or "apikey" for SendGrid
SMTP_PASS=your-app-password        # or SendGrid API key

# Email Addresses
SMTP_FROM=your-email@gmail.com     # Sender email
ADMIN_EMAIL=admin@luis-gilberto.com # Where to receive notifications
REPLY_TO=hello@luis-gilberto.com   # Reply-to address
```

### 4. Update Domain Configuration

In `netlify/functions/scopeiq-results.js`, the allowed origins are:
```javascript
const ALLOWED_ORIGINS = ["https://luis-gilberto.com", "https://www.luis-gilberto.com"];
```

Make sure your production domain is included in this list.

### 5. Deploy to Netlify

#### Option A: Git Integration (Recommended)
1. Push your code to GitHub/GitLab
2. Connect your repository to Netlify
3. Netlify will automatically deploy on every push

#### Option B: Manual Deploy
1. Build your project locally
2. Drag and drop the build folder to Netlify

### 6. Test Production Deployment

1. Visit your live site
2. Complete the ScopeIQ assessment
3. Check that you receive:
   - Admin notification email
   - User confirmation email

## Email Templates

### Admin Notification
- **Subject**: `ScopeIQ Lead: [Name] ([Company]) - [Recommendation]`
- **Content**: Complete assessment data, recommendation logic, next steps

### User Confirmation
- **Subject**: `Your ScopeIQ Recommendation: [Recommendation] for [Company]`
- **Content**: Personalized recommendation, benefits, next steps

## Monitoring and Analytics

### Netlify Functions Logs
- View function execution logs in Netlify dashboard
- Monitor for errors and performance

### Email Deliverability
- Check spam folders initially
- Monitor bounce rates
- Set up SPF/DKIM records for better deliverability

## Scaling Considerations

### Database Integration (Future)
For higher volume, consider adding:
- **Airtable**: Easy spreadsheet-like database
- **Supabase**: PostgreSQL with real-time features
- **Firebase**: Google's real-time database

### CRM Integration
- **HubSpot**: Marketing automation
- **Pipedrive**: Sales pipeline management
- **Zapier**: Connect to 3000+ apps

## Security Best Practices

1. **Environment Variables**: Never commit SMTP credentials to code
2. **CORS**: Restrict origins to your domain only
3. **Rate Limiting**: Consider adding rate limiting for form submissions
4. **Input Validation**: Validate all form inputs server-side

## Troubleshooting

### Common Issues

#### "Server not configured" Error
- Check that all environment variables are set in Netlify
- Verify variable names match exactly

#### Emails Not Sending
- Check SMTP credentials
- Verify email provider settings
- Check Netlify function logs

#### CORS Errors
- Ensure your domain is in ALLOWED_ORIGINS
- Check that the function is deployed

### Debug Steps
1. Check Netlify function logs
2. Test SMTP credentials separately
3. Verify environment variables
4. Check email provider quotas

## Cost Estimation

### Free Tier (Recommended Start)
- **Netlify**: Free (100GB bandwidth, 300 build minutes)
- **Gmail SMTP**: Free (500 emails/day)
- **Total**: $0/month

### Professional Tier
- **Netlify Pro**: $19/month (1TB bandwidth, 1000 build minutes)
- **SendGrid Essentials**: $14.95/month (50,000 emails)
- **Total**: ~$34/month

## Next Steps

1. Choose your email provider
2. Set up SMTP credentials
3. Configure Netlify environment variables
4. Deploy and test
5. Monitor email delivery
6. Consider database integration for lead management

This setup provides a scalable, professional solution that works 24/7 without requiring your computer to be online.