# ScopeIQ Wizard - Deployment Checklist

## Pre-Deployment
- [ ] Choose email provider (Gmail/SendGrid/Mailgun)
- [ ] Get SMTP credentials
- [ ] Test SMTP credentials locally
- [ ] Review production domain in scopeiq-results.js

## Netlify Setup
- [ ] Connect GitHub repository to Netlify
- [ ] Set build command: `echo 'ScopeIQ Wizard deployed'`
- [ ] Set publish directory: `.`
- [ ] Add environment variables from .env.template
- [ ] Enable Netlify Functions

## Environment Variables (Required)
- [ ] SMTP_HOST
- [ ] SMTP_PORT
- [ ] SMTP_USER
- [ ] SMTP_PASS
- [ ] SMTP_FROM
- [ ] ADMIN_EMAIL
- [ ] REPLY_TO

## Post-Deployment Testing
- [ ] Visit live site
- [ ] Complete full assessment
- [ ] Verify admin email received
- [ ] Verify user confirmation email received
- [ ] Check email deliverability (not in spam)
- [ ] Test on mobile devices
- [ ] Test form validation

## Optional Enhancements
- [ ] Set up custom domain
- [ ] Configure SPF/DKIM records
- [ ] Add Google Analytics
- [ ] Set up monitoring/alerts
- [ ] Integrate with CRM

## Troubleshooting
If emails aren't working:
1. Check Netlify function logs
2. Verify environment variables
3. Test SMTP credentials
4. Check email provider quotas
5. Review spam folders

## Support
- Netlify Docs: https://docs.netlify.com/functions/overview/
- Email Provider Documentation
- Check PRODUCTION_SETUP.md for detailed instructions
