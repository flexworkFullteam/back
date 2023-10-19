const axios = require('axios');

const GOOGLE_MAPS_API_KEY = 'TU_CLAVE_DE_API'; // Reemplaza con tu propia clave de API

async function obtenerDireccion(latitud, longitud) {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitud},${longitud}&key=${GOOGLE_MAPS_API_KEY}`
    );

    if (response.data.status === 'OK') {
      const direccion = response.data.results[0].formatted_address;
      return direccion;
    } else {
      console.error('Error al obtener la dirección:', response.data.error_message);
      return null;
    }
  } catch (error) {
    console.error('Error en la solicitud a la API de Google Maps:', error);
    return null;
  }
}

module.exports = obtenerDireccion;