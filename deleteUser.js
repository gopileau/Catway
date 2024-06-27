// Assurez-vous que ce code est exécuté après le chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    // Fonction pour supprimer un utilisateur
    const deleteUser = async (userId) => {
        const token = localStorage.getItem('token');

        if (!token) {
            console.error('No token found');
            return;
        }

        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 401) {
                console.error('Authorization error');
            } else {
                const data = await response.json();
                console.log('User deleted:', data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Gestionnaire de soumission pour le formulaire de suppression d'utilisateur
    document.getElementById('deleteUserForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const userId = document.getElementById('deleteUserId').value;
        await deleteUser(userId); // Appel de la fonction deleteUser
    });

    // Fetch catways and reservations
    fetchCatways();
    fetchReservations();

    // Fonction pour récupérer et afficher les catways
    async function fetchCatways() {
        try {
            const response = await fetch('/api/catways', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const catways = await response.json();
            const catwayList = document.getElementById('catwayList');
            catwayList.innerHTML = ''; // Clear the list before adding new items
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
    }

    // Fonction pour récupérer et afficher les réservations
    async function fetchReservations() {
        try {
            const response = await fetch('/api/reservations', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const reservations = await response.json();
            const reservationList = document.getElementById('reservationList');
            reservationList.innerHTML = ''; // Clear the list before adding new items
            reservations.forEach(reservation => {
                const listItem = document.createElement('li');
                listItem.textContent = `Reservation for Catway ${reservation.catwayNumber} - ${reservation.clientName}`;
                listItem.addEventListener('click', () => {
                    localStorage.setItem('reservationId', reservation._id);
                    window.location.href = 'reservation.html';
                });
                reservationList.appendChild(listItem);
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Form handlers to create, update, and delete catways and reservations

    // Create Catway
    document.getElementById('createCatwayForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const catwayNumber = document.getElementById('catwayNumber').value;
        const type = document.getElementById('type').value;
        const catwayState = document.getElementById('catwayState').value;

        try {
            const response = await fetch('/api/catways', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ catwayNumber, type, catwayState })
            });

            if (response.ok) {
                alert('Catway created successfully');
                fetchCatways();
            } else {
                const errorData = await response.json();
                alert(errorData.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    // Create Reservation
    document.getElementById('createReservationForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const catwayNumber = document.getElementById('reservationCatwayNumber').value;
        const clientName = document.getElementById('clientName').value;
        const boatName = document.getElementById('boatName').value;
        const checkIn = document.getElementById('checkIn').value;
        const checkOut = document.getElementById('checkOut').value;

        try {
            const response = await fetch(`/api/catways/${catwayNumber}/reservations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ clientName, boatName, checkIn, checkOut })
            });

            if (response.ok) {
                alert('Reservation created successfully');
                fetchReservations();
            } else {
                const errorData = await response.json();
                alert(errorData.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    // Delete Reservation
    document.getElementById('deleteReservationForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const reservationId = document.getElementById('deleteReservationId').value;

        try {
            const response = await fetch(`/api/reservations/${reservationId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                alert('Reservation deleted successfully');
                fetchReservations();
            } else {
                const errorData = await response.json();
                alert(errorData.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    // Delete Catway
    document.getElementById('deleteCatwayForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const catwayId = document.getElementById('deleteCatwayId').value;

        try {
            const response = await fetch(`/api/catways/${catwayId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                alert('Catway deleted successfully');
                fetchCatways();
            } else {
                const errorData = await response.json();
                alert(errorData.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    // Create User
    document.getElementById('createUserForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const userName = document.getElementById('userName').value;
        const userEmail = document.getElementById('userEmail').value;
        const userPassword = document.getElementById('userPassword').value;

        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ name: userName, email: userEmail, password: userPassword })
            });

            if (response.ok) {
                alert('User created successfully');
            } else {
                const errorData = await response.json();
                alert(errorData.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    // Modify User
    document.getElementById('modifyUserForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const userId = document.getElementById('modifyUserId').value;
        const userName = document.getElementById('modifyUserName').value;
        const userEmail = document.getElementById('modifyUserEmail').value;
        const userPassword = document.getElementById('modifyUserPassword').value;

        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ name: userName, email: userEmail, password: userPassword })
            });

            if (response.ok) {
                alert('User modified successfully');
            } else {
                const errorData = await response.json();
                alert(errorData.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});
