// Configuración de Firebase
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
var db = firebase.firestore();


// Función para guardar datos del cliente, pagos, pedidos y carrito
function guardarDatosCliente(datosUsuario, datosPago, datosPedido, datosCarrito) {
  // Guardar datos del usuario en la colección 'clientes'
  db.collection("clientes").doc(datosUsuario.uid).set({
    nombre: datosUsuario.nombre,
    email: datosUsuario.email,
    // Otros campos relevantes del usuario
  })
  .then(() => {
    console.log("Datos de usuario guardados en Firestore");

    // Guardar datos de pago en la subcolección 'pagosCliente'
    return db.collection("clientes").doc(datosUsuario.uid).collection("pagosCliente").add({
      titularTarjeta: datosPago.titularTarjeta,
      numTarjeta: datosPago.numTarjeta,
      fechaVencimiento: datosPago.fechaVencimiento,
      cvv: datosPago.cvv
    });
  })
  .then((docRef) => {
    console.log("Datos de pago guardados en Firestore en la subcolección 'pagosCliente' con ID: ", docRef.id);

    // Guardar datos de pedido en la subcolección 'pedidosCliente'
    return db.collection("clientes").doc(datosUsuario.uid).collection("pedidosCliente").add({
      region: datosPedido.region,
      ciudad: datosPedido.ciudad,
      recibeNombre: datosPedido.recibeNombre,
      direccion: datosPedido.direccion
    });
  })
  .then((docRef) => {
    console.log("Datos de pedido guardados en Firestore en la subcolección 'pedidosCliente' con ID: ", docRef.id);

    // Guardar datos del carrito en la subcolección 'carritoCliente'
    const carritoBatch = db.batch();
    datosCarrito.forEach((producto) => {
      const nuevoProductoRef = db.collection("clientes").doc(datosUsuario.uid).collection("carritoCliente").doc();
      carritoBatch.set(nuevoProductoRef, {
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: producto.cantidad
        // Otros campos del producto en el carrito
      });
    });
    return carritoBatch.commit();
  })
  .then(() => {
    console.log("Productos en el carrito guardados en Firestore en la subcolección 'carritoCliente'");

    // Todo se ha guardado correctamente, podrías redirigir a otra página o realizar otras acciones
  })
  .catch((error) => {
    console.error("Error al guardar datos en Firestore: ", error);
  });
}

// Referencia al botón de pago
const btnPagar = document.getElementById('btnPagar');

// Evento clic del botón de pago
btnPagar.addEventListener('click', function(event) {
  event.preventDefault(); // Evitar el envío automático del formulario si está dentro de un formulario

  // Referencia al formulario de pago
  const paymentForm = document.getElementById('paymentForm');

  // Obtener los valores del formulario
  const titularTarjeta = paymentForm['titular-tarjeta'].value;
  const numTarjeta = paymentForm['num-tarjeta'].value;
  const fechaVencimiento = paymentForm['fecha-vencimiento'].value;
  const cvv = paymentForm['cvv'].value;

  // Simular datos del usuario (debes obtener estos datos según tu lógica de autenticación)
  const datosUsuario = {
    uid: 'usuario-unico-id',
    nombre: 'Nombre del Usuario',
    email: 'usuario@example.com'
    // Otros campos del usuario si los tienes
  };

  // Llamar a la función para guardar datos del cliente en 'clientes'
  guardarDatosCliente(datosUsuario, {
    titularTarjeta: titularTarjeta,
    numTarjeta: numTarjeta,
    fechaVencimiento: fechaVencimiento,
    cvv: cvv
  });
});
