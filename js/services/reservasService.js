const API_URL = "http://localhost:8080/api/reservas"

// Método GET
export async function obtenerReservas() {
    try {
        const response = await fetch (API_URL);
        
        if(!response.ok){
            throw new Error ("No se pudieron obtener las reservas: " + response.statusText);
        }    

        const resultado = await response.json();
        return resultado.data;
    } 
    catch (error) {
        console.error("Error al obtener las reservas: " + error);
        throw error;
    }
}

// Método POST
export async function agregarReserva(reserva) {
    try {
        const response = await fetch (API_URL, {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(reserva)
        });
        
        if(!response.ok){
            const body = await response.json().catch(() => null);
            throw new Error (body?.message || "No se pudo agregar la reserva: " + response.statusText); // Así da la respuesta que trae el json en vez de una generica
        }    

        const resultado = await response.json();
        return resultado;
    } 
    catch (error) {
        console.error("Error al agregar la reserva: " + error);
        throw error;
    }
}


// Método DELETE
export async function eliminarReserva(id) {
    try {
        const response = await fetch (`${API_URL}/${id}`, {
            method: "DELETE"
        });
        
        if(!response.ok){
            const body = await response.json().catch(() => null);
            throw new Error (body?.message || "Error al eliminar la reserva: " + response.statusText); // Así da la respuesta que trae el json en vez de una generica
        }    

        return true;
    } 
    catch (error) {
        console.error("Error al eliminar la reserva: " + error);
        throw error;
    }
}

// Método GET (con id)
export async function obtenerReserva(id) {
    try {
        const response = await fetch (`${API_URL}/${id}`);
        
        if(!response.ok){
            throw new Error ("No se pudieron obtener la reserva: " + response.statusText);
        }    

        const resultado = await response.json();
        return resultado.data;
    } 
    catch (error) {
        console.error("Error al obtener la reserva: " + error);
        throw error;
    }
}

// Método PUT
export async function actualizarReserva(id, reserva) {
    try {
        const response = await fetch (`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(reserva)
        });
        
        if(!response.ok){
            const body = await response.json().catch(() => null);
            throw new Error (body?.message || "No se pudo actualizar la reserva: " + response.statusText); // Así da la respuesta que trae el json en vez de una generica
        }    

        const resultado = await response.json();
        return resultado;
    } 
    catch (error) {
        console.error("Error al actualizar la reserva: " + error);
        throw error;
    }
}
