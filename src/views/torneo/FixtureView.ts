
export interface FechaView {
	IdTorneo: number,
	FechaNumero: number,
	IdEquipoLibre: number,
	Fase: string,
}


export interface FixturePartidosView {
	FechaNumero: number,
	IdTorneo: number,
	Partido: number,
	IdLocal: number,
	IdVisitante: number,
}


export interface FixtureManualView {
	idTorneo: number,
	tipo: string,
	fechas: FechaView[],
	fixture: FixturePartidosView[],
}

