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

//Formato de ingreso de número de tarjeta (Se crean los espacios de forma automática y limita la cantidad de números)
document.addEventListener('DOMContentLoaded', function () {
    const serialCardNumber = document.getElementById('serialCardNumber');

    serialCardNumber.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\s+/g, ''); //Elimina todos los espacios
        if (value.length > 16) {
            value = value.slice(0, 16); //Limita el número de tarjeta a 16 dígitos
        }

        //Mantener la posición del cursor al formatear el valor
        const formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
        const selectionStart = serialCardNumber.selectionStart;

        serialCardNumber.value = formattedValue;

        //Ajustar la posición del cursor después de formatear
        if (selectionStart % 5 === 0 && selectionStart > 0 && e.inputType !== 'deleteContentBackward') {
            serialCardNumber.setSelectionRange(selectionStart + 1, selectionStart + 1);
        } else {
            serialCardNumber.setSelectionRange(selectionStart, selectionStart);
        }
    });
});

//Formato de ingreso de Fecha de vencimiento (Crear el / y límite de números)
document.addEventListener('DOMContentLoaded', function () {
    const exDate = document.getElementById('ExDate');

    exDate.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');//Elimina cualquier carácter no numérico

        if (value.length > 4) {
            value = value.slice(0, 4);//Limita la fecha a 4 dígitos (MMYY)
        }

        //Añade el slash después de los primeros dos dígitos
        if (value.length > 2) {
            value = value.slice(0, 2) + '/' + value.slice(2);
        }

        //Mantener la posición del cursor al formatear el valor
        const cursorPosition = e.target.selectionStart;
        e.target.value = value;

        //Ajustar la posición del cursor después de formatear
        let newCursorPosition = cursorPosition;

        //Si el cursor estaba justo antes del '/'
        if (cursorPosition > 2 && cursorPosition <= 3) {
            newCursorPosition = cursorPosition + 1;
        }

        e.target.setSelectionRange(newCursorPosition, newCursorPosition);
    });
});

//Formato de ingreso de CVV (máximo 3 números)
document.addEventListener('DOMContentLoaded', function () {
    const cvvInput = document.getElementById('cvv');

    cvvInput.addEventListener('input', function (e) {
        //Elimina cualquier carácter no numérico
        let value = e.target.value.replace(/\D/g, '');
        
        //Limita el valor a 3 dígitos
        if (value.length > 3) {
            value = value.slice(0, 3);
        }

        //Actualiza el valor del campo
        e.target.value = value;
    });
});
