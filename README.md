# PDF Report Service — JOAT Bathroom Renovation Quiz

Generates a branded PDF quote (Puppeteer) and uploads it to SiteGround via
FTPS (confirmed working — see below), for the JOAT bathroom quiz funnel.

## Confirmed working config

- Protocol: **FTPS** (explicit TLS, `secure: true` in `basic-ftp`) — NOT
  plain FTP, NOT SFTP. Confirmed via FileZilla and `test-ftp.js`.
- Host: `ftp.aizall60.sg-host.com`, port `21`
- Real upload path (relative to this account's own FTP root):
  `joat.bathroomrennos.com.au/public_html/pdf/reports/`
- Public URL for uploaded files:
  `https://joat.bathroomrennos.com.au/pdf/reports/<filename>`

## Local setup

```bash
npm install
cp .env.example .env
# fill in real values in .env
docker compose -f docker-compose.local.yml up -d --build
node test-generate.js
```

## Isolated FTP test (no Docker, no Puppeteer — just connectivity)

```bash
npm install basic-ftp
node test-ftp.js
```

Edit the `CONFIG` block at the top of `test-ftp.js` directly if credentials
change — it does not read `.env`, it's fully self-contained on purpose.

## VPS deployment

Once confirmed locally, deploy the same code to the VPS using
`docker-compose.yml` (Traefik-routed version) instead of
`docker-compose.local.yml`.

## Quiz-side integration

The quiz's `api/submit-lead.js` (separate project) calls this service's
`/generate` endpoint before firing its webhook, so the PDF url is always
resolved before any downstream email/SMS automation fires. See that
project's README for details.

Env vars needed on the quiz/Vercel side:
```
PDF_SERVICE_URL=https://<this-service's-domain>
PDF_SERVICE_API_KEY=<same value as PDF_SERVICE_API_KEY here>
```
