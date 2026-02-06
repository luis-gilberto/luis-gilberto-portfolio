
import fs from 'fs';
import path from 'path';

// ANSI colors for output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m"
};

const LOG_FILE = path.join(process.cwd(), 'deployment-logs.txt');

function log(message: string, type: 'INFO' | 'SUCCESS' | 'ERROR' | 'WARN' | 'CYAN' = 'INFO') {
  const timestamp = new Date().toISOString();
  const colorMap = {
    INFO: colors.blue,
    SUCCESS: colors.green,
    ERROR: colors.red,
    WARN: colors.yellow,
    CYAN: colors.cyan
  };
  
  const consoleMsg = `${colorMap[type]}[${type}]${colors.reset} ${message}`;
  console.log(consoleMsg);
  
  const fileMsg = `[${timestamp}] [${type}] ${message}\n`;
  fs.appendFileSync(LOG_FILE, fileMsg);
}

async function checkUrl(url: string, description: string): Promise<boolean> {
  try {
    const start = Date.now();
    const response = await fetch(url);
    const duration = Date.now() - start;
    
    if (response.ok) {
      log(`${description} (${url}) - OK (${duration}ms)`, 'SUCCESS');
      return true;
    } else {
      log(`${description} (${url}) - FAILED (Status: ${response.status})`, 'ERROR');
      return false;
    }
  } catch (error) {
    log(`${description} (${url}) - ERROR: ${(error as Error).message}`, 'ERROR');
    return false;
  }
}

async function verifyDeployment() {
  const baseUrl = process.argv[2] || 'http://localhost:3000';
  
  log(`Starting Deployment Verification for: ${baseUrl}`, 'INFO');
  log(`Log file: ${LOG_FILE}`, 'INFO');

  // 1. Health Check
  log('--- Phase 1: System Health ---', 'CYAN');
  const healthUrl = `${baseUrl}/api/health`;
  let healthOk = false;
  
  try {
    const healthRes = await fetch(healthUrl);
    if (healthRes.ok) {
      const data = await healthRes.json();
      log(`Health Check Passed: Version ${data.version}, DB: ${data.database}`, 'SUCCESS');
      healthOk = true;
    } else {
      log(`Health Check Failed: Status ${healthRes.status}`, 'ERROR');
    }
  } catch (e) {
    log(`Health Check Error: ${(e as Error).message}`, 'ERROR');
  }

  if (!healthOk) {
    log('CRITICAL: Health check failed. Aborting verification.', 'ERROR');
    process.exit(1);
  }

  // 2. Critical Routes Check
  log('--- Phase 2: Critical Routes ---', 'CYAN');
  const routes = [
    { path: '/', name: 'Home Page' },
    { path: '/login', name: 'Login Page' },
    { path: '/api/auth/session', name: 'Auth Session Endpoint' }, // Validate Auth System
    { path: '/admin', name: 'Admin Dashboard (Auth Redirect Expected)' } // Might 307/302, need to handle
  ];

  let routesOk = true;
  for (const route of routes) {
    const success = await checkUrl(`${baseUrl}${route.path}`, route.name);
    if (!success && route.path !== '/admin') routesOk = false; // Admin might redirect, which fetch follows, so 200 is good or 401
  }

  // 3. Environment Config Check (Local only simulation)
  log('--- Phase 3: Configuration ---', 'CYAN');
  const requiredVars = ['DATABASE_URL', 'NEXTAUTH_URL', 'NEXTAUTH_SECRET'];
  // We can't check remote env vars directly from outside, but we can verify if local process has them if running locally
  if (baseUrl.includes('localhost')) {
    const missingVars = requiredVars.filter(v => !process.env[v]);
    if (missingVars.length > 0) {
      log(`Missing Environment Variables: ${missingVars.join(', ')}`, 'WARN');
    } else {
      log('Local Environment Variables Check Passed', 'SUCCESS');
    }
  } else {
    log('Skipping Env Var check for remote deployment (assumed managed by provider)', 'INFO');
  }

  // 4. Mobile Viewport Simulation (Basic Reachability)
  log('--- Phase 4: Mobile Reachability ---', 'CYAN');
  try {
    const mobileRes = await fetch(baseUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
      }
    });
    if (mobileRes.ok) {
      log('Mobile User-Agent Request: OK', 'SUCCESS');
    } else {
      log('Mobile User-Agent Request: FAILED', 'ERROR');
    }
  } catch (e) {
    log(`Mobile Check Error: ${(e as Error).message}`, 'ERROR');
  }

  log('--- Verification Summary ---', 'CYAN');
  if (healthOk && routesOk) {
    log('DEPLOYMENT VERIFICATION PASSED', 'SUCCESS');
    process.exit(0);
  } else {
    log('DEPLOYMENT VERIFICATION FAILED', 'ERROR');
    process.exit(1);
  }
}

verifyDeployment();
