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
    console.log('Catways:', catways);
    const catwayList = document.getElementById('catwayList');
    catwayList.innerHTML = '';
    catways.forEach(catway => {
      const listItem = document.createElement('li');
      listItem.textContent = `Catway ${catway.catwayNumber} - ${catway.type}`;
      catwayList.appendChild(listItem);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  fetchCatways();
});
async function fetchCatwayDetails(id) {
    console.log('Catway ID :', id);
    try {
      const response = await fetch(`/api/catways/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const catwayDetails = await response.json();
        console.log('Catway Details :', catwayDetails);
        // Vérifiez si les données du catway sont correctement récupérées
        if (catwayDetails && catwayDetails.number && catwayDetails.type && catwayDetails.state) {
          // Afficher les détails du catway ici
          document.getElementById('catway-number').innerHTML = catwayDetails.number;
          document.getElementById('catway-type').innerHTML = catwayDetails.type;
          document.getElementById('catway-state').innerHTML = catwayDetails.state;
        } else {
          console.error('Les données du catway ne sont pas correctement récupérées');
        }
      } else {
        console.error('Erreur lors de la récupération des détails du catway:', response.statusText);
        // Afficher un message d'erreur si nécessaire
        const errorMessageElement = document.getElementById('errorMessage');
        if (errorMessageElement) {
          errorMessageElement.innerHTML = `Erreur lors de la récupération des détails du catway: ${response.statusText}`;
        } else {
          console.error('L\'élément errorMessage n\'est pas défini');
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
      // Afficher un message d'erreur si nécessaire
      const errorMessageElement = document.getElementById('errorMessage');
      if (errorMessageElement) {
        errorMessageElement.innerHTML = `Erreur lors de la récupération des détails du catway: ${error.message}`;
      } else {
        console.error('L\'élément errorMessage n\'est pas défini');
      }
    }
  }
  async function updateCatway(id) {
    try {
      const response = await fetch(`/api/catways/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          // données à mettre à jour
        })
      });
      if (response.ok) {
        console.log('Catway mis à jour avec succès');
      } else {
        console.error('Erreur lors de la mise à jour du catway:', response.statusText);
      }
    } catch (error) {
      console.error('Erreur:', error);
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
    const catwayNumber = document.getElementById('reservationCatwayNumber').value; 
    console.log('Catway Number:', catwayNumber); 
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

// Modifier Catway
const updateCatwayForm = document.getElementById('updateCatwayForm');

updateCatwayForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const updateCatwayId = document.getElementById('updateCatwayId').value;
  const updateCatwayStatus = document.getElementById('updateCatwayStatus').value;

  try {
    const response = await fetch(`/api/catways/${updateCatwayId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ state: updateCatwayStatus }),
    });

    if (response.ok) {
      console.log('Catway mis à jour avec succès');
    } else {
      console.error('Erreur lors de la mise à jour du catway');
    }
  } catch (error) {
    console.error(error);
  }
});

// Supprimer Catway
const deleteCatwayForm = document.getElementById('deleteCatwayForm');

deleteCatwayForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const deleteCatwayId = document.getElementById('deleteCatwayId').value;

  try {
    const response = await fetch(`/api/catways/${deleteCatwayId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      console.log('Catway supprimé avec succès');
    } else {
      console.error('Erreur lors de la suppression du catway');
    }
  } catch (error) {
    console.error(error);
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

