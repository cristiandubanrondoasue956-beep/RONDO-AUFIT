 // Miramos la sesión del administrador
window.onload = function() {
    const sesion = obtenerSesion();
    if (!sesion) {
        alert("Debes iniciar sesión primero");
        window.location.href = "login.html";
        return;
    }
    if (sesion.rol !== "administrador") {
        alert("No tienes permiso para acceder al panel de administrador");
        window.location.href = "panel-empleado.html";
        return;
    }
    document.getElementById("nombreAdmin").textContent = ""+ sesion.nombre;

        // Cargamos todo al iniciar
        cargarEstadisticas();
        cargarEncargos();
        cargarInventario();
};

//       CAMBIAR ENTRE TABS     
function cambiarTab(seccionId, tab) {
    // Desactivar todas las secciones y tabs
    document.querySelectorAll(".seccion").forEach(s => s.classList.remove("activa"));
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("activo"));

//    Activar la seleccionada
    document.getElementById("seccion-" + seccionId).classList.add("activa");
    tab.classList.add("activo");
}

//      CARGAR ESTADÍSTICAS     
function cargarEstadisticas() {
    const encargos = obtenerEncargos();

//      Contamos por estado
    const pendientes  = encargos.filter(f => f.estado === "pendiente").length;
    const confirmados = encargos.filter(f => f.estado === "confirmado").length;
    const denegados   = encargos.filter(f => f.estado === "denegado").length;

//      CALCULAMOS INGRESOS SOLO DE LOS CONFIRMADOS
    const ingresos = encargos
        .filter(f => f.estado === "confirmado")
        .reduce((acc, f) => acc + parseFloat(f.total), 0);

            document.getElementById("statTotal").textContent      = encargos.length;
            document.getElementById("statPendientes").textContent = pendientes;
            document.getElementById("statConfirmados").textContent = confirmados;
            document.getElementById("statDenegados").textContent  = denegados;
            document.getElementById("statDinero").textContent     = ingresos.toFixed(3) + "F";

            // Mostramos la lista de clientes
            const listaDiv = document.getElementById("listaClientes");

            if (encargos.length === 0) {
                listaDiv.innerHTML = '<div class="sin-datos">Todavía no hay encargos</div>';
                return;
            }

            // Construimos la tabla de clientes
            listaDiv.innerHTML = `
                <div class="tabla-contenedor">
                <table>
                    <thead>
                        <tr>
                            <th>NOMBRE</th>
                            <th>DOMICILIO</th>
                            <th>TELÉFONO</th>
                            <th>EMAIL</th>
                            <th>ENCARGOS</th>
                            <th>TOTAL GASTADO</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${construirFilasClientes(encargos)}
                    </tbody>
                </table>
                </div>
            `;
        }


//      CARRITO ----------------
//      Agrupa encargos por cliente y calcula totales
function construirFilasClientes(encargos) {
//      Usamos un objeto para agrupar por email
    const clientesMap = {};

        encargos.forEach(function(encargo) {
            const email = encargo.cliente.email;
            if (!clientesMap[email]) {
                clientesMap[email] = {
                    nombre:    encargo.cliente.nombre,
                    domicilio: encargo.cliente.domicilio,
                    telefono:  encargo.cliente.telefono,
                    email:     email,
                    numEncargos: 0,
                    totalGastado: 0
                };
            }
            clientesMap[email].numEncargos++;
            if (encargo.estado === "confirmado") {
                    clientesMap[email].totalGastado += parseFloat(encargo.total);
            }
        });

//      Convertimos el objeto a filas de tabla
        return Object.values(clientesMap).map(cliente => `
            <tr>
                <td>${cliente.nombre}</td>
                <td>${cliente.domicilio}</td>
                <td>${cliente.telefono}</td>
                <td>${cliente.email}</td>
                <td style="text-align:center;">${cliente.numEncargos}</td>
                <td>${cliente.totalGastado.toFixed(3)} FCFA</td>
            </tr>
        `).join("");
        }

//      CARGAR TABLA DE ENCARGOS 
function cargarEncargos() {
    const encargos  = obtenerEncargos();
    const tbody     = document.getElementById("cuerpoTablaEncargos");

        if (encargos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="sin-datos">No hay encargos todavía</td></tr>';
            return;
        }

//        Ordenamos de más reciente a más antiguo
    encargos.sort((a, b) => b.id - a.id);

        tbody.innerHTML = encargos.map(encargo => `
            <tr>
                <td>#${encargo.id}</td>
                <td>${encargo.fecha}</td>
                <td>
                    <strong>${encargo.cliente.nombre}</strong><br>
                    <span style="color:#666; font-size:11px;">${encargo.cliente.email}</span><br>
                    <span style="color:#666; font-size:11px;">${encargo.cliente.telefono}</span>
                </td>
                <td>
                    ${encargo.productos.map(p =>
                        `${p.nombre} ×${p.cantidad}`
                    ).join("<br>")}
                </td>
                <td>${encargo.total} FCFA</td>
                <td><span class="badge ${encargo.estado}">${encargo.estado.toUpperCase()}</span></td>
            </tr>
        `).join("");
}

//      CARGAR TABLA DE INVENTARIO ----
function cargarInventario() {
    const productos = obtenerProductos();
    const tbody     = document.getElementById("cuerpoInventario");

    tbody.innerHTML = productos.map(producto => {
        // Color del stock según la cantidad
        let claseStock = "stock-ok";
        if (producto.stock === 0) claseStock = "stock-agotado";
        else if (producto.stock <= 3) claseStock = "stock-bajo";

        return `
            <tr>
                <td><img src="${producto.imagen}" alt="${producto.nombre}" class="img-mini"></td>
                <td>${producto.nombre}</td>
                <td>${producto.categoria}</td>
                <td>${producto.talla}</td>
                <td>${producto.precio.toFixed(3)} FCFA</td>
                <td class="${claseStock}">
                     ${producto.stock === 0 ? "❌ AGOTADO" : producto.stock <= 3 ? "⚠ " + producto.stock : producto.stock}
                </td>
                <td>
                    <input 
                        type="number" 
                        class="input-stock"
                        id="stock-${producto.id}"
                        value="${producto.stock}"
                        min="0"
                    >
                    <button 
                        class="btn-guardar-stock"
                        onclick="actualizarStockManual(${producto.id})"
                    >
                        GUARDAR
                    </button>
                    <span class="aviso-guardado" id="aviso-${producto.id}"></span>
                </td>
            </tr>
        `;
    }).join("");
}

//      El administrador puede cambiar el stock manualmente
function actualizarStockManual(idProducto) {
    const nuevoStock = parseInt(document.getElementById("stock-" + idProducto).value);

    if (isNaN(nuevoStock) || nuevoStock < 0) {
        alert("Introduce un número válido (0 o más)");
            return;
        }

//      Actualizamos en localStorage
    const productos = obtenerProductos();
    const producto  = productos.find(p => p.id === idProducto);
    if (producto) {
        producto.stock = nuevoStock;
        localStorage.setItem("productos", JSON.stringify(productos));
    }

//      Mostramos un aviso de guardado
    const aviso = document.getElementById("aviso-" + idProducto);
    aviso.textContent = "✓ Guardado";
    setTimeout(() => { aviso.textContent = ""; }, 2000);

//      Recargamos la tabla
    cargarInventario();
}