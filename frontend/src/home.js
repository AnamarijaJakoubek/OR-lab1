import React, {useState, useContext} from 'react';
import Metadata from './Metadata';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import exportFromJSON from 'export-from-json';

const Home = () => {
  const [selectedAttribute, setSelectedAttribute] = useState('wildcard');
  const [filterText, setFilterText] = useState('');
  const {isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const [data, setData] = useState([]);
    var finalHotelsWithReviews = [];

    const context = {
      "@context": {
        "@vocab": "https://schema.org/",
        "idhotela": "identifier",
		    "naziv": "name",
		    "brojzvjezdica": "starRating",
        "telefon": "telephone",
        "email": "email",
        "webstranica": "url",
        "lokacija": "location",
        "adresa": "address",
        "ulica": "streetAddress",
        "kucnibroj": "streetAddress",
        "postanskibroj": "postalCode",
        "kucniljubimci": "petsAllowed",
        "kontakt": "ContactPoint"
      },
      "@type": "LodgingBusiness"
    };
  

const formatData = () => {
 
    var hotelsWithReviews = [];
    for (const hotel of data) {
        if (hotelsWithReviews.hasOwnProperty(hotel.idhotela)) {
            const noviReview = {
              "@type": "Review",
                korisnik: hotel.korisnik,
                ocjena: hotel.ocjena,
                komentar: hotel.komentar
            }
            hotelsWithReviews[hotel.idhotela].recenzije.push(noviReview);
        } else {
            hotelsWithReviews[hotel.idhotela]  = {
              "@type": "Hotel",
                idhotela: hotel.idhotela,
                naziv: hotel.naziv,
                lokacija: hotel.lokacija,
                adresa: {
                  "@type": "PostalAddress",
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
                      "@type": "Review",
                        korisnik: hotel.korisnik,
                        ocjena: hotel.ocjena,
                        komentar: hotel.komentar
                    }
                ]
                }
        }
    }
 finalHotelsWithReviews = hotelsWithReviews.filter(Boolean);
  // return {
  //   ...context,
  //   hoteli: finalHotelsWithReviews
  // };
}

const exportJSON = () => {
  formatData();
exportFromJSON({ data: { ...context, hoteli: finalHotelsWithReviews }, fileName: 'hoteli2', exportType: 'json' });
};

    
const exportCSV = () => {
    const fileName = 'hoteli2';
    const exportType = exportFromJSON.types.csv;
    exportFromJSON({data, fileName,  exportType});
};

  
  const refresh =  () => {
    const requestData = {
      selectedAttribute: selectedAttribute,
      filterText: filterText,
    };
  fetch(`/filter`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body : JSON.stringify(requestData),
  })
      .then((response) => {
          if (!response.ok) {
          throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then((fetchedData) => {
          setData(fetchedData);
         
      })
      .catch((error) => {
          console.error('Error fetching data:', error);
      });
      exportJSON();
      exportCSV();
  };


  return (
    <html lang="hr">
      <Metadata />
      <body className="bg-gray-100">
        <div className="container mx-auto my-8 p-8 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center mb-6">
            <h1 className="text-4xl font-bold mb-4 text-blue-600">Skup podataka o hotelima u Hrvatskoj</h1>

            <div className="bg-blue-50 p-2 rounded-md flex gap-4">
              {isAuthenticated && (
                <Link to="/profile" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                  Korisnički profil
                </Link> 
              )}
              {isAuthenticated && (
                <button onClick={() => refresh()} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                  Osvježi preslike
                </button> 
                )}
              <Link to="/datatable" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                Pregledaj tablicu podataka
              </Link>
              {!isAuthenticated && ( 
              <button onClick={() => loginWithRedirect()} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                Prijava
                </button>
              )}
             
              {isAuthenticated (
                <button onClick={() => logout( { returnTo: window.location.origin } )} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                 Odjava
                </button> 
                )}
            </div>
          </div>
          <div className="mb-8 bg-blue-50 p-6 rounded-md">
            <h2 className="text-2xl font-bold mb-2 text-blue-800">Druga laboratorijska vježba iz kolegija Otvoreno računarstvo</h2>
            <p className="text-gray-700">
              <strong>Autor:</strong> Anamarija Jakoubek
            </p>
            <p className="text-gray-700">
              <strong>Licenca:</strong> Creative Commons Zero v1.0 Universal
            </p>
            <p className="text-gray-700">
              <strong>Verzija:</strong> 4.0
            </p>
            <p className="text-gray-700">
              <strong>Jezik:</strong> Hrvatski
            </p>
            <p className="text-gray-700">
              <strong>Godina prikupljanja podataka:</strong> 2023
            </p>
            <p className="text-gray-700">
              <strong>Prostorni obuhvat:</strong> Republika Hrvatska
            </p>
          </div>

          <div className="mb-8 bg-blue-50 p-6 rounded-md">
            <h2 className="text-2xl font-bold mb-2 text-blue-800">Popis datoteka</h2>
            <ul className="list-disc list-inside text-gray-700">
              <li>hoteli.json</li>
              <li>hoteli.csv</li>
              <li>hoteli_dump.sql</li>
              <li>LICENCE</li>
              <li>README.md</li>
              <li>schema.json</li>
              <li>frontend</li>
              <li>backend</li>
            </ul>
          </div>

          <div className="mb-8 bg-blue-50 p-6 rounded-md">
            <h2 className="text-2xl font-bold mb-2 text-blue-800">Opis atributa</h2>
            <ul className="list-disc list-inside text-gray-700">
            <li><strong>Naziv:</strong> Naziv hotela</li>
          <li><strong>Lokacija:</strong> Grad/mjesto u kojem se hotel nalazi</li>
          <li><strong>Adresa:</strong> Ulica, kućni broj, poštanski broj</li>
          <li><strong>Broj zvjezdica:</strong> Kategorizacija po Pravilniku o razvrstavanju, kategorizaciji i posebnim standardima ugostiteljskih objekata</li>
          <li><strong>Bazen:</strong> Broj bazena u sklopu hotela</li>
          <li><strong>Restoran:</strong> Broj restorana u sklopu hotela</li>
          <li><strong>Besplatan wifi:</strong> Nudi li hotel besplatan wifi</li>
          <li><strong>Kućni ljubimci:</strong> Je li dozvoljen boravak kućnim ljubimcima</li>
          <li><strong>Fitness centar:</strong> Sadrži li hotel fitness centar</li>
          <li><strong>Spa i wellness centar:</strong> Sadrži li hotel spa i wellness centar</li>
          <li><strong>Kontakt:</strong> Broj telefona, e-mail, web stranica</li>
          <li><strong>Recenzije:</strong> Recenzije gostiju</li>
            </ul>
          </div>
          <div className="mb-8 bg-blue-50 p-6 rounded-md">
            <h2 className="text-2xl font-bold mb-2 text-blue-800">Poveznice na verzije podataka</h2>
            <p className="text-gray-700">
              Pogledajte verzije podataka u oblicima CSV i JSON:
              <br />
              <a href="/hoteli.csv" className="text-blue-500 hover:underline" download>
                hoteli.csv
              </a>
              {' | '}
              <a href="/hoteli.json" className="text-blue-500 hover:underline" download>
                hoteli.json
              </a>
            </p>
          </div>
        </div>
      </body>
    </html>
  );
};

export default Home;

   

     