document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.token) {
            localStorage.setItem('token', data.token);
            window.location.href = 'dashboard.html'; // Rediriger vers la page de tableau de bord après la connexion réussie
        } else {
            alert(data.message); // Afficher un message d'erreur si la connexion a échoué
        }
    } catch (err) {
        console.error(err);
        alert('An error occurred. Please try again.'); // Afficher un message d'erreur générique en cas d'erreur
    }
});


