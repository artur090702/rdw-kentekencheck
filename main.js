const rdw = require('./rdw/rdw');
const express = require('express');

const app = express();
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('pages/index');
});

app.get('/kentekencheck', (req, res, next) => {
  const licenseplate = (req.query.licenseplate || '').toUpperCase().replaceAll('-', '');
  rdw.fetchLicenseplate(licenseplate)
    .then((data) => res.render('pages/kentekencheck', { data }))
    .catch(next);
});

app.use((err, req, res, next) => {
  console.error(err);
  if (req.query.licenseplate) {
    return res.status(500).send(
      `Kenteken check voor kenteken <b>${req.query.licenseplate}</b> is mislukt. Controleer kenteken of neem contact op (+31 6 15500583)`
    );
  }
  res.status(500).send('Er is iets mis gegaan. Neem contact op. (+31 6 15500583)');
});

app.listen(8080);
console.info('Server is listening on port 8080');
