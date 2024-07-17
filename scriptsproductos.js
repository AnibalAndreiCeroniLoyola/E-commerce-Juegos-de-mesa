// Configura tu Firebase
var firebaseConfig = {
    apiKey: "AIzaSyD0xV0NVmEbGrolEtIyPbB9GiWgnLYxVKI",
    authDomain: "dragonmaze-92a4a.firebaseapp.com",
    projectId: "dragonmaze-92a4a",
    storageBucket: "dragonmaze-92a4a.appspot.com",
    messagingSenderId: "644433599328",
    appId: "1:644433599328:web:63566e2df268b35b1c9c05"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

// Función para manejar el clic en el botón de comprar
function agregarProductoACarrito() {
    var producto = {
        nombre: "Juego Dragon Maze",
        precio: 24990,
        descripcion: "Un emocionante juego de mesa",
        imagen: "./imgproductocarrito.png"
    };

    // Usa el nombre del producto como ID (opcional)
    var idProducto = producto.nombre.replace(/\s+/g, '-').toLowerCase();

    // Referencia a la colección 'productos' y al documento con el ID específico
    var docRef = db.collection("productos").doc(idProducto);

    // Realiza la transacción para actualizar el stock en Firestore
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
        carritoRef.get().then(function(querySnapshot) {
            if (querySnapshot.empty) {
                // La colección 'carrito' no existe, crea un documento con el producto
                return carritoRef.doc(idProducto).set(producto);
            } else {
                // La colección 'carrito' ya existe, simplemente agrega el producto
                return carritoRef.doc(idProducto).set(producto);
            }
        }).then(function() {
            console.log("Producto agregado al carrito en Firestore: ", producto);
            // Aquí puedes redirigir al carrito u otra página después de agregar al carrito
            window.location.href = "carrito.html";
        }).catch(function(error) {
            console.error("Error al agregar producto al carrito en Firestore: ", error);
            // Manejar errores aquí, por ejemplo, mostrar un mensaje al usuario
        });
    }).catch(function(error) {
        console.error("Error actualizando stock: ", error);
        // Manejar errores aquí, por ejemplo, mostrar un mensaje al usuario
    });
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