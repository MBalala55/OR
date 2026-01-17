document.addEventListener('DOMContentLoaded', initializeAuth);

// dohvaća status autentifikacije i prikazuje odgovarajući sadržaj
async function initializeAuth() {
    try {
        const response = await fetch('/user-status');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        renderAuthNav(data);
    } catch (error) {
        console.error('Greška pri dohvaćanju statusa:', error);
        showAuthError();
    }
}

// Renderira navigaciju na osnovu statusa autentifikacije
// Renderira navigaciju na osnovu statusa autentifikacije
// @param {Object} data - Podaci o autentifikaciji
function renderAuthNav(data) {
    const container = document.getElementById('auth-content');
    
    if (data.isAuthenticated) {
        const userName = data.user?.name || 'Korisnik';
        container.innerHTML = `
            <span>Prijavljeni ste kao: ${escapeHtml(userName)}</span> | 
            <a href="/profile">Profil</a> | 
            <a href="/refresh-backups">Osvježi preslike</a> | 
            <a href="/logout" class="logout-link">Odjava</a>
        `;
    } else {
        container.innerHTML = `<a href="/login" class="login-link">Prijava</a>`;
    }
}

// grešku u navigaciji
function showAuthError() {
    const container = document.getElementById('auth-content');
    container.innerHTML = `
        <span style="color: #d32f2f;">Greška pri učitavanju</span> | 
        <a href="/login">Prijava</a>
    `;
}

// štiti od XSS napada osiguravanjem HTML-a
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
