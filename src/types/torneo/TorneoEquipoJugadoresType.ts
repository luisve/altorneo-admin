export interface TorneoEquipoJugadorType {
	Nombre: string
	, Apellido: string
	, IdEquipo: number
	, IdJugador: number
	, Habilitado: boolean
	/*
	IdEquipo: number,
	Nombre: string,
	Apellido: string,
	Email: string,
	Telefono: string,
	Celular: string,
	DNI: number,
	Peso: number,
	Altura: number,
	Puesto: string,
	Numero: number,
	FechaNacimiento: Date,
	IdImagen: number,
	Habilitado: number,

	IdJugador: number,
	NombreJugador: string,
	PuestoJugador: string,
	Imagen: string,
	G: string,
	A: string,
	R: string,
	*/
};


export const DefaultTorneoEquipoJugadorType = (): TorneoEquipoJugadorType => ({
	Nombre: ''
	, Apellido: ''
	, IdEquipo: 0
	, IdJugador: 0
	, Habilitado: true
	/*
	IdEquipo: 0,
	Nombre: "",
	Apellido: "",
	Email: "",
	Telefono: "",
	Celular: "",
	DNI: 0,
	Peso: 0,
	Altura: 0,
	Puesto: "",
	Numero: 0,
	FechaNacimiento: new Date(),
	IdImagen: 0,
	Habilitado: 0,

	IdJugador: 0,
	NombreJugador: "",
	PuestoJugador: "",
	Imagen: "",
	G: "",
	A: "",
	R: "",
	*/
});
