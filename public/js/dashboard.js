if (!localStorage.getItem('token')) {
    window.location.href = 'index.html';
}


async function loadCatways() {
  try {
    const response = await fetch('/api/catways'); 
    if (!response.ok) throw new Error('Erreur lors de la récupération des catways');

    const catways = await response.json();
    console.log('Catways récupérés:', catways);

    const select = document.getElementById('catwaySelect');
    select.innerHTML = '<option value="">Sélectionnez un Catway</option>'; 

    catways.forEach(catway => {
      const option = document.createElement('option');
      option.value = catway._id; 
      option.textContent = `Catway ${catway.number || 'N/A'}`; 
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Erreur lors du chargement des catways:', error);
    alert('Impossible de charger les catways. Veuillez réessayer.');
  }
}
document.addEventListener('DOMContentLoaded', () => {
  loadCatways(); 
});



async function loadReservations() {
  try {
    const response = await fetch('/api/reservations');
    const reservations = await response.json();
    console.log('Réservations:', reservations);

    const reservationSelect = document.getElementById('reservationSelect'); 
    reservationSelect.innerHTML = ''; 
    reservations.forEach(reservation => {
      const option = document.createElement('option');
      option.value = reservation._id; 
      option.text = `Réservation ${reservation.num} - ID: ${reservation._id}`;
      reservationSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations:', error);
  }
}

loadReservations();

async function loadUsers() {
  try {
    const response = await fetch('/api/users'); 
    const users = await response.json();

    const userSelect = document.getElementById('userSelect');
    userSelect.innerHTML = '<option value="">Sélectionnez un Utilisateur</option>';

    users.forEach(user => {
      const option = document.createElement('option');
      option.value = user._id; 
      option.textContent = user.name; 
      userSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Erreur lors du chargement des utilisateurs:', error);
    alert('Impossible de charger les utilisateurs. Veuillez réessayer.');
  }
}


document.addEventListener('DOMContentLoaded', loadUsers);


async function fetchCatways() {
  try {
    const response = await fetch('/api/catways');
    if (!response.ok) throw new Error('Erreur lors de la récupération des catways');

    const catways = await response.json();
    const catwayList = document.getElementById('catwayList') || document.createElement('ul'); 
    catwayList.id = 'catwayList';
    
 
    catwayList.innerHTML = '';

    catways.forEach(catway => {
      const listItem = document.createElement('li');
      listItem.textContent = `Catway ${catway.catwayNumber} - ${catway.type}`;
      catwayList.appendChild(listItem);
    });

  } catch (error) {
    console.error('Erreur :', error);
    alert('Erreur lors de la récupération des catways');
  }
}


document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('viewCatwayForm').addEventListener('submit', async (event) => {
      event.preventDefault();
      
      const catwayId = document.getElementById('catwayNumberInput').value.trim();
      console.log('ID du Catway entré:', catwayId);
      
      if (!catwayId) {
          alert('Veuillez entrer un ID de catway.');
          return;
      }

      try {
    
          const response = await fetch(`/api/catways/${catwayId}?_=${new Date().getTime()}`);
          const text = await response.text(); 
          console.log('Réponse brute de l\'API:', text);
          
          if (!response.ok) {
              throw new Error(`Erreur HTTP: ${response.status} - Catway non trouvé`);
          }

          const catway = JSON.parse(text);
          console.log('Détails du Catway (objet):', catway);

       
          if (catway && catway.id && catway.number && catway.type && catway.state) {
              document.getElementById('catwayDetails').innerHTML = `
                  <h3>Détails du Catway</h3>
                  <p>ID: ${catway.id}</p>
                  <p>Numéro: ${catway.number}</p>
                  <p>Type: ${catway.type}</p>
                  <p>État: ${catway.state}</p>
              `;
          } else {
              document.getElementById('catwayDetails').innerHTML = `
                  <h3>Détails du Catway</h3>
                  <p>ID: ${catway.id || 'N/A'}</p>
                  <p>Numéro: ${catway.number || 'N/A'}</p>
                  <p>Type: ${catway.type || 'N/A'}</p>
                  <p>État: ${catway.state || 'N/A'}</p>
                  <p>Certains détails du catway sont manquants.</p>
              `;
          }
      } catch (error) {
          console.error('Erreur lors de la récupération des détails du catway:', error);
          alert('Erreur lors de la récupération des détails du catway. Veuillez vérifier l\'ID et réessayer.');
      }
  });
});

async function fetchReservations() {
  try {
    const responseReservations = await fetch('/api/reservations', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!responseReservations.ok) throw new Error('Erreur lors de la récupération des réservations');
    const reservations = await responseReservations.json();
    
    const responseCatways = await fetch('/api/catways');
    const catways = await responseCatways.json();

    
    const reservationList = document.getElementById('reservationList');
    if (!reservationList) {
      console.error('Element with ID "reservationList" not found');
      return;
    }
    
    reservationList.innerHTML = ''; 

    reservations.forEach(reservation => {
      const listItem = document.createElement('li');

      const catway = reservation.catway ? `Catway ${reservation.catway.catwayNumber}` : 'Catway non attribué';
      const user = reservation.user ? reservation.user.name : 'Utilisateur inconnu';

      listItem.innerHTML = `
        <h3>Détails de la Réservation</h3>
        <p>ID Réservation: ${reservation._id}</p>
        <p>Client: ${reservation.clientName || 'N/A'}</p>
        <p>Bateau: ${reservation.boatName || 'N/A'}</p>
        <p>Catway: ${catway}</p>
        <p>Heure de Début: ${new Date(reservation.startTime).toLocaleString()}</p>
        <p>Heure de Fin: ${new Date(reservation.endTime).toLocaleString()}</p>
        <p>Check-In: ${new Date(reservation.checkIn).toLocaleString()}</p>
        <p>Check-Out: ${new Date(reservation.checkOut).toLocaleString()}</p>
      `;

      reservationList.appendChild(listItem);
    });

    const catwaySelect = document.getElementById('reservationCatwayNumber');
    catwaySelect.innerHTML = '<option value="">-- Choisissez un catway --</option>';
    catways.forEach(catway => {
      const option = document.createElement('option');
      option.value = catway._id;
      option.text = catway.catwayNumber; 
      catwaySelect.appendChild(option);
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des réservations:', error);
    alert('Erreur lors de la récupération des réservations. Veuillez réessayer.');
  }
}

fetchReservations();


  
  async function afficherDetailsReservation(reservationId) {
    try {
        const response = await fetch(`/api/reservations/${reservationId}`);
        if (!response.ok) {
            const errorData = await response.json();
            alert(errorData.message);
            return; 
        }

        const reservation = await response.json();
     
        document.getElementById('reservationDetails').innerHTML = `
            <h3>Détails de la Réservation</h3>
            <p>ID: ${reservation._id || 'N/A'}</p>
            <p>Nom du Client: ${reservation.clientName || 'N/A'}</p>
            <p>Nom du Bateau: ${reservation.boatName || 'N/A'}</p>
            <p>Catway: ${reservation.catway ? reservation.catway.number : 'N/A'}</p>
            <p>Heure de Début: ${new Date(reservation.startTime).toLocaleString()}</p>
            <p>Heure de Fin: ${new Date(reservation.endTime).toLocaleString()}</p>
            <p>Check-In: ${new Date(reservation.checkIn).toLocaleString()}</p>
            <p>Check-Out: ${new Date(reservation.checkOut).toLocaleString()}</p>
        `;
    } catch (error) {
        console.error('Erreur lors de la récupération des détails de la réservation:', error);
        alert('Erreur lors de la récupération des détails de la réservation. Veuillez vérifier l\'ID et réessayer.');
    }
}


document.getElementById('detailsReservationForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const reservationId = document.getElementById('detailsReservationId').value.trim();
    afficherDetailsReservation(reservationId);
});

async function fetchUsers() {
  const token = localStorage.getItem('accessToken'); 

  const response = await fetch('/api/users', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`, 
    },
  });

  if (response.ok) {
    const users = await response.json();
    console.log(users);
  } else {
    console.error('Erreur de récupération des utilisateurs:', await response.json());
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token'); 

  try {
    const response = await fetch('/api/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      }
    });

    if (response.ok) {
      const users = await response.json();
      console.log(users);
    } else {
      const error = await response.json();
      console.error('Erreur lors de la récupération des utilisateurs:', error.message);
     
    }
  } catch (error) {
    console.error('Erreur de connexion:', error);
  }
});


async function updateUser(event) {
  event.preventDefault(); 
  const userId = document.getElementById('updateUserId').value;
  const userName = document.getElementById('updateUserName').value;
  const userEmail = document.getElementById('updateUserEmail').value;

  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ name: userName, email: userEmail }) 
    });

    if (!response.ok) throw new Error('Erreur lors de la mise à jour de l’utilisateur');

    const data = await response.json();
    alert(data.message); 
  } catch (error) {
    console.error(error);
    alert('Impossible de mettre à jour l’utilisateur. Veuillez réessayer.');
  }
}


document.getElementById('updateUserForm').addEventListener('submit', updateUser);

async function deleteUser() {
  const userId = document.getElementById('userIdToDelete').value;

  if (!userId) {
    alert("Veuillez entrer un ID utilisateur.");
    return;
  }

  let accessToken = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (response.status === 401) {
 
      accessToken = await refreshToken(); 
      if (accessToken) {
       
        const retryResponse = await fetch(`/api/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (!retryResponse.ok) {
          throw new Error('Erreur lors de la suppression de l\'utilisateur');
        }

        const data = await retryResponse.json();
        alert(data.message);
        loadUsers(); // Recharge la liste des utilisateurs
      }
      return;
    }

    if (!response.ok) {
      throw new Error('Erreur lors de la suppression de l\'utilisateur');
    }

    const data = await response.json();
    alert(data.message);
    loadUsers(); // Recharge la liste des utilisateurs
  } catch (error) {
    console.error('Erreur:', error);
    alert('Impossible de supprimer l\'utilisateur. Veuillez réessayer.');
  }
}


async function refreshToken() {
  const refreshToken = localStorage.getItem('refreshToken');

  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refreshToken })
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('accessToken', data.accessToken); 
      return data.accessToken;
    } else {
      throw new Error('Unable to refresh token');
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
    alert('Session expirée. Veuillez vous reconnecter.');
    window.location.href = '/login.html'; // Rediriger vers la page de connexion
  }
}



fetchCatways();
fetchReservations();
const element = document.getElementById('elementId');
if (element) {
  element.addEventListener('click', () => {
    // Code à exécuter lors du clic
  });
} else {
  console.error("L'élément avec l'id 'elementId' n'existe pas dans le DOM.");
}
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

async function populateCatwaySelect() {
  try {
    const response = await fetch('/api/catways');
    const catways = await response.json();

    const catwaySelect = document.getElementById('catwayInput'); 
    if (!catwaySelect) {
      console.error('Element with ID "catwayInput" not found');
      return;
    }

    catways.forEach(catway => {
      const option = document.createElement('option');
      option.value = catway._id; 
      option.textContent = catway.name; 
      catwaySelect.appendChild(option);
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des catways:', error);
  }
}


document.addEventListener('DOMContentLoaded', () => {
  populateCatwaySelect(); 
});


document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('createReservationForm');
  if (form) {
      form.addEventListener('submit', async function(event) {
          event.preventDefault(); 
          const userId = document.getElementById('userSelect').value;
          const catwayNumber = document.getElementById('catwayInput').value;

          if (!catwayNumber) {
              alert('Veuillez entrer l\'ID du catway.');
              return;
          }

          const clientName = document.getElementById('clientName').value;
          const boatName = document.getElementById('boatName').value;
          const startTime = document.getElementById('startTime').value;
          const endTime = document.getElementById('endTime').value;
          const checkIn = document.getElementById('checkIn').value;
          const checkOut = document.getElementById('checkOut').value;

          const reservationData = {
              user: userId,
              clientName,
              boatName,
              startTime,
              endTime,
              checkIn,
              checkOut
          };

          console.log('Données de réservation:', reservationData);

          try {
              const response = await fetch(`/api/catways/${catwayNumber}/reservations`, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${localStorage.getItem('token')}`
                  },
                  body: JSON.stringify(reservationData)
              });

              const result = await response.json();

              if (response.ok) {
                  alert('Réservation créée avec succès !');
                 
              } else {
                  console.error('Erreur de création de réservation:', result);
                  alert('Erreur: ' + result.message);
              }
          } catch (error) {
              console.error('Erreur lors de la requête:', error);
              alert('Une erreur s\'est produite lors de la création de la réservation.');
          }
      });
  } else {
      console.error("Le formulaire 'createReservationForm' n'a pas été trouvé.");
  }
});

// Supprimer Réservation
document.getElementById('deleteReservationForm').addEventListener('submit', async (event) => {
  event.preventDefault(); 

  const reservationId = document.getElementById('deleteReservationId').value.trim(); 

  try {
      const response = await fetch(`/api/reservations/${reservationId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    

      if (response.ok) {
          alert('Réservation supprimée avec succès');ie
          fetchReservations(); 
      } else {
          const errorData = await response.json();
          alert(`Erreur: ${errorData.message}`); 
      }
  } catch (error) {
      console.error('Erreur lors de la suppression de la réservation:', error);
      alert('Erreur lors de la suppression de la réservation.'); 
  }
});


// Modifier Catway
const updateCatwayForm = document.getElementById('updateCatwayForm');

updateCatwayForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const updateCatwayId = document.getElementById('updateCatwayId').value.trim();
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
  const deleteCatwayId = document.getElementById('deleteCatwayId').value.trim();

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
document.getElementById('viewCatwayForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const catwayId = document.getElementById('catwayNumberInput').value.trim();

  try {
      const response = await fetch(`/api/catways/${catwayId}`);
      if (!response.ok) {
          const errorData = await response.json();
          alert(errorData.message);
          return; 
      }

      const catway = await response.json();
     
      document.getElementById('catwayDetails').innerHTML = `
          <h3>Détails du Catway</h3>
          <p>ID: ${catway.id || 'N/A'}</p>
          <p>Numéro: ${catway.number || 'N/A'}</p>
          <p>Type: ${catway.type || 'N/A'}</p>
          <p>État: ${catway.state || 'N/A'}</p>
      `;
  } catch (error) {
      console.error('Erreur lors de la récupération des détails du catway:', error);
      alert('Erreur lors de la récupération des détails du catway. Veuillez vérifier l\'ID et réessayer.');
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
document.getElementById('updateUserForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const userId = document.getElementById('updateUserId').value;
  const userName = document.getElementById('updateUserName').value;
  const userEmail = document.getElementById('updateUserEmail').value;

  try {
      const response = await fetch(`/api/users/${userId}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ name: userName, email: userEmail })
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
          headers: {
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


