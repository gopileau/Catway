// Code pour stocker l'ID du catway dans localStorage
localStorage.setItem('catwayId', '66d9beab579f91f9f19b988E');

// Code pour récupérer les détails du catway à partir de l'API
document.addEventListener('DOMContentLoaded', async () => {
    const catwayId = localStorage.getItem('catwayId');
    console.log(catwayId);

    if (!catwayId) {
        alert('Catway ID not found');
        window.location.href = 'catways.html';
        return;
    }

    try {
        const response = await fetch(`/api/catways/${catwayId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const catway = await response.json();
        console.log(catway); // Ajoutez cette ligne pour afficher la réponse de l'API
        if (catway) {
            const catwayDetails = document.getElementById('catwayDetails');
            catwayDetails.innerHTML = `
                <p>Catway Number: ${catway.catwayNumber}</p>
                <p>Type: ${catway.type}</p>
                <p>State: ${catway.catwayState}</p>
            `;
        } else {
            console.log('Aucun détail trouvé pour le catway');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});