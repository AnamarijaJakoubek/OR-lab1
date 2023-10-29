--
-- PostgreSQL database dump
--

-- Dumped from database version 15.2
-- Dumped by pg_dump version 15.2

-- Started on 2023-10-29 02:06:39

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 3351 (class 0 OID 74112)
-- Dependencies: 215
-- Data for Name: adresa; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.adresa (adresaid, ulica, kucnibroj, postanskibroj) FROM stdin;
1	Obala Jerka Šižgorića	1	22000
2	Na Moru	1	20235
3	Vlaha Bukovca	6	20000
4	V.Nazota	6	52210
5	Mihanovićeva	1	Donji Grad
6	Alberi	300a	52475
7	Ulica Ivana Gorana Kovačića	14	21300
8	Ulica bana Josipa Jelačića	2	51260
9	Vukovarska	35b	21000
10	Banija ulica	15	47000
\.


--
-- TOC entry 3355 (class 0 OID 74128)
-- Dependencies: 219
-- Data for Name: hoteli; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hoteli (idhotela, naziv, lokacija, brojzvjezdica, bazen, restoran, besplatanwifi, kucniljubimci, fitnesscentar, spawellnesscentar, adresaid, kontaktid) FROM stdin;
1	D-Resort	Šibenik	4	2	2	Da	Da	Da	Da	1	1
2	Sun Gardens	Dubrovnik	5	5	6	Da	Ne	Da	Da	2	2
3	Villa Dubrovnik	Ploče	5	1	1	Da	Da	Da	Da	3	3
4	Monte Mulini	Rovinj	5	2	3	Da	Da	Da	Da	4	4
5	Esplanade Zagreb	Zagreb	5	0	2	Da	Da	Da	Da	5	5
6	Kempinski Hotel Adriatic	Savudrija	5	1	2	Da	Da	Da	Da	6	6
7	Aminess Khalani Beach Hotel	Makarska	5	4	2	Da	Ne	Da	Da	7	7
8	Miramare	Crikvenica	5	1	1	Da	Da	Da	Da	8	8
9	Time Boutique	Split	4	1	1	Da	Ne	Ne	Da	9	9
10	Florian&Godler	Karlovac	4	0	1	Da	Ne	Ne	Da	10	10
\.


--
-- TOC entry 3353 (class 0 OID 74119)
-- Dependencies: 217
-- Data for Name: kontakt; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.kontakt (kontaktid, telefon, email, webstranica) FROM stdin;
1	+385 22 331 452	info@dresortsibenik.com	https://dresortsibenik.com/
2	+385 (0)20 361 500	info@sungardensdubrovnik.com	https://www.dubrovniksungardens.com/
3	+385 20 500 300	reservations@villa-dubrovnik.hr	https://www.villa-dubrovnik.hr/hr/
4	+385 52 808 000	hello@maistra.hr	https://www.maistra.com/hr/smjestaj/hotel-monte-mulini/#/
5	00 385 1 45 666 66	info@esplanade.hr	https://esplanade.hr/
6	+385 52 707 000	reservation.adriatic@kempinski.com	https://www.kempinski.com/hr/hotel-adriatic
7	+385 52 858 600	reservations@aminess.com	https://www.aminess.com/hr/aminess-khalani-beach-hotel
8	+385 51 707 100	booking@miramare.hr	https://www.miramare.hr/hr/
9	+385 (0)95 222 9092	info@hoteltimesplit.com	https://hoteltimesplit.com/
10	+385 47 640138	info@floriangodler.hr	https://floriangodler.hr/
\.


--
-- TOC entry 3357 (class 0 OID 74162)
-- Dependencies: 221
-- Data for Name: recenzije; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recenzije (recenzijaid, hotelid, korisnik, ocjena, komentar) FROM stdin;
1	1	Lana	4	Prekrasno mjesto uz more.
2	1	Ivan	5	Savršena usluga i restorani.
3	1	Petra	4	Bazen je bio odličan.
4	2	Mia	4	Puno sadržaja za djecu.
5	2	Nikola	3	Pogled iz sobe nije bio impresivan.
6	2	Ivana	5	Savršen odmor uz bazen.
7	3	Klara	5	Savršen odmor u Villi Dubrovnik!
8	3	Marko	4	Lijepa plaža i restoran.
9	3	Hrvoje	4	Opuštajući spa centar.
10	4	Eva	5	Prekrasna lokacija i pogled na more.
11	4	Filip	4	Usluga u restoranu bila odlična.
12	4	Luka	5	Osoblje je bilo vrlo ljubazno.
13	5	Lucija	4	Elegantan hotel u centru grada.
14	5	Jakov	3	Nedostatak besplatnog doručka.
15	5	Elena	5	Savršen boravak u luksuznom hotelu.
16	6	Juraj	5	Odličan spa centar i bazen.
17	6	Elena	5	Savršen odmor uz more.
18	6	Nina	4	Predivan pogled na more.
19	7	Hana	3	Nedostatak restorana u blizini.
20	7	Igor	4	Lijepa plaža.
21	7	Petar	4	Dobra zabava na plaži.
22	8	Stjepan	4	Udobne sobe i ljubazno osoblje.
23	8	Klara	4	Predivan pogled na more.
24	8	Ivana	5	Savršena lokacija uz obalu.
25	9	Lara	5	Prekrasan pogled na more iz sobe.
26	9	Ivan	4	Usluga u restoranu bila dobra.
27	9	Petra	5	Osoblje je bilo iznimno susretljivo.
28	10	Dino	3	Dobar doručak, ali male sobe.
29	10	Mia	5	Odlična lokacija u centru grada.
30	10	Filip	4	Lijep vrt i terasa za opuštanje.
\.


--
-- TOC entry 3367 (class 0 OID 0)
-- Dependencies: 214
-- Name: adresa_adresaid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.adresa_adresaid_seq', 10, true);


--
-- TOC entry 3368 (class 0 OID 0)
-- Dependencies: 218
-- Name: hoteli_idhotela_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hoteli_idhotela_seq', 10, true);


--
-- TOC entry 3369 (class 0 OID 0)
-- Dependencies: 216
-- Name: kontakt_kontaktid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.kontakt_kontaktid_seq', 10, true);


--
-- TOC entry 3370 (class 0 OID 0)
-- Dependencies: 220
-- Name: recenzije_recenzijaid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.recenzije_recenzijaid_seq', 30, true);


-- Completed on 2023-10-29 02:06:39

--
-- PostgreSQL database dump complete
--

