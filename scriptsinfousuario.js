// Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyD0xV0NVmEbGrolEtIyPbB9GiWgnLYxVKI",
    authDomain: "dragonmaze-92a4a.firebaseapp.com",
    projectId: "dragonmaze-92a4a",
    storageBucket: "dragonmaze-92a4a.appspot.com",
    messagingSenderId: "644433599328",
    appId: "1:644433599328:web:63566e2df268b35b1c9c05"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Inicializar Firestore
var db = firebase.firestore();

// Función para obtener datos del usuario y llenar el formulario
function populateUserInfo() {
    // Obtener el usuario actualmente conectado
    var user = firebase.auth().currentUser;

    if (user) {
        // Obtener datos del usuario desde Firestore
        db.collection("users").doc(user.uid).get()
            .then((doc) => {
                if (doc.exists) {
                    // Llenar los campos del formulario con los datos del usuario
                    document.getElementById('userEmail').textContent = doc.data().email;
                    document.getElementById('userName').textContent = doc.data().nombre;
                    document.getElementById('userLastName').textContent = doc.data().apellidos;
                } else {
                    console.log("No se encontraron datos de usuario.");
                }
            })
            .catch((error) => {
                console.error("Error al obtener datos de usuario:", error);
            });
    } else {
        console.log("No hay usuario logueado.");
    }
}

// Ejecutar la función cuando el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function() {
    populateUserInfo();
});
