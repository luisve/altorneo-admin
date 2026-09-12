export type SancionType = {
	IdJugador: number,
	IdEquipo: number,
	A: number,
	AAcumuladas: number,
	R: number,
	EquipoNombre: string,
	JugadorNombre: string,
	RAcumuladas: number,
}


export const DefaultSancionType: SancionType = {
	IdJugador: 0,
	IdEquipo: 0,
	A: 0,
	AAcumuladas: 0,
	R: 0,
	EquipoNombre: "",
	JugadorNombre: "",
	RAcumuladas: 0,
}

