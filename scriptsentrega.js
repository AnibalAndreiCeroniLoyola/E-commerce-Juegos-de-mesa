const firebaseConfig = {
    apiKey: "AIzaSyD0xV0NVmEbGrolEtIyPbB9GiWgnLYxVKI",
    authDomain: "dragonmaze-92a4a.firebaseapp.com",
    projectId: "dragonmaze-92a4a",
    storageBucket: "dragonmaze-92a4a.appspot.com",
    messagingSenderId: "644433599328",
    appId: "1:644433599328:web:63566e2df268b35b1c9c05"
};

firebase.initializeApp(firebaseConfig);

//Inicializar Firestore
var db = firebase.firestore();

//Referencia al formulario
const form = document.querySelector('.form');

//Evento submit del formulario
form.addEventListener('submit', (e) => {
    e.preventDefault(); //Evitar el envío del formulario por defecto
    
    //Obtener los valores del formulario
    const region = form.region.value;
    const ciudad = form.ciudad.value;
    const recibeNombre = form.recibeNombre.value;
    const direccion = form.direccion.value;

    console.log("Valores del formulario:", region, ciudad, recibeNombre, direccion);

    //Guardar los datos en Firestore
    db.collection('pedidos').add({
        region: region,
        ciudad: ciudad,
        recibeNombre: recibeNombre,
        direccion: direccion
    })
    .then((docRef) => {
        console.log("Documento escrito con ID: ", docRef.id);
        window.location.href = "checkout.html"; //Redireccionar a la página de checkout
    })
    .catch((error) => {
        console.error("Error al añadir documento: ", error);
    });
});
