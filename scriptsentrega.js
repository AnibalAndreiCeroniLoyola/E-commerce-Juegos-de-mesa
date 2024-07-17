const firebaseConfig = {
    apiKey: "AIzaSyD0xV0NVmEbGrolEtIyPbB9GiWgnLYxVKI",
    authDomain: "dragonmaze-92a4a.firebaseapp.com",
    projectId: "dragonmaze-92a4a",
    storageBucket: "dragonmaze-92a4a.appspot.com",
    messagingSenderId: "644433599328",
    appId: "1:644433599328:web:63566e2df268b35b1c9c05"
};

firebase.initializeApp(firebaseConfig);

// Inicializar Firestore
var db = firebase.firestore();

// Referencia al formulario
const form = document.querySelector('.form');

// Evento submit del formulario
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Evitar el envío del formulario por defecto
    
    // Obtener los valores del formulario
    const region = form.region.value;
    const ciudad = form.ciudad.value;
    const recibeNombre = form.recibeNombre.value;
    const direccion = form.direccion.value;

    console.log("Valores del formulario:", region, ciudad, recibeNombre, direccion);

    // Guardar los datos en Firestore
    db.collection('entrega').add({
        region: region,
        ciudad: ciudad,
        recibeNombre: recibeNombre,
        direccion: direccion
    })
    .then((docRef) => {
        console.log("Documento de entrega escrito con ID: ", docRef.id);

        // Obtener el usuario actual
        const user = firebase.auth().currentUser;

        if (user) {
            // Simular datos del usuario (debes obtener estos datos según tu lógica de autenticación)
            const datosUsuario = {
                uid: user.uid,
                nombre: user.displayName,
                email: user.email
                // Otros campos del usuario si los tienes
            };

            // Llamar a la función para guardar datos del cliente en 'clientes'
            guardarDatosCliente(datosUsuario, {}, {
                region: region,
                ciudad: ciudad,
                recibeNombre: recibeNombre,
                direccion: direccion
            }, []);
        }

        // Redireccionar a la página de checkout
        window.location.href = "checkout.html"; 
    })
    .catch((error) => {
        console.error("Error al añadir documento de entrega: ", error);
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

// Función para guardar datos del cliente, pagos, pedidos, carrito y entrega
function guardarDatosCliente(datosUsuario, datosPago, datosPedido, datosCarrito) {
    // Implementación de guardar datos en Firestore
    db.collection("clientes").doc(datosUsuario.uid).collection("entregaClientes").add({
        region: datosPedido.region,
        ciudad: datosPedido.ciudad,
        recibeNombre: datosPedido.recibeNombre,
        direccion: datosPedido.direccion
    })
    .then((docRef) => {
        console.log("Datos de entrega guardados en Firestore en la subcolección 'entregaClientes' con ID: ", docRef.id);
    })
    .catch((error) => {
        console.error("Error al guardar datos de entrega en Firestore: ", error);
    });
}
