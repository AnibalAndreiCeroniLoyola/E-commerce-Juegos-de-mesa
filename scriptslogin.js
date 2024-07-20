//Configuración de Firestore
var firebaseConfig = {
    apiKey: "AIzaSyD0xV0NVmEbGrolEtIyPbB9GiWgnLYxVKI",
    authDomain: "dragonmaze-92a4a.firebaseapp.com",
    projectId: "dragonmaze-92a4a",
    storageBucket: "dragonmaze-92a4a.appspot.com",
    messagingSenderId: "644433599328",
    appId: "1:644433599328:web:63566e2df268b35b1c9c05"
};

//Inicializar Firestore
firebase.initializeApp(firebaseConfig);


//Cargar DOM
document.addEventListener("DOMContentLoaded", function () {

    //Obtener datos del botón de cuenta
    var accountLink = document.querySelector('.icon-account a');

    //Función para verificar el estado de autenticación del usuario
    function checkAuthState() {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                console.log("Usuario autenticado:", user.email);
            } else {
                console.log("Usuario no autenticado");
            }
        });
    }

    //Llamar a la función para verificar el estado de autenticación
    checkAuthState();

    //Agregar evento de click al botón de cuenta
    if (accountLink) {
        accountLink.addEventListener('click', function(e) {
            e.preventDefault();

            // Verificar si hay un usuario autenticado
            var user = firebase.auth().currentUser;
            if (user) {
                //Si el usuario está conectado, se redirecciona al inicio
                window.location.href = "index.html";
            } else {
                //Si no, se le vuelve a redirigir al login para que inicie sesión
                window.location.href = "login.html";
            }
        });
    }

    //Agregar evento de submit al formulario de inicio de sesión
    var loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var email = document.querySelector('#loginForm input[type="email"]').value;
            var password = document.querySelector('#loginForm input[type="password"]').value;

            //Iniciar sesión con Firebase Auth
            firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
                .then(function () {
                    return firebase.auth().signInWithEmailAndPassword(email, password);
                })
                .then(function (userCredential) {
                    //Inicio de sesión exitoso
                    var user = userCredential.user;
                    console.log("Inicio de sesión exitoso para: " + user.email);
                    alert("Inicio de sesión exitoso!");
                    window.location.href = "index.html"; //Redireccionar al inicio
                })
                .catch(function (error) {
                    //Manejar errores de inicio de sesión
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.error("Error al iniciar sesión: ", errorMessage);
                    alert("Error al iniciar sesión: " + errorMessage);
                });
        });
    }

});