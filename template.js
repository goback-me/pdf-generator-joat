function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildReportHtml(data) {
  var name = escapeHtml(data.name || "there");
  var answers = data.answers || {};

  var layout = escapeHtml(answers["Are you keeping the same layout?"] || "Not specified");
  var tiles = escapeHtml(answers["Who is supplying your tiles?"] || "Not specified");
  var pcItems = escapeHtml(answers["Who is supplying your toilet, taps, basin and shower fittings?"] || "Not specified");

  var quoteNo = "Q-" + Date.now().toString().slice(-6);
  var dateStr = new Date().toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" }).toUpperCase();

  return `<!DOCTYPE html>
<html lang="en-AU">
<head>
<meta charset="UTF-8">
<style>
  @page { size: A4; margin: 0; }
  html,body{width:100%;}
  *{box-sizing:border-box;}
  body{
    margin:0;
    font-family:'Liberation Sans','Arial',sans-serif;
    color:#14193e;
    font-size:13px;
    line-height:1.5;
    -webkit-print-color-adjust:exact;
  }
  .page{width:100%;}

  /* ---------- TOP BAR ---------- */
  .topbar{background:#0a0b12;padding:16px 40px;color:#fff;}
  .topbar-inner{display:table;width:100%;}
  .topbar-cell{display:table-cell;vertical-align:middle;}
  .logo-cell{width:34%;}
  .logo-row{display:table;}
  .logo-icon{display:table-cell;vertical-align:middle;width:30px;}
  .hex{width:26px;height:26px;background:#fff;clip-path:polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%);display:inline-block;}
  .logo-text{display:table-cell;vertical-align:middle;padding-left:8px;font-size:17px;font-weight:800;letter-spacing:0.02em;color:#fff;}
  .review-cell{text-align:center;font-size:9.5px;font-weight:700;color:#fff;line-height:1.3;}
  .review-badge-cell{text-align:right;}
  .badge{display:inline-block;vertical-align:middle;margin-left:16px;font-size:9px;font-weight:700;color:#fff;}
  .badge .icon-circle{display:inline-block;width:16px;height:16px;border-radius:50%;text-align:center;line-height:16px;font-size:9px;font-weight:800;color:#fff;margin-right:4px;vertical-align:middle;}
  .icon-google{background:#fff;color:#4285F4;}
  .icon-fb{background:#1877F2;color:#fff;}
  .stars{color:#f5b400;font-size:10px;letter-spacing:1px;}

  /* ---------- HERO ---------- */
  .hero{background:#eaf5f1;padding:34px 60px 30px;text-align:center;}
  .eyebrow-pill{display:inline-block;background:#fbe0cc;color:#e8632a;font-size:10px;font-weight:800;letter-spacing:0.08em;padding:6px 18px;border-radius:20px;margin-bottom:16px;}
  .price-value{font-size:52px;font-weight:800;color:#14193e;letter-spacing:-0.01em;margin-bottom:14px;}
  .price-note{font-size:12.5px;color:#14193e;max-width:560px;margin:0 auto 18px;}
  .greeting{font-size:12px;color:#14193e;max-width:620px;margin:0 auto;}

  /* ---------- CTA BUTTON BLOCK ---------- */
  .cta-block{background:#eaf5f1;text-align:center;padding:0 60px 32px;}
  .cta-pill{display:inline-block;background:#2ba84a;border-radius:16px;padding:14px 26px 16px;min-width:420px;}
  .cta-save{font-size:9px;font-weight:700;letter-spacing:0.1em;color:#d9f5e2;margin-bottom:4px;}
  .cta-main{font-size:16px;font-weight:800;color:#fff;letter-spacing:0.01em;}

  /* ---------- DARK SECTION ---------- */
  .dark-section{background:#0f1330;padding:26px 40px 20px;}
  .info-card{background:#171b45;border-radius:14px;padding:18px 26px 20px;margin-bottom:14px;}
  .info-card:last-child{margin-bottom:0;}
  .info-card h2{font-size:16px;font-weight:800;color:#fff;letter-spacing:0.01em;margin:0 0 12px;}
  .info-line{font-size:11px;color:#fff;margin-bottom:7px;line-height:1.5;}
  .info-line:last-child{margin-bottom:0;}
  .info-line .accent{color:#5aa9e6;font-weight:700;}
  .info-line .body-text{color:rgba(255,255,255,0.82);}

  /* ---------- FOOTER (inside dark section) ---------- */
  .footer-strip{text-align:center;padding-top:14px;font-size:9px;font-weight:700;letter-spacing:0.03em;color:rgba(255,255,255,0.55);}
</style>
</head>
<body>
<div class="page">

  <!-- TOP BAR -->
  <div class="topbar">
    <div class="topbar-inner">
      <div class="topbar-cell logo-cell">
        <div class="logo-row">
          <div class="logo-icon"><span class="hex"></span></div>
          <div class="logo-text">JOAT</div>
        </div>
      </div>
      <div class="topbar-cell review-cell">133+ 5 star<br>google reviews</div>
      <div class="topbar-cell review-badge-cell">
        <span class="badge"><span class="icon-circle icon-google">G</span>Reviews <span class="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span></span>
        <span class="badge"><span class="icon-circle icon-fb">f</span>Reviews <span class="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span></span>
      </div>
    </div>
  </div>

  <!-- HERO -->
  <div class="hero">
    <div class="eyebrow-pill">YOUR BATHROOM RENOVATION, ESTIMATED</div>
    <div class="price-value">$25k &ndash; $35k+</div>
    <div class="price-note">A starting range based on what you've told us so far. <b>Your exact price is confirmed at a free, no-obligation inspection.</b></div>
    <div class="greeting">Hi <b>${name}</b>, thanks for sharing a few details about your bathroom. Here's an honest starting range and exactly what's driving it, so you know what to expect before we ever step through your front door.</div>
  </div>

  <!-- CTA -->
  <div class="cta-block">
    <div class="cta-pill">
      <div class="cta-save">SAVE $1,000 VALUE</div>
      <div class="cta-main">BOOK A FREE ESTIMATE ASSESSMENT</div>
    </div>
  </div>

  <!-- DARK SECTION -->
  <div class="dark-section">

    <div class="info-card">
      <h2>INCLUDED IN EVERY RENOVATION</h2>
      <div class="info-line">&#10003; <span class="accent">Waterproofing:</span> <span class="body-text">full wet area waterproofing membrane, compliant to AS 3740</span></div>
      <div class="info-line">&#10003; <span class="accent">Structural elements:</span> <span class="body-text">assessment and allowance for any structural adjustment required</span></div>
      <div class="info-line">&#10003; <span class="accent">Design:</span> <span class="body-text">layout and finish design consultation</span></div>
      <div class="info-line">&#10003; <span class="accent">Review:</span> <span class="body-text">quality check and sign-off before handover</span></div>
    </div>

    <div class="info-card">
      <h2>BASED ON WHAT YOU TOLD US</h2>
      <div class="info-line">&#10003; <span class="accent">Layout:</span> <span class="body-text">${layout}</span></div>
      <div class="info-line">&#10003; <span class="accent">Tiles:</span> <span class="body-text">${tiles}</span></div>
      <div class="info-line">&#10003; <span class="accent">PC items (toilet, tapware, vanity):</span> <span class="body-text">${pcItems}</span></div>
    </div>

    <div class="info-card">
      <h2>WHY WE QUOTE THIS WAY</h2>
      <div class="info-line">1. <span class="accent">We give you an honest range:</span> <span class="body-text">No lowball number to get you in the door, then surprises later.</span></div>
      <div class="info-line">2. <span class="accent">You get a fixed price on-site:</span> <span class="body-text">We confirm your exact cost once we've seen your bathroom.</span></div>
      <div class="info-line">3. <span class="accent">Your inspection is completely free:</span> <span class="body-text">The inspection is free. You decide what happens next.</span></div>
    </div>

    <div class="footer-strip">JAKE OF ALL TRADEZ RESIDENTIAL BUILDING, REPAIR &amp; MAINTENANCE WORKS &nbsp;||&nbsp; QUOTE #${quoteNo}&nbsp; ${dateStr}</div>

  </div>

</div>
</body>
</html>`;
}

module.exports = { buildReportHtml };