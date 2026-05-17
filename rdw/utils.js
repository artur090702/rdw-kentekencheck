const urlVehicle = 'https://opendata.rdw.nl/resource/m9d7-ebf2.json?$query=';
const queryVehicle = `SELECT
  \`kenteken\`,
  \`voertuigsoort\`,
  \`merk\`,
  \`handelsbenaming\`,
  \`vervaldatum_apk\`,
  \`datum_tenaamstelling\`,
  \`bruto_bpm\`,
  \`inrichting\`,
  \`aantal_zitplaatsen\`,
  \`eerste_kleur\`,
  \`tweede_kleur\`,
  \`aantal_cilinders\`,
  \`cilinderinhoud\`,
  \`massa_ledig_voertuig\`,
  \`toegestane_maximum_massa_voertuig\`,
  \`massa_rijklaar\`,
  \`maximum_massa_trekken_ongeremd\`,
  \`maximum_trekken_massa_geremd\`,
  \`datum_eerste_toelating\`,
  \`datum_eerste_tenaamstelling_in_nederland\`,
  \`wacht_op_keuren\`,
  \`catalogusprijs\`,
  \`wam_verzekerd\`,
  \`maximale_constructiesnelheid\`,
  \`laadvermogen\`,
  \`oplegger_geremd\`,
  \`aanhangwagen_autonoom_geremd\`,
  \`aanhangwagen_middenas_geremd\`,
  \`aantal_staanplaatsen\`,
  \`aantal_deuren\`,
  \`aantal_wielen\`,
  \`afstand_hart_koppeling_tot_achterzijde_voertuig\`,
  \`afstand_voorzijde_voertuig_tot_hart_koppeling\`,
  \`afwijkende_maximum_snelheid\`,
  \`lengte\`,
  \`breedte\`,
  \`europese_voertuigcategorie\`,
  \`europese_voertuigcategorie_toevoeging\`,
  \`europese_uitvoeringcategorie_toevoeging\`,
  \`plaats_chassisnummer\`,
  \`technische_max_massa_voertuig\`,
  \`type\`,
  \`type_gasinstallatie\`,
  \`typegoedkeuringsnummer\`,
  \`variant\`,
  \`uitvoering\`,
  \`volgnummer_wijziging_eu_typegoedkeuring\`,
  \`vermogen_massarijklaar\`,
  \`wielbasis\`,
  \`export_indicator\`,
  \`openstaande_terugroepactie_indicator\`,
  \`vervaldatum_tachograaf\`,
  \`taxi_indicator\`,
  \`maximum_massa_samenstelling\`,
  \`aantal_rolstoelplaatsen\`,
  \`maximum_ondersteunende_snelheid\`,
  \`jaar_laatste_registratie_tellerstand\`,
  \`tellerstandoordeel\`,
  \`code_toelichting_tellerstandoordeel\`,
  \`tenaamstellen_mogelijk\`,
  \`vervaldatum_apk_dt\`,
  \`datum_tenaamstelling_dt\`,
  \`datum_eerste_toelating_dt\`,
  \`datum_eerste_tenaamstelling_in_nederland_dt\`,
  \`vervaldatum_tachograaf_dt\`,
  \`maximum_last_onder_de_vooras_sen_tezamen_koppeling\`,
  \`type_remsysteem_voertuig_code\`,
  \`rupsonderstelconfiguratiecode\`,
  \`wielbasis_voertuig_minimum\`,
  \`wielbasis_voertuig_maximum\`,
  \`lengte_voertuig_minimum\`,
  \`lengte_voertuig_maximum\`,
  \`breedte_voertuig_minimum\`,
  \`breedte_voertuig_maximum\`,
  \`hoogte_voertuig\`,
  \`hoogte_voertuig_minimum\`,
  \`hoogte_voertuig_maximum\`,
  \`massa_bedrijfsklaar_minimaal\`,
  \`massa_bedrijfsklaar_maximaal\`,
  \`technisch_toelaatbaar_massa_koppelpunt\`,
  \`maximum_massa_technisch_maximaal\`,
  \`maximum_massa_technisch_minimaal\`,
  \`subcategorie_nederland\`,
  \`verticale_belasting_koppelpunt_getrokken_voertuig\`,
  \`zuinigheidsclassificatie\`,
  \`registratie_datum_goedkeuring_afschrijvingsmoment_bpm\`,
  \`registratie_datum_goedkeuring_afschrijvingsmoment_bpm_dt\`,
  \`gem_lading_wrde\`,
  \`aerodyn_voorz\`,
  \`massa_alt_aandr\`,
  \`verl_cab_ind\`,
  \`api_gekentekende_voertuigen_assen\`,
  \`api_gekentekende_voertuigen_brandstof\`,
  \`api_gekentekende_voertuigen_carrosserie\`,
  \`api_gekentekende_voertuigen_carrosserie_specifiek\`,
  \`api_gekentekende_voertuigen_voertuigklasse\`
WHERE caseless_one_of(\`kenteken\`, "%s")`;

const urlAPK = 'https://opendata.rdw.nl/resource/a34c-vvps.json?$query=';
const queryAPK = `SELECT \`kenteken\`,
  \`soort_erkenning_keuringsinstantie\`,
  \`meld_datum_door_keuringsinstantie\`,
  \`meld_tijd_door_keuringsinstantie\`,
  \`gebrek_identificatie\`,
  \`soort_erkenning_omschrijving\`,
  \`aantal_gebreken_geconstateerd\`,
  \`meld_datum_door_keuringsinstantie_dt\`
  WHERE caseless_one_of(\`kenteken\`, "%s")`;

function generateVehicleURL(licenseplate) {
  return urlVehicle + encodeURIComponent(queryVehicle.replace('%s', licenseplate));
}

function generateAPKURL(licenseplate) {
  return urlAPK + encodeURIComponent(queryAPK.replace('%s', licenseplate));
}

function groupAPKByDate(apkInfo, gebreken) {
  const keuringen = new Map();
  for (const apk of apkInfo) {
    const date = apk.meld_datum_door_keuringsinstantie;
    const keuring = keuringen.get(date) || [];
    apk.description = gebreken.get(apk.gebrek_identificatie);
    keuring.push(apk);
    keuringen.set(date, keuring);
  }
  return keuringen;
}

function normalizeLicensePlate(raw) {
  return (raw || '').toUpperCase().replace(/-/g, '');
}

module.exports = { generateVehicleURL, generateAPKURL, groupAPKByDate, normalizeLicensePlate };
