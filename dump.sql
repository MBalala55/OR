--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: knjige; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.knjige (
    id integer NOT NULL,
    naziv character varying(100) NOT NULL,
    autor character varying(100) NOT NULL,
    godina_izdanja integer,
    izdavac character varying(100),
    mjesto_izdanja character varying(50),
    isbn character varying(20),
    broj_stranica integer,
    jezik character varying(50)
);


ALTER TABLE public.knjige OWNER TO postgres;

--
-- Name: knjige_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.knjige_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.knjige_id_seq OWNER TO postgres;

--
-- Name: knjige_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.knjige_id_seq OWNED BY public.knjige.id;


--
-- Name: primjerci; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.primjerci (
    id integer NOT NULL,
    knjiga_id integer NOT NULL,
    broj_primjerka integer NOT NULL,
    dostupnost character varying(20) NOT NULL
);


ALTER TABLE public.primjerci OWNER TO postgres;

--
-- Name: primjerci_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.primjerci_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.primjerci_id_seq OWNER TO postgres;

--
-- Name: primjerci_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.primjerci_id_seq OWNED BY public.primjerci.id;


--
-- Name: zanrovi; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.zanrovi (
    id integer NOT NULL,
    knjiga_id integer NOT NULL,
    naziv_zanra character varying(100) NOT NULL
);


ALTER TABLE public.zanrovi OWNER TO postgres;

--
-- Name: zanrovi_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.zanrovi_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.zanrovi_id_seq OWNER TO postgres;

--
-- Name: zanrovi_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.zanrovi_id_seq OWNED BY public.zanrovi.id;


--
-- Name: knjige id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knjige ALTER COLUMN id SET DEFAULT nextval('public.knjige_id_seq'::regclass);


--
-- Name: primjerci id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.primjerci ALTER COLUMN id SET DEFAULT nextval('public.primjerci_id_seq'::regclass);


--
-- Name: zanrovi id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zanrovi ALTER COLUMN id SET DEFAULT nextval('public.zanrovi_id_seq'::regclass);


--
-- Data for Name: knjige; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.knjige (id, naziv, autor, godina_izdanja, izdavac, mjesto_izdanja, isbn, broj_stranica, jezik) FROM stdin;
1	Hamlet	William Shakespeare	2018	Bulaja naklada	Zagreb	9789533284378	180	hrvatski
2	Kralj Edip	Sophocles	2011	Bulaja naklada	Zagreb	9789533280806	116	hrvatski
3	Rat i mir	Lav Nikolaevič Tolstoj	2015	Bulaja naklada	Zagreb	9789533283197	915	hrvatski
4	1984.	George Orwell	2015	Šareni dućan	Koprivnica	9789533200903	350	hrvatski
5	Zločin i kazna	Fedor Mihaljevič Dostoevskij	2003	Mozaik knjiga	Zagreb	9789531961964	476	hrvatski
6	Božanstvena komedija: Raj	Dante Alighieri	2023	Matica hrvatska	Zagreb	9789533412696	686	hrvatski
7	Gospodar prstenova: Prstenova družina	John Ronald Reuel Tolkien	2018	Lumen izdavaštvo	Zagreb	9789533421544	516	hrvatski
8	Životinjska farma	George Orwell	2004	Globus media	Zagreb	9789537160246	95	hrvatski
9	Životinjska farma	George Orwell	2022	Egmont	Zagreb	9789531324977	136	hrvatski
10	Životinjska farma	George Orwell	2024	Egmont	Zagreb	9789531324977	136	hrvatski
11	Gulliverova putovanja	Jonathan Swift	2018	Bulaja naklada	Zagreb	9789533284309	226	hrvatski
12	Gulliverova putovanja	Jonathan Swift	1997	Školska knjiga	Zagreb	9789530604076	153	hrvatski
13	Gulliverova putovanja	Jonathan Swift	2000	Zagrebačka stvarnost	Zagreb	9789531920540	112	hrvatski
14	Mali princ	Antoine de Saint-Exupéry	2016	Mozaik knjiga	Zagreb	9789531410786	89	hrvatski
15	Mali princ	Antoine de Saint-Exupéry	2021	Mala zvona	Zagreb	9789538313356	60	hrvatski
\.


--
-- Data for Name: primjerci; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.primjerci (id, knjiga_id, broj_primjerka, dostupnost) FROM stdin;
1	1	1	Dostupna
2	1	2	Dostupna
3	2	1	Nedostupna
4	2	2	Nedostupna
5	3	1	Dostupna
6	3	2	Nedostupna
7	4	1	Nedostupna
8	4	2	Dostupna
9	5	1	Dostupna
10	6	1	Nedostupna
11	7	1	Dostupna
12	8	1	Dostupna
13	9	1	Dostupna
14	10	1	Dostupna
15	11	1	Dostupna
16	12	1	Nedostupna
17	13	1	Nedostupna
18	14	1	Dostupna
19	15	1	Dostupna
\.


--
-- Data for Name: zanrovi; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.zanrovi (id, knjiga_id, naziv_zanra) FROM stdin;
1	1	Tragedija
2	1	Drama
3	1	Klasična književnost
4	2	Tragedija
5	2	Drama
6	2	Klasična književnost
7	3	Povijesni roman
8	3	Epika
9	3	Klasična književnost
10	4	Distopija
11	4	Politički roman
12	4	Znanstvena fantastika
13	5	Roman
14	5	Psihološki roman
15	5	Klasična književnost
16	6	Epika
17	6	Alegorija
18	6	Klasična književnost
19	7	Fantastika
20	7	Avantura
21	7	Epika
22	8	Satira
23	8	Alegorija
24	8	Povijesni roman
25	9	Satira
26	9	Alegorija
27	9	Povijesni roman
28	10	Satira
29	10	Alegorija
30	10	Povijesni roman
31	11	Satira
32	11	Fantastika
33	11	Avantura
34	12	Satira
35	12	Fantastika
36	12	Avantura
37	13	Satira
38	13	Fantastika
39	13	Avantura
40	14	Fantastika
41	14	Bajka
42	14	Filozofska priča
43	15	Fantastika
44	15	Bajka
45	15	Filozofska priča
\.


--
-- Name: knjige_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.knjige_id_seq', 15, true);


--
-- Name: primjerci_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.primjerci_id_seq', 19, true);


--
-- Name: zanrovi_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.zanrovi_id_seq', 45, true);


--
-- Name: knjige knjige_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knjige
    ADD CONSTRAINT knjige_pkey PRIMARY KEY (id);


--
-- Name: primjerci primjerci_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.primjerci
    ADD CONSTRAINT primjerci_pkey PRIMARY KEY (id);


--
-- Name: zanrovi zanrovi_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zanrovi
    ADD CONSTRAINT zanrovi_pkey PRIMARY KEY (id);


--
-- Name: primjerci primjerci_knjiga_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.primjerci
    ADD CONSTRAINT primjerci_knjiga_id_fkey FOREIGN KEY (knjiga_id) REFERENCES public.knjige(id) ON DELETE CASCADE;


--
-- Name: zanrovi zanrovi_knjiga_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zanrovi
    ADD CONSTRAINT zanrovi_knjiga_id_fkey FOREIGN KEY (knjiga_id) REFERENCES public.knjige(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

