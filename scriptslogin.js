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

    // Función para verificar el estado de autenticación del usuario
    function checkAuthState() {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                // Usuario está autenticado
                console.log("Usuario autenticado:", user.email);
                // Aquí puedes realizar acciones adicionales si el usuario está autenticado
            } else {
                // Usuario no está autenticado
                console.log("Usuario no autenticado");
            }
        });
    }

    // Llamar a la función para verificar el estado de autenticación
    checkAuthState();

    // Agregar evento de clic al botón de cuenta
    if (accountLink) {
        accountLink.addEventListener('click', function(e) {
            e.preventDefault();

            // Verificar si hay un usuario autenticado
            var user = firebase.auth().currentUser;
            if (user) {
                // Si el usuario está autenticado, redirigir al inicio
                window.location.href = "index.html";
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
            var password = document.querySelector('#loginForm input[type="password"]').value;

            // Iniciar sesión con Firebase Auth
            firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
                .then(function () {
                    return firebase.auth().signInWithEmailAndPassword(email, password);
                })
                .then(function (userCredential) {
                    // Éxito en el inicio de sesión
                    var user = userCredential.user;
                    console.log("Inicio de sesión exitoso para: " + user.email);
                    alert("Inicio de sesión exitoso!");
                    window.location.href = "index.html"; // Redirigir a la página de cuenta
                })
                .catch(function (error) {
                    // Manejar errores de inicio de sesión
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.error("Error al iniciar sesión: ", errorMessage);
                    alert("Error al iniciar sesión: " + errorMessage);
                });
        });
    }

});