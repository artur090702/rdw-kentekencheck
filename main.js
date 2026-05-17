const rdw = require('./rdw/rdw');
const { normalizeLicensePlate } = require('./rdw/utils');
const express = require('express');

const app = express();
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('pages/index');
});

app.get('/kentekencheck', (req, res, next) => {
  const licenseplate = normalizeLicensePlate(req.query.licenseplate);
  rdw.fetchLicenseplate(licenseplate)
    .then(data => res.render('pages/kentekencheck', { data }))
    .catch(next);
});

app.use((err, req, res, next) => {
  console.error(err);
  if (req.query.licenseplate) {
    const safe = normalizeLicensePlate(req.query.licenseplate);
    return res.status(500).send(
      `Kenteken check voor kenteken <b>${safe}</b> is mislukt. Controleer kenteken of neem contact op (+31 6 15500583/artur090702@gmail.com)`
    );
  }
  res.status(500).send('Er is iets mis gegaan. Neem contact op. (+31 6 15500583/artur090702@gmail.com)');
});

const port = process.env.PORT || 8080;
app.listen(port);

console.info(`Server is listening on port ${port}`);
