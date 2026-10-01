

export type FechaParticipanteType = {
	Id: number
	, IdEquipo: number
	, Hora: string
	, Apellido: string
	, Nombre: string
}


export const DefaultFechaParticipanteType: FechaParticipanteType = {
	Id: 0
	, IdEquipo: 0
	, Hora: ''
	, Apellido: ''
	, Nombre: ''
}
