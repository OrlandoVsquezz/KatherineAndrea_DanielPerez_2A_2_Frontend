const API_URL = "http://localhost:8080/api/vehiculos"

// Método GET
export async function obtenerVehiculos() {
    try {
        const response = await fetch (API_URL);
        
        if(!response.ok){
            throw new Error ("No se pudieron obtener los vehiculos: " + response.statusText)
        }    

        const resultado = await response.json;
        return resultado.data;
    } 
    catch (error) {
        console.error("Error al obtener los vehículos: " + error);
        throw error;
    }
}