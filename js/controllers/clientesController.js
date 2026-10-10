import { obtenerCliente, obtenerClientes, eliminarCliente, actualizarCliente, agregarCliente } from "../services/clientesService.js";

// Elementos del DOM
const frmAgregarClientes = document.getElementById("frmAgregarClientes");
const idCliente = document.getElementById("idCliente");
const txtNombre = document.getElementById("txtNombre");
const txtApellido = document.getElementById("txtApellido");
const txtTelefono  = document.getElementById("txtTelefono");
const txtEmail = document.getElementById("txtEmail");
const txtDireccion = document.getElementById("txtDireccion");

const btnAgregarCliente = document.getElementById("btnAgregarCliente");
const btnCancelar = document.getElementById("btnCancelar");

const mensaje = document.getElementById("mensaje");
const textoMensaje = document.getElementById("textoMensaje");
const tbClientes = document.getElementById("tbClientes");

let temporizador;

// Alerta 
function mostrarAlerta(texto, tipo) {
    const tema = tipo === "success" ? "alert-success" : "alert-danger";
    // Si es de tipo success se mostrara verde sino rojo
    mensaje.className = `alert ${tema}`; // Aqui se cambian las clases
    textoMensaje.textContent = texto;
    mensaje.scrollIntoView({ behavior: "smooth" });

    clearTimeout(temporizador);
    temporizador = setTimeout(() => mensaje.classList.add("d-none"), 4000);
    // Al terminar el temporizador se vuelve a poner la clase d-none
}

// Cargar clientes en la tabla
async function cargarClientes() {
    try {
        const clientes = await obtenerClientes();
        
        tbClientes.innerHTML = "";

        clientes.forEach((cliente) => {
            tbClientes.innerHTML += `
                <tr>
                    <td>${cliente.id}</td>
                    <td>${cliente.nombre}</td>
                    <td>${cliente.apellido}</td>
                    <td>${cliente.telefono}</td>
                    <td>${cliente.email}</td>
                    <td>${cliente.direccion}</td>
                    <td>
                    <button class="btn btn-danger btn-sm" onclick="borrarCliente(${cliente.id})">Eliminar</button>
                    <button class="btn btn-warning btn-sm" onclick="cargarInformacionCliente(${cliente.id})">Actualizar</button>
                    </td>
                </tr>
            `
        })
    } 
    catch (error) {
        mostrarAlerta("No se pudieron cargar los clientes: " + error.message, "danger");
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", async function () {
    await cargarClientes();
})

frmAgregarClientes.addEventListener("submit", async function (event) {
    event.preventDefault();

    const id = idCliente.value.trim();
    const nombre = txtNombre.value.trim();
    const apellido = txtApellido.value.trim();
    const telefono = txtTelefono.value.trim();
    const email = txtEmail.value.trim();
    const direccion = txtDireccion.value.trim();

    // Validaciones 
    if(nombre == "" || apellido == "" || telefono == "" || email == "") {
        mostrarAlerta("Todos los campos son obligatorios a excepcion de dirección", "warning");
        return;
    }

    const cliente = {
        id: id,
        nombre: nombre,
        apellido: apellido,
        telefono: telefono,
        email: email,
        direccion: direccion || null
    }

    try {
        let resultado;
        
        if(id != ""){
            resultado = await actualizarCliente(id, cliente);
        }
        else {
            resultado = await agregarCliente(cliente)
        }

        mostrarAlerta(resultado.message, "success");
        resetForm();
        await cargarClientes();
    } 
    catch (error) {
        mostrarAlerta("No se pudo guardar al cliente :" + error.message, "error");
    }
})

function resetForm() {
    frmAgregarClientes.reset();
    idCliente.value = "";
    btnAgregarCliente.textContent = "Agregar cliente";
    btnCancelar.classList.add("d-none");
}

btnCancelar.addEventListener("click", resetForm);

async function borrarCliente(id) {
    const confirmacion = confirm("¿Desea eliminar a este cliente?");

    if(!confirmacion){
        return;
    }

    try {
        await eliminarCliente(id);
        mostrarAlerta("Cliente eliminado correctamente", "success");
        resetForm();
        await cargarClientes();
    }
    catch (error) {
        mostrarAlerta("No se pudo eliminar al cliente: " + error.message, "error")
    }
}

async function cargarInformacionCliente(id) {
    try {
        const cliente = await obtenerCliente(id);
        
        if(!cliente) {
            mostrarAlerta("No se encontro al cliente", "error");
            return;
        }

        idCliente.value = cliente.id;
        txtNombre.value = cliente.nombre;
        txtApellido.value = cliente.apellido;
        txtTelefono.value = cliente.telefono;
        txtEmail.value = cliente.email;
        txtDireccion.value = cliente.direccion;

        btnAgregarCliente.textContent = "Actualizar";
        btnCancelar.classList.remove("d-none");

        window.scrollTo({ top: 0, behavior: "smooth"});
    } 
    catch (error) {
        mostrarAlerta("No se pudieron obtener los datos de la reserva", "error");
        console.error(error);
    }
}

window.borrarCliente = borrarCliente;
window.cargarInformacionCliente = cargarInformacionCliente;