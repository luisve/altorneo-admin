

export type EquipoJugadorType = {
	Id: number | null
	, IdEquipo: number
	, IdParticipante: number
	, IdImagen?: number
	, Activo?: boolean
	, Imagen?: string
	, Puesto: string
	, Numero: number
};


export const DefaultEquipoJugadorType: EquipoJugadorType = {
	Id: null
	, IdEquipo: 0
	, IdParticipante: 0
	, IdImagen: 0
	, Activo: true
	, Imagen: ''
	, Puesto: ''
	, Numero: 0
};
