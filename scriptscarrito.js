//Configuración Firestore
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
var db = firebase.firestore();

//Función para manejar el clic en el botón "CONFIRMAR PEDIDO"
function guardarCarritoEnFirestore() {
    //Verificar el estado de autenticación actual
    var user = firebase.auth().currentUser;
    if (!user) {
        //Si el usuario no está autenticado, redireccionar a la página de inicio de sesión
        window.location.href = "login.html";
        return;
    }

    //Guardar el carrito en Firestore
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    //Verifica si la colección 'carrito' existe, si no, se creará
    var carritoRef = db.collection("carrito");
    carritoRef.get().then((querySnapshot) => {
        if (querySnapshot.empty) {
            console.log("La colección 'carrito' no existe. Creando...");
            return carritoRef.add({}); //Crear un documento en la colección 'carrito'
        } else {
            console.log("La colección 'carrito' ya existe.");
            return Promise.resolve(); //No crea el documento
        }
    }).then(() => {
        //Guardar producto en el carrito
        carrito.forEach(producto => {
            var idProducto = generarIdProducto(producto);
            var docRef = carritoRef.doc(idProducto);
            
            docRef.set(producto)
                .then(() => {
                    console.log("Producto guardado en Firestore: ", producto);
                })
                .catch((error) => {
                    console.error("Error al guardar producto en Firestore: ", error);
                });
        });

        //Limpiar el carrito local
        localStorage.removeItem('carrito');

        //Redireccionar a la página de entrega
        window.location.href = "entrega.html";
    }).catch((error) => {
        console.error("Error al verificar/crear la colección 'carrito': ", error);
    });
}


//Función para generar un ID único para el producto
function generarIdProducto(producto) {
    return producto.nombre.replace(/\s+/g, '-').toLowerCase();
}

//Mostrar el producto del carrito en la página
var carritoRef = db.collection("carrito");

carritoRef.get().then(function(querySnapshot) {
    if (querySnapshot.empty) {
        console.log("El carrito está vacío.");
        return;
    }

    //Limpiar la lista de productos
    var carritoItems = document.getElementById('carrito-items');
    carritoItems.innerHTML = '';

    //Declarar el subtotal y el costo de envío
    var subtotal = 0;
    var costoEnvio = 3500;

    //Operar sobre los documentos del carrito
    querySnapshot.forEach(function(doc) {
        var producto = doc.data();
        subtotal += producto.precio;

        //Sección HTML para mostrar los detalles del producto
        var listItem = document.createElement('div');
        listItem.classList.add('product-item');
        listItem.innerHTML = `
            <div class="producto-imagen"><img src="${producto.imagen}" alt="${producto.nombre}" style="max-width: 10%; height: auto; ></div>
            <div class="producto-info">
                <h3>${producto.nombre}</h3>
                <p>Precio: $${producto.precio}</p>
            </div>
        `;

        //Agregar el producto al carrito
        carritoItems.appendChild(listItem);
    });

    //Calcular el total sumando el subtotal y el costo de envío
    var total = subtotal + costoEnvio;

    //Actualizar los detalles
    document.getElementById('subtotal').textContent = '$' + subtotal;
    document.getElementById('total').textContent = '$' + total;
}).catch(function(error) {
    console.error("Error al obtener productos del carrito: ", error);
});


//Establecer persistencia de autenticación local al iniciar Firebase
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
        if (user) {
            //El usuario está autenticado correctamente
            console.log("Usuario autenticado:", user.email);
            //Mostrar el botón de cerrar sesión
            cerrarSesionBtn.style.display = 'block';
        } else {
            //El usuario no está autenticado
            console.log("Usuario no autenticado");
            //Ocultar el botón de cerrar sesión
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
        // Redirigir al inicio
        window.location.href = "index.html";
    }).catch((error) => {
        console.error("Error al cerrar sesión", error);
    });
}

//Función para limpiar el carrito
function limpiarCarrito() {
    //Verificar el estado de conexión actual
    var user = firebase.auth().currentUser;
    if (!user) {
        //Si el usuario no está conectado, redirigir al login
        window.location.href = "login.html";
        return;
    }

    //Limpiar el carrito en Firestore
    var carritoRef = db.collection("carrito");
    
    //Eliminar los documentos de la colección 'carrito'
    carritoRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            doc.ref.delete().then(() => {
                console.log("Producto eliminado del carrito: ", doc.id);
            }).catch((error) => {
                console.error("Error al eliminar producto del carrito: ", error);
            });
        });
        
        //Limpiar el carrito
        localStorage.removeItem('carrito');

        //Actualiza los detalles
        document.getElementById('carrito-items').innerHTML = '';
        document.getElementById('subtotal').textContent = '$0';
        document.getElementById('total').textContent = '$0';

    }).catch((error) => {
        console.error("Error al limpiar el carrito en Firestore: ", error);
    });
}

