if (!localStorage.getItem('token')) {
    window.location.href = 'index.html';
}
async function loadCatways() {
    try {
        const response = await fetch('/api/catways');
        const catways = await response.json();
        console.log('Catways:', catways);  

        const catwaySelect = document.getElementById('reservationCatwayNumber');
        catways.forEach(catway => {
            console.log('Catway:', catway); 

            const option = document.createElement('option');
            option.value = catway.voie;  
            option.text = catway.voie;   
            catwaySelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading catways:', error);
    }
}

loadCatways();



// Définir toutes les fonctions d'abord

async function fetchCatways() {
    try {
        const response = await fetch('/api/catways', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const catways = await response.json();
        const catwayList = document.getElementById('catwayList');
        catwayList.innerHTML = ''; 
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

async function fetchReservations() {
    try {
        const response = await fetch('/api/reservations', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            const reservations = await response.json();
            const reservationList = document.getElementById('reservationList');
            reservationList.innerHTML = ''; 
  
            const uniqueReservations = reservations.filter((reservation, index, self) =>
                index === self.findIndex((r) => (
                    r.catway._id === reservation.catway._id && r.user._id === reservation.user._id
                ))
            );

            uniqueReservations.forEach(reservation => {
                const listItem = document.createElement('li'); 
                const catwayName = reservation.catway ? reservation.catway.name : 'Inconnu';
                const userName = reservation.user ? reservation.user.name : 'Inconnu';
                listItem.textContent = `Réservation pour Catway ${catwayName} - ${userName}`;
                reservationList.appendChild(listItem);
            });

        } else {
            console.error('Erreur lors de la récupération des réservations:', response.statusText);
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Appeler les fonctions après leur définition
fetchCatways();
fetchReservations();

// Créer Catway
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


// Fonction pour peupler le sélecteur des catways
async function populateCatwaySelect() {
    try {
        const response = await fetch('/api/catways');
        const catways = await response.json();

        const select = document.getElementById('reservationCatwayNumber');
        select.innerHTML = '<option value="">Sélectionner un catway</option>'; // Clear previous options

        catways.forEach(catway => {
            const option = document.createElement('option');
            option.value = catway._id; // Assuming catway._id is the unique identifier
            option.textContent = `Catway ${catway.catwayNumber}`; // Adjust text as needed
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching catways:', error);
    }
}

// Appel de la fonction lorsque le DOM est complètement chargé
document.addEventListener('DOMContentLoaded', () => {
    populateCatwaySelect();
});

// Créer Réservation
document.getElementById('createReservationForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const userId = document.getElementById('userId').value;
    const catwayNumber = document.getElementById('reservationCatwayNumber').value; // Assurez-vous que cette valeur n'est pas undefined
    console.log('Catway Number:', catwayNumber); // Debugging line
    const clientName = document.getElementById('clientName').value;
    const boatName = document.getElementById('boatName').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const checkIn = document.getElementById('checkIn').value;
    const checkOut = document.getElementById('checkOut').value;

    const reservationData = {
        user: userId,
        catway: catwayNumber,
        clientName: clientName,
        boatName: boatName,
        startTime: startTime,
        endTime: endTime,
        checkIn: checkIn,
        checkOut: checkOut
    };

    try {
        const response = await fetch(`/api/catways/${catwayNumber}/reservations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reservationData)
        });

        const result = await response.json();
        if (response.ok) {
            alert('Reservation created successfully!');
        } else {
            alert('Error: ' + result.message);
        }
    } catch (error) {
        console.error('Error creating reservation:', error);
    }
});

// Supprimer Réservation
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

// Supprimer Catway
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

// Créer Utilisateur
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

// Modifier Utilisateur
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

// Supprimer Utilisateur
document.getElementById('deleteUserForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const userId = document.getElementById('deleteUserId').value;

    try {
        const response = await fetch(`/api/users/${userId}`, {
            method: 'DELETE',
            headers:
 {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            alert('User deleted successfully');
        } else {
            const errorData = await response.json();
            alert(errorData.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

