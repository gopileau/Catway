document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('Fetching token...');
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('User not authenticated');
            return;
        }

        console.log('Fetching reservations...');
        const response = await fetch('http://localhost:5000/api/reservations', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch reservations');
        }

        const reservations = await response.json();
        console.log('Reservations fetched:', reservations);
        
        const reservationList = document.getElementById('reservationList');
        reservationList.innerHTML = ''; 

        if (reservations.length === 0) {
            reservationList.textContent = 'No reservations available';
        } else {
            reservations.forEach(reservation => {
                const listItem = document.createElement('li');
                listItem.textContent = `Reservation for Catway ${reservation.catwayNumber} - ${reservation.clientName}`;
                listItem.addEventListener('click', () => {
                    localStorage.setItem('reservationId', reservation._id);
                    window.location.href = 'reservation.html';
                });
                reservationList.appendChild(listItem);
            });
        }
    } catch (error) {
        console.error('Error fetching reservations:', error);
    }
});









