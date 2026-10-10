
/**
 * Convierte una fecha de formato 'YYYY-MM-DD HH:MM' a 'DD/MM/YYYY'.
 * @param dateString La cadena de fecha en formato 'YYYY-MM-DD HH:MM'.
 * @returns La cadena de fecha en formato 'DD/MM/YYYY'.
 */
export const toDayMonthYear = (dateString: string): string => {
	const [anio, mes, dia] = dateString.split('-');
	const fechaFormateada = `${dia}/${mes}/${anio}`;
	if (fechaFormateada) {
		return fechaFormateada;
	} else {
		return 's/d';
	}

};

/**
 * Convierte una fecha de formato 'YYYY-MM-DD HH:MM' a 'DD/MM/YYYY HH:MM'.
 * @param dateString La cadena de fecha en formato 'YYYY-MM-DD HH:MM'.
 * @returns La cadena de fecha en formato 'DD/MM/YYYY HH:MM'.
 */
export const toDayMonthYearTime = (dateString: string): string => {
	const date = new Date(dateString);
	const day = date.getDate().toString().padStart(2, '0');
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const year = date.getFullYear();
	const hours = date.getHours().toString().padStart(2, '0');
	const minutes = date.getMinutes().toString().padStart(2, '0');
	if (!isNaN(date.getTime())) {
		return `${day}/${month}/${year} ${hours}:${minutes}`;
	} else {
		return `S/D`;
	}
};

/**
 * Convierte una fecha de formato 'DD/MM/YYYY HH:MM' a 'YYYY-MM-DD'.
 * Esto es útil para los inputs de tipo 'date'.
 * @param dateString La cadena de fecha en formato 'DD/MM/YYYY HH:MM'.
 * @returns La cadena de fecha en formato 'YYYY-MM-DD'.
 */
export const toISO = (dateString: string): string => {
	const parts = dateString.split(' ')[0].split('/');
	return `${parts[2]}-${parts[1]}-${parts[0]}`;
};

/**
 * Convierte una fecha de formato 'DD/MM/YYYY HH:MM' a 'YYYY-MM-DDTHH:MM'.
 * Esto es útil para los inputs de tipo 'datetime-local'.
 * @param dateString La cadena de fecha en formato 'DD/MM/YYYY HH:MM'.
 * @returns La cadena de fecha en formato 'YYYY-MM-DDTHH:MM'.
 */
export const toISODateTime = (dateString: string): string => {
	const [datePart, timePart] = dateString.split(' ');
	const parts = datePart.split('/');
	return `${parts[2]}-${parts[1]}-${parts[0]}T${timePart}`;
};


export const toDateFormat = (stringFecha: string): Date => {
	const [year, month, day] = stringFecha.split('-').map(Number);
	const fechaObjeto = new Date(year, month - 1, day);
	return fechaObjeto;
}


// devuelve YYYY-MM-DD HH:MM:SS
export const toMySQLDate = (fecha: Date): string => {
	const fechaMysql =
		fecha.getFullYear() + '-' +
		String(fecha.getMonth() + 1).padStart(2, '0') + '-' +
		String(fecha.getDate()).padStart(2, '0') + ' ' +
		String(fecha.getHours()).padStart(2, '0') + ':' +
		String(fecha.getMinutes()).padStart(2, '0') + ':' +
		String(fecha.getSeconds()).padStart(2, '0');
	return fechaMysql;
}


// devuelve string para un input type='date'
export const getHoy = (): string => {
	const hoy = new Date();
	return new Date(
		hoy.getTime() - hoy.getTimezoneOffset() * 60000
	)
		.toISOString()
		.split("T")[0];
}


// Convierte YYYY-MM-DD a DD_MM_YYYY
export const toNombreArchivo = (dateString: string): string => {
	const [datePart] = dateString.split(' ');
	const parts = datePart.split('-');
	return `${parts[2]}_${parts[1]}_${parts[0]}`;
};
