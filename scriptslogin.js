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

// Esperar a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function () {
    // Obtener el elemento del botón de cuenta
    var accountLink = document.querySelector('.icon-account a');

    // Agregar evento de clic al botón de cuenta
    if (accountLink) {
        accountLink.addEventListener('click', function(e) {
            e.preventDefault();

            // Verificar si hay un usuario autenticado
            var user = firebase.auth().currentUser;
            if (user) {
                // Si el usuario está autenticado, redirigir a la página de cuenta
                window.location.href = "cuenta.html";
            } else {
                // Si no está autenticado, redirigir al inicio de sesión
                window.location.href = "login.html";
            }
        });
    }

    // Agregar evento de submit al formulario de inicio de sesión
    var loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var email = document.querySelector('#loginForm input[type="email"]').value;
            var contrasena = document.querySelector('#loginForm input[type="password"]').value;

            firebase.auth().signInWithEmailAndPassword(email, contrasena)
                .then((userCredential) => {
                    console.log("Inicio de sesión exitoso!");
                    alert("Inicio de sesión exitoso!");
                    window.location.href = "cuenta.html";
                })
                .catch((error) => {
                    console.error("Error al iniciar sesión: ", error.message);
                    alert("Error al iniciar sesión: " + error.message);
                });
        });

    }
});
