const { test } = require('node:test');
const assert = require('node:assert/strict');
const { generateVehicleURL, generateAPKURL, groupAPKByDate, normalizeLicensePlate } = require('../rdw/utils');

test('normalizeLicensePlate strips dashes and uppercases', () => {
  assert.equal(normalizeLicensePlate('12-ab-34'), '12AB34');
  assert.equal(normalizeLicensePlate('AB-12-CD'), 'AB12CD');
  assert.equal(normalizeLicensePlate('AB12CD'), 'AB12CD');
  assert.equal(normalizeLicensePlate(''), '');
  assert.equal(normalizeLicensePlate(undefined), '');
  assert.equal(normalizeLicensePlate(null), '');
});

test('generateVehicleURL contains licenseplate and correct base URL', () => {
  const url = generateVehicleURL('AB12CD');
  assert.ok(url.startsWith('https://opendata.rdw.nl/resource/m9d7-ebf2.json'));
  assert.ok(url.includes('AB12CD'));
});

test('generateAPKURL contains licenseplate and correct base URL', () => {
  const url = generateAPKURL('AB12CD');
  assert.ok(url.startsWith('https://opendata.rdw.nl/resource/a34c-vvps.json'));
  assert.ok(url.includes('AB12CD'));
});

test('generateVehicleURL and generateAPKURL use different endpoints', () => {
  const vehicleURL = generateVehicleURL('AB12CD');
  const apkURL = generateAPKURL('AB12CD');
  assert.notEqual(vehicleURL, apkURL);
  assert.ok(vehicleURL.includes('m9d7-ebf2'));
  assert.ok(apkURL.includes('a34c-vvps'));
});

test('groupAPKByDate groups entries by date', () => {
  const gebreken = new Map();
  const apkInfo = [
    { meld_datum_door_keuringsinstantie: '20230101', gebrek_identificatie: 'G001' },
    { meld_datum_door_keuringsinstantie: '20230101', gebrek_identificatie: 'G002' },
    { meld_datum_door_keuringsinstantie: '20220601', gebrek_identificatie: 'G001' },
  ];
  const result = groupAPKByDate(apkInfo, gebreken);
  assert.equal(result.size, 2);
  assert.equal(result.get('20230101').length, 2);
  assert.equal(result.get('20220601').length, 1);
});

test('groupAPKByDate attaches gebrek description to each entry', () => {
  const gebreken = new Map([
    ['G001', { gebrek_omschrijving: 'Remmen versleten' }],
    ['G002', { gebrek_omschrijving: 'Band defect' }],
  ]);
  const apkInfo = [
    { meld_datum_door_keuringsinstantie: '20230101', gebrek_identificatie: 'G001' },
    { meld_datum_door_keuringsinstantie: '20230101', gebrek_identificatie: 'G002' },
  ];
  groupAPKByDate(apkInfo, gebreken);
  assert.deepEqual(apkInfo[0].description, { gebrek_omschrijving: 'Remmen versleten' });
  assert.deepEqual(apkInfo[1].description, { gebrek_omschrijving: 'Band defect' });
});

test('groupAPKByDate sets description to undefined for unknown gebrek', () => {
  const gebreken = new Map();
  const apkInfo = [
    { meld_datum_door_keuringsinstantie: '20230101', gebrek_identificatie: 'UNKNOWN' },
  ];
  groupAPKByDate(apkInfo, gebreken);
  assert.equal(apkInfo[0].description, undefined);
});

test('groupAPKByDate returns empty map for empty input', () => {
  const result = groupAPKByDate([], new Map());
  assert.equal(result.size, 0);
});
