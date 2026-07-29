// Standalone FTP/FTPS test — fully self-contained, no .env, no other files.
// Fill in the 5 values below, then run: node test-ftp.js
//
// Requires: npm install basic-ftp

const ftp = require('basic-ftp');
const fs = require('fs');

// ============================================
// EDIT THESE 5 VALUES
// ============================================
const CONFIG = {
  host: 'ftp.aizall60.sg-host.com',   // <-- your FTP host
  port: 21,                            // <-- 21 for FTP/FTPS, 18765 was for SFTP (different protocol, not used here)
  user: 'pdf@joat.bathroomrennos.com.au',       // <-- confirmed working
  password: 'REPLACE_WITH_PASSWORD',   // <-- exact password from SiteGround
  secure: true,                        // <-- true = FTPS (encrypted, what FileZilla used successfully). Set false only if you specifically need plain unencrypted FTP.
};
// ============================================

console.log('--- Config being used ---');
console.log('host:', CONFIG.host);
console.log('port:', CONFIG.port);
console.log('user:', CONFIG.user);
console.log('password length:', CONFIG.password.length);
console.log('secure (FTPS)?', CONFIG.secure);
console.log('');

async function main() {
  const client = new ftp.Client(15000); // 15s timeout, fails fast instead of hanging
  client.ftp.verbose = true; // full protocol log — helpful if this fails again

  try {
    console.log('Connecting...');
    await client.access(CONFIG);
    console.log('\n✅ Connected successfully!');

    console.log('\nListing current directory (this account\'s own root)...');
    const list = await client.list();
    if (list.length === 0) {
      console.log('(empty — expected if this is a fresh/scoped folder)');
    } else {
      console.log(list.map(item => `${item.isDirectory ? '[dir] ' : '      '}${item.name}`));
    }

    // Real path confirmed via File Manager: joat.bathroomrennos.com.au/public_html/pdf/
    console.log('\nEntering joat.bathroomrennos.com.au/public_html/pdf/ ...');
    await client.cd('joat.bathroomrennos.com.au/public_html/pdf');
    const innerList = await client.list();
    console.log(innerList.map(item => `${item.isDirectory ? '[dir] ' : '      '}${item.name}`));

    console.log('\nUploading a test file INTO that pdf folder...');
    fs.writeFileSync('./ftp-test-upload.txt', 'FTP connectivity test — safe to delete.');
    await client.uploadFrom('./ftp-test-upload.txt', 'ftp-test-upload.txt');
    fs.unlinkSync('./ftp-test-upload.txt');
    console.log('✅ Test file uploaded successfully as ftp-test-upload.txt');
    console.log('   Now check: https://joat.bathroomrennos.com.au/pdf/ftp-test-upload.txt');

    client.close();
  } catch (err) {
    console.error('\n❌ Failed:', err.message);
    console.error('\nIf this is an auth failure: double-check username/password exactly as shown in SiteGround.');
    console.error('If this is a timeout: try secure:false, or test from a different network (e.g. phone hotspot) to rule out a firewall blocking this port.');
  }
}

main();
