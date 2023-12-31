const nombreInput = document.getElementById("nombre");
const numeroInput = document.getElementById("numero");
const btnAgregar = document.getElementById("btnAgregar");
const buscarNombreInput = document.getElementById("buscarNombre");
const listaContactos = document.getElementById("listaContactos");
const mensajeError = document.getElementById("mensajeError");
const cerrarMensaje = document.getElementById("cerrarMensaje");
const mensajeTexto = document.getElementById("mensajeTexto");

let contactos = JSON.parse(localStorage.getItem("contactos")) || [];
let edicionEnProceso = false;

function mostrarContactos(resultados = contactos) {
    listaContactos.innerHTML = "";

    for (let i = 0; i < resultados.length; i++) {
        const contacto = resultados[i];
        const li = document.createElement("li");
        li.classList.add("list-group-item");
        li.innerHTML = `
            <b>Nombre: ${contacto.nombre} | Número: ${contacto.numero}</b>
            <button type="button" class="btn btn-danger btn-sm" id="btnEliminar_${i}">Eliminar</button>
            <button type="button" class="btn btn-secondary btn-sm" id="btnEditar_${i}">Editar</button>
        `;

        const btnEliminar = li.querySelector(`#btnEliminar_${i}`);
        btnEliminar.addEventListener("click", () => eliminarContacto(i, resultados));

        const btnEditar = li.querySelector(`#btnEditar_${i}`);
        btnEditar.addEventListener("click", () => mostrarFormularioEdicion(i, resultados));

        listaContactos.appendChild(li);
    }
}

function agregarContacto() {
    const nombre = nombreInput.value;
    const numero = numeroInput.value;

    if (nombre != "" && numero != "") {
        if (contactoExiste(nombre, numero)) {
            mostrarMensajeError();
        } else {
            contactos.push({
                nombre,
                numero
            });
            localStorage.setItem("contactos", JSON.stringify(contactos));
            mostrarContactos();
            nombreInput.value = "";
            numeroInput.value = "";
            ocultarMensajeError();
        }
    }
}

function eliminarContacto(index, resultadosBusqueda) {
    const contactoEliminado = resultadosBusqueda[index];
    const nuevosContactos = [];
    for (const contacto of contactos) {
        if (!(contacto.nombre === contactoEliminado.nombre && contacto.numero === contactoEliminado.numero)) {
            nuevosContactos.push(contacto);
        }
    }
    contactos = nuevosContactos;
    localStorage.setItem("contactos", JSON.stringify(contactos));
    buscarNombreInput.value = "";
    ocultarMensajeError();
    mostrarContactos();
}

function mostrarFormularioEdicion(index, resultadosBusqueda) {
    if (edicionEnProceso) {
        return;
    }

    edicionEnProceso = true;

    const contacto = resultadosBusqueda[index];

    const formularioEdicion = document.createElement("div");
    formularioEdicion.innerHTML = `
        <div class="mb-3">
            <label for="editNombre" class="form-label">Nuevo Nombre:</label>
            <input type="text" class="form-control" id="editNombre" value="${contacto.nombre}">
        </div>
        <div class="mb-3">
            <label for="editNumero" class="form-label">Nuevo Número:</label>
            <input type="number" class="form-control" id="editNumero" value="${contacto.numero}">
        </div>
        <button type="button" class="btn btn-primary" id="btnGuardarEdicion">Guardar</button>
        <button type="button" class="btn btn-secondary" id="btnCancelarEdicion" onclick="ocultarMensajeError()">Cancelar</button>
    `;

    const btnGuardarEdicion = formularioEdicion.querySelector("#btnGuardarEdicion");
    btnGuardarEdicion.addEventListener("click", () => guardarEdicionContacto(index, resultadosBusqueda));

    const btnCancelarEdicion = formularioEdicion.querySelector("#btnCancelarEdicion");
    btnCancelarEdicion.addEventListener("click", () => mostrarContactos(resultadosBusqueda));

    listaContactos.replaceChild(formularioEdicion, listaContactos.children[index]);
    ocultarMensajeError();
}

function guardarEdicionContacto(index, resultadosBusqueda) {
    const nuevoNombre = document.getElementById("editNombre").value;
    const nuevoNumero = document.getElementById("editNumero").value;

    if (nuevoNombre !== "" && nuevoNumero !== "") {
        const contactoEditado = resultadosBusqueda[index];
        const cambiosRealizados = (
            contactoEditado.nombre !== nuevoNombre ||
            contactoEditado.numero !== nuevoNumero
        );

        if (cambiosRealizados) {
            let nombreExiste = false;
            let numeroExiste = false;

            for (let i = 0; i < contactos.length; i++) {
                if (i !== index) {
                    if (contactos[i].nombre === nuevoNombre) {
                        nombreExiste = true;
                    }
                    if (contactos[i].numero === nuevoNumero) {
                        numeroExiste = true;
                    }
                }
            }

            if (!nombreExiste && !numeroExiste) {
                contactoEditado.nombre = nuevoNombre;
                contactoEditado.numero = nuevoNumero;
                localStorage.setItem("contactos", JSON.stringify(contactos));
            } else {
                mostrarMensajeError();
                return;
            }
        }
        
        buscarNombreInput.value = "";
        ocultarMensajeError();
        mostrarContactos();
    }

    edicionEnProceso = false;
}

function buscarContactoPorNombre(nombreBuscado) {
    const resultados = contactos.filter(contacto =>
        contacto.nombre.toLowerCase().includes(nombreBuscado.toLowerCase())
    );
    return resultados;
}

function mostrarMensajeError() {
    mensajeError.classList.remove("d-none");
}

function ocultarMensajeError() {
    mensajeError.classList.add("d-none");
}

function contactoExiste(nombre, numero) {
    for (const contactoRecorrido of contactos) {
        if (contactoRecorrido.nombre === nombre || contactoRecorrido.numero === numero) {
            return true;
        }
    }
    return false;
}

btnAgregar.addEventListener("click", agregarContacto);
cerrarMensaje.addEventListener("click", ocultarMensajeError);

buscarNombreInput.addEventListener("input", () => {
    const resultados = buscarContactoPorNombre(buscarNombreInput.value.toLowerCase());
    mostrarContactos(resultados);
});

mostrarContactos();


