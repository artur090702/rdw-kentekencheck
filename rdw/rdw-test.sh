#!/bin/sh
query='SELECT `kenteken`,
	`soort_erkenning_keuringsinstantie`,
	`meld_datum_door_keuringsinstantie`,
	`meld_tijd_door_keuringsinstantie`,
	`soort_erkenning_omschrijving`,
	`soort_melding_ki_omschrijving`,
	`vervaldatum_keuring`,
	`meld_datum_door_keuringsinstantie_dt`,
	`vervaldatum_keuring_dt`,
	`api_gebrek_constateringen`,
	`api_gebrek_beschrijving`
	WHERE caseless_one_of(`kenteken`, "07DJNH")'
url='https://opendata.rdw.nl/resource/sgfe-77wx.json?$query='
url_encoded=$url$(echo $query | urlencode)
curl "$url_encoded"
