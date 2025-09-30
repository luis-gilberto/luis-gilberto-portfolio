#!/usr/bin/env node

// ScopeIQ Wizard - Production Deployment Helper
// This script helps prepare the wizard for production deployment

const fs = require('fs');
const path = require('path');

const CONFIG = {
  productionDomain: 'https://luis-gilberto.com',
  testEmail: 'admin@luis-gilberto.com',
  replyTo: 'hello@luis-gilberto.com'
};

function createProductionIndex() {
  const indexPath = path.join(__dirname, 'index.html');
  let content = fs.readFileSync(indexPath, 'utf8');
  
  // Remove local backend detection for production
  const localBackendCode = `        // Use local backend for testing, Netlify function for production
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const endpoint = isLocal ? 'http://localhost:3001/.netlify/functions/scopeiq-results' : '/.netlify/functions/scopeiq-results';
        
        const response = await fetch(endpoint, {`;
  
  const productionCode = `        const response = await fetch('/.netlify/functions/scopeiq-results', {`;
  
  content = content.replace(localBackendCode, productionCode);
  
  // Create production version
  const prodPath = path.join(__dirname, 'index-production.html');
  fs.writeFileSync(prodPath, content);
  
  console.log('✅ Created index-production.html (optimized for production)');
  return prodPath;
}

function createNetlifyConfig() {
  const netlifyConfig = `# Netlify configuration for ScopeIQ Wizard

[build]
  publish = "."
  command = "echo 'ScopeIQ Wizard deployed successfully'"

[functions]
  directory = "netlify/functions"
  node_bundler = "esbuild"

[build.environment]
  NODE_VERSION = "18.20.4"

# Redirect for ScopeIQ wizard
[[redirects]]
  from = "/scopeiq"
  to = "/IMCServices/scopeiq-wizard/"
  status = 200

[[redirects]]
  from = "/scopeiq/*"
  to = "/IMCServices/scopeiq-wizard/:splat"
  status = 200

# Headers for security
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"
`;

  const configPath = path.join(__dirname, 'netlify.toml');
  fs.writeFileSync(configPath, netlifyConfig);
  
  console.log('✅ Created netlify.toml configuration');
  return configPath;
}

function createEnvironmentTemplate() {
  const envTemplate = `# ScopeIQ Wizard - Environment Variables Template
# Copy these to your Netlify site settings > Environment variables

# SMTP Configuration (Choose one provider)

# Option 1: Gmail SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password

# Option 2: SendGrid SMTP
# SMTP_HOST=smtp.sendgrid.net
# SMTP_PORT=587
# SMTP_USER=apikey
# SMTP_PASS=your-sendgrid-api-key

# Option 3: Mailgun SMTP
# SMTP_HOST=smtp.mailgun.org
# SMTP_PORT=587
# SMTP_USER=your-mailgun-username
# SMTP_PASS=your-mailgun-password

# Email Configuration
SMTP_FROM=your-email@gmail.com
ADMIN_EMAIL=${CONFIG.testEmail}
REPLY_TO=${CONFIG.replyTo}

# Instructions:
# 1. Choose one SMTP provider above
# 2. Replace placeholder values with your actual credentials
# 3. Add these variables to Netlify: Site Settings > Environment Variables
# 4. Deploy your site
# 5. Test the wizard to ensure emails are working
`;

  const envPath = path.join(__dirname, '.env.template');
  fs.writeFileSync(envPath, envTemplate);
  
  console.log('✅ Created .env.template with environment variables');
  return envPath;
}

function createDeploymentChecklist() {
  const checklist = `# ScopeIQ Wizard - Deployment Checklist

## Pre-Deployment
- [ ] Choose email provider (Gmail/SendGrid/Mailgun)
- [ ] Get SMTP credentials
- [ ] Test SMTP credentials locally
- [ ] Review production domain in scopeiq-results.js

## Netlify Setup
- [ ] Connect GitHub repository to Netlify
- [ ] Set build command: \`echo 'ScopeIQ Wizard deployed'\`
- [ ] Set publish directory: \`.\`
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
`;

  const checklistPath = path.join(__dirname, 'DEPLOYMENT_CHECKLIST.md');
  fs.writeFileSync(checklistPath, checklist);
  
  console.log('✅ Created DEPLOYMENT_CHECKLIST.md');
  return checklistPath;
}

function validateNetlifyFunction() {
  const functionPath = path.join(__dirname, '..', '..', 'netlify', 'functions', 'scopeiq-results.js');
  
  if (!fs.existsSync(functionPath)) {
    console.log('❌ Netlify function not found at:', functionPath);
    return false;
  }
  
  const content = fs.readFileSync(functionPath, 'utf8');
  
  // Check for required environment variables
  const requiredVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM', 'ADMIN_EMAIL'];
  const missingVars = requiredVars.filter(varName => !content.includes(varName));
  
  if (missingVars.length > 0) {
    console.log('❌ Missing environment variables in function:', missingVars.join(', '));
    return false;
  }
  
  console.log('✅ Netlify function validated');
  return true;
}

function main() {
  console.log('🚀 ScopeIQ Wizard - Production Deployment Helper\n');
  
  try {
    // Validate existing setup
    console.log('📋 Validating current setup...');
    validateNetlifyFunction();
    
    // Create production files
    console.log('\n📦 Creating production files...');
    createProductionIndex();
    createNetlifyConfig();
    createEnvironmentTemplate();
    createDeploymentChecklist();
    
    console.log('\n🎉 Production setup complete!');
    console.log('\n📋 Next steps:');
    console.log('1. Review PRODUCTION_SETUP.md for detailed instructions');
    console.log('2. Follow DEPLOYMENT_CHECKLIST.md step by step');
    console.log('3. Configure environment variables from .env.template');
    console.log('4. Deploy to Netlify');
    console.log('5. Test the live wizard');
    
    console.log('\n🔗 Useful links:');
    console.log('- Netlify Dashboard: https://app.netlify.com/');
    console.log('- Gmail App Passwords: https://myaccount.google.com/apppasswords');
    console.log('- SendGrid: https://sendgrid.com/');
    
  } catch (error) {
    console.error('❌ Error during setup:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { createProductionIndex, createNetlifyConfig, createEnvironmentTemplate };