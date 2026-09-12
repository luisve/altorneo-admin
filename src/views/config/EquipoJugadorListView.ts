export interface EquipoJugadorListView {
	Id: number | null
	, IdEquipo: number
	, Nombre: string
	, Apellido: string
	, Email: string
	, Telefono: string
	, Celular: string
	, DNI: number
	, Peso: number
	, Altura: number
	, Puesto: string
	, Numero: number
	, FechaNacimiento: Date
	, Imagen: string
};


export const DefaultEquipoJugadorListView = (): EquipoJugadorListView => ({
	Id: null
	, IdEquipo: 0
	, Nombre: ""
	, Apellido: ""
	, Email: ""
	, Telefono: ""
	, Celular: ""
	, DNI: 0
	, Peso: 0
	, Altura: 0
	, Puesto: ""
	, Numero: 0
	, FechaNacimiento: new Date()
	, Imagen: ''
});
