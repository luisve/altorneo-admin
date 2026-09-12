export interface JuezType {
	Id: number | null,
	ApellidoYNombre: string,
	Celular: string;
	Domicilio: string;
	IdCampeonato: number;
	Mail: string;
	Observaciones: string;
	Telefono: string;
}


export const DefaultJuezType = (): JuezType => ({
	Id: null,
	ApellidoYNombre: "",
	Celular: "",
	Domicilio: "",
	IdCampeonato: 0,
	Mail: "",
	Observaciones: "",
	Telefono: "",
})