
// Google Apps Script for ScopeIQ Email Automation
// This script processes form submissions and sends personalized recommendations

function onFormSubmit(e) {
  try {
    // Get form response data
    const responses = e.response.getItemResponses();
    const email = extractEmailFromResponses(responses);
    const assessmentData = processAssessmentResponses(responses);

    // Calculate recommendation
    const recommendation = calculateRecommendation(assessmentData);

    // Send personalized email
    sendRecommendationEmail(email, recommendation, assessmentData);

    // Log to spreadsheet for tracking
    logAssessmentData(email, assessmentData, recommendation);

  } catch (error) {
    console.error('Error in onFormSubmit:', error);
    // Send error notification to admin
    MailApp.sendEmail({
      to: 'me@luis-gilberto.com', // Replace with actual admin email
      subject: 'ScopeIQ Error Alert',
      body: `Error processing assessment: ${error.toString()}`
    });
  }
}

function extractEmailFromResponses(responses) {
  // Find email response (assuming it's the last question)
  for (let response of responses) {
    const answer = response.getResponse();
    if (answer && answer.includes('@')) {
      return answer;
    }
  }
  return null;
}

function processAssessmentResponses(responses) {
  const assessmentData = {};

  // Map form responses to assessment data
  responses.forEach((response, index) => {
    const question = response.getItem().getTitle();
    const answer = response.getResponse();

    // Map questions to response values
    if (question.includes('primary business objective')) {
      assessmentData.objective = mapObjectiveResponse(answer);
    } else if (question.includes('timeline')) {
      assessmentData.timeline = mapTimelineResponse(answer);
    } else if (question.includes('budget')) {
      assessmentData.budget = mapBudgetResponse(answer);
    } else if (question.includes('team structure')) {
      assessmentData.team = mapTeamResponse(answer);
    } else if (question.includes('challenge')) {
      assessmentData.challenge = mapChallengeResponse(answer);
    } else if (question.includes('creative')) {
      assessmentData.creative = mapCreativeResponse(answer);
    }
  });

  return assessmentData;
}

function mapObjectiveResponse(answer) {
  if (answer.includes('Launch')) return 'launch';
  if (answer.includes('Scale')) return 'scale';
  if (answer.includes('Enter')) return 'expand';
  if (answer.includes('Optimize')) return 'optimize';
  return 'launch'; // default
}

function mapTimelineResponse(answer) {
  if (answer.includes('2-4 weeks')) return 'immediate';
  if (answer.includes('1-3 months')) return 'short';
  if (answer.includes('3-6 months')) return 'medium';
  if (answer.includes('6-12')) return 'long';
  return 'medium'; // default
}

function mapBudgetResponse(answer) {
  if (answer.includes('Under $5K')) return 'low';
  if (answer.includes('$5K - $15K')) return 'medium';
  if (answer.includes('$15K - $50K')) return 'high';
  if (answer.includes('$50K+')) return 'enterprise';
  return 'medium'; // default
}

function mapTeamResponse(answer) {
  if (answer.includes('Just me')) return 'solo';
  if (answer.includes('Small team')) return 'small';
  if (answer.includes('Established')) return 'established';
  if (answer.includes('Large')) return 'large';
  return 'small'; // default
}

function mapChallengeResponse(answer) {
  if (answer.includes('Getting started')) return 'direction';
  if (answer.includes('Inconsistent')) return 'scaling';
  if (answer.includes('Too complex')) return 'complexity';
  if (answer.includes('Leadership')) return 'leadership';
  return 'direction'; // default
}

function mapCreativeResponse(answer) {
  if (answer.includes('Not a priority')) return 'not_priority';
  if (answer.includes('Somewhat')) return 'somewhat';
  if (answer.includes('Very important')) return 'important';
  if (answer.includes('Critical')) return 'critical';
  return 'somewhat'; // default
}

function calculateRecommendation(assessmentData) {
  // Scoring weights for each scope
  const weights = {
    quickstart: {
      launch: 3, scale: 2, expand: 1, optimize: 4,
      immediate: 5, short: 3, medium: 1, long: 0,
      low: 5, medium: 2, high: 1, enterprise: 0,
      solo: 4, small: 3, established: 1, large: 0,
      direction: 5, scaling: 2, complexity: 1, leadership: 1,
      not_priority: 3, somewhat: 3, important: 2, critical: 1
    },
    launch: {
      launch: 5, scale: 2, expand: 4, optimize: 1,
      immediate: 2, short: 5, medium: 3, long: 1,
      low: 3, medium: 5, high: 2, enterprise: 1,
      solo: 3, small: 5, established: 2, large: 1,
      direction: 4, scaling: 3, complexity: 2, leadership: 2,
      not_priority: 2, somewhat: 4, important: 5, critical: 4
    },
    fractional: {
      launch: 2, scale: 4, expand: 3, optimize: 5,
      immediate: 1, short: 3, medium: 5, long: 2,
      low: 2, medium: 4, high: 3, enterprise: 1,
      solo: 2, small: 4, established: 3, large: 2,
      direction: 2, scaling: 5, complexity: 3, leadership: 4,
      not_priority: 4, somewhat: 3, important: 3, critical: 2
    },
    growth: {
      launch: 1, scale: 5, expand: 4, optimize: 3,
      immediate: 0, short: 1, medium: 4, long: 5,
      low: 1, medium: 3, high: 5, enterprise: 3,
      solo: 1, small: 3, established: 5, large: 3,
      direction: 1, scaling: 4, complexity: 4, leadership: 3,
      not_priority: 3, somewhat: 4, important: 5, critical: 4
    },
    enterprise: {
      launch: 1, scale: 3, expand: 5, optimize: 2,
      immediate: 0, short: 1, medium: 2, long: 5,
      low: 0, medium: 1, high: 4, enterprise: 5,
      solo: 0, small: 1, established: 4, large: 5,
      direction: 1, scaling: 2, complexity: 5, leadership: 4,
      not_priority: 2, somewhat: 3, important: 4, critical: 5
    },
    founder: {
      launch: 2, scale: 3, expand: 2, optimize: 4,
      immediate: 1, short: 2, medium: 4, long: 5,
      low: 3, medium: 4, high: 3, enterprise: 2,
      solo: 5, small: 3, established: 2, large: 1,
      direction: 4, scaling: 3, complexity: 2, leadership: 5,
      not_priority: 3, somewhat: 3, important: 3, critical: 2
    }
  };

  // Calculate scores
  const scores = {};
  Object.keys(weights).forEach(scope => {
    scores[scope] = 0;
    Object.keys(assessmentData).forEach(dimension => {
      const value = assessmentData[dimension];
      if (weights[scope][value]) {
        scores[scope] += weights[scope][value];
      }
    });
  });

  // Find highest scoring scope
  let topScope = 'quickstart';
  let highestScore = scores.quickstart;

  Object.keys(scores).forEach(scope => {
    if (scores[scope] > highestScore) {
      highestScore = scores[scope];
      topScope = scope;
    }
  });

  return {
    primaryScope: topScope,
    scores: scores,
    showPartnership: assessmentData.creative === 'important' || assessmentData.creative === 'critical'
  };
}

function sendRecommendationEmail(email, recommendation, assessmentData) {
  const scopeData = getScopeData(recommendation.primaryScope);
  const template = getEmailTemplate(recommendation.primaryScope);

  // Personalize email content
  let htmlBody = template.html;
  let textBody = template.text;

  // Add partnership message if needed
  if (recommendation.showPartnership) {
    const partnershipHtml = `
      <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #ffc107;">
        <h4 style="color: #856404; margin-top: 0;">🎨 Enhanced Creative Partnership Available</h4>
        <p style="color: #856404;">Based on your assessment, I can connect you with <strong>Michael from 100% Creative</strong> for integrated strategy-creative execution. As your Strategic Creative Liaison, I'll ensure seamless coordination between business strategy and creative excellence.</p>
      </div>
    `;
    htmlBody = htmlBody.replace('</div>', partnershipHtml + '</div>');

    textBody += `

ENHANCED CREATIVE PARTNERSHIP AVAILABLE:
Based on your assessment, I can connect you with Michael from 100% Creative for integrated strategy-creative execution. As your Strategic Creative Liaison, I'll ensure seamless coordination between business strategy and creative excellence.
`;
  }

  // Send email
  MailApp.sendEmail({
    to: email,
    subject: template.subject,
    htmlBody: htmlBody,
    body: textBody,
    name: 'Luis Gilberto - Strategic Marketing Intelligence'
  });
}

function getScopeData(scope) {
  const scopes = {
    quickstart: {
      name: 'Quick-Start Sprint',
      price: '$2,000',
      timeline: '2-4 weeks',
      description: 'Rapid marketing foundation setup with immediate actionable strategies'
    },
    launch: {
      name: 'Launch Campaign',
      price: '$5,000-$8,000',
      timeline: '4-6 weeks',
      description: 'Comprehensive go-to-market strategy for new products, services, or market entry'
    },
    fractional: {
      name: 'Fractional Leadership',
      price: '$8,000-$12,000',
      timeline: '3-6 months',
      description: 'Part-time strategic marketing leadership for growing organizations'
    },
    growth: {
      name: 'Growth Partnership',
      price: '$12,000-$18,000',
      timeline: '6-12 months',
      description: 'Long-term strategic partnership focused on sustainable, scalable growth'
    },
    enterprise: {
      name: 'Enterprise Consulting',
      price: '$18,000-$25,000+',
      timeline: '6+ months',
      description: 'Complex, multi-faceted marketing transformation for established organizations'
    },
    founder: {
      name: 'Founder\'s Ally',
      price: '$15,000-$20,000',
      timeline: 'Ongoing partnership',
      description: 'Dedicated strategic advisor for founders navigating growth and marketing challenges'
    }
  };

  return scopes[scope];
}

function getEmailTemplate(scope) {
  const templates = {
    quickstart: {
      subject: 'Your Quick-Start Sprint Marketing Plan | ScopeIQ Results',
      html: `<div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 40px; text-align: center; color: white;">
          <h1 style="color: #00d4ff;">Your Marketing Quick-Start Sprint</h1>
          <p>Personalized ScopeIQ Assessment Results</p>
        </div>
        <div style="padding: 30px; background: #f8f9fa;">
          <h2>Ready to Launch Your Marketing Foundation?</h2>
          <div style="background: white; padding: 25px; border-radius: 8px; border-left: 4px solid #00d4ff;">
            <h3 style="color: #00d4ff;">Quick-Start Sprint - $2,000 | 2-4 Weeks</h3>
            <p>Rapid marketing foundation setup with immediate actionable strategies.</p>
            <h4>What You'll Get:</h4>
            <ul>
              <li>Strategic audit & opportunity identification</li>
              <li>Quick-win marketing tactics</li>
              <li>Essential systems setup</li>
              <li>90-day action roadmap</li>
            </ul>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="mailto:me@luis-gilberto.com?subject=Strategy Session Request&body=Hi Luis,%0A%0AI'd like to book a strategy session to discuss my ScopeIQ assessment results.%0A%0ABest regards" style="background: linear-gradient(135deg, #00d4ff 0%, #00a8cc 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px;">Book Your Strategy Session</a>
          </div>
        </div>
      </div>`,
      text: `Your ScopeIQ Assessment Results: Quick-Start Sprint

Based on your assessment, I recommend the Quick-Start Sprint engagement.

QUICK-START SPRINT - $2,000 | 2-4 WEEKS
• Strategic audit & opportunity identification
• Quick-win marketing tactics
• Essential systems setup  
• 90-day action roadmap

Book your strategy session: me@luis-gilberto.com

Best regards,
Luis Gilberto`
    }
    // Add other scope templates here...
  };

  return templates[scope] || templates.quickstart;
}

function logAssessmentData(email, assessmentData, recommendation) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Assessment Data') || 
                SpreadsheetApp.getActiveSpreadsheet().insertSheet('Assessment Data');

  // Add headers if first row
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Timestamp', 'Email', 'Objective', 'Timeline', 'Budget', 'Team', 
      'Challenge', 'Creative', 'Recommendation', 'Scores'
    ]);
  }

  // Add data
  sheet.appendRow([
    new Date(),
    email,
    assessmentData.objective,
    assessmentData.timeline,
    assessmentData.budget,
    assessmentData.team,
    assessmentData.challenge,
    assessmentData.creative,
    recommendation.primaryScope,
    JSON.stringify(recommendation.scores)
  ]);
}

// Test function for development
function testEmailSystem() {
  const testData = {
    objective: 'launch',
    timeline: 'short',
    budget: 'medium',
    team: 'small',
    challenge: 'direction',
    creative: 'important'
  };

  const recommendation = calculateRecommendation(testData);
  console.log('Test recommendation:', recommendation);

  // Uncomment to test actual email sending
  // sendRecommendationEmail('test@example.com', recommendation, testData);
}
