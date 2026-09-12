export type ParticipanteType = {
	Id: number | null
	, Nombre: string
	, Apellido: string
	, Email: string
	, Telefono: string
	, Celular: string
	, DNI: number
	, Peso: number
	, Altura: number
	, FechaNacimiento: string
	, Puesto: string
	, Numero: number
};

export const DefaultParticipanteType: ParticipanteType = {
	Id: null
	, Nombre: ''
	, Apellido: ''
	, Email: ''
	, Telefono: ''
	, Celular: ''
	, DNI: 0
	, Peso: 0
	, Altura: 0
	, FechaNacimiento: ''
	, Puesto: ''
	, Numero: 0
};
