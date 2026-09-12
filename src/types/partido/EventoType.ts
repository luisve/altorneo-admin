export type EventoType = {
	IdPartido: number,
	Tiempo: number,
	Minuto: number,
	Evento: string,
	IdJugador: number,
	NombreJugador: string,
	IdEquipo: number,
	IdJugadorIngreso: number,
	NombreJugadorIngreso: string,
}


export const DefaultEventoType: EventoType = {
	IdPartido: 0,
	Tiempo: 0,
	Minuto: 0,
	Evento: "",
	IdJugador: 0,
	NombreJugador: "",
	IdEquipo: 0,
	IdJugadorIngreso: 0,
	NombreJugadorIngreso: "",
}


export type postEventoType = {
	IdPartido: number;
	Eventos: EventoType[];
}