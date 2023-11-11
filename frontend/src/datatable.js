import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import exportFromJSON from 'export-from-json';

const Datatable = () => {
    const [selectedAttribute, setSelectedAttribute] = useState('wildcard');
    const [filterText, setFilterText] = useState('');
    const [data, setData] = useState([]);
    var finalHotelsWithReviews = [];

    const handleSearch = () => {
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
    };

    const formatData = () => {
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
    
    }

   const exportJSON = () => {
    formatData();
    exportFromJSON({ data: { hoteli: finalHotelsWithReviews }, fileName: 'hoteli', exportType: 'json' });
};
    
        
    const exportCSV = () => {
        const fileName = 'hoteli';
        const exportType = exportFromJSON.types.csv;
        exportFromJSON({data, fileName,  exportType});
    };

    const isTableEmpty = data.length === 0;

    return (

        <>
        <div className="my-4 p-4 bg-gray-200 rounded shadow-md">
            <label className="block mb-2">Odaberite atribut za pretragu:</label>
            <select
                className="border p-2 mr-2"
                value={selectedAttribute}
                onChange={(e) => setSelectedAttribute(e.target.value)}>
                <option value="wildcard">Svi atributi</option>
                <option value="naziv">Naziv</option>
                <option value="lokacija">Lokacija</option>
                <option value="brojzvjezdica">Broj zvjezdica</option>
                <option value="bazen">Broj bazena</option>
                <option value="restoran">Broj restorana</option>
                <option value="besplatanwifi">Besplatan wifi</option>
                <option value="kucniljubimci">Kućni ljubimci</option>
                <option value="fitnesscentar">Fitness centar</option>
                <option value="spawellnesscentar">Spa i wellness centar</option>        
            </select>
          <input
            type="text"
            className="border p-2 mr-2"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
          
            <button className="bg-blue-500 text-white px-4 py-2 rounded m-2 hover:bg-blue-600"
            onClick={handleSearch}>Pretraži</button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded m-2 hover:bg-blue-600"
            onClick={exportJSON}>Preuzmi JSON</button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded m-2 hover:bg-blue-600"
            onClick={exportCSV}>Preuzmi CSV</button>
           <Link to="/" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Početna</Link>
        </div>
        {isTableEmpty ? (
        <p>Nema podataka.</p>
      ) : (
        <>
        <table className="w-full table-fixed">
        <thead>
            <tr>
            <th className="w-1/12">Naziv</th>
            <th className="w-1/12">Lokacija</th>
            <th className="w-2/12">Ulica, kućni broj, poštanski broj</th>
            <th className="w-1/12">Broj zvjezdica</th>
            <th className="w-1/12">Bazen</th>
            <th className="w-1/12">Restoran</th>
            <th className="w-1/12">Besplatan wifi</th>
            <th className="w-1/12">Kućni ljubimci</th>
            <th className="w-1/12">Fitness centar</th>
            <th className="w-1/12">Spa i wellness centar</th>
            <th className="w-1/12">Telefon</th>
            <th className="w-2/12 whitespace-normal">Email</th>
            <th className="w-2/12 whitespace-normal">Web stranica</th>
            <th className="w-1/12">Recenzija</th>
            </tr>
        </thead>
        <tbody>
        {data.map((item, index) => (
                <tr key={index} className={`border-t ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
                     <td className="w-1/12 border p-2">{item.naziv}</td>
                    <td className="w-1/12 border p-2">{item.lokacija} </td>
                    <td className="w-2/12 border p-2">{item.ulica} {item.kucnibroj}, {item.postanskibroj}</td>
                    <td className="w-1/12 border p-2">{item.brojzvjezdica}</td>
                    <td className="w-1/12 border p-2">{item.bazen}</td>
                    <td className="w-1/12 border p-2">{item.restoran}</td>
                    <td className="w-1/12 border p-2">{item.besplatanwifi}</td>
                    <td className="w-1/12 border p-2">{item.kucniljubimci}</td>
                    <td className="w-1/12 border p-2">{item.fitnesscentar}</td>
                    <td className="w-1/12 border p-2">{item.spawellnesscentar}</td>
                    <td className="w-1/12 border p-2">{item.telefon}</td>
                    <td className="w-2/12 border p-2 whitespace-no-wrap overflow-hidden">{item.email}</td>
                    <td className="w-2/12 border p-2 whitespace-no-wrap overflow-hidden">{item.webstranica}</td>
                    <td className="w-1/12 border p-2">{item.korisnik}, {item.ocjena}, "{item.komentar}"</td>
                </tr>     
            ))}       
        </tbody>
    </table>
    </> )}
    </>
    );
};
export default Datatable;