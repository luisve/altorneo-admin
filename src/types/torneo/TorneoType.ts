

export type TorneoType = {
	Id: number | null
	, Nombre: string
	, IdCampeonato: number
	, IdCategoria: number
	, FechaInicio: Date
	, PuntosGanado: number
	, PuntosEmpatado: number
	, PuntosPerdido: number
	, Jugadores: number
	, Costo: number
	, Pago: number
}


export const DefaultTorneoType = (): TorneoType => ({
	Id: null
	, Nombre: ''
	, IdCampeonato: 0
	, IdCategoria: 0
	, FechaInicio: new Date()
	, PuntosGanado: 3
	, PuntosEmpatado: 1
	, PuntosPerdido: 0
	, Jugadores: 11
	, Costo: 0
	, Pago: 1
})
