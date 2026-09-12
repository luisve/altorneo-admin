

export type PartidoPrintView = {
	Id: number | null
	, Fecha: string
	, Partido: number
	, Zona?: string
	, EquipoLocal?: string
	, EquipoVisitante?: string
	, LinkPDF?: string
	, Sede?: string
	, IdLocal?: number
	, IdVisitante?: number
	,
}


export const DefaultPartidoPrintView: PartidoPrintView = {
	Id: null
	, Fecha: ""
	, Partido: 0
	, Zona: ""
	, EquipoLocal: ""
	, EquipoVisitante: ""
	, LinkPDF: ""
	, Sede: ""
	, IdLocal: 0
	, IdVisitante: 0
	,
}

