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

const OpenApi = require('../openapi.json');

//labos3

function wrapResponse(data, message, status) {
  return {
      status: status,
      message: message,
      data: data
  };
}

function wrapData(data) {
  const context = {
    "@context": {
      "@vocab": "https://schema.org/",
		    "idhotela": "identifier",
		    "naziv": "name",
		    "brojzvjezdica": "starRating",
        "telefon": "telephone",
        "email": "email",
        "webstranica": "url",
    },
    "@type": "Hotel"
  };

  var hotelsWithReviews = [];
  for (const hotel of data) {
      if (hotelsWithReviews.hasOwnProperty(hotel.idhotela)) {
          const noviReview = {
              korisnik: hotel.korisnik,
              ocjena: hotel.ocjena,
              komentar: hotel.komentar
          }
          hotelsWithReviews[hotel.idhotela].recenzije.push(noviReview);
      } else {
          hotelsWithReviews[hotel.idhotela]  = {
              idhotela: hotel.idhotela,
              naziv: hotel.naziv,
              lokacija: hotel.lokacija,
              adresa: {
                  ulica: hotel.ulica,
                  kucnibroj: hotel.kucnibroj,
                  postanskibroj: hotel.postanskibroj
              },
              brojzvjezdica: hotel.brojzvjezdica,
              bazen: hotel.bazen,
              restoran: hotel.restoran,
              besplatanwifi: hotel.besplatanwifi,
              kucniljubimci: hotel.kucniljubimci,
              fitnesscentar: hotel.fitnesscentar,
              spawellnesscentar: hotel.spawellnesscentar,
              kontakt: {
                 "@type": "ContactPoint",
                  telefon: hotel.telefon,
                  email: hotel.email,
                  webstranica: hotel.webstranica
              },
              recenzije: [
                  {
                      korisnik: hotel.korisnik,
                      ocjena: hotel.ocjena,
                      komentar: hotel.komentar
                  }
              ]
              }
      }
  }
finalHotelsWithReviews = hotelsWithReviews.filter(Boolean);
return {
   ...context,
  hoteli: finalHotelsWithReviews
};
}



//GET /api/getAll - Dohvacanje cjelokupne koleckcija podataka
app.get('/api/hoteli', async(req, res) => {
  
  try {
      const client = await pool.connect();
      const result = await client.query(
          `SELECT
              hoteli.idhotela, hoteli.naziv, hoteli.lokacija, adresa.ulica, adresa.kucnibroj, adresa.postanskibroj,
              hoteli.brojzvjezdica, hoteli.bazen, hoteli.restoran, hoteli.besplatanwifi, hoteli.kucniljubimci,
              hoteli.fitnesscentar, hoteli.spawellnesscentar, kontakt.telefon, kontakt.email, kontakt.webstranica,
              recenzije.korisnik, recenzije.ocjena, recenzije.komentar
          FROM
              (public.hoteli
              LEFT JOIN public.adresa ON hoteli.adresaid = adresa.adresaid)
              LEFT JOIN public.kontakt ON hoteli.kontaktid = kontakt.kontaktid
              LEFT JOIN public.recenzije ON hoteli.idhotela = recenzije.hotelid
          `
      );
      client.release();
      res.setHeader('Content-Type', 'application/json');
      res.status(200);
      const data = wrapData(result.rows);
      const wrappedResponse = wrapResponse(data, 'Successfully fetched all data', 'OK');
      res.json(wrappedResponse);

  } catch (err) {
    console.error('Error executing query', err);
    res.setHeader('Content-Type', 'application/json');
    res.status(500)
    const wrappedResponse = wrapResponse(null, 'Failed to fetch all data', 'Internal Server Error');
    res.json(wrappedResponse);
  }
});

//GET  -  dohvaćanje pojedinačnog resursa iz kolekcije temeljem jedinstvenog identifikatora resursa.
app.get('/api/hotel/:id', async(req, res) => {

  try {
      const client = await pool.connect();
      const result = await client.query(
          `SELECT
              hoteli.idhotela, hoteli.naziv, hoteli.lokacija, adresa.ulica, adresa.kucnibroj, adresa.postanskibroj,
              hoteli.brojzvjezdica, hoteli.bazen, hoteli.restoran, hoteli.besplatanwifi, hoteli.kucniljubimci,
              hoteli.fitnesscentar, hoteli.spawellnesscentar, kontakt.telefon, kontakt.email, kontakt.webstranica,
              recenzije.korisnik, recenzije.ocjena, recenzije.komentar
          FROM
              (public.hoteli
              LEFT JOIN public.adresa ON hoteli.adresaid = adresa.adresaid)
              LEFT JOIN public.kontakt ON hoteli.kontaktid = kontakt.kontaktid
              LEFT JOIN public.recenzije ON hoteli.idhotela = recenzije.hotelid
              WHERE CAST(idhotela as TEXT) LIKE '${req.params.id}' 
              `
      );
      client.release();

      if(result.rowCount == 0) {
        res.setHeader('Content-Type', 'application/json');
        res.status(404);
        const wrappedResponse = wrapResponse(null, 'No data found for the provided ID', 'Not found');
        res.json(wrappedResponse);

      } else {
        res.setHeader('Content-Type', 'application/json');
        res.status(200);
        const data = wrapData(result.rows);
        const wrappedResponse = wrapResponse(data, 'Data successfully retrieved for the given ID', 'OK');      
        res.json(wrappedResponse);
      }
    
  } catch (err) {
    console.error('Error executing query', err);
    res.setHeader('Content-Type', 'application/json');
    res.status(500);
    const wrappedResponse = wrapResponse(null, 'Failed to execute query for the provided ID', 'Internal Server Error');
    res.json(wrappedResponse);
  }
});

//GET  - dohvaćanje pojedinačnog resursa iz kolekcije temeljem lokacije
app.get('/api/hotel/lokacija/:lokacija', async(req, res) => {
  try {
      const client = await pool.connect();
      const result = await client.query(
          `SELECT
              hoteli.idhotela, hoteli.naziv, hoteli.lokacija, adresa.ulica, adresa.kucnibroj, adresa.postanskibroj,
              hoteli.brojzvjezdica, hoteli.bazen, hoteli.restoran, hoteli.besplatanwifi, hoteli.kucniljubimci,
              hoteli.fitnesscentar, hoteli.spawellnesscentar, kontakt.telefon, kontakt.email, kontakt.webstranica,
              recenzije.korisnik, recenzije.ocjena, recenzije.komentar
          FROM
              (public.hoteli
              LEFT JOIN public.adresa ON hoteli.adresaid = adresa.adresaid)
              LEFT JOIN public.kontakt ON hoteli.kontaktid = kontakt.kontaktid
              LEFT JOIN public.recenzije ON hoteli.idhotela = recenzije.hotelid
          WHERE lokacija LIKE '%${req.params.lokacija}%' 
          `
      );
      if(result.rowCount == 0) {
        res.setHeader('Content-Type', 'application/json');
        res.status(404);
        const wrappedResponse = wrapResponse(null, 'No data found for the provided location', 'Not found');
        res.json(wrappedResponse);
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.status(200);
        const data = wrapData(result.rows);
        const wrappedResponse = wrapResponse(data, 'Data successfully retrieved for the given location', 'OK');      
        res.json(wrappedResponse);
      }
  } catch (err) {
    console.error('Error executing query', err);
    res.setHeader('Content-Type', 'application/json');
    res.status(500);
    const wrappedResponse = wrapResponse(null, 'Failed to execute query for the provided location', 'Internal Server Error');
    res.json(wrappedResponse);
  }
});

//GET  - dohvaćanje pojedinačnog resursa iz kolekcije temeljem broja zvjezdica
app.get('/api/hotel/zvjezdice/:brojzvjezdica', async(req, res) => {
  try {
      const client = await pool.connect();
      const result = await client.query(
          `SELECT
              hoteli.idhotela, hoteli.naziv, hoteli.lokacija, adresa.ulica, adresa.kucnibroj, adresa.postanskibroj,
              hoteli.brojzvjezdica, hoteli.bazen, hoteli.restoran, hoteli.besplatanwifi, hoteli.kucniljubimci,
              hoteli.fitnesscentar, hoteli.spawellnesscentar, kontakt.telefon, kontakt.email, kontakt.webstranica,
              recenzije.korisnik, recenzije.ocjena, recenzije.komentar
          FROM
              (public.hoteli
              LEFT JOIN public.adresa ON hoteli.adresaid = adresa.adresaid)
              LEFT JOIN public.kontakt ON hoteli.kontaktid = kontakt.kontaktid
              LEFT JOIN public.recenzije ON hoteli.idhotela = recenzije.hotelid
            WHERE CAST(brojzvjezdica as TEXT) LIKE '${req.params.brojzvjezdica}' 
          `
      );
      client.release();
      if(result.rowCount == 0) {
        res.setHeader('Content-Type', 'application/json');
        res.status(404);
        const wrappedResponse = wrapResponse(null, 'No data found for the provided star rating', 'Not found');
        res.json(wrappedResponse);

      } else {
        res.setHeader('Content-Type', 'application/json');
        res.status(200);
        const data = wrapData(result.rows);
        const wrappedResponse = wrapResponse(data, 'Data successfully retrieved for the given star rating', 'OK');      
        res.json(wrappedResponse);
      }          
  } catch (err) {
    console.error('Error executing query', err);
    res.setHeader('Content-Type', 'application/json');
    res.status(500);
    const wrappedResponse = wrapResponse(null, 'Failed to execute query for the provided star rating', 'Internal Server Error');
    res.json(wrappedResponse);
  }
});

//GET  -  dohvaćanje pojedinačnog resursa iz kolekcije temeljem broja bazena
app.get('/api/hotel/bazeni/:brojbazena', async(req, res) => {
  try {
      const client = await pool.connect();
      const result = await client.query(
          `SELECT
              hoteli.idhotela, hoteli.naziv, hoteli.lokacija, adresa.ulica, adresa.kucnibroj, adresa.postanskibroj,
              hoteli.brojzvjezdica, hoteli.bazen, hoteli.restoran, hoteli.besplatanwifi, hoteli.kucniljubimci,
              hoteli.fitnesscentar, hoteli.spawellnesscentar, kontakt.telefon, kontakt.email, kontakt.webstranica,
              recenzije.korisnik, recenzije.ocjena, recenzije.komentar
          FROM
              (public.hoteli
              LEFT JOIN public.adresa ON hoteli.adresaid = adresa.adresaid)
              LEFT JOIN public.kontakt ON hoteli.kontaktid = kontakt.kontaktid
              LEFT JOIN public.recenzije ON hoteli.idhotela = recenzije.hotelid
          WHERE CAST(bazen as TEXT) LIKE '%${req.params.brojbazena}%' 
          `
      );
      client.release();
      if(result.rowCount == 0) {
        res.setHeader('Content-Type', 'application/json');
        res.status(404);
        const wrappedResponse = wrapResponse(null, 'No data found for the provided pool availability', 'Not found');
        res.json(wrappedResponse);

      } else {
        res.setHeader('Content-Type', 'application/json');
        res.status(200);
        const data = wrapData(result.rows);
        const wrappedResponse = wrapResponse(data, 'Data successfully retrieved for the given pool availability', 'OK');      
        res.json(wrappedResponse);
      } 
  } catch (err) {
    console.error('Error executing query', err);
    res.setHeader('Content-Type', 'application/json');
    res.status(500);
    const wrappedResponse = wrapResponse(null, 'Failed to execute query for the provided pool availanility', 'Internal Server Error');
    res.json(wrappedResponse);
  }
});

//POST  -  ubacivanje pojedinačnog resursa u kolekciju.
app.post('/api/hoteli', async(req, res) => {
  try {
    const {
         naziv, lokacija, adresa, 
        brojzvjezdica, bazen, restoran, besplatanwifi,
        kucniljubimci, fitnesscentar, spawellnesscentar, kontakt
      } = req.body;

      const { ulica, kucnibroj, postanskibroj } = adresa; 
      const client = await pool.connect();

      const insertedAddress = await client.query(
        `INSERT INTO adresa (ulica, kucnibroj, postanskibroj) 
        VALUES ($1, $2, $3) 
        RETURNING *`,
        [ulica, kucnibroj, postanskibroj]
      );
      const adresaid = insertedAddress.rows[0].adresaid;

      const insertedContact = await client.query(
        `INSERT INTO kontakt (telefon, email, webstranica) 
        VALUES ($1, $2, $3) 
        RETURNING *`,
        [kontakt.telefon, kontakt.email, kontakt.webstranica]
      );

      const kontaktid = insertedContact.rows[0].kontaktid;

      const result = await client.query(
      `INSERT INTO hoteli (naziv, lokacija, brojzvjezdica, bazen, restoran, besplatanwifi, kucniljubimci, 
          fitnesscentar, spawellnesscentar, adresaid, kontaktid)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING idhotela
      `, [naziv, lokacija, brojzvjezdica, bazen, restoran, besplatanwifi, kucniljubimci, fitnesscentar, spawellnesscentar, adresaid, kontaktid]
      );

      const hotelId = result.rows[0].idhotela;
      req.body = { hotelId, ...req.body };

      client.release();
      res.setHeader('Content-Type', 'application/json');
      res.status(201);
      const wrappedResponse = wrapResponse(req.body, 'Successfully added data', 'Created');
      res.json(wrappedResponse);
      

  } catch (err) {
    console.error('Error executing query', err);
    res.setHeader('Content-Type', 'application/json');
    res.status(500);
    const wrappedResponse = wrapResponse(null, 'Failed to execute query', 'Internal Server Error');
    res.json(wrappedResponse);

  }

});

app.post('/api/hoteli/recenzije/:id', async(req, res) => {
  try {
    const { korisnik, ocjena, komentar } = req.body;
    const hotelId = req.params.id;

      const client = await pool.connect();

        const result = await client.query(
          `INSERT INTO recenzije (hotelid, korisnik, ocjena, komentar) 
          VALUES ($1, $2, $3, $4)`,
          [hotelId, korisnik, ocjena, komentar]
        );
      const data = {
        "hotelId" : hotelId,
        ...req.body
      }
      client.release();
      res.setHeader('Content-Type', 'application/json');
      res.status(201);
      const wrappedResponse = wrapResponse(data, 'Successfully added data', 'Created');
      res.json(wrappedResponse);
      

  } catch (err) {
    console.error('Error executing query', err);
    res.setHeader('Content-Type', 'application/json');
    res.status(500);
    const wrappedResponse = wrapResponse(null, 'Failed to execute query', 'Internal Server Error');
    res.json(wrappedResponse);

  }
 
}) 

//PUT  -  osvježavanje elemenata resursa.
app.put('/api/hotel/:id', async(req, res) => {
  const hotelId = req.params.id;
  var query =  `UPDATE hoteli SET `;
  const body = req.body;
  const keys = Object.keys(body);
  let setValues = '';

  try {
      const client = await pool.connect();

      keys.forEach((key, index) => {
        if(key == 'idhotela') return;
        setValues += `${key} = `;
        setValues += typeof body[key] === 'string' ? `'${body[key]}', ` : `${body[key]}, `;
      })

      // Uklanjanje zadnjeg zareza i razmaka
      setValues = setValues.slice(0, -2);
      query += setValues;
      query += `WHERE CAST(idhotela as TEXT) LIKE '%${req.params.id}%' `;

      const result = await client.query(query);
    
      if (result.rowCount == 0) {
        res.setHeader('Content-Type', 'application/json');
        res.status(404);
        const wrappedResponse = wrapResponse(null, 'No data found for the provided ID', 'Not found');
        res.json(wrappedResponse);

      } else {
        const rows = await client.query(`SELECT * FROM hoteli WHERE CAST(idhotela as TEXT) LIKE '%${req.params.id}%'`)
        res.setHeader('Content-Type', 'application/json');
        res.status(200);
        const wrappedResponse = wrapResponse(rows.rows, 'Data successfully updated', 'OK');
        res.json(wrappedResponse);
      }
      client.release();
  } catch (err) {
    console.error('Error executing query', err);
    res.setHeader('Content-Type', 'application/json');
    res.status(500);
    const wrappedResponse = wrapResponse(null, 'Failed to execute query', 'Internal Server Error');
    res.json(wrappedResponse);
  }

});

//DELETE  -  brisanje pojedinog resursa iz kolekcije temeljem jedinstvenog identifikatora resursa.
app.delete('/api/hotel/:id', async(req, res) => {
  const hotelId = req.params.id;

  try {
    const client = await pool.connect();

   // Obriši hotel
    const rows =  await client.query( `SELECT * FROM hoteli WHERE CAST(idhotela as TEXT) LIKE '%${req.params.id}%' `);
   
    console.log(rows.rows);
    const result = await client.query('DELETE FROM hoteli WHERE idhotela = $1', [hotelId]);

    if(result.rowCount == 0) {
        res.setHeader('Content-Type', 'application/json');
        res.status(404);
        const wrappedResponse = wrapResponse(null, 'No data found for the provided ID', 'Not found');
        res.json(wrappedResponse);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.status(200);
      const wrappedResponse = wrapResponse(rows.rows, 'Data successfully deleted', 'OK');
      res.json(wrappedResponse);
    }
  
  } catch (err) {
    console.error('Error executing query', err);
    res.setHeader('Content-Type', 'application/json');
    res.status(500);
    const wrappedResponse = wrapResponse(null, 'Failed to execute query', 'Internal Server Error');
    res.json(wrappedResponse);
  }

});

app.get('/api/specification', async(req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200);
  const wrappedResponse = wrapResponse(OpenApi, 'OpenApi specifikacija', 'OK');
  res.json(wrappedResponse);
});


app.get('/refresh', async(req, res) => {
    

});




app.listen(port, () => {
  console.log(`Server je pokrenut na http://localhost:${port}`);
});


//dodavanje hotela, recenzij