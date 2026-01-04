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
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/datatable', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'datatable.html'));
});

app.get('/datajson', async (req, res) => {
    try {
        const trazim = req.query.trazim || '';
        const atribut = req.query.atribut || 'all';
        const download = req.query.download === 'true';

        let upit = `SELECT k.*, z.naziv_zanra AS zanr, p.broj_primjerka, p.dostupnost
                        FROM knjige k
                            LEFT JOIN zanrovi z ON k.id = z.knjiga_id
                            LEFT JOIN primjerci p ON k.id = p.knjiga_id`;

        let params = [];

        if (trazim !== '') {
            const niz = `%${trazim}%`;
            params.push(niz);

            if (atribut === 'all') {
                upit += ` WHERE (k.naziv ILIKE $1`;
                upit += ` OR k.autor ILIKE $1`;
                upit += ` OR z.naziv_zanra ILIKE $1`;
                upit += ` OR CAST(k.godina_izdanja AS TEXT) ILIKE $1`;
                upit += ` OR CAST(k.isbn AS TEXT) ILIKE $1`;
                upit += ` OR p.dostupnost ILIKE $1)`;
            } else if (atribut === 'naziv') {
                upit += ` WHERE k.naziv ILIKE $1`;
            } else if (atribut === 'autor') {
                upit += ` WHERE k.autor ILIKE $1`;
            } else if (atribut === 'zanr') {
                upit += ` WHERE z.naziv_zanra ILIKE $1`;
            } else if (atribut === 'godina_izdanja') {
                upit += ` WHERE CAST(k.godina_izdanja AS TEXT) ILIKE $1`;
            } else if (atribut === 'isbn') {
                upit += ` WHERE CAST(k.isbn AS TEXT) ILIKE $1`;
            } else if (atribut === 'dostupnost') {
                params[0] = `${trazim}%`;
                upit += ` WHERE p.dostupnost ILIKE $1`;
            }
        }

        upit += ` ORDER BY k.id`;

        const pom = await pool.query(upit, params);
        const knjige = pom.rows;

        if (download) {
            res.setHeader('Content-Type', 'application/json');
            res.attachment('knjiznica.json'); 
            return res.send(JSON.stringify(knjige, null, 2));
        }

        res.json(knjige);

    } catch (err) {
        console.error(err);
        res.status(500).send('Greška u dohvaćanju podataka ili filtriranju');
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

// ~ LAB 3 ~

// a)
app.get('/api/knjige', async (req, res) => {
    try {
        const upit = `SELECT k.*, z.naziv_zanra AS zanr, p.broj_primjerka, p.dostupnost
                        FROM knjige k
                            LEFT JOIN zanrovi z ON k.id = z.knjiga_id
                            LEFT JOIN primjerci p ON k.id = p.knjiga_id
                            ORDER BY k.id`;

        const rez = await pool.query(upit);
        
        res.status(200).json({
            "status": "OK",
            "message": "Dohvaćene sve knjige",
            "response": rez.rows
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            "status": "Error",
            "message": "Greška pri dohvaćanju podataka",
            "response": null
        });
    }
});

// b)
app.get('/api/knjige/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id) || id.toString() !== req.params.id) {
            return res.status(400).json({
                "status": "Bad Request",
                "message": "Nešto s ID-om u zahtjevu nije dobro",
                "response": null
            });
        }

        const upit = `SELECT k.*, z.naziv_zanra AS zanr, p.broj_primjerka, p.dostupnost
                        FROM knjige k
                            LEFT JOIN zanrovi z ON k.id = z.knjiga_id
                            LEFT JOIN primjerci p ON k.id = p.knjiga_id
                        WHERE k.id = $1`;

        const rez = await pool.query(upit, [id]);

        if (rez.rows.length === 0) {
            return res.status(404).json({
                "status": "Not Found",
                "message": "Knjiga s tim ID-om ne postoji",
                "response": null
            });
        }

        res.status(200).json({
            "status": "OK",
            "message": "Knjiga s traženim ID-om je pronađena",
            "response": rez.rows
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            "status": "Error",
            "message": "Greška na poslužitelju (b)",
            "response": null
        });
    }
});

// c)
// 1
app.get('/api/knjige/autor/:ime', async (req, res) => {
    try {
        const { ime } = req.params;

        if (!ime || ime.trim().length === 0) {
            return res.status(400).json({
                "status": "Bad Request",
                "message": "Za pretragu po autoru treba unijeti ime",
                "response": null
            });
        }

        const upit = `SELECT k.*, z.naziv_zanra AS zanr, p.broj_primjerka, p.dostupnost
                        FROM knjige k
                            LEFT JOIN zanrovi z ON k.id = z.knjiga_id
                            LEFT JOIN primjerci p ON k.id = p.knjiga_id
                        WHERE k.autor ILIKE $1`;

        const rez = await pool.query(upit, [`%${ime}%`]);

        if (rez.rows.length === 0) {
            return res.status(404).json({
                "status": "Not Found",
                "message": `Nisu pronađene knjige autora: ${ime}`,
                "response": null
            });
        }

        res.status(200).json({
            "status": "OK",
            "message": "Knjige treženog autora su pronađene",
            "response": rez.rows
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            "status": "Error",
            "message": "Greška na poslužitelju prilikom pretrage po autore (c.1)",
            "response": null
        });
    }
});

// 2
app.get('/api/knjige/naslov/:naziv', async (req, res) => {
    try {
        const { naziv } = req.params;

        if (!naziv || naziv.trim().length === 0) {
            return res.status(400).json({
                "status": "Bad Request",
                "message": "Za pretragu po nazivu treba unijeti ime",
                "response": null
            });
        }

        const upit = `SELECT k.*, z.naziv_zanra AS zanr, p.broj_primjerka, p.dostupnost
                        FROM knjige k
                            LEFT JOIN zanrovi z ON k.id = z.knjiga_id
                            LEFT JOIN primjerci p ON k.id = p.knjiga_id
                        WHERE k.naziv ILIKE $1`;

        const rez = await pool.query(upit, [`%${naziv}%`]);

        if (rez.rows.length === 0) {
            return res.status(404).json({
                "status": "Not Found",
                "message": `Nisu pronađene knjige pod nazivom: ${naziv}`,
                "response": null
            });
        }

        res.status(200).json({
            "status": "OK",
            "message": "Knjige treženog naslova su pronađene",
            "response": rez.rows
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            "status": "Error",
            "message": "Greška na poslužitelju prilikom pretrage po nazivu (c.2)",
            "response": null
        });
    }
});

// 3
app.get('/api/knjige/status/dostupne', async (req, res) => {
    try {
        const upit = `SELECT k.*, z.naziv_zanra AS zanr, p.broj_primjerka, p.dostupnost
                        FROM knjige k
                            LEFT JOIN zanrovi z ON k.id = z.knjiga_id
                            LEFT JOIN primjerci p ON k.id = p.knjiga_id
                        WHERE p.dostupnost = 'Dostupna'`;

        const rez = await pool.query(upit);

        if (rez.rows.length === 0) {
            return res.status(404).json({
                "status": "Not Found",
                "message": `Nisu pronađene knjige koje su dostupne`,
                "response": null
            });
        }

        res.status(200).json({
            "status": "OK",
            "message": "Pronađene su dostupne knjige",
            "response": rez.rows
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            "status": "Error",
            "message": "Greška na poslužitelju prilikom pretrage po nazivu (c.3)",
            "response": null
        });
    }
});

// 4
app.get('/api/knjige/status/nedostupne', async (req, res) => {
    try {
        const upit = `SELECT k.*, z.naziv_zanra AS zanr, p.broj_primjerka, p.dostupnost
                        FROM knjige k
                            LEFT JOIN zanrovi z ON k.id = z.knjiga_id
                            LEFT JOIN primjerci p ON k.id = p.knjiga_id
                        WHERE p.dostupnost = 'Nedostupna'`;

        const rez = await pool.query(upit);

        if (rez.rows.length === 0) {
            return res.status(404).json({
                "status": "Not Found",
                "message": `Nisu pronađene knjige koje nisu dostupne`,
                "response": null
            });
        }

        res.status(200).json({
            "status": "OK",
            "message": "Pronađene su knjige koje nisu dostupne",
            "response": rez.rows
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            "status": "Error",
            "message": "Greška na poslužitelju prilikom pretrage po nazivu (c.4)",
            "response": null
        });
    }
});

// d)
app.post('/api/knjige', async (req, res) => {
    const client = await pool.connect();

    try {
        const {
            naziv, autor, godina_izdanja, izdavac, mjesto_izdanja,
            isbn, broj_stranica, jezik,
            zanrovi,
            primjerci
        } = req.body;

        if (!naziv || !autor || !zanrovi || !primjerci) {
            client.release();

            return res.status(400).json({
                "status": "Bad Request",
                "message": "Naziv, autor, zanrovi i primjerci su obavezni za unos",
                "response": null
            });

        }

        await client.query('BEGIN');

        const upit1 = `INSERT INTO knjige (naziv, autor, godina_izdanja, izdavac, mjesto_izdanja, isbn, broj_stranica, jezik)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                        RETURNING id`;

        const rez1 = await client.query(upit1, [naziv, autor, godina_izdanja, izdavac, mjesto_izdanja, isbn, broj_stranica, jezik]);
        const id1 = rez1.rows[0].id;

        if (Array.isArray(zanrovi)) {
            for (const zanr of zanrovi) {
                await client.query(`INSERT INTO zanrovi (knjiga_id, naziv_zanra)
                                    VALUES ($1, $2)`, [id1, zanr]);
            }
        }

        if (Array.isArray(primjerci)) {
            for (const p of primjerci) {
                await client.query(`INSERT INTO primjerci (knjiga_id, broj_primjerka, dostupnost)
                                    VALUES ($1, $2, $3)`, [id1, p.broj_primjerka, p.dostupnost]);
            }
        }

        await client.query(`COMMIT`);

        return res.status(201).json({
            "status": "Created",
            "message": "Uspješno unesen podataka u bazu",
            "response": { id: id1, naziv }
        });

    } catch (err) {
        await client.query(`ROLLBACK`);
        console.error(err);
        return res.status(500).json({
            "status": "Error",
            "message": "Greška pri unosu (d)",
            "response": null
        });
    } finally {
        client.release();
    }
});

// e)
app.put('/api/knjige/:id', async (req, res) => {
    const client = await pool.connect();
    try {
        const { id } = req.params;
        const {
            naziv, autor, godina_izdanja, izdavac, mjesto_izdanja,
            isbn, broj_stranica, jezik,
            zanrovi,
            primjerci
        } = req.body;

        if (isNaN(id)) {
            client.release();
            
            return res.status(400).json({
                "status": "Bad Request",
                "message": "Problem s ID-om",
                "response": null
            });
        }

        await client.query('BEGIN');

        const upit1 = `UPDATE knjige 
                            SET naziv = $1, autor = $2, godina_izdanja = $3, izdavac = $4, 
                                mjesto_izdanja = $5, isbn = $6, broj_stranica = $7, jezik = $8
                            WHERE id = $9 RETURNING *`;
        
        const rez1 = await client.query(upit1, [naziv, autor, godina_izdanja, izdavac, mjesto_izdanja, isbn, broj_stranica, jezik, id]);

        if (rez1.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                "status": "Not Found",
                "message": "Knjiga s tim ID-om ne postoji",
                "response": null
            });
        }

        if (zanrovi && Array.isArray(zanrovi)) {
            await client.query(`DELETE FROM zanrovi WHERE knjiga_id = $1`, [id]);

            for (const zanr of zanrovi) {
                await client.query(`INSERT INTO zanrovi (knjiga_id, naziv_zanra) VALUES ($1, $2)`, [id, zanr]);
            }
        }

        if (primjerci && Array.isArray(primjerci)) {
            await client.query(`DELETE FROM primjerci WHERE knjiga_id = $1`, [id]);
            for (const p of primjerci) {
                await client.query(`INSERT INTO primjerci (knjiga_id, broj_primjerka, dostupnost) VALUES ($1, $2, $3)`, 
                [id, p.broj_primjerka, p.dostupnost]);
            }
        }

        await client.query('COMMIT');

        res.status(200).json({
            "status": "OK",
            "message": "Uspješno ažurirano",
            "response": rez1.rows[0]
        });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({
            "status": "Error",
            "message": "Greška pri ažuriranju (e)",
            "response": null });
    } finally {
        client.release();
    }
});

// f)
app.delete('/api/knjige/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({
                "status": "Bad Request",
                "message": "Nešto s ID-om u zahtjevu nije dobro",
                "response": null
            });
        }

        const upit = `DELETE FROM knjige WHERE id = $1 RETURNING *`;
        const rez = await pool.query(upit, [id]);

        if (rez.rowCount === 0) {
            return res.status(404).json({
                "status": "Not Found",
                "message": `Knjiga s ID-jem ${id} ne postoji, brisanje se nije provelo`,
                "response": null
            });
        }

        res.status(200).json({
            "status": "OK",
            "message": "Uspješno obrisano",
            "response": rez.rows[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            "status": "Error",
            "message": "Greška pri brisanju (f)",
            "response": null
        });
    }
});

app.get('/openapi.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'openapi.json'));
});
// - - - - - - - -

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});