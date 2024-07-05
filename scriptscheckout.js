const firebaseConfig = {
    apiKey: "AIzaSyD0xV0NVmEbGrolEtIyPbB9GiWgnLYxVKI",
    authDomain: "dragonmaze-92a4a.firebaseapp.com",
    projectId: "dragonmaze-92a4a",
    storageBucket: "dragonmaze-92a4a.appspot.com",
    messagingSenderId: "644433599328",
    appId: "1:644433599328:web:63566e2df268b35b1c9c05"
};


firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

// Referencia al formulario de pago
const paymentForm = document.getElementById('paymentForm');

//Evento submit del formulario
paymentForm.addEventListener('submit', function(event) {
  event.preventDefault(); // Evitar envío automático del formulario

//Obtener los valores del formulario
const titularTarjeta = paymentForm['titular-tarjeta'].value;
const numTarjeta = paymentForm['num-tarjeta'].value;
const fechaVencimiento = paymentForm['fecha-vencimiento'].value;
const cvv = paymentForm['cvv'].value;

// Guardar los datos en Firestore
db.collection('pagos').add({
    titularTarjeta: titularTarjeta,
    numTarjeta: numTarjeta,
    fechaVencimiento: fechaVencimiento,
    cvv: cvv
})
.then((docRef) => {
    console.log("Datos de pago guardados correctamente con ID: ", docRef.id);
    // Aquí podrías redirigir a una página de confirmación o mostrar un mensaje de éxito
    //window.location.href = "confirmacion_pago.html"; // Redireccionar a la página de confirmación
})
.catch((error) => {
    console.error("Error al guardar datos de pago: ", error);
    // Manejar errores o mostrar un mensaje al usuario
    alert("Hubo un error al procesar tu pago. Por favor, inténtalo de nuevo.");
  });
});
