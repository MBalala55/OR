# OR
Repozitorije za labose iz Otvorenog računarstva


## Skup podataka: knjižnica

Skup podataka knjižnica sastoji se od deset različitih književnih djela te neka od njih dijele autora. U skupu se nalazi više od 10 zapisa jer za neke od djela postoji više identičnih primjeraka ili postoji par različitih izdanja, istih ili različitih izdavača. Skup sadrži sljedeće podatke o knjigama: id, isbn, autor, jezik, naziv, izdavac, žanrovi, primjerci (koji sadrži podatak o dostupnosti i broju primjerka), broj stranica, godina izdanja, mjesto izdanja.

**Svrha:** Ovaj skup podataka izrađen je za potrebe izrade laboratorijske vježbe iz kolegija Otvorenog računarstva.

---

## Metapodaci
**Naziv skupa podataka:** knjižnica

**Autor:** Matko Balala

**Jezik podataka:** hrvatski

**Format datoteka:** JSON, CSV

**Broj zapisa:** 15

**Broj atributa:** 11

**Roditelj-dijete veza:** knjiga - primjerci

**Datum izrade:** 25. listopada 2025.

**Baza podataka:** PostgreSQL

---

**Opis atributa**

| Atribut | Opis |
|---------|------|
| id | Jedinstveni identifikator knjige |
| isbn | Međunarodni standardni broj knjige |
| autor | Ime i prezime autora knjige |
| jezik | Jezik na kojem je knjiga napisana |
| naziv | Naslov knjige |
| izdavac | Naziv izdavačke kuće |
| zanrovi | Popis žanrova kojima knjiga pripada |
| primjerci | Popis dostupnih primjeraka (broj primjerka i dostupnost) |
| broj_stranica | Broj stranica koje knjiga sadrži |
| godina_izdanja | Godina kada je knjiga izdana |
| mjesto_izdanja | Mjesto u kojem je knjiga izdana |

---

**Licencija:**  Apache License, Version 2.0 (January 2004) - http://www.apache.org/licenses/

**Datoteke u repozitoriju:**
- knjižnica.json
- knjižnica.csv
- README.md
- LICENSE
- dump.sql

**Verzija:** 1.0
