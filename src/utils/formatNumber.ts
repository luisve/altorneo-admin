
/**
 * Convierte una fecha de formato 'YYYY-MM-DD HH:MM' a 'DD/MM/YYYY'.
 * @param dateString La cadena de fecha en formato 'YYYY-MM-DD HH:MM'.
 * @returns La cadena de fecha en formato 'DD/MM/YYYY'.
 */
export const currencyFormatter = new Intl.NumberFormat('es-AR', {
	style: 'currency',
	currency: 'ARS',
});
