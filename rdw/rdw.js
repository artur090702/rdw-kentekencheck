const fs = require('fs');
const path = require('path');
const scrape = require('./scrape/scrape');
const { generateVehicleURL, generateAPKURL, groupAPKByDate } = require('./utils');

const gebreken = new Map();

async function init() {
  const data = await fs.promises.readFile(path.join(__dirname, 'gebreken.json'));
  for (const gebrek of JSON.parse(data)) {
    gebreken.set(gebrek.gebrek_identificatie, gebrek);
  }
}

const ready = init();

async function fetchLicenseplate(licenseplate) {
  await ready;
  const [vehicleRes, apkRes] = await Promise.all([
    fetch(generateVehicleURL(licenseplate)),
    fetch(generateAPKURL(licenseplate)),
  ]);
  const info = await vehicleRes.json();
  const apkInfo = await apkRes.json();

  info.apk_keuringen = groupAPKByDate(apkInfo, gebreken);
  info.apk_info = apkInfo;
  info.site_info = await scrape.scrapeLicenseplate(licenseplate);
  return info;
}

module.exports = { fetchLicenseplate };
