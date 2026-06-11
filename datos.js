
// MI BASE DE DATOS SIMULADA 

// Usamos localStorage para que los datos persistan entre páginas


// ---- PRODUCTOS DEL INVENTARIO ----
// Cada producto tiene: id, nombre, precio, talla, stock, imagen, categoria
const productosIniciales = [
    { id: 1,  nombre: "Polo Lacoste",        precio: 40.000, talla: "M",  stock: 10, imagen: "fotos/lacoste.jpg",        categoria: "Camisas" },
    { id: 2,  nombre: "Camisa Negra",         precio: 30.000, talla: "L",  stock: 8,  imagen: "fotos/camisanegra.jpg",     categoria: "Camisas" },
    { id: 3,  nombre: "Pantalón Chin",        precio: 55.00, talla: "M",  stock: 5,  imagen: "fotos/pantalonchin.avif",   categoria: "Pantalones" },
    { id: 4,  nombre: "Chaqueta Gris",        precio: 80.00, talla: "L",  stock: 4,  imagen: "fotos/chaquetagris.jpg",    categoria: "Chaquetas" },
    { id: 5,  nombre: "Cinturón Rojo",        precio: 20.00, talla: "ÚN", stock: 15, imagen: "fotos/cinturonrojo.jpg",    categoria: "Accesorios" },
    { id: 6,  nombre: "Blusa Elegante",       precio: 35.00, talla: "S",  stock: 7,  imagen: "fotos/blusa.jpg",           categoria: "Camisas" },
    { id: 7,  nombre: "Pantalón Marrón",      precio: 50.00, talla: "M",  stock: 6,  imagen: "fotos/pantalonmaron.jpg",   categoria: "Pantalones" },
    { id: 8,  nombre: "Chándal Ropa",         precio: 65.00, talla: "L",  stock: 3,  imagen: "fotos/chandalropa.webp",    categoria: "Deportivo" },
    { id: 9,  nombre: "Traje Rosa",           precio: 90.00, talla: "S",  stock: 2,  imagen: "fotos/trajerosa.jpg",       categoria: "Trajes" },
    { id: 10, nombre: "Sombrero Marrón",      precio: 25.00, talla: "ÚN", stock: 12, imagen: "fotos/sombreromaron.webp",  categoria: "Accesorios" },
    { id: 11, nombre: "Cadena Dorada",        precio: 15.00, talla: "ÚN", stock: 20, imagen: "fotos/cadena2.webp",        categoria: "Accesorios" },
    { id: 12, nombre: "Gorro",                precio: 18.00, talla: "ÚN", stock: 9,  imagen: "fotos/goro.jpg",            categoria: "Accesorios" },
    { id: 13, nombre: "Polo Rojo",            precio: 40.00, talla: "M",  stock: 11, imagen: "fotos/rojo1.jpg",           categoria: "Camisas" }
];

//  USUARIOS DEL SISTEMA (empleados y el administrador) 

const usuariosSistema = [
    { id: 1, nombre: "Cristian Duban Admin Principal", usuario: "mufasa",    contraseña: "mufasa770",   rol: "administrador" },
    { id: 2, nombre: "Fermin Empleado", usuario: "fermin",   contraseña: "dogman", rol: "empleado" },
    { id: 3, nombre: "Oscarina Empleada",    usuario: "oscarina",      contraseña: "constantemente", rol: "empleado" }
];



// localStorage es como una "caja" donde he guardado los datos 


// Inicializa los productos en localStorage si no existen todavía
function inicializarDatos() {
    if (!localStorage.getItem("productos")) {
        localStorage.setItem("productos", JSON.stringify(productosIniciales));
    }
    if (!localStorage.getItem("encargos")) {
        localStorage.setItem("encargos", JSON.stringify([]));
    }
}

// Obtiene todos los productos
function obtenerProductos() {
    return JSON.parse(localStorage.getItem("productos")) || productosIniciales;
}

// Obtiene todos los encargos de los clientes
function obtenerEncargos() {
    return JSON.parse(localStorage.getItem("encargos")) || [];
}

// Guarda un nuevo encargo
function guardarEncargo(encargo) {
    const encargos = obtenerEncargos();
    encargo.id = Date.now(); // ID único usando la fecha/hora actual
    encargo.fecha = new Date().toLocaleString("es-ES");
    encargo.estado = "pendiente"; // Estado inicial: pendiente
    encargos.push(encargo);
    localStorage.setItem("encargos", JSON.stringify(encargos));
    return encargo;
}

// Actualiza el estado de un encargo (confirmar o denegar)
function actualizarEstadoEncargo(idEncargo, nuevoEstado) {
    const encargos = obtenerEncargos();
    const index = encargos.findIndex(f => f.id === idEncargo);
    if (index !== -1) {
        encargos[index].estado = nuevoEstado;
        localStorage.setItem("encargos", JSON.stringify(encargos));
    }
}

// Actualiza el stock de productos cuando se confirma un encargo
function actualizarStock(carrito) {
    const productos = obtenerProductos();
    carrito.forEach(itemCarrito => {
        const producto = productos.find(p => p.id === itemCarrito.id);
        if (producto) {
            producto.stock = Math.max(0, producto.stock - itemCarrito.cantidad);
        }
    });
    localStorage.setItem("productos", JSON.stringify(productos));
}

// Verifica si el login es correcto y devuelve el usuario si existe
function verificarLogin(usuario, contraseña) {
    return usuariosSistema.find(u => u.usuario === usuario && u.contraseña === contraseña) || null;
}

// Guarda el usuario que ha iniciado sesión
function guardarSesion(usuario) {
    sessionStorage.setItem("usuarioActivo", JSON.stringify(usuario));
}

// Obtiene el usuario que está en sesión
function obtenerSesion() {
    return JSON.parse(sessionStorage.getItem("usuarioActivo")) || null;
}

// Cierra la sesión
function cerrarSesion() {
    sessionStorage.removeItem("usuarioActivo");
    window.location.href = "login.html";
}

// Inicializar datos al cargar cualquier página
inicializarDatos();
