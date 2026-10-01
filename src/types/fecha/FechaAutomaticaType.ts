
export type FechaAutomaticaItem = {
	IdSede: number;
	Nombre: string;
	Activa: boolean;
	Desde: string;
	Hasta: string;
}

export type FechaAutomaticaType = {
	IdTorneo: number | null
	, Dia: string
	, DuracionPartido: number
	, Sedes: FechaAutomaticaItem[]
}


export const DefaultFechaAutomaticaType: FechaAutomaticaType = {
	IdTorneo: 0
	, Dia: ''
	, DuracionPartido: 100
	, Sedes: []
}
