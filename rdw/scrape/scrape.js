const puppeteer = require('puppeteer');

let initPromise = null;
let scrapedHeaders;

async function doInit(licenseplate) {
  console.log('getting RDW headers');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  });
  try {
    const page = await browser.newPage();
    page.on('request', req => {
      if (req.url() === 'https://ovi.rdw.nl/api/v1/VoertuigInfo') {
        scrapedHeaders = new Headers(req.headers());
      }
    });
    await page.goto('https://ovi.rdw.nl/');
    await page.waitForSelector('#kenteken');
    await page.click('#kenteken');
    await page.keyboard.type(licenseplate + '\n');
    await page.click('div > ovi-search > div > form > div > button');

    let cookieString = '';
    for (const cookie of await browser.cookies()) {
      cookieString += `${cookie.name}=${cookie.value};`;
    }
    scrapedHeaders.set('cookie', cookieString);
  } finally {
    await browser.close();
  }

  console.log('got RDW headers');
  setTimeout(() => {
    console.info('rerunning init function on next request');
    initPromise = null;
  }, 1000 * 60 * 60);
}

async function init(licenseplate) {
  if (!initPromise) {
    initPromise = doInit(licenseplate).catch(err => {
      initPromise = null;
      throw err;
    });
  }
  return initPromise;
}

function buildRequest(licenseplate) {
  const headers = new Headers({
    accept: 'application/json, text/plain, */*',
    'content-type': 'application/json',
    origin: 'https://ovi.rdw.nl',
    referer: 'https://ovi.rdw.nl/',
  });
  for (const [key, value] of scrapedHeaders) {
    headers.set(key, value);
  }
  return new Request('https://ovi.rdw.nl/api/v1/VoertuigInfo', {
    method: 'POST',
    body: JSON.stringify({ kenteken: licenseplate }),
    headers,
  });
}

async function scrapeLicenseplate(licenseplate) {
  await init(licenseplate);
  try {
    const resp = await fetch(buildRequest(licenseplate));
    return await resp.json();
  } catch {
    initPromise = null;
    await init(licenseplate);
    const resp = await fetch(buildRequest(licenseplate));
    return await resp.json();
  }
}

module.exports = { scrapeLicenseplate };
