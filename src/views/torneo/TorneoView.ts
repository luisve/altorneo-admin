

export type TorneoView = {
	Id?: number,
	Nombre: string,
	IdCategoria: number,
	FechaInicio: Date,
	Categoria: string,
	PuntosGanado: number,
	PuntosEmpatado: number,
	PuntosPerdido: number,
	Jugadores: number,
	Saldo: number,
}


export const DefaultTorneoView: TorneoView = {
	Id: -1,
	Nombre: "Nuevo Torneo",
	IdCategoria: 0,
	FechaInicio: new Date(),
	Categoria: "",
	PuntosGanado: 3,
	PuntosEmpatado: 1,
	PuntosPerdido: 0,
	Jugadores: 11,
	Saldo: 0,
}

