import { obtenerReserva, obtenerReservas, eliminarReserva, actualizarReserva, agregarReserva } from "../services/reservasService"
import { obtenerClientes } from "../services/clientesService"
import { obtenerVehiculos } from "../services/vehiculosService"

// Elementos del DOM 
const frmAgregarReservas = document.getElementById("frmAgregarReservas");
const idReserva = document.getElementById("idReserva");
const ddNombreCliente = document.getElementById("NombreCliente");
const ddVehiculo = document.getElementById("ddVehiculo");
const txtFechaReserva = document.getElementById("txtFechaReserva");
const txtCantidadPasajeros = document.getElementById("txtCantidadPasajeros");
const txtCantidadDias = document.getElementById("txtCantidadDias");
const txtTotalPago = document.getElementById("txtTotalPago");
const ddEstadoReserva = document.getElementById("ddEstadoReserva");

const btnAgregarReserva = document.getElementById("btnAgregarReserva");
const btnCancelar = document.getElementById("btnCancelar");

const mensaje = document.getElementById("mensaje");
const textoMensaje = document.getElementById("textoMensaje");
const tbReservas = document.getElementById("tbReservas");

let listaClientes = [];
let listaVehiculos = [];
let temporizador;

// Alerta 
function mostrarAlerta(texto, tipo) {
    const tema = tipo === "success" ? "theme-success" : "theme-danger";
    // Si es de tipo success se mostrara verde sino rojo
    mensaje.className = `alert ${tema}`; // Aqui se cambian las clases
    textoMensaje.textContent = texto;
    mensaje.scrollIntoView({ behavior: "smooth" });

    clearTimeout(temporizador);
    temporizador = setTimeout(() => mensaje.classList.add("d-none"), 4000);
    // Al terminar el temporizador se vuelve a poner la clase d-none
}

// Cargar selects
async function cargarSelects() {
    try {
        const clientes = await obtenerClientes();
        const vehiculos = await obtenerVehiculos();
        
        listaClientes = clientes;
        listaVehiculos = vehiculos;

        ddNombreCliente.innerHTML = '<option value="">Selecciona un cliente</option>';
        clientes.forEach((cliente) => {
            ddNombreCliente.innerHTML += `<option value="${cliente.id}">${cliente.nombre} + " " + ${cliente.apellido} </option>`;
        })

        ddVehiculo.innerHTML = '<option value="">Selecciona un vehículo</option>';
        vehiculos.forEach((vehiculo) => {
            ddVehiculo.innerHTML += `<option value="${vehiculo.id}">${vehiculo.nombre}</option>`;
        });

    } 
    catch (error) {
        mostrarAlerta("No se pudieron cargar los clientes o los vehiculos: " + error.message, "danger");
        console.error(error);
    }
}

// Cargar reservas en la tabla
async function cargarReservas() {
    try {
        const reservas = await obtenerReservas();
        
        tbReservas.innerHTML = "";

        reservas.forEach((reserva) => {
            const cliente = listaClientes.find((c) => c.id === cliente.id);
            const vehiculo = listaVehiculos.find((v) => v.id === vehiculo.id)

            tbReservas.innerHTML += `
                <tr>
                    <td>${reserva.id}</td>
                    <td>${reserva.nombre} + " " + ${reserva.apellido}</td>
                    <td>${reserva.placa}</td>
                    <td>${reserva.fechaReserva}</td>
                    <td>${reserva.cantidadPasajeros}</td>
                    <td>${reserva.cantidadDias}</td>
                    <td>${reserva.totalPago}</td>
                    <td>${reserva.estadoActual}</td>
                    <button class="btn btn-danger btn-sm" onclick="borrarReserva(${reserva.id})">Eliminar</button>
                    <button class="btn btn-warning btn-sm" onclick="cargarInformacionReserva(${reserva.id})">Actualizar</button>
                </tr>
            `
        })
    } 
    catch (error) {
        mostrarAlerta("No se pudieron cargar las reservas: " + error.mesage, "danger");
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", async function () {
    await cargarSelects();
    await cargarReservas();
})

function esFechaPasada(fechaTexto) {
    const [anio, mes, dia] = fechaTexto.split("-").map(Number);
    const fecha = new Date (anio, mes -1, dia);
    
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    return fecha < hoy;
}

frmAgregarReservas.addEventListener("submit", async function (event) {
    event.preventDefault();

    const id = idReserva.value.trim();
    const cliente = ddNombreCliente.value.trim();
    const vehiculo = ddVehiculo.value.trim();
    const fechaReserva = txtFechaReserva.value.trim();
    const cantidadPasajeros = txtCantidadPasajeros.value.trim();
    const cantidadDias = txtCantidadDias.value.trim();
    const totalPago = txtTotalPago.value.trim();
    const estadoReserva = ddEstadoReserva.value.trim();

    // Validaciones 
    if(cliente == "" || vehiculo == "" || fechaReserva == "" || cantidadPasajeros == "" || cantidadDias == "" || totalPago == "" || estadoReserva == "") {
        mostrarAlerta("Todos los campos son obligatorios, no se debe dejar ningun campo vacio", "warning");
        return;
    }

    if(fechaReserva == ""){
        mostrarAlerta("Seleccione una fecha", "warning");
    }

    if(esFechaPasada(fechaReserva)){
        mostrarAlerta("La fecha no puede ser pasada");
        return;
    }

    const reserva = {
        id: id,
        idCliente: Number(cliente),
        idVehiculo: Number(vehiculo),
        fechaReserva: fechaReserva,
        cantidadPasajeros: cantidadPasajeros,
        cantidadDias: cantidadDias,
        estado: estadoReserva,
        totalPago: totalPago
    }

    try {
        let resultado;
        
        if(id != ""){
            resultado = await actualizarReserva(id, reserva);
        }
        else {
            resultado = await agregarReserva(reserva)
        }

        mostrarAlerta(resultado.mesage, "success");
        resetForm();
        await cargarReservas();
    } 
    catch (error) {
        mostrarAlerta("No se pudo guardar la reserva :" + error.message, "error");
    }
})

function resetForm() {
    frmAgregarReservas.reset();
    idReserva.value = "";
    btnAgregarReserva.textContent = "Agregar reserva";
    btnCancelar.classList.add("d-none");
}

btnCancelar.addEventListener("click", resetForm);

async function borrarReserva(id) {
    const confirmacion = confirm("¿Desea eliminar esta reserva?");

    if(!confirmacion){
        return;
    }

    try {
        await eliminarReserva(id);
        mostrarAlerta("Reserva eliminada correctamente", "success");
        resetForm();
        await cargarReservas();
    }
    catch (error) {
        mostrarAlerta("No se pudo eliminar la reserva: " + error.message, "error")
    }
}

async function cargarInformacionReserva(id) {
    try {
        const reserva = await obtenerReserva(id);
        
        if(!reserva) {
            mostrarAlerta("No se encontro la reserva", "error");
            return;
        }

        idReserva.value = reserva.id;
        ddNombreCliente.value = reserva.idCliente;
        ddVehiculo.value = reserva.idVehiculo;
        txtFechaReserva.value = reserva.fechaReserva;
        txtCantidadPasajeros.value = reserva.cantidadPasajeros;
        txtCantidadDias.value = reserva.cantidadDias;
        ddEstadoReserva.value = reserva.estado;
        txtTotalPago.value = reserva.totalPago;

        btnAgregarReserva.textContent = "Actualizar";
        btnCancelar.classList.remove("d-none");

        window.scrollTo({ top: 0, behavior: "smooth"});
    } 
    catch (error) {
        mostrarAlerta("No se pudieron obtener los datos de la reserva", "error");
        console.error(error);
    }
}

window.borrarReserva = borrarReserva;
window.cargarInformacionReserva = cargarInformacionReserva;