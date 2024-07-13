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

// Función para manejar el clic en el botón "CONFIRMAR PEDIDO"
function guardarCarritoEnFirestore() {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Verifica si la colección 'carrito' existe; si no, la crea
    var carritoRef = db.collection("carrito");
    carritoRef.get().then((querySnapshot) => {
        if (querySnapshot.empty) {
            console.log("La colección 'carrito' no existe. Creando...");
            return carritoRef.add({}); // Crea un documento vacío en la colección 'carrito'
        } else {
            console.log("La colección 'carrito' ya existe.");
            return Promise.resolve(); // Continúa sin crear nada nuevo
        }
    }).then(() => {
        // Ahora procede a guardar los productos del carrito
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

        // Limpia el carrito local
        localStorage.removeItem('carrito');

        // Redirige a la página de entrega
        window.location.href = "entrega.html";
    }).catch((error) => {
        console.error("Error al verificar/crear la colección 'carrito': ", error);
        // Manejar errores aquí, por ejemplo, mostrar un mensaje al usuario
    });
}

// Función para generar un ID único para el producto (opcional)
function generarIdProducto(producto) {
    return producto.nombre.replace(/\s+/g, '-').toLowerCase();
}

// Obtener los productos del carrito y mostrarlos en la página
var carritoRef = db.collection("carrito");

carritoRef.get().then(function(querySnapshot) {
    if (querySnapshot.empty) {
        console.log("El carrito está vacío.");
        return;
    }

    // Limpiar la lista de productos antes de agregar nuevos
    var carritoItems = document.getElementById('carrito-items');
    carritoItems.innerHTML = '';

    // Inicializa el subtotal y el costo de envío
    var subtotal = 0;
    var costoEnvio = 3500; // Ajusta según tus necesidades

    // Iterar sobre los documentos del carrito
    querySnapshot.forEach(function(doc) {
        var producto = doc.data();
        subtotal += producto.precio;

        // Crear elementos HTML para mostrar los detalles del producto
        var listItem = document.createElement('div');
        listItem.classList.add('product-item');
        listItem.innerHTML = `
            <div class="producto-imagen"><img src="${producto.imagen}" alt="${producto.nombre}" style="max-width: 10%; height: auto; ></div>
            <div class="producto-info">
                <h3>${producto.nombre}</h3>
                <p>Precio: $${producto.precio}</p>
            </div>
        `;

        // Agregar el elemento a la lista de productos en el carrito
        carritoItems.appendChild(listItem);
    });

    // Calcula el total sumando el subtotal y el costo de envío
    var total = subtotal + costoEnvio;

    // Actualiza el contenido en la interfaz de usuario
    document.getElementById('subtotal').textContent = '$' + subtotal;
    document.getElementById('total').textContent = '$' + total;
}).catch(function(error) {
    console.error("Error al obtener productos del carrito: ", error);
});
