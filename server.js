const express = require('express');
const puppeteer = require('puppeteer');
const ftp = require('basic-ftp');
const fs = require('fs/promises');
const { buildReportHtml } = require('./template');

const app = express();
app.use(express.json({ limit: '2mb' }));

const API_KEY = process.env.PDF_SERVICE_API_KEY;

app.post('/generate', async (req, res) => {
  if (req.headers['x-api-key'] !== API_KEY) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const { name, email, phone, answers } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'missing required field: email' });
  }

  let browser;
  try {
    const html = buildReportHtml({ name, answers });

    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();
    browser = null;

    const filename = `bathroom-report-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.pdf`;
    const localPath = `/tmp/${filename}`;
    await fs.writeFile(localPath, pdfBuffer);

    const publicUrl = await uploadViaFtp(localPath, filename);
    await fs.unlink(localPath);

    res.json({ success: true, url: publicUrl });
  } catch (err) {
    console.error('generate error:', err);
    if (browser) { try { await browser.close(); } catch (_) {} }
    res.status(500).json({ error: err.message });
  }
});

app.get('/health', (req, res) => res.json({ ok: true }));

// Confirmed working path (via FileZilla + test-ftp.js):
// account root -> joat.bathroomrennos.com.au/public_html/pdf/
// PDFs are saved into a "reports" subfolder inside that.
const REMOTE_DIR = 'joat.bathroomrennos.com.au/public_html/pdf/reports';

async function uploadViaFtp(localPath, filename) {
  const client = new ftp.Client(15000); // 15s timeout

  try {
    await client.access({
      host: process.env.SG_FTP_HOST,
      port: Number(process.env.SG_FTP_PORT || 21),
      user: process.env.SG_FTP_USER,
      password: process.env.SG_FTP_PASS,
      secure: true, // FTPS — confirmed working
    });

    // Creates the folder if it doesn't exist yet, and cds into it.
    await client.ensureDir(REMOTE_DIR);
    await client.uploadFrom(localPath, filename);
  } finally {
    client.close();
  }

  return `${process.env.SG_PUBLIC_BASE_URL}/pdf/reports/${filename}`;
}

const PORT = 3000;
app.listen(PORT, () => console.log(`pdf-report-service listening on ${PORT}`));
