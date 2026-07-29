// Test script for the PDF generation service.
// Run with: node test-generate.js
//
// Requires Node 18+ (uses built-in fetch — no npm install needed).
// Reads PDF_SERVICE_API_KEY straight from your .env file.

const fs = require('fs');
const path = require('path');

function loadEnvFile(filePath) {
  const env = {};
  if (!fs.existsSync(filePath)) return env;

  const lines = fs.readFileSync(filePath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

const envFile = loadEnvFile(path.join(__dirname, '.env'));

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';
const API_KEY = process.env.PDF_SERVICE_API_KEY || envFile.PDF_SERVICE_API_KEY;

if (!API_KEY) {
  console.error('❌ No API key found. Add PDF_SERVICE_API_KEY=... to your .env file in this folder.');
  process.exit(1);
}

console.log(`Using API key from ${process.env.PDF_SERVICE_API_KEY ? 'environment variable' : '.env file'}: ${API_KEY.slice(0, 4)}...${API_KEY.slice(-4)}`);

const testPayload = {
  name: 'Test User',
  email: 'test@example.com',
  phone: '0400 000 000',
  answers: {
    'Are you keeping the same layout?': 'Layout stays as is, no plumbing relocation required',
    'Who is supplying your tiles?': 'Supplied by us, included as a budget allocation and confirmed at your inspection',
    'Who is supplying your toilet, taps, basin and shower fittings?': 'Supplied by you, no allowance included in this estimate'
  }
};

async function main() {
  console.log('--- Step 1: health check ---');
  try {
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    console.log('Health:', healthRes.status, healthData);
  } catch (err) {
    console.error('Health check failed — is the container running?', err.message);
    process.exit(1);
  }

  console.log('\n--- Step 2: generate PDF ---');
  console.log('Sending payload:', JSON.stringify(testPayload, null, 2));

  const start = Date.now();
  try {
    const res = await fetch(`${BASE_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      },
      body: JSON.stringify(testPayload)
    });

    const elapsed = Date.now() - start;
    const data = await res.json().catch(() => null);

    console.log(`\nStatus: ${res.status} (${elapsed}ms)`);
    console.log('Response body:', data);

    if (res.status === 401) {
      console.error('\n❌ Unauthorized — check that PDF_SERVICE_API_KEY matches your .env exactly.');
    } else if (res.ok && data && data.url) {
      console.log(`\n✅ Success. PDF should be reachable at:\n   ${data.url}`);
      console.log('   Open that URL in a browser to confirm it actually renders.');
    } else {
      console.error('\n❌ Request completed but did not return a url — check container logs:');
      console.error('   docker compose -f docker-compose.local.yml logs -f pdf-report-service');
    }
  } catch (err) {
    console.error('\n❌ Request failed entirely:', err.message);
    console.error('Is the service running and reachable at', BASE_URL, '?');
  }
}

main();
