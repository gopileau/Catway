document.addEventListener('DOMContentLoaded', async () => {
    const catwayId = localStorage.getItem('catwayId');
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
        const catwayDetails = document.getElementById('catwayDetails');
        catwayDetails.innerHTML = `
            <p>Catway Number: ${catway.catwayNumber}</p>
            <p>Type: ${catway.type}</p>
            <p>State: ${catway.catwayState}</p>
        `;
    } catch (error) {
        console.error('Error:', error);
    }
});
