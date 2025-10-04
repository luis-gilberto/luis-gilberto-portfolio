# ScopeIQ Wizard - Complete Export Documentation

**Generated:** December 19, 2024  
**Purpose:** Comprehensive export for engineering team to make critical changes to accurately represent services

## Table of Contents
1. [System Overview](#system-overview)
2. [Assessment Logic & Scoring](#assessment-logic--scoring)
3. [Recommendation Engine](#recommendation-engine)
4. [Configuration Files](#configuration-files)
5. [Backend Implementation](#backend-implementation)
6. [Deployment Architecture](#deployment-architecture)
7. [File Structure](#file-structure)
8. [Critical Areas for Engineering Review](#critical-areas-for-engineering-review)

---

## System Overview

The ScopeIQ Wizard is a comprehensive marketing assessment tool that provides personalized recommendations based on business needs and goals. It consists of:

- **Frontend**: Single-page application with 8-question assessment
- **Backend**: Netlify Functions for production, Node.js for local development
- **Email System**: SMTP-based notifications to admin and user
- **Scoring Algorithm**: Weighted scoring system with conditional logic
- **Recommendation Engine**: Multi-factor decision tree

### Current Architecture
- **Local Development**: Python HTTP server (port 8082) + Node.js backend (port 3001)
- **Production**: Netlify CDN + Netlify Functions + SMTP email service

---

## Assessment Logic & Scoring

### Question Configuration

The assessment consists of 8 weighted questions stored in the `questions` array:

```javascript
const questions = [
  {
    id: 1,
    title: "What stage is your business currently in?",
    subtitle: "This helps us understand your foundational needs and growth trajectory.",
    options: [
      { text: "Pre-launch or idea stage", value: 1 },
      { text: "Just launched (0-6 months)", value: 2 },
      { text: "Early growth (6 months - 2 years)", value: 3 },
      { text: "Established business (2+ years)", value: 4 },
      { text: "Scaling/expanding rapidly", value: 5 }
    ]
  },
  {
    id: 2,
    title: "What's your primary business objective for the next 12 months?",
    subtitle: "Understanding your goals helps us recommend the right strategic approach.",
    options: [
      { text: "Launch a new product or service", value: 15 },
      { text: "Increase brand awareness and visibility", value: 12 },
      { text: "Generate more qualified leads", value: 18 },
      { text: "Improve conversion rates and sales", value: 20 },
      { text: "Expand into new markets or segments", value: 25 }
    ]
  },
  {
    id: 3,
    title: "What's your ideal timeline for seeing results?",
    subtitle: "Different strategies work better for different timeframes.",
    options: [
      { text: "I need results immediately (1-3 months)", value: 5 },
      { text: "Quick wins are important (3-6 months)", value: 10 },
      { text: "Steady growth over time (6-12 months)", value: 15 },
      { text: "Long-term strategic building (12+ months)", value: 20 },
      { text: "I'm flexible on timing", value: 12 }
    ]
  },
  {
    id: 4,
    title: "What's your approximate monthly marketing budget?",
    subtitle: "This helps us recommend solutions that fit your investment capacity.",
    options: [
      { text: "Under $1,000/month", value: 1 },
      { text: "$1,000 - $5,000/month", value: 3 },
      { text: "$5,000 - $15,000/month", value: 5 },
      { text: "$15,000 - $50,000/month", value: 7 },
      { text: "$50,000+/month", value: 10 }
    ]
  },
  {
    id: 5,
    title: "How large is your current team?",
    subtitle: "Team size affects the type of support and collaboration model that works best.",
    options: [
      { text: "Just me (solo founder/entrepreneur)", value: 1 },
      { text: "2-5 people", value: 3 },
      { text: "6-15 people", value: 5 },
      { text: "16-50 people", value: 7 },
      { text: "50+ people", value: 10 }
    ]
  },
  {
    id: 6,
    title: "What's your biggest marketing challenge right now?",
    subtitle: "Understanding your pain points helps us focus on the right solutions.",
    options: [
      { text: "Don't know where to start with marketing", value: 8 },
      { text: "Not generating enough quality leads", value: 15 },
      { text: "Marketing efforts aren't converting to sales", value: 18 },
      { text: "Can't scale marketing efforts effectively", value: 22 },
      { text: "Need strategic direction and planning", value: 12 }
    ]
  },
  {
    id: 7,
    title: "How hands-on do you want to be in the marketing process?",
    subtitle: "This helps us determine the right level of involvement and collaboration.",
    options: [
      { text: "Very hands-on - I want to learn and be involved", value: 8 },
      { text: "Collaborative - guide me but I'll execute", value: 12 },
      { text: "Strategic oversight - check-ins and direction", value: 16 },
      { text: "Hands-off - just deliver results", value: 20 },
      { text: "Flexible based on what works best", value: 14 }
    ]
  },
  {
    id: 8,
    title: "What type of engagement appeals to you most?",
    subtitle: "Different engagement models work better for different business situations.",
    options: [
      { text: "Multi-channel campaigns requiring creative assets", value: 20, creative: true },
      { text: "Brand development with visual identity needs", value: 22, creative: true },
      { text: "Content strategy with design-heavy execution", value: 18, creative: true },
      { text: "Marketing operations with creative workflow management", value: 15, creative: true },
      { text: "Flexible arrangement based on needs", value: 18 }
    ]
  }
];
```

### Scoring System

The scoring system uses:
- **Total Score**: Sum of all answer values
- **Individual Factors**: Specific question values for decision logic
- **Creative Integration**: Boolean flag from question 8
- **Weighted Decisions**: Different thresholds for different recommendations

---

## Recommendation Engine

### Core Algorithm

```javascript
function calculateRecommendation() {
  const totalScore = answers.reduce((sum, answer) => sum + answer.value, 0);
  const businessStage = answers[0]?.value || 1;
  const objective = answers[1]?.value || 10;
  const timeline = answers[2]?.value || 10;
  const budget = answers[3]?.value || 1;
  const teamSize = answers[4]?.value || 1;
  const engagementType = answers[7]?.value || 10;
  
  // Check for creative integration options
  const engagementAnswer = answers.find(a => a.questionId === 8);
  const hasCreativeIntegration = engagementAnswer && engagementAnswer.creative === true;
  const creativeEngagementType = engagementAnswer?.text || '';

  // Decision Logic (Simplified)
  if (timeline <= 5 && (businessStage <= 2 || budget <= 1)) {
    return "Quick-Start Sprint";
  }
  
  if (totalScore >= 80 && budget >= 5 && teamSize >= 3) {
    return "Growth Acceleration Program";
  }
  
  // Default to Strategic Marketing Plan
  return "Strategic Marketing Plan";
}
```

### Recommendation Types

#### 1. Quick-Start Sprint
- **Trigger**: `timeline <= 5 && (businessStage <= 2 || budget <= 1)`
- **Price**: `$8K-$15K` (base) / `$12K-$22K` (with creative)
- **Duration**: `3-4 weeks`
- **Target**: Early-stage businesses with urgent needs

#### 2. Strategic Marketing Plan
- **Trigger**: Default for mid-range scores
- **Price**: `$12K-$25K` (base) / `$18K-$35K` (with creative)
- **Duration**: `6-12 weeks`
- **Target**: Businesses launching new offerings or entering new markets

#### 3. Growth Acceleration Program
- **Trigger**: `totalScore >= 80 && budget >= 5 && teamSize >= 3`
- **Price**: `$25K-$50K` (base) / `$35K-$75K` (with creative)
- **Duration**: `3-6 months`
- **Target**: Scaling businesses with substantial resources

---

## Configuration Files

### Environment Variables (.env.template)

```bash
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
ADMIN_EMAIL=admin@luis-gilberto.com
REPLY_TO=hello@luis-gilberto.com
```

### Netlify Configuration (netlify.toml)

```toml
# Netlify configuration for ScopeIQ Wizard

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
```

---

## Backend Implementation

### Local Development Backend (local-backend.js)

```javascript
// Simple local backend for ScopeIQ wizard testing
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'submissions.json');

// CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
};

const server = http.createServer((req, res) => {
    // Handle POST to scopeiq-results
    if (method === 'POST' && parsedUrl.pathname === '/.netlify/functions/scopeiq-results') {
        // Process submission and save to local JSON file
        // Console logging for development
    }
});
```

### Production Backend (netlify/functions/scopeiq-results.js)

```javascript
const nodemailer = require("nodemailer");

const ALLOWED_ORIGINS = ["https://luis-gilberto.com", "https://www.luis-gilberto.com"];

exports.handler = async (event) => {
  // CORS handling
  // Environment variable validation
  // Email sending logic
  // Recommendation logic generation
  
  const transporter = nodemailer.createTransporter({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });
  
  // Send admin notification and user confirmation emails
};
```

---

## Deployment Architecture

### Development Environment
- **Frontend**: Python HTTP server on port 8082
- **Backend**: Node.js server on port 3001
- **Data Storage**: Local JSON file (`submissions.json`)
- **Email**: Console logging only

### Production Environment
- **Frontend**: Netlify CDN
- **Backend**: Netlify Functions (serverless)
- **Email Service**: SMTP provider (Gmail/SendGrid/Mailgun)
- **Data Storage**: Email notifications to admin

### Deployment Process
1. Run `node deploy-to-production.js` to generate production files
2. Configure environment variables in Netlify
3. Deploy via Git integration
4. Test email functionality

---

## File Structure

```
scopeiq-wizard/
├── index.html                 # Main wizard interface (1,664 lines)
├── index-production.html      # Production-optimized version
├── local-backend.js          # Local testing server (115 lines)
├── deploy-to-production.js    # Production setup helper (247 lines)
├── .env.template             # Environment variables template
├── netlify.toml              # Netlify configuration
├── submissions.json          # Local test data (auto-generated)
├── README.md                 # Project documentation
├── PRODUCTION_SETUP.md       # Detailed deployment guide
├── DEPLOYMENT_CHECKLIST.md   # Step-by-step checklist
└── NETLIFY_DEPLOYMENT_GUIDE.md # Netlify-specific instructions

netlify/functions/
├── package.json              # Dependencies for functions
└── scopeiq-results.js        # Production email handler (109 lines)
```

---

## Critical Areas for Engineering Review

### 1. Service Representation Accuracy

**Current Issue**: The recommendation engine may not accurately represent your actual service offerings.

**Key Areas to Review**:
- **Pricing Ranges**: Lines 1273, 1305, 1337 in `scopeiq-wizard.html`
- **Service Descriptions**: Recommendation objects in `calculateRecommendation()`
- **Benefits Lists**: May not match actual service deliverables
- **Timeline Estimates**: May not reflect real project durations

### 2. Scoring Algorithm Refinement

**Current Logic**: Simple weighted scoring with basic thresholds

**Potential Improvements**:
- More sophisticated decision trees
- Industry-specific considerations
- Budget-to-service matching logic
- Team size impact on service delivery

### 3. Question Optimization

**Current Questions**: 8 questions with predetermined weights

**Areas for Enhancement**:
- Industry/vertical-specific questions
- More nuanced budget categories
- Technical capability assessment
- Urgency vs. quality trade-offs

### 4. Creative Integration Logic

**Current Implementation**: Boolean flag based on question 8

**Enhancement Opportunities**:
- More granular creative service categorization
- Creative complexity assessment
- Resource requirement estimation
- Creative timeline considerations

### 5. Email Content Personalization

**Current System**: Template-based emails with basic personalization

**Improvement Areas**:
- Industry-specific recommendations
- More detailed next steps
- Resource links and case studies
- Follow-up sequence automation

### 6. Data Collection and Analytics

**Current Limitation**: Basic email notifications only

**Enhancement Opportunities**:
- CRM integration
- Analytics tracking
- A/B testing capabilities
- Lead scoring refinement

---

## Technical Implementation Notes

### Frontend Architecture
- Single-page application with vanilla JavaScript
- CSS Grid and Flexbox for responsive design
- Progressive disclosure UI pattern
- Form validation and error handling

### Backend Architecture
- Serverless functions for scalability
- SMTP email delivery
- Environment-based configuration
- CORS handling for security

### Security Considerations
- Environment variable protection
- CORS origin restrictions
- Input validation and sanitization
- Email rate limiting (provider-dependent)

---

## Next Steps for Engineering Team

1. **Service Audit**: Review all pricing, descriptions, and timelines against actual offerings
2. **Algorithm Enhancement**: Refine scoring logic based on real client data
3. **Question Optimization**: Add industry-specific and technical capability questions
4. **Integration Planning**: Consider CRM and analytics integration requirements
5. **Testing Strategy**: Develop comprehensive testing for recommendation accuracy
6. **Performance Monitoring**: Implement tracking for conversion and accuracy metrics

---

**End of Export Documentation**

*This document contains the complete technical specification and implementation details of the ScopeIQ Wizard as of December 19, 2024. All code snippets, configuration files, and architectural decisions are documented for engineering team reference.*