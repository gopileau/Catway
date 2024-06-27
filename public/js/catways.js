document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/catways', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const catways = await response.json();
        const catwayList = document.getElementById('catwayList');
        catways.forEach(catway => {
            const listItem = document.createElement('li');
            listItem.textContent = `Catway ${catway.catwayNumber} - ${catway.type}`;
            listItem.addEventListener('click', () => {
                localStorage.setItem('catwayId', catway._id);
                window.location.href = 'catway.html';
            });
            catwayList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error:', error);
    }
});
