//Configuración de Firestore
const firebaseConfig = {
    apiKey: "AIzaSyD0xV0NVmEbGrolEtIyPbB9GiWgnLYxVKI",
    authDomain: "dragonmaze-92a4a.firebaseapp.com",
    projectId: "dragonmaze-92a4a",
    storageBucket: "dragonmaze-92a4a.appspot.com",
    messagingSenderId: "644433599328",
    appId: "1:644433599328:web:63566e2df268b35b1c9c05"
};

//Inicializar Firestore
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

//Establecer persistencia de la sesión local al inicializar Firestore
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(function () {
        console.log("Persistencia de autenticación establecida correctamente");
    })
    .catch(function (error) {
        console.error("Error al establecer persistencia de autenticación:", error);
    });

//Función para verificar el estado de autenticación del usuario
function checkAuthState() {
    firebase.auth().onAuthStateChanged(function (user) {
        const cerrarSesionBtn = document.getElementById('cerrarSesionBtn');
        const btnPagar = document.getElementById('btnPagar');

        if (user) {
            //Si el usuario está autenticado
            console.log("Usuario autenticado:", user.email);
            cerrarSesionBtn.style.display = 'block';

            //Evento click del botón de pagar
            btnPagar.addEventListener('click', function(event) {
                event.preventDefault();

                //Ventana emergente de confirmación
                if (confirm("¿Estás seguro de que deseas proceder con el pago?")) {
                    //Si el usuario confirma, se continua con el pago
                    const paymentForm = document.getElementById('paymentForm');

                    //Obtener los valores del formulario
                    const titularTarjeta = paymentForm['titular-tarjeta'].value;
                    const numTarjeta = paymentForm['num-tarjeta'].value;
                    const fechaVencimiento = paymentForm['fecha-vencimiento'].value;
                    const cvv = paymentForm['cvv'].value;

                    //Obtener los datos del usuario desde Firestore
                    db.collection('usuarios').doc(user.uid).get().then((doc) => {
                        if (doc.exists) {
                            const userData = doc.data();
                            const datosUsuario = {
                                uid: user.uid,
                                nombre: userData.nombre ? userData.nombre : '',
                                apellidos: userData.apellidos ? userData.apellidos : '',
                                email: user.email
                            };
                            console.log('Datos del usuario:', datosUsuario);

                            //Llamar a la función para guardar datos del cliente en 'clientes'
                            guardarDatosCliente(datosUsuario, {
                                titularTarjeta: titularTarjeta,
                                numTarjeta: numTarjeta,
                                fechaVencimiento: fechaVencimiento,
                                cvv: cvv
                            });

                            //Crear la subcolección 'estado' con el estado "Aprobado"
                            db.collection("clientes").doc(user.uid).collection("estado").add({
                                estado: "Aprobado"
                            })
                            .then(() => {
                                console.log("Estado 'Aprobado' guardado en la subcolección 'estado'.");
                                //Redireccionar a la página de estado del pedido
                                window.location.href = "estadopedido.html";
                            })
                            .catch((error) => {
                                console.error("Error al guardar estado en Firestore: ", error);
                            });

                        } else {
                            console.log('No se encontró el documento del usuario.');
                        }
                    }).catch((error) => {
                        console.log('Error al obtener datos del usuario de Firestore:', error);
                    });

                } else {
                    //Si el usuario cancela, guardar el estado como 'Pendiente'
                    db.collection("clientes").doc(user.uid).collection("estado").add({
                        estado: "Pendiente"
                    })
                    .then(() => {
                        console.log("Estado 'Pendiente' guardado en la subcolección 'estado'.");
                        //Mantener al usuario en la pantalla de pagos
                        window.location.href = "checkout.html";
                    })
                    .catch((error) => {
                        console.error("Error al guardar estado en Firestore: ", error);
                    });
                }
            });

        } else {
            console.log("Usuario no autenticado");
            cerrarSesionBtn.style.display = 'none';
        }
    });
}

//Verificar el estado de autenticación al cargar la página
checkAuthState();

//Función para cerrar sesión
function cerrarSesion() {
    firebase.auth().signOut().then(() => {
        console.log("Sesión cerrada exitosamente");
        //Redireccionar al inicio
        window.location.href = "index.html";
    }).catch((error) => {
        console.error("Error al cerrar sesión", error);
    });
}

//Función para guardar datos del cliente y pagos en Firestore
function guardarDatosCliente(datosUsuario, datosPago) {
    //Guardar datos del cliente en la colección 'clientes'
    db.collection("clientes").doc(datosUsuario.uid).set({
        nombre: datosUsuario.nombre,
        apellidos: datosUsuario.apellidos,
        email: datosUsuario.email
    }, { merge: true })
    .then(() => {
        console.log("Datos del cliente guardados en Firestore.");

        //Guardar datos del pago en la subcolección 'pagosCliente'
        return db.collection("clientes").doc(datosUsuario.uid).collection("pagosCliente").add({
            titularTarjeta: datosPago.titularTarjeta,
            numTarjeta: datosPago.numTarjeta,
            fechaVencimiento: datosPago.fechaVencimiento,
            cvv: datosPago.cvv
        });
    })
    .then((docRef) => {
        console.log("Datos de pago guardados en Firestore en la subcolección 'pagosCliente' con ID: ", docRef.id);
    })
    .catch((error) => {
        console.error("Error al guardar datos de pago en Firestore: ", error);
    });
}
