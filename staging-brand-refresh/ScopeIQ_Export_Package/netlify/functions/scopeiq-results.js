// netlify/functions/scopeiq-results.js
const nodemailer = require("nodemailer");

const ALLOWED_ORIGINS = ["https://luis-gilberto.com", "https://www.luis-gilberto.com"];
const cors = (origin, extra = {}) => ({
  "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  ...extra
});

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers: cors(event.headers.origin) };
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: cors(event.headers.origin), body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, ADMIN_EMAIL, REPLY_TO } = process.env;
  const missing = [["SMTP_HOST",SMTP_HOST],["SMTP_PORT",SMTP_PORT],["SMTP_USER",SMTP_USER],["SMTP_PASS",SMTP_PASS],["SMTP_FROM",SMTP_FROM],["ADMIN_EMAIL",ADMIN_EMAIL]]
    .filter(([k,v]) => !v).map(([k]) => k);
  if (missing.length) {
    console.error("Missing env vars:", missing);
    return { statusCode: 500, headers: cors(event.headers.origin), body: JSON.stringify({ error: `Server not configured: ${missing.join(", ")}` }) };
  }

  let payload;
  try { payload = JSON.parse(event.body || "{}"); }
  catch { return { statusCode: 400, headers: cors(event.headers.origin), body: JSON.stringify({ error: "Invalid JSON" }) }; }

  const { name, email, company, answers, recommendation, timestamp } = payload;
  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!name || !emailRx.test(email)) {
    return { statusCode: 400, headers: cors(event.headers.origin), body: JSON.stringify({ error: "Name and valid email are required." }) };
  }

  // Calculate score from answers if available
  const score = answers ? answers.reduce((sum, answer) => sum + (answer.value || 0), 0) : null;

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });

  // Generate recommendation logic explanation
  const generateRecommendationLogic = (answers, recommendation, score) => {
    if (!answers || !recommendation) return "No detailed analysis available.";
    
    const factors = [];
    
    // Analyze key factors based on answers
    if (answers.length >= 8) {
      const businessStage = answers[0]?.value || 0;
      const objective = answers[1]?.value || 0;
      const timeline = answers[2]?.value || 0;
      const budget = answers[3]?.value || 0;
      const teamSize = answers[4]?.value || 0;
      const challenge = answers[5]?.value || 0;
      const marketComplexity = answers[6]?.value || 0;
      const engagementType = answers[7]?.value || 0;
      
      // Strategic Campaign & Asset Intelligence factors
      if (score >= 75 && budget >= 7 && teamSize >= 5) {
        factors.push("High assessment score indicating strategic readiness");
        factors.push("Substantial budget ($15K-$50K/month) for comprehensive programs");
        factors.push("Large team (50+ people) with existing creative capabilities");
        factors.push("Need for strategic campaign planning and asset optimization");
      }
      // Quick-Start Sprint factors
      else if (timeline <= 5 && (businessStage <= 2 || budget <= 1)) {
        factors.push("Urgent timeline requirements (1-3 months)");
        factors.push("Early stage business or limited budget");
        factors.push("Need for rapid strategic clarity and foundation");
      }
      // Launch Campaign factors
      else if (objective === 10 || (businessStage <= 2 && timeline >= 10)) {
        factors.push("Product/service launch objective identified");
        factors.push("Need for comprehensive go-to-market strategy");
      }
      // General factors
      else {
        if (teamSize <= 1) factors.push("Limited internal marketing resources");
        if (timeline <= 5) factors.push("Urgent timeline requirements");
        if (budget >= 5) factors.push("Substantial marketing budget available");
        if (businessStage >= 3) factors.push("Established business ready for growth");
        if (engagementType >= 15) factors.push("Need for ongoing strategic partnership");
        if (marketComplexity >= 3) factors.push("Complex market requiring specialized approach");
      }
    }
    
    return `Based on the assessment (Score: ${score}), the recommendation for "${recommendation.title}" was determined by:\n\n${factors.length > 0 ? factors.map(f => `• ${f}`).join('\n') : '• Standard assessment criteria applied'}\n\nThis recommendation aligns with the client's specific needs for ${recommendation.duration} engagement focusing on ${recommendation.description?.toLowerCase() || 'strategic marketing support'}.`;
  };

  const adminSubject = `ScopeIQ Lead: ${name}${company ? ` (${company})` : ""} - ${recommendation?.title || 'Assessment Complete'}`;
  const adminText = `NEW SCOPEIQ LEAD\n\nCONTACT INFO:\nName: ${name}\nEmail: ${email}\nCompany: ${company || "Not provided"}\n\nASSESSMENT RESULTS:\nScore: ${score ?? "—"}\nRecommendation: ${recommendation?.title || "—"}\nPrice Range: ${recommendation?.price || "—"}\nDuration: ${recommendation?.duration || "—"}\n\nRECOMMENDATION LOGIC:\n${generateRecommendationLogic(answers, recommendation, score)}\n\nNEXT STEPS:\n${recommendation?.nextSteps ? recommendation.nextSteps.map(step => `• ${step}`).join('\n') : '• Follow up with consultation'}\n\nSubmitted: ${timestamp || new Date().toISOString()}`;

  const userSubject = `Your ScopeIQ Recommendation: ${recommendation?.title || 'Assessment Complete'}${company ? ` for ${company}` : ""}`;
  const userText = `Hi ${name},

Thank you for completing the ScopeIQ assessment! Based on your responses, I've identified the best marketing approach for your needs.

🎯 YOUR RECOMMENDATION: ${recommendation?.title || "Custom Solution"}
💰 Investment Range: ${recommendation?.price || "Custom pricing"}
⏱️ Timeline: ${recommendation?.duration || "To be determined"}

${recommendation?.description ? `WHAT THIS INCLUDES:
${recommendation.description}

` : ''}${recommendation?.benefits ? `KEY BENEFITS:
${recommendation.benefits.slice(0, 4).map(benefit => `• ${benefit}`).join('\n')}

` : ''}NEXT STEPS:
${recommendation?.nextSteps ? recommendation.nextSteps.slice(0, 2).map(step => `• ${step}`).join('\n') : '• I\'ll reach out to discuss your specific needs\n• We\'ll schedule a consultation to dive deeper'}

I'm excited to help you achieve your marketing goals. Feel free to reply with any questions!

Best regards,
Luis Gilberto
Marketing Strategist

P.S. Keep an eye out for my follow-up email with additional insights tailored to your business.`;

  try {
    await transporter.sendMail({ from: SMTP_FROM, to: ADMIN_EMAIL, subject: adminSubject, text: adminText });
    await transporter.sendMail({ from: SMTP_FROM, to: email, subject: userSubject, text: userText, replyTo: REPLY_TO || "hello@luis-gilberto.com" });
    return { statusCode: 200, headers: cors(event.headers.origin, { "Content-Type": "application/json" }), body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error("Email send error:", err);
    return { statusCode: 500, headers: cors(event.headers.origin, { "Content-Type": "application/json" }), body: JSON.stringify({ error: "Email sending failed", details: String(err) }) };
  }
};
