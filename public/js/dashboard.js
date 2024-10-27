if (!localStorage.getItem('token')) {
    window.location.href = 'index.html';
}

// Fonction pour charger les catways depuis l'API et les ajouter à la liste déroulante
async function loadCatways() {
  try {
    const response = await fetch('/api/catways'); // Remplacez par l'URL correcte de votre API
    if (!response.ok) throw new Error('Erreur lors de la récupération des catways');

    const catways = await response.json();
    console.log('Catways récupérés:', catways); // Vérifiez les données récupérées

    const select = document.getElementById('catwaySelect');
    select.innerHTML = '<option value="">Sélectionnez un Catway</option>'; // Réinitialise la liste

    catways.forEach(catway => {
      const option = document.createElement('option');
      option.value = catway._id; // Assurez-vous que _id est la clé correcte
      option.textContent = `Catway ${catway.number || 'N/A'}`; // Affiche le numéro du catway ou 'N/A'
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Erreur lors du chargement des catways:', error);
    alert('Impossible de charger les catways. Veuillez réessayer.');
  }
}
document.addEventListener('DOMContentLoaded', () => {
  loadCatways(); // Charge les catways lorsque la page est prête
});
// Assurez-vous que cette fonction est appelée après le chargement du DOM


async function loadReservations() {
  try {
    const response = await fetch('/api/reservations');
    const reservations = await response.json();
    console.log('Réservations:', reservations);

    const reservationSelect = document.getElementById('reservationSelect'); // Assurez-vous d'avoir un élément select pour les réservations
    reservationSelect.innerHTML = ''; // Réinitialiser les options avant d'ajouter de nouvelles
    reservations.forEach(reservation => {
      const option = document.createElement('option');
      option.value = reservation._id; // Utiliser l'ID de la réservation
      option.text = `Réservation ${reservation.num} - ID: ${reservation._id}`; // Afficher le numéro et l'ID de la réservation
      reservationSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations:', error);
  }
}

loadReservations();
// Fonction pour charger les utilisateurs depuis l'API et les ajouter à la liste déroulante
async function loadUsers() {
  try {
    const response = await fetch('/api/users'); // Remplace par l'URL correcte de ton API
    const users = await response.json();

    const userSelect = document.getElementById('userSelect'); // Assurez-vous d'avoir un élément select pour les utilisateurs
    userSelect.innerHTML = '<option value="">Sélectionnez un Utilisateur</option>'; // Réinitialise la liste

    users.forEach(user => {
      const option = document.createElement('option');
      option.value = user._id; // Assurez-vous que _id est la clé correcte
      option.textContent = user.name; // Affiche le nom de l'utilisateur
      userSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Erreur lors du chargement des utilisateurs:', error);
    alert('Impossible de charger les utilisateurs. Veuillez réessayer.');
  }
}

// Appel de la fonction pour charger les utilisateurs lorsque la page est prête
document.addEventListener('DOMContentLoaded', loadUsers);


// Définir la fonction fetchCatways
async function fetchCatways() {
  try {
    const response = await fetch('/api/catways');
    if (!response.ok) throw new Error('Erreur lors de la récupération des catways');

    const catways = await response.json();
    const catwayList = document.getElementById('catwayList') || document.createElement('ul'); // Utilise une liste non ordonnée
    catwayList.id = 'catwayList';
    
    // Vider la liste avant d'ajouter les nouveaux éléments
    catwayList.innerHTML = ''; // Efface le contenu précédent

    catways.forEach(catway => {
      const listItem = document.createElement('li');
      listItem.textContent = `Catway ${catway.catwayNumber} - ${catway.type}`;
      catwayList.appendChild(listItem);
    });

    // Si tu ne veux pas afficher la liste à la fin, décommente la ligne ci-dessous
    // catwayList.style.display = 'none'; // Masque la liste
  } catch (error) {
    console.error('Erreur :', error);
    alert('Erreur lors de la récupération des catways');
  }
}


// Appeler la fonction fetchCatways lorsque le DOM est complètement chargé
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
          // Utilisation d'un timestamp pour éviter le cache
          const response = await fetch(`/api/catways/${catwayId}?_=${new Date().getTime()}`);
          const text = await response.text(); // Récupère la réponse brute pour la journaliser
          console.log('Réponse brute de l\'API:', text);
          
          if (!response.ok) {
              throw new Error(`Erreur HTTP: ${response.status} - Catway non trouvé`);
          }

          const catway = JSON.parse(text);
          console.log('Détails du Catway (objet):', catway);

          // Vérifie si l'objet contient les champs nécessaires
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

    // Assurez-vous que l'élément avec l'ID 'reservationList' existe
    const reservationList = document.getElementById('reservationList');
    if (!reservationList) {
      console.error('Element with ID "reservationList" not found');
      return;
    }
    
    reservationList.innerHTML = ''; // Clear previous content

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
      option.text = catway.catwayNumber; // Afficher uniquement le numéro
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
            return; // Sortir de la fonction si la réservation n'est pas trouvée
        }

        const reservation = await response.json();
        // Vérifie si l'objet contient les champs nécessaires
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

// Écouteur d'événements pour le formulaire de détails de réservation
document.getElementById('detailsReservationForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const reservationId = document.getElementById('detailsReservationId').value.trim();
    afficherDetailsReservation(reservationId);
});

async function fetchUsers() {
  const token = localStorage.getItem('accessToken'); // Récupérer le token

  const response = await fetch('/api/users', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`, // Ajouter le token ici
    },
  });

  if (response.ok) {
    const users = await response.json();
    console.log(users);
  } else {
    console.error('Erreur de récupération des utilisateurs:', await response.json());
  }
}

// dashboard.js (ou un fichier similaire où vous récupérez des données utilisateur)
// dashboard.js

document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token'); // Récupérez le token depuis le stockage local

  try {
    const response = await fetch('/api/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Ajoutez le token ici
      }
    });

    if (response.ok) {
      const users = await response.json();
      console.log(users); // Traitez la réponse des utilisateurs ici
      // Par exemple, affichez les utilisateurs dans une liste
    } else {
      const error = await response.json();
      console.error('Erreur lors de la récupération des utilisateurs:', error.message);
      // Affichez un message d'erreur à l'utilisateur
    }
  } catch (error) {
    console.error('Erreur de connexion:', error);
  }
});


async function updateUser(event) {
  event.preventDefault(); // Empêche le rechargement de la page
  const userId = document.getElementById('updateUserId').value;
  const userName = document.getElementById('updateUserName').value;
  const userEmail = document.getElementById('updateUserEmail').value;

  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Assurez-vous d'ajouter le token
      },
      body: JSON.stringify({ name: userName, email: userEmail }) // Corps de la requête
    });

    if (!response.ok) throw new Error('Erreur lors de la mise à jour de l’utilisateur');

    const data = await response.json();
    alert(data.message); // Affiche le message de succès
  } catch (error) {
    console.error(error);
    alert('Impossible de mettre à jour l’utilisateur. Veuillez réessayer.');
  }
}

// Lier cette fonction au formulaire
document.getElementById('updateUserForm').addEventListener('submit', updateUser);

async function deleteUser() {
  const userId = document.getElementById('userIdToDelete').value;

  if (!userId) {
    alert("Veuillez entrer un ID utilisateur.");
    return;
  }

  // Récupérer le token d'accès du stockage local
  let accessToken = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (response.status === 401) {
      // Token expiré, essayer de le renouveler
      accessToken = await refreshToken(); // Appel de la fonction de renouvellement
      if (accessToken) {
        // Réessayez de supprimer l'utilisateur après le renouvellement du token
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
      localStorage.setItem('accessToken', data.accessToken); // Mettez à jour le token
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

    const catwaySelect = document.getElementById('catwayInput'); // Assurez-vous que cet élément existe dans votre HTML
    if (!catwaySelect) {
      console.error('Element with ID "catwayInput" not found');
      return;
    }

    catways.forEach(catway => {
      const option = document.createElement('option');
      option.value = catway._id; // ou autre attribut pertinent
      option.textContent = catway.name; // ou autre attribut pertinent
      catwaySelect.appendChild(option);
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des catways:', error);
  }
}


document.addEventListener('DOMContentLoaded', () => {
  populateCatwaySelect(); // Appelle la fonction au chargement du DOM
});


document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('createReservationForm');
  if (form) {
      form.addEventListener('submit', async function(event) {
          event.preventDefault(); // Empêche le rechargement de la page

          // Récupération des valeurs du formulaire
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

          console.log('Données de réservation:', reservationData); // Affiche les données avant l'envoi

          try {
              const response = await fetch(`/api/catways/${catwayNumber}/reservations`, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${localStorage.getItem('token')}` // Ajoutez l'en-tête d'autorisation
                  },
                  body: JSON.stringify(reservationData)
              });

              const result = await response.json();

              if (response.ok) {
                  alert('Réservation créée avec succès !');
                  // Optionnel: rechargez les réservations ou effectuez d'autres actions ici
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
  event.preventDefault(); // Empêche le rechargement de la page

  const reservationId = document.getElementById('deleteReservationId').value.trim(); // Récupère l'ID de la réservation

  try {
      const response = await fetch(`/api/reservations/${reservationId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    

      if (response.ok) {
          alert('Réservation supprimée avec succès'); // Alerte si la suppression réussie
          fetchReservations(); // Récupère à nouveau la liste des réservations si nécessaire
      } else {
          const errorData = await response.json();
          alert(`Erreur: ${errorData.message}`); // Affiche un message d'erreur si la suppression échoue
      }
  } catch (error) {
      console.error('Erreur lors de la suppression de la réservation:', error); // Journalise les erreurs
      alert('Erreur lors de la suppression de la réservation.'); // Alerte d'erreur
  }
});


// Modifier Catway
const updateCatwayForm = document.getElementById('updateCatwayForm');

updateCatwayForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const updateCatwayId = document.getElementById('updateCatwayId').value.trim(); // Supprimer les espaces
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
  const deleteCatwayId = document.getElementById('deleteCatwayId').value.trim(); // Supprimer les espaces

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
          return; // Sortir de la fonction si le catway n'est pas trouvé
      }

      const catway = await response.json();
      // Vérifie si l'objet contient les champs nécessaires
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


