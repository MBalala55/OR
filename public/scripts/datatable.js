let knjige = [];
let filtrirane = [];

async function fetchBooks(trazim = '', atribut = 'all') {
    const url = `/datajson?trazim=${encodeURIComponent(trazim)}&atribut=${encodeURIComponent(atribut)}`;

    try {
        const res = await fetch(url);

        knjige = await res.json();
        filtrirane = knjige;

        renderTable(filtrirane);
    } catch(err) {
        console.error("Greška pri dohvaćanju url-a: ", err)
    }
}

function renderTable(data) {
    const tbody = document.getElementById('podaci');
    tbody.innerHTML = '';

    data.forEach(red => {
        const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${red.id}</td>
                <td>${red.naziv}</td>
                <td>${red.autor}</td>
                <td>${red.godina_izdanja}</td>
                <td>${red.izdavac}</td>
                <td>${red.mjesto_izdanja}</td>
                <td>${red.isbn}</td>
                <td>${red.broj_stranica}</td>
                <td>${red.jezik}</td>
                <td>${red.zanr}</td>
                <td>${red.broj_primjerka}</td>
                <td>${red.dostupnost}</td>
            `;
            tbody.appendChild(tr);
    });
}

document.getElementById('filter').addEventListener('submit', (e) => {
    e.preventDefault();

    const trazim = document.getElementById('filterInput').value;
    const atribut = document.getElementById('filterAttribute').value;

    fetchBooks(trazim, atribut);
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
    if (!data.length)
        return;

    const keys = ['id','naziv','autor','godina_izdanja','izdavac','mjesto_izdanja','isbn','broj_stranica','jezik','zanr','broj_primjerka','dostupnost'];
    let csv = keys.join(',') + '\n';
    
    data.forEach(red => {
        const row = [
            red.id, red.naziv, red.autor, red.godina_izdanja, red.izdavac,
            red.mjesto_izdanja, red.isbn, red.broj_stranica, red.jezik,
            red.zanr, red.broj_primjerka, red.dostupnost
        ].map(v => `${v}`);
        
        csv += row.join(',') + '\n';
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