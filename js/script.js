const nombreInput = document.getElementById("nombre");
const numeroInput = document.getElementById("numero");
const btnAgregar = document.getElementById("btnAgregar");
const buscarNombreInput = document.getElementById("buscarNombre");
const listaContactos = document.getElementById("listaContactos");

let contactos = JSON.parse(localStorage.getItem("contactos")) || [];

function mostrarContactos() {
    listaContactos.innerHTML = "";

    for (let i = 0; i < contactos.length; i++) {
        const contacto = contactos[i];
        const li = document.createElement("li");
        li.classList.add("list-group-item");
        li.innerHTML = `
            <b>Nombre: ${contacto.nombre} | Número: ${contacto.numero}</b>
            <button type="button" class="btn btn-danger btn-sm" id="btnEliminar_${i}">Eliminar</button>
            <button type="button" class="btn btn-secondary btn-sm" id="btnEditar_${i}">Editar</button>
        `;

        const btnEliminar = li.querySelector(`#btnEliminar_${i}`);
        btnEliminar.addEventListener("click", () => eliminarContacto(i));

        const btnEditar = li.querySelector(`#btnEditar_${i}`);
        btnEditar.addEventListener("click", () => mostrarFormularioEdicion(i));

        listaContactos.appendChild(li);
    }

    const nombreEditar = localStorage.getItem("contactoAEditar");
    if (nombreEditar) {
        for (let i = 0; i < contactos.length; i++) {
            if (contactos[i].nombre === nombreEditar) {
                mostrarFormularioEdicion(i);
 
            }
        }
    }
}

function agregarContacto() {
    const nombre = nombreInput.value;
    const numero = numeroInput.value;

    if (nombre !== "" && numero !== "") {
        contactos.push({ nombre, numero });
        localStorage.setItem("contactos", JSON.stringify(contactos));
        mostrarContactos();
        nombreInput.value = "";
        numeroInput.value = "";
    }
}

function eliminarContacto(index) {
    contactos.splice(index, 1);
    localStorage.setItem("contactos", JSON.stringify(contactos));
    mostrarContactos();
}

function mostrarFormularioEdicion(index) {
    const contacto = contactos[index];

    const formularioEdicion = document.createElement("div");
    formularioEdicion.innerHTML = `
        <div class="mb-3">
            <label for="editNombre" class="form-label">Nuevo Nombre:</label>
            <input type="text" class="form-control" id="editNombre" value="${contacto.nombre}">
        </div>
        <div class="mb-3">
            <label for="editNumero" class="form-label">Nuevo Número:</label>
            <input type="text" class="form-control" id="editNumero" value="${contacto.numero}">
        </div>
        <button type="button" class="btn btn-primary" id="btnGuardarEdicion">Guardar</button>
        <button type="button" class="btn btn-secondary" id="btnCancelarEdicion">Cancelar</button>
    `;

    const btnGuardarEdicion = formularioEdicion.querySelector("#btnGuardarEdicion");
    btnGuardarEdicion.addEventListener("click", () => guardarEdicionContacto(index));

    const btnCancelarEdicion = formularioEdicion.querySelector("#btnCancelarEdicion");
    btnCancelarEdicion.addEventListener("click", () => mostrarContactos());

    listaContactos.replaceChild(formularioEdicion, listaContactos.children[index]);
}

function guardarEdicionContacto(index) {
    const nuevoNombre = document.getElementById("editNombre").value;
    const nuevoNumero = document.getElementById("editNumero").value;

    if (nuevoNombre !== "" && nuevoNumero !== "") {
        contactos[index].nombre = nuevoNombre;
        contactos[index].numero = nuevoNumero;
        localStorage.setItem("contactos", JSON.stringify(contactos));
        mostrarContactos();
    }
}

function buscarContactoPorNombre(nombreBuscado) {
    const resultados = contactos.filter(contacto =>
        contacto.nombre.toLowerCase().includes(nombreBuscado.toLowerCase())
    );

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
        btnEliminar.addEventListener("click", () => eliminarContacto(contacto));

        const btnEditar = li.querySelector(`#btnEditar_${i}`);
        btnEditar.addEventListener("click", () => mostrarFormularioEdicion(i));

        listaContactos.appendChild(li);
    }
}


btnAgregar.addEventListener("click", agregarContacto);
buscarNombreInput.addEventListener("input", () => buscarContactoPorNombre(buscarNombreInput.value.toLowerCase()));

mostrarContactos();
