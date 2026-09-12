
export type FechaZonaItem = {
	IdFecha: number;
	Zona: string;
}

export type FechaView = {
	FechaNumero: number | null,
	IdEquipoLibre?: number,
	Zona?: string,
	Partido: number | null,
	IdLocal?: number,
	IdVisitante?: number,
	Local: string,
	Visitante: string,
	Libre: string,
	ImagenLocal: string,
	ImagenVisitante: string,
	FechaZona?: FechaZonaItem[];
}


export const DefaultFechaView: FechaView = {
	FechaNumero: 0,
	IdEquipoLibre: 0,
	Zona: "",
	Partido: 0,
	IdLocal: 0,
	IdVisitante: 0,
	Local: "",
	Visitante: "",
	Libre: "",
	ImagenLocal: "",
	ImagenVisitante: "",
	FechaZona: [],
}
