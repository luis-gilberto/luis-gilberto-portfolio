# ScopeIQ Wizard

A comprehensive marketing assessment tool that provides personalized recommendations based on business needs and goals.

## 🚀 Quick Start

### Local Development (Testing Only)
```bash
# Start local backend for testing
node local-backend.js

# Start frontend server (in another terminal)
python -m http.server 8082

# Visit: http://localhost:8082/IMCServices/scopeiq-wizard/
```

### Production Deployment
```bash
# Generate production files
node deploy-to-production.js

# Follow the deployment checklist
# See DEPLOYMENT_CHECKLIST.md
```

## 📁 Project Structure

```
scopeiq-wizard/
├── index.html                 # Main wizard interface
├── local-backend.js          # Local testing server
├── deploy-to-production.js    # Production setup helper
├── PRODUCTION_SETUP.md       # Detailed deployment guide
├── DEPLOYMENT_CHECKLIST.md   # Step-by-step checklist
├── .env.template             # Environment variables template
├── netlify.toml              # Netlify configuration
├── index-production.html     # Production-optimized version
└── submissions.json          # Local test data (auto-generated)
```

## 🔄 Development vs Production

### Local Development
- **Purpose**: Testing and development
- **Backend**: Node.js server (port 3001)
- **Data Storage**: Local JSON file
- **Email**: Console logging only
- **Scalability**: Not scalable (requires your computer)

### Production Deployment
- **Purpose**: Live website for real users
- **Backend**: Netlify Functions (serverless)
- **Data Storage**: Email notifications
- **Email**: Real SMTP email delivery
- **Scalability**: Fully scalable, works 24/7

## ⚙️ Features

### Assessment Logic
- **7 Strategic Questions**: Business stage, team size, timeline, budget, etc.
- **Scoring System**: Weighted responses determine recommendations
- **4 Service Tiers**: From consultation to full partnership
- **Personalized Results**: Tailored recommendations with pricing

### Email Notifications
- **Admin Alerts**: Detailed lead information and assessment results
- **User Confirmations**: Personalized recommendations and next steps
- **Professional Templates**: Branded email design

### Technical Features
- **Responsive Design**: Works on all devices
- **Form Validation**: Real-time input validation
- **Progress Tracking**: Visual progress indicator
- **Error Handling**: Graceful error management
- **CORS Support**: Cross-origin request handling

## 🛠️ Configuration

### Required Environment Variables
```bash
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Email Settings
SMTP_FROM=your-email@gmail.com
ADMIN_EMAIL=admin@luis-gilberto.com
REPLY_TO=hello@luis-gilberto.com
```

### Supported Email Providers
- **Gmail**: Free, 500 emails/day
- **SendGrid**: Free tier, 100 emails/day
- **Mailgun**: Free tier, 5,000 emails/month

## 📊 Assessment Recommendations

### 1. Strategic Consultation (Score: 0-25)
- **Duration**: 2-4 weeks
- **Price**: $2,500 - $5,000
- **Best For**: Early-stage businesses

### 2. Focused Campaign (Score: 26-50)
- **Duration**: 1-3 months
- **Price**: $5,000 - $15,000
- **Best For**: Specific marketing needs

### 3. Growth Partnership (Score: 51-75)
- **Duration**: 3-6 months
- **Price**: $10,000 - $25,000
- **Best For**: Scaling businesses

### 4. Strategic Partnership (Score: 76-100)
- **Duration**: 6+ months
- **Price**: $15,000+
- **Best For**: Established companies

## 🚀 Deployment Options

### Option 1: Netlify (Recommended)
1. Connect GitHub repository
2. Configure environment variables
3. Deploy automatically

### Option 2: Manual Deployment
1. Generate production files
2. Upload to hosting provider
3. Configure serverless functions

## 📈 Analytics & Monitoring

### Built-in Tracking
- Form completion rates
- Assessment results distribution
- Email delivery status
- Error logging

### Integration Options
- Google Analytics
- HubSpot CRM
- Zapier automation
- Custom webhooks

## 🔒 Security Features

- **Input Validation**: Server-side validation
- **CORS Protection**: Domain-restricted access
- **Environment Variables**: Secure credential storage
- **Rate Limiting**: Prevents spam submissions

## 📞 Support

### Documentation
- `PRODUCTION_SETUP.md` - Detailed deployment guide
- `DEPLOYMENT_CHECKLIST.md` - Step-by-step checklist
- `.env.template` - Environment configuration

### Troubleshooting
1. Check Netlify function logs
2. Verify environment variables
3. Test SMTP credentials
4. Review email provider quotas

## 🎯 Next Steps

1. **For Testing**: Use the local backend setup
2. **For Production**: Follow the production deployment guide
3. **For Scaling**: Consider database integration and CRM connections

---

**Ready to deploy?** Start with `PRODUCTION_SETUP.md` for detailed instructions.