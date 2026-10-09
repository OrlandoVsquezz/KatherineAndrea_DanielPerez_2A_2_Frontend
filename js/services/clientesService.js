const API_URL = "http://localhost:8080/api/clientes"

// Método GET
export async function obtenerClientes() {
    try {
        const response = await fetch (API_URL);
        
        if(!response.ok){
            throw new Error ("No se pudieron obtener los clientes: " + response.statusText);
        }    

        const resultado = await response.json;
        return resultado.data;
    } 
    catch (error) {
        console.error("Error al obtener los clientes: " + error);
        throw error;
    }
}

// Método POST
export async function agregarCliente(cliente) {
    try {
        const response = await fetch (API_URL, {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(cliente)
        });
        
        if(!response.ok){
            const body = await response.json().catch(() => null);
            throw new Error (body?.message || "No se pudo agregar al cliente: " + response.statusText); // Así da la respuesta que trae el json en vez de una generica
        }    

        const resultado = await response.json;
        return resultado.data;
    } 
    catch (error) {
        console.error("Error al agregar al cliente: " + error);
        throw error;
    }
}


// Método DELETE
export async function eliminarCliente(id) {
    try {
        const response = await fetch (API_URL, {
            method: "DELETE"
        });
        
        if(!response.ok){
            const body = await response.json().catch(() => null);
            throw new Error (body?.message || "Error al eliminar al cliente: " + response.statusText); // Así da la respuesta que trae el json en vez de una generica
        }    

        const resultado = await response.json;
        return resultado.data;
    } 
    catch (error) {
        console.error("Error al eliminar al cliente: " + error);
        throw error;
    }
}

// Método GET (con id)
export async function obtenerCliente(id) {
    try {
        const response = await fetch (`${API_URL}/${id}`);
        
        if(!response.ok){
            throw new Error ("No se pudo obtener al cliente: " + response.statusText);
        }    

        const resultado = await response.json;
        return resultado.data;
    } 
    catch (error) {
        console.error("Error al obtener al cliente: " + error);
        throw error;
    }
}

// Método PUT
export async function actualizarCliente(id, cliente) {
    try {
        const response = await fetch (`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(cliente)
        });
        
        if(!response.ok){
            const body = await response.json().catch(() => null);
            throw new Error (body?.message || "No se pudo actualizar al cliente: " + response.statusText); // Así da la respuesta que trae el json en vez de una generica
        }    

        const resultado = await response.json;
        return resultado.data;
    } 
    catch (error) {
        console.error("Error al actualizar al cliente: " + error);
        throw error;
    }
}