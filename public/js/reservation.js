document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('Fetching token...');
        const token = localStorage.getItem('token');
        const reservationId = localStorage.getItem('reservationId');
        
        if (!token) {
            console.log('User not authenticated');
            return;
        }
        if (!reservationId) {
            console.log('No reservation ID found');
            return;
        }

        console.log('Fetching reservation details...');
        const response = await fetch(`http://localhost:5000/api/reservations/${reservationId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch reservation details');
        }

        const reservation = await response.json();
        console.log('Reservation details fetched:', reservation);
        
        const reservationDetails = document.getElementById('reservationDetails');
        reservationDetails.innerHTML = `
            <p>Client: ${reservation.clientName}</p>
            <p>Boat: ${reservation.boatName}</p>
            <p>Check-in: ${new Date(reservation.checkIn).toLocaleString()}</p>
            <p>Check-out: ${new Date(reservation.checkOut).toLocaleString()}</p>
            <p>Catway Number: ${reservation.catwayNumber}</p>
        `;
    } catch (error) {
        console.error('Error fetching reservation details:', error);
    }
});



