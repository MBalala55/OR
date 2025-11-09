let knjige = [];
let filtrirane = [];

async function fetchBooks() {
    const res = await fetch('/datajson');
    knjige = await res.json();
    filtrirane = knjige;
    renderTable(filtrirane);
}

function renderTable(data) {
    const tbody = document.getElementById('podaci');
    tbody.innerHTML = '';
    data.forEach(knjiga => {
        knjiga.zanrovi.forEach(z => {
            knjiga.primjerci.forEach(p => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${knjiga.id}</td>
                    <td>${knjiga.naziv}</td>
                    <td>${knjiga.autor}</td>
                    <td>${knjiga.godina_izdanja}</td>
                    <td>${knjiga.izdavac}</td>
                    <td>${knjiga.mjesto_izdanja}</td>
                    <td>${knjiga.isbn}</td>
                    <td>${knjiga.broj_stranica}</td>
                    <td>${knjiga.jezik}</td>
                    <td>${z}</td>
                    <td>${p.broj_primjerka}</td>
                    <td>${p.dostupnost}</td>
                `;
                tbody.appendChild(tr);
            });
        });
    });
}

function filtriraj(trazim, atribut) {
    trazim = trazim.toLowerCase();

    if (!trazim)
        return knjige;

    return knjige.filter(knjiga => {
        if (atribut === 'all') {
            return knjiga.id.toString().includes(trazim) || knjiga.naziv.toLowerCase().includes(trazim) ||
                   knjiga.autor.toLowerCase().includes(trazim) || knjiga.godina_izdanja?.toString().includes(trazim) ||
                   knjiga.izdavac?.toLowerCase().includes(trazim) || knjiga.mjesto_izdanja?.toLowerCase().includes(trazim) ||
                   knjiga.isbn?.toLowerCase().includes(trazim) || knjiga.broj_stranica?.toString().includes(trazim) ||
                   knjiga.jezik?.toLowerCase().includes(trazim) || knjiga.zanrovi.some(z => z.toLowerCase().includes(trazim)) ||
                   knjiga.primjerci.some(p => p.dostupnost.toLowerCase().includes(trazim));
        } else if (atribut === 'naziv') {
            return knjiga.naziv.toLowerCase().includes(trazim);
        } else if (atribut === 'autor') {
            return knjiga.autor.toLowerCase().includes(trazim);
        } else if (atribut === 'zanr') {
            return knjiga.zanrovi.some(z => z.toLowerCase().includes(trazim));
        } else if (atribut === 'godina_izdanja') {
            return knjiga.godina_izdanja?.toString().includes(trazim);
        } else if (atribut === 'isbn') {
            return knjiga.isbn?.toLowerCase().includes(trazim);
        } else if (atribut === 'dostupnost') {
            return knjiga.primjerci.some(p => p.dostupnost.toLowerCase().includes(trazim));
        }
    });
}

document.getElementById('filter').addEventListener('submit', (e) => {
    e.preventDefault();
    const trazim = document.getElementById('filterInput').value;
    const atribut = document.getElementById('filterAttribute').value;
    filtrirane = filtriraj(trazim, atribut);
    renderTable(filtrirane);
});

function downloadJson(data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'filtrirani_knjiznica.json';
    a.click();
    URL.revokeObjectURL(url);
}

function downloadCsv(data) {
    if (!data.length) return;
    const keys = ['id','naziv','autor','godina_izdanja','izdavac','mjesto_izdanja','isbn','broj_stranica','jezik','zanr','broj_primjerka','dostupnost'];
    let csv = keys.join(',') + '\n';
    data.forEach(knjiga => {
        knjiga.zanrovi.forEach(z => {
            knjiga.primjerci.forEach(p => {
                const row = [
                    knjiga.id, knjiga.naziv, knjiga.autor, knjiga.godina_izdanja, knjiga.izdavac,
                    knjiga.mjesto_izdanja, knjiga.isbn, knjiga.broj_stranica, knjiga.jezik,
                    z, p.broj_primjerka, p.dostupnost
                ].map(v => `${v}`);
                csv += row.join(',') + '\n';
            });
        });
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'filtrirani_knjiznica.csv';
    a.click();
    URL.revokeObjectURL(url);
}

document.getElementById('downloadJson').addEventListener('click', () => downloadJson(filtrirane));
document.getElementById('downloadCsv').addEventListener('click', () => downloadCsv(filtrirane));

fetchBooks();