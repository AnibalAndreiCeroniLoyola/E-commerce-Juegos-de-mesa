const firebaseConfig = {
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
                  uid: user.uid,
                  nombre: user.displayName,
                  email: user.email
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

// Función para guardar datos del cliente, pagos, pedidos y carrito
function guardarDatosCliente(datosUsuario, datosPago) {
  // Implementación de guardar datos en Firestore
  db.collection("clientes").doc(datosUsuario.uid).collection("pagosCliente").add({
      titularTarjeta: datosPago.titularTarjeta,
      numTarjeta: datosPago.numTarjeta,
      fechaVencimiento: datosPago.fechaVencimiento,
      cvv: datosPago.cvv
  })
  .then((docRef) => {
      console.log("Datos de pago guardados en Firestore en la subcolección 'pagosCliente' con ID: ", docRef.id);
      // Todo se ha guardado correctamente, podrías redirigir a otra página o realizar otras acciones
  })
  .catch((error) => {
      console.error("Error al guardar datos de pago en Firestore: ", error);
  });
}
