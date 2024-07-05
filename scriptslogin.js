var firebaseConfig = {
    apiKey: "AIzaSyD0xV0NVmEbGrolEtIyPbB9GiWgnLYxVKI",
    authDomain: "dragonmaze-92a4a.firebaseapp.com",
    projectId: "dragonmaze-92a4a",
    storageBucket: "dragonmaze-92a4a.appspot.com",
    messagingSenderId: "644433599328",
    appId: "1:644433599328:web:63566e2df268b35b1c9c05"
};

firebase.initializeApp(firebaseConfig);

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('loginForm').addEventListener('submit', function (e) {
        e.preventDefault();

        var email = document.querySelector('#loginForm input[type="email"]').value;
        var contrasena = document.querySelector('#loginForm input[type="password"]').value;

        firebase.auth().signInWithEmailAndPassword(email, contrasena)
            .then((userCredential) => {
                console.log("Inicio de sesión exitoso!");
                alert("Inicio de sesión exitoso!");
                window.location.assign("https://anibalandreiceroniloyola.github.io/E-commerce-Juegos-de-mesa/cat%C3%A1logo.html")
            })
            .catch((error) => {
                console.error("Error al iniciar sesión: ", error.message);
                alert("Error al iniciar sesión: " + error.message);
            });
    });
});
