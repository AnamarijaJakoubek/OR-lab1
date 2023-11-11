import React from 'react';
import Metadata from './Metadata';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <html lang="hr">
      <Metadata />
      <body className="bg-gray-100">
        <div className="container mx-auto my-8 p-8 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center mb-6">
            <h1 className="text-4xl font-bold mb-4 text-blue-600">Skup podataka o hotelima u Hrvatskoj</h1>

            <div className="bg-blue-50 p-2 rounded-md">
              <Link to="/datatable" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                Pregledaj tablicu podataka
              </Link>
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
              <strong>Verzija:</strong> 2.0
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

   

     