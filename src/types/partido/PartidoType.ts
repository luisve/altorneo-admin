

export type PartidoType = {
	Id?: number,
	Partido: number,
	Zona: string,
	Fecha: Date,
	IdLocal: number,
	IdVisitante: number,
	IdJuez?: number,
	IdJuezL1?: number,
	IdJuezL2?: number,
	IdSede?: number,
	Observaciones?: string,

	checkFecha?: boolean,
	checkJuez?: boolean,
	checkJuezL1?: boolean,
	checkJuezL2?: boolean,
	checkSede?: boolean,
}


export const DefaultPartidoType: PartidoType = {
	Id: 0,
	Partido: 0,
	Zona: "",
	Fecha: new Date(),
	IdLocal: 0,
	IdVisitante: 0,
	IdJuez: 0,
	IdJuezL1: 0,
	IdJuezL2: 0,
	IdSede: 0,
	Observaciones: "",

	checkFecha: false,
	checkJuez: false,
	checkJuezL1: false,
	checkJuezL2: false,
	checkSede: false,
}

