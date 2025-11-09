const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const PORT = 3000;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'knjiznica',
    password: 'bazepodataka',
    port: 5432,
});

pool.connect((err) => {
    if (err)
        console.error('Problem oko povezivanja na bazu - ', err.stack);
    else
        console.log('Povezan na bazu');
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/datatable', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'datatable.html'));
});

app.get('/datajson', async (req, res) => {
    try {
        const knjigeQuery = `SELECT * FROM knjige ORDER BY id`;
        const zanroviQuery = `SELECT * FROM zanrovi ORDER BY knjiga_id, id`;
        const primjerciQuery = `SELECT * FROM primjerci ORDER BY knjiga_id, id`;

        const [knjigeRes, zanroviRes, primjerciRes] = await Promise.all([
            pool.query(knjigeQuery),
            pool.query(zanroviQuery),
            pool.query(primjerciQuery)
        ]);

        const knjige = knjigeRes.rows;
        const zanrovi = zanroviRes.rows;
        const primjerci = primjerciRes.rows;

        const result = knjige.map(k => {
            return {
                ...k,
                zanrovi: zanrovi.filter(z => z.knjiga_id === k.id).map(z => z.naziv_zanra),
                primjerci: primjerci.filter(p => p.knjiga_id === k.id).map(p => ({
                    broj_primjerka: p.broj_primjerka,
                    dostupnost: p.dostupnost
                }))
            };
        });

        // res.json(result);
        
        res.header('Content-Type', 'text/json');
        res.attachment('knjiznica.json');
        res.send(json);
    } catch (err) {
        console.error(err);
        res.status(500).send('Greška u dohvaćanju podataka');
    }
});


app.get('/datacsv', async (req, res) => {
    try {
        const sql = `
            SELECT k.id, k.naziv, k.autor, k.godina_izdanja, k.izdavac,
                   k.mjesto_izdanja, k.isbn, k.broj_stranica, k.jezik,
                   z.naziv_zanra AS zanr, p.broj_primjerka, p.dostupnost
            FROM knjige k
            LEFT JOIN zanrovi z ON k.id = z.knjiga_id
            LEFT JOIN primjerci p ON k.id = p.knjiga_id
            ORDER BY k.id, z.id, p.id;
        `;

        const { rows } = await pool.query(sql);

        let csv = 'id,naziv,autor,godina_izdanja,izdavac,mjesto_izdanja,isbn,broj_stranica,jezik,zanr,broj_primjerka,dostupnost\n';
        
        // radi samo ako vrijednsti ne sadrze "" ili \n
        // treba promijniti ako se takvi znakovi trebaju nalaziti unutra
        // ili ako ce se unositi pa makar i greskom
        rows.forEach(r => {
            csv += `${r.id},${r.naziv},${r.autor},${r.godina_izdanja},${r.izdavac},${r.mjesto_izdanja},${r.isbn},${r.broj_stranica},${r.jezik},${r.zanr},${r.broj_primjerka},${r.dostupnost}\n`;
        });

        res.header('Content-Type', 'text/csv');
        res.attachment('knjiznica.csv');
        res.send(csv);
    } catch (err) {
        console.error(err);
        res.status(500).send('Greška u dohvaćanju podataka');
    }
});

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});