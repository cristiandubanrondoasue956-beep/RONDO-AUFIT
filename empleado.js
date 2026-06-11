// Estado actual del filtro
let filtroActual = "todos";

// Verificamos que hay sesión activa y que es empleado o admin
window.onload = function() {
    const sesion = obtenerSesion();
    if (!sesion) {
        alert("Debes iniciar sesión primero");
        window.location.href = "login.html";
        return;
    }
    document.getElementById("nombreEmpleado").textContent = " " + sesion.nombre;
    cargarEncargos();
};

//       Carga y muestra todos los encargos
function cargarEncargos() {
    const encargos = obtenerEncargos(); // función de datos.js
    mostrarEncargos(encargos, filtroActual);
}

//       Muestra los encargos filtrados
function mostrarEncargos(encargos, filtro) {
    const lista = document.getElementById("listaEncargos");

//       Filtramos según el estado seleccionado
    const filtrados = filtro === "todos"
        ? encargos
        : encargos.filter(f => f.estado === filtro);

//      Si no hay encargos
        if (filtrados.length === 0) {
            lista.innerHTML = '<div class="sin-encargos">No hay encargos ' + (filtro !== "todos" ? filtro + "s" : "") + ' todavía</div>';
            return;
        }

//      Ordenamos de más reciente a más antiguo (por id = timestamp)
        filtrados.sort((a, b) => b.id - a.id);

        lista.innerHTML = "";

        filtrados.forEach(function(encargo) {
            const tarjeta = document.createElement("div");
            tarjeta.className = "tarjeta-encargo " + encargo.estado;

                // Lista de productos del encargo
            const productosHTML = encargo.productos.map(p =>
                `<li>${p.nombre} (Talla: ${p.talla}) × ${p.cantidad} — ${(p.precio * p.cantidad).toFixed(3)} FCFA</li>`
            ).join("");

                // Botones de acción (solo si está pendiente)
            const botonesHTML = encargo.estado === "pendiente" ? `
                <div class="acciones">
                    <button class="btn-confirmar" onclick="cambiarEstado(${encargo.id}, 'confirmado')"> CONFIRMAR</button>
                    <button class="btn-denegar"   onclick="cambiarEstado(${encargo.id}, 'denegado')">  DENEGAR</button>
                </div>
            ` : `<div style="text-align:right; color:#666; font-size:13px;">Encargo ya gestionado</div>`;

            tarjeta.innerHTML = `
                <div class="encargo-cabecera">
                    <div>
                        <div class="encargo-id">ID: #${encargo.id}</div>
                        <div class="encargo-fecha"> ${encargo.fecha}</div>
                    </div>
                    <span class="badge-estado ${encargo.estado}">${encargo.estado.toUpperCase()}</span>
                </div>

                <div class="datos-cliente">
                    <strong>  Cliente:</strong> ${encargo.cliente.nombre}<br>
                    <strong>  Domicilio:</strong> ${encargo.cliente.domicilio}<br>
                    <strong>  Teléfono:</strong> ${encargo.cliente.telefono}<br>
                    <strong>  Email:</strong> ${encargo.cliente.email}
                </div>

                <div class="productos-encargo">
                        strong style="color:white;">🛍 Productos pedidos:</strong>
                    <ul>${productosHTML}</ul>
                </div>

                <div class="encargo-total">  Total: ${encargo.total} FCFA</div>

                ${botonesHTML}
            `;

            lista.appendChild(tarjeta);
        });
}

        // Cambia el estado de un encargo (confirmado o denegado)
function cambiarEstado(idEncargo, nuevoEstado) {
    const mensaje = nuevoEstado === "confirmado"
        ? "¿Confirmar este encargo?"
        : "¿Denegar este encargo?";

    if (confirm(mensaje)) {
        actualizarEstadoEncargo(idEncargo, nuevoEstado); // función de datos.js

//      Si se confirma, descontamos stock
    if (nuevoEstado === "confirmado") {
        const encargos = obtenerEncargos();
        const encargo = encargos.find(e => e.id === idEncargo);
        if (encargo) {
            actualizarStock(encargo.productos); // función de datos.js
        }
    }

    cargarEncargos(); // Recargamos la vista
    }
}

        // Filtra los encargos por estado
function filtrar(estado, boton) {
    filtroActual = estado;

//  Actualizamos el botón activo
    document.querySelectorAll(".btn-filtro").forEach(b => b.classList.remove("activo"));
    boton.classList.add("activo");

        cargarEncargos();
}