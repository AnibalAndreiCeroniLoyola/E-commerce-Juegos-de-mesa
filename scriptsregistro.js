var firebaseConfig = {
    apiKey: "AIzaSyD0xV0NVmEbGrolEtIyPbB9GiWgnLYxVKI",
    authDomain: "dragonmaze-92a4a.firebaseapp.com",
    projectId: "dragonmaze-92a4a",
    storageBucket: "dragonmaze-92a4a.appspot.com",
    messagingSenderId: "644433599328",
    appId: "1:644433599328:web:63566e2df268b35b1c9c05"
};


firebase.initializeApp(firebaseConfig);

// Obtener la instancia de la autenticación
const auth = firebase.auth();

// Initialize Firestore
var db = firebase.firestore();

// Manejo del evento de envío del formulario
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('loginForm').addEventListener('submit', function (e) {
        e.preventDefault();

        var email = document.getElementById('email').value;
        var nombre = document.getElementById('nombre').value;
        var apellidos = document.getElementById('apellidos').value;
        var contrasena = document.getElementById('contrasena').value;

        // Crear un nuevo usuario con correo y contraseña
        firebase.auth().createUserWithEmailAndPassword(email, contrasena)
            .then((userCredential) => {
                // Guardar información adicional del usuario en Firestore
                return db.collection("usuarios").doc(userCredential.user.uid).set({
                    nombre: nombre,
                    apellidos: apellidos,
                    email: email
                });
            })
            .then(() => {
                console.log("Registro exitoso!");
                alert("Registro exitoso!");
                // Redireccionar o realizar otra acción después del registro
                console.log("Redireccionando a login.html");
                window.location.href = "login.html";
            })
            .catch((error) => {
                console.error("Error al registrarse: ", error.message);
                alert("Error al registrarse: " + error.message);
            });
    });
});

// Establecer persistencia de autenticación local al iniciar Firebase
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(function () {
        console.log("Persistencia de autenticación establecida correctamente");
    })
    .catch(function (error) {
        console.error("Error al establecer persistencia de autenticación:", error);
    });

// Función para verificar el estado de autenticación del usuario
function checkAuthState() {
    firebase.auth().onAuthStateChanged(function (user) {
        const cerrarSesionBtn = document.getElementById('cerrarSesionBtn');
        if (user) {
            // Usuario está autenticado
            console.log("Usuario autenticado:", user.email);
            // Mostrar el botón de cerrar sesión
            cerrarSesionBtn.style.display = 'block';
        } else {
            // Usuario no está autenticado
            console.log("Usuario no autenticado");
            // Ocultar el botón de cerrar sesión
            cerrarSesionBtn.style.display = 'none';
        }
    });
}

// Verificar el estado de autenticación al cargar la página
checkAuthState();

// Función para cerrar sesión
function cerrarSesion() {
    firebase.auth().signOut().then(() => {
        // Cerrar sesión exitosamente
        console.log("Sesión cerrada exitosamente");
        // Redirigir a la página de inicio o a donde prefieras
        window.location.href = "index.html";
    }).catch((error) => {
        // Ocurrió un error al cerrar sesión
        console.error("Error al cerrar sesión", error);
    });
}