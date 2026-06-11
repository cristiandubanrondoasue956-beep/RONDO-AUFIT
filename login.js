function iniciarSesion() {
    const usuario    = document.getElementById("inputUsuario").value.trim();
    const contrasena = document.getElementById("inputContrasena").value.trim();
    const mensajeError = document.getElementById("mensajeError");

    mensajeError.textContent = "";

    if (!usuario || !contrasena) {
        mensajeError.textContent = "Rellena todos los campos";
        return;
    }

    // Verificamos con la función de datos.js
    const usuarioEncontrado = verificarLogin(usuario, contrasena);

    if (usuarioEncontrado) {
        // Guardamos la sesión
        guardarSesion(usuarioEncontrado);

        // Redirigilo según el rol
        if (usuarioEncontrado.rol === "administrador") {
            window.location.href = "panel-admin.html";
        } else {
            window.location.href = "panel-empleado.html";
        }
    } else {
        mensajeError.textContent = "Usuario o contraseña incorrectos";
    }
}