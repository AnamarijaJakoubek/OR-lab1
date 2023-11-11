const express = require('express');
const app = express();
const port = 3001; // Možete postaviti port prema vašim preferencijama
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');

const corsOptions = {
    origin: 'http://localhost:3000', // Postavite na svoju domenu frontend-a
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };
  
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const pool = new Pool( {
    host: 'localhost',      
    port: 5434,             
    database: 'hoteli',     
    user: 'postgres',       
    password: 'bazepodataka' 
  });

app.post('/filter', async (req, res) => {
    const filterBy = req.body.selectedAttribute;
    const filterValue = req.body.filterText;

    var query = `
      SELECT
        hoteli.idhotela, hoteli.naziv, hoteli.lokacija, adresa.ulica, adresa.kucnibroj, adresa.postanskibroj,
        hoteli.brojzvjezdica, hoteli.bazen, hoteli.restoran, hoteli.besplatanwifi, hoteli.kucniljubimci,
        hoteli.fitnesscentar, hoteli.spawellnesscentar, kontakt.telefon, kontakt.email, kontakt.webstranica,
        recenzije.korisnik, recenzije.ocjena, recenzije.komentar
      FROM
        (public.hoteli
        LEFT JOIN public.adresa ON hoteli.adresaid = adresa.adresaid)
        LEFT JOIN public.kontakt ON hoteli.kontaktid = kontakt.kontaktid
        LEFT JOIN public.recenzije ON hoteli.idhotela = recenzije.hotelid
      WHERE `;

      switch (filterBy) {
        case 'wildcard':
          query += 
          `naziv LIKE '%${filterValue}%'
          OR lokacija LIKE '%${filterValue}%' 
          OR ulica LIKE '%${filterValue}%'
          OR kucnibroj LIKE '%${filterValue}%' 
          OR postanskibroj LIKE '%${filterValue}%'
          OR CAST(brojzvjezdica as TEXT) LIKE '%${filterValue}%'
          OR CAST(bazen as TEXT) LIKE '%${filterValue}%'
          OR CAST(restoran as TEXT) LIKE '%${filterValue}%'
          OR besplatanwifi LIKE '%${filterValue}%' 
          OR kucniljubimci LIKE '%${filterValue}%'
          OR fitnesscentar LIKE '%${filterValue}%'
          OR spawellnesscentar LIKE '%${filterValue}%'
          OR telefon LIKE '%${filterValue}%'
          OR email LIKE '%${filterValue}%'
          OR webstranica LIKE '%${filterValue}%'
          OR korisnik LIKE '%${filterValue}%'
          OR CAST(ocjena AS TEXT) LIKE '%${filterValue}%'
          OR komentar LIKE '%${filterValue}%'
          `;
          break;
        case 'naziv':
          query += `naziv LIKE '%${filterValue}%'`;
          break;
        case 'lokacija':
          query += `lokacija LIKE '%${filterValue}%'`;
          break;
        case 'brojzvjezdica':
          query += `CAST(brojzvjezdica as TEXT) LIKE '%${filterValue}%'`;
          break;
        case 'bazen':
          query += `CAST(bazen as TEXT) LIKE '%${filterValue}%'`;
          break;
        case 'restoran':
          query += `CAST(restoran as TEXT) LIKE '%${filterValue}%'`;
          break;
        case 'besplatanwifi':
          query += `besplatanwifi LIKE '%${filterValue}%'`;
          break;
        case 'kucniljubimci':
          query += `kucniljubimci LIKE '%${filterValue}%'`;
          break;
        case 'fitnesscentar':
          query += `fitnesscentar LIKE '%${filterValue}%'`;
          break;
        case 'spawellnesscentar':
            query += `spawellnesscentar LIKE '%${filterValue}%'`;
            break;
      }
      try {
        const result = await pool.query(query);
        res.json(result.rows);
      } catch (err) {
         console.error('Pogreška prilikom dohvaćanja podataka', err);
         res.status(500).json({ error: 'Pogreška prilikom dohvaćanja podataka' });
      } 
  });

  app.listen(port, () => {
    console.log(`Server je pokrenut na http://localhost:${port}`);
  });