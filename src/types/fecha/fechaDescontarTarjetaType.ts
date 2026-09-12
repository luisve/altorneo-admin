export type FechaDescontarTarjetaType = {
	IdJugador: number, 
	IdTorneo: number, 
	ARestadas?: number,
	RRestadas?: number,
}


export const DefaultFechaDescontarTarjetaType: FechaDescontarTarjetaType = {
	IdJugador: 0,
	IdTorneo: 0,
	ARestadas: 0,
	RRestadas: 0,
}

