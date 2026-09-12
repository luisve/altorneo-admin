export type CuerpoTecnicoView = {
	Id: number,
	IdTecnico: number,
	IdEquipo: number,
	Nombre: string,
	Apellido: string,
	IdImagen: number,
	Activo: boolean,
	Imagen: string,
}


export const DefaultCuerpoTecnicoView = (): CuerpoTecnicoView => ({
	Id: 0,
	IdTecnico: 0,
	IdEquipo: 0,
	Nombre: "",
	Apellido: "",
	IdImagen: 0,
	Activo: true,
	Imagen: ""
});

