// Configuración de Firestore
var firebaseConfig = {
    apiKey: "AIzaSyD0xV0NVmEbGrolEtIyPbB9GiWgnLYxVKI",
    authDomain: "dragonmaze-92a4a.firebaseapp.com",
    projectId: "dragonmaze-92a4a",
    storageBucket: "dragonmaze-92a4a.appspot.com",
    messagingSenderId: "644433599328",
    appId: "1:644433599328:web:63566e2df268b35b1c9c05"
};

// Inicializar Firestore
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

// Función para el click en el botón de comprar
function agregarProductoACarrito() {
    var producto = {
        nombre: "Expansión 2",
        precio: 19990,
        descripcion: "Expansión para la última versión",
        imagen: "imágenes/imgproductocarrito.png"
    };

    // Usa el nombre del producto como ID
    var idProducto = producto.nombre.replace(/\s+/g, '-').toLowerCase();
    var user = firebase.auth().currentUser;

    if (!user) {
        // Si el usuario no está autenticado, redireccionar a la página de login
        window.location.href = "login.html";
        return;
    }

    // Referencia a la colección 'productos' y al documento con el ID específico
    var docRef = db.collection("productos").doc(idProducto);

    // Primero verificar si el documento del producto existe
    docRef.get().then(function(doc) {
        if (!doc.exists) {
            // Si el documento no existe, crearlo con el stock inicial
            docRef.set(producto).then(function() {
                console.log("Producto creado en Firestore con stock inicial");
                // Llamar de nuevo a la función para realizar la transacción después de crear el documento
                realizarTransaccion();
            }).catch(function(error) {
                console.error("Error creando el producto en Firestore: ", error);
            });
        } else {
            // Si el documento ya existe, realizar la transacción directamente
            realizarTransaccion();
        }
    }).catch(function(error) {
        console.error("Error verificando la existencia del producto: ", error);
    });

    function realizarTransaccion() {
        // Transacción para actualizar el stock del producto en Firestore
        db.runTransaction(function(transaction) {
            return transaction.get(docRef).then(function(doc) {
                if (!doc.exists) {
                    throw "Documento no encontrado en Firestore";
                }

                var newStock = doc.data().stock - 1;

                if (newStock < 0) {
                    throw "No hay suficiente stock disponible";
                }

                transaction.update(docRef, { stock: newStock });
                return newStock;
            });
        }).then(function(newStock) {
            console.log("Stock actualizado a: ", newStock);

            // Crear la colección 'carrito' si no existe y agregar el producto
            var carritoRef = db.collection("carrito");
            carritoRef.doc(idProducto).set(producto)
                .then(function() {
                    console.log("Producto agregado al carrito en Firestore: ", producto);

                    // Crear o actualizar la subcolección 'carritoCliente' en 'clientes'
                    var carritoClienteRef = db.collection("clientes").doc(user.uid).collection("carritoCliente");
                    return carritoClienteRef.doc(idProducto).set(producto);
                }).then(function() {
                    console.log("Producto agregado a 'carritoCliente' en Firestore");
                    // Redireccionar al carrito
                    window.location.href = "carrito.html";
                }).catch(function(error) {
                    console.error("Error al agregar producto al carrito en Firestore: ", error);
                });
        }).catch(function(error) {
            console.error("Error actualizando stock: ", error);
        });
    }
}

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
            console.log("Usuario autenticado:", user.email);
            // Mostrar el botón de cerrar sesión
            cerrarSesionBtn.style.display = 'block';
        } else {
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
        console.log("Sesión cerrada exitosamente");
        // Redireccionar al inicio
        window.location.href = "index.html";
    }).catch((error) => {
        console.error("Error al cerrar sesión", error);
    });
}