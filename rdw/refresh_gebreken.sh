#!/bin/sh
url='https://opendata.rdw.nl/resource/hx2c-gt7k.json?$query='
query='SELECT
`gebrek_identificatie`,
`ingangsdatum_gebrek`,
`gebrek_artikel_nummer`,
`gebrek_omschrijving`,
`ingangsdatum_gebrek_dt`
WHERE `gebrek_identificatie` LIKE "R%"
OR `gebrek_identificatie` LIKE "S%"
OR `gebrek_identificatie` LIKE "T%"
OR `gebrek_identificatie` LIKE "U%"
OR `gebrek_identificatie` LIKE "V%"
OR `gebrek_identificatie` LIKE "W%"
OR `gebrek_identificatie` LIKE "X%"
OR `gebrek_identificatie` LIKE "Y%"
OR `gebrek_identificatie` LIKE "Z%"'
url_encoded=$url$(echo $query | urlencode)

url='https://opendata.rdw.nl/resource/hx2c-gt7k.json'
curl "$url"
