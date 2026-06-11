// ============================================================
// TIENDA.JS — LÓGICA DE LA TIENDA PARA EL CLIENTE
// ============================================================

// Esta variable guarda los productos que el cliente ha añadido al carrito
let carrito = [];

// ---- AL CARGAR LA PÁGINA, MOSTRAMOS LOS PRODUCTOS ----
window.onload = function() {
    mostrarProductos();
};

// Genera las tarjetas de productos dinámicamente (desde datos.js)
function mostrarProductos() {
    const productos = obtenerProductos(); // función de datos.js
    const seccionPrendas = document.getElementById("prendas");

    // Vaciamos la sección primero
    seccionPrendas.innerHTML = "";

    // Por cada producto creamos una tarjeta
    productos.forEach(function(producto) {
        // Creamos el contenedor principal de cada tarjeta
        const tarjeta = document.createElement("div");
        tarjeta.className = "tablasRopas1"; // usamos tu clase CSS

        // El HTML dentro de la tarjeta
        tarjeta.innerHTML = `
            <div class="hijostablasRopas1-1">
                <img 
                    src="${producto.imagen}" 
                    alt="${producto.nombre}"
                    class="cajaRopaImg"
                >
            </div>
            <div class="hijostablasRopas1-2" style="flex-direction: column; padding: 8px 0;">
                <p class="nombreProducto">${producto.nombre}</p>
                <p class="precioProducto">${producto.precio.toFixed(3)} FCFA — Talla: ${producto.talla}</p>
                <p class="precioProducto" style="color: ${producto.stock > 0 ? '#418a44' : 'red'}">
                    ${producto.stock > 0 ? 'Stock: ' + producto.stock : '❌ Sin stock'}
                </p>
                <a 
                    href="#" 
                    class="btn"
                    onclick="agregarAlCarrito(${producto.id}); return false;"
                    style="${producto.stock === 0 ? 'opacity:0.4; pointer-events:none;' : ''}"
                >
                    ${producto.stock > 0 ? 'AÑADIR AL CARRITO' : 'SIN STOCK'}
                </a>
            </div>
        `;

        seccionPrendas.appendChild(tarjeta);
    });
}

// ---- FUNCIÓN PARA AGREGAR UN PRODUCTO AL CARRITO ----
function agregarAlCarrito(idProducto) {
    const productos = obtenerProductos();
    const producto = productos.find(p => p.id === idProducto);

    if (!producto) return;

    // Buscamos si ya está en el carrito
    const existente = carrito.find(item => item.id === idProducto);

    if (existente) {
        // Si ya está, aumentamos la cantidad (sin pasar del stock)
        if (existente.cantidad < producto.stock) {
            existente.cantidad++;
        } else {
            mostrarNotificacion("⚠ No hay más stock disponible");
            return;
        }
    } else {
        // Si no está, lo añadimos nuevo
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            talla: producto.talla,
            cantidad: 1
        });
    }

    actualizarVistaCarrito();
    mostrarNotificacion("✓ " + producto.nombre + " añadido");
}

// ---- ACTUALIZA EL PANEL DEL CARRITO ----
function actualizarVistaCarrito() {
    const lista = document.getElementById("listaCarrito");
    const contador = document.getElementById("contadorCarrito");
    const totalDiv = document.getElementById("totalCarrito");
    const carritoVacio = document.getElementById("carritoVacio");

    // Calculamos el total de artículos
    const totalArticulos = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    contador.textContent = totalArticulos;

    if (carrito.length === 0) {
        lista.innerHTML = '<div id="carritoVacio">Tu carrito está vacío</div>';
        totalDiv.textContent = "Total: 0.000 FCFS";
        return;
    }

    // Construimos el HTML de los items
    //COMO FUNCIONA
    lista.innerHTML = "";
    let total = 0;

    carrito.forEach(function(item) {
        total += item.precio * item.cantidad;

        const div = document.createElement("div");
        div.className = "itemCarrito";
        div.innerHTML = `
            <img src="${item.imagen}" alt="${item.nombre}">
            <div class="info">
                <strong>${item.nombre}</strong>
                <span>Talla: ${item.talla}</span>
                <span>${item.precio.toFixed(3)} FCFA × ${item.cantidad}</span>
            </div>
            <button class="btnEliminar" onclick="quitarDelCarrito(${item.id})">✕</button>
        `;
        lista.appendChild(div);
    });

    totalDiv.textContent = "Total: " + total.toFixed(3) + " FCFA";
}

// ---- QUITAR UN PRODUCTO DEL CARRITO ----
function quitarDelCarrito(idProducto) {
    carrito = carrito.filter(item => item.id !== idProducto);
    actualizarVistaCarrito();
}

// ---- ABRIR Y CERRAR EL PANEL DEL CARRITO ----
function abrirCarrito() {
    document.getElementById("panelCarrito").classList.add("abierto");
}

function cerrarCarrito() {
    document.getElementById("panelCarrito").classList.remove("abierto");
}

// ---- ABRIR EL MODAL DE REGISTRO ----
function abrirModal() {
    if (carrito.length === 0) {
        mostrarNotificacion("⚠ Añade productos primero");
        return;
    }
    document.getElementById("fondoModal").classList.add("activo");
    document.getElementById("formularioModal").style.display = "block";
    document.getElementById("mensajeExito").style.display = "none";
    cerrarCarrito();
}

function cerrarModal() {
    document.getElementById("fondoModal").classList.remove("activo");
}

function cerrarTodo() {
    cerrarModal();
    carrito = [];
    actualizarVistaCarrito();
    mostrarProductos(); // refrescamos los productos por si cambió el stock
}

// ---- VALIDAR Y ENVIAR EL ENCARGO ----
function enviarEncargo() {
    // Limpiar errores anteriores
    document.getElementById("errNombre").textContent = "";
    document.getElementById("errDomicilio").textContent = "";
    document.getElementById("errTelefono").textContent = "";
    document.getElementById("errEmail").textContent = "";

    // Leer los datos del formulario
    const nombre   = document.getElementById("modalNombre").value.trim();
    const domicilio = document.getElementById("modalDomicilio").value.trim();
    const telefono = document.getElementById("modalTelefono").value.trim();
    const email    = document.getElementById("modalEmail").value.trim();

    let valido = true;

    // Validaciones sencillas
    if (nombre.length < 3) {
        document.getElementById("errNombre").textContent = "Escribe tu nombre completo (mínimo 3 letras)";
        valido = false;
    }

    if (domicilio.length < 5) {
        document.getElementById("errDomicilio").textContent = "Escribe tu dirección completa";
        valido = false;
    }

    // El teléfono debe tener entre 9 y 15 números
    if (!/^[0-9]{9,15}$/.test(telefono)) {
        document.getElementById("errTelefono").textContent = "El teléfono debe tener entre 9 y 15 dígitos";
        valido = false;
    }

    // Validar que el email tenga formato correcto
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.getElementById("errEmail").textContent = "Escribe un email válido (ej: cristianduban@gmail.com)";
        valido = false;
    }

    // Si todo está bien, guardamos el encargo
    if (valido) {
        // Calculamos el total
        const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

        // Construimos el objeto del encargo
        const encargo = {
            cliente: {
                nombre: nombre,
                domicilio: domicilio,
                telefono: telefono,
                email: email
            },
            productos: carrito,          // lista de productos
            total: total.toFixed(3),     // total en euros
        };

        // Guardamos en localStorage (función de datos.js)
        guardarEncargo(encargo);

        // Mostramos el mensaje de éxito
        document.getElementById("formularioModal").style.display = "none";
        document.getElementById("mensajeExito").style.display = "block";
    }
}

// notificacion pequeño aviso en la parte de abajo de la pagina
function mostrarNotificacion(mensaje) {
    const notif = document.getElementById("notificacion");
    notif.textContent = mensaje;
    notif.classList.add("visible");
    // Desaparece después de 2 segundos
    setTimeout(function() {
        notif.classList.remove("visible");
    }, 2000);
}
