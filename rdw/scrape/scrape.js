const puppeteer = require('puppeteer');

let initialized = false;
let scrapedHeaders;
async function init(licenseplate) {
  if (initialized) {
    return
  }
  console.log("getting RDW headers");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://ovi.rdw.nl/');
  await page.waitForSelector('#kenteken')
  await page.click('#kenteken');
  await page.keyboard.type(licenseplate+"\n");
  page.on('request', req => {
   if(req.url() === "https://ovi.rdw.nl/api/v1/VoertuigInfo") {
     scrapedHeaders = new Headers(req.headers());
   }
  });
  await page.click('div > ovi-search > div > form > div > button')
  let cookie_string = '';
  for (const cookie of await browser.cookies()) {
    cookie_string += `${cookie.name}=${cookie.value};`;
  }
  scrapedHeaders.set("cookie", cookie_string);
  await browser.close()
  console.log("got RDW headers. Disabling initialization");

  initialized = true;
  setTimeout(function() {
    console.info("rerunning init function on next request")
    initialized = false;
  }, 1000*60*60)
}

async function scrapeLicenseplate(licenseplate) {
  await init(licenseplate);
  const headers = new Headers({
  'authority': 'ovi.rdw.nl' ,
  'accept': 'application/json, text/plain, */*' ,
  'accept-language': 'en-US,en;q=0.9' ,
  'content-type': 'application/json' ,
  'correlationid': '19e4b213-e35d-4102-9c7b-6233d1331c0c' ,
  'dnt': '1' ,
  'edssessionid': 'b44f6be8-aa1d-4a61-b62c-cd554870213d' ,
  'origin': 'https://ovi.rdw.nl' ,
  'priority': 'u=1, i' ,
  'referer': 'https://ovi.rdw.nl/' ,
  'request-id': '|618f7c764baa441cbb15ae37b44a2998.a658392f33934d8f' ,
  'sec-ch-ua': '"Not(A:Brand";v="24", "Chromium";v="122"' ,
  'sec-ch-ua-mobile': '?0' ,
  'sec-ch-ua-platform': '"Linux"' ,
  'sec-fetch-dest': 'empty' ,
  'sec-fetch-mode': 'cors' ,
  'sec-fetch-site': 'same-origin' ,
  'traceparent': '00-618f7c764baa441cbb15ae37b44a2998-a658392f33934d8f-01' ,
  'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) QtWebEngine/6.8.2 Chrome/122.0.6261.171 Safari/537.36' ,
  });
  for (const [key, value] of scrapedHeaders) {
    headers.delete(key);
    headers.set(key, value);
  }
  const body = `{"kenteken":"${licenseplate}"}`;
  const req = new Request("https://ovi.rdw.nl/api/v1/VoertuigInfo", {
    method: "POST",
    body: body,
    headers: headers,
  });
  try {
    const resp = await fetch(req);
    return await resp.json();
  } catch {
    initialized = false;
    await init(licenseplate);
    const resp = await fetch(req);
    return await resp.json();
  }
}

module.exports = {
  scrapeLicenseplate
}
