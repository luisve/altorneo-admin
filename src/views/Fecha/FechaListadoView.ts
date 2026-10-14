

export type FechaListadoView = {
	Hora: string
	, Sede: string
	, Categoria: string
	, Local: string
	, Visitante: string
	, [key: string]: string | number | boolean | Date | null | undefined;
}


export const DefaultFechaListadoView: FechaListadoView = {
	Hora: ''
	, Sede: ''
	, Categoria: ''
	, Local: ''
	, Visitante: ''
}
