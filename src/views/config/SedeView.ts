export type SedeView = {
	Id: number,
	Nombre: string,
	Domicilio: string,
	IdImagenPerfil: number,
	NombreImagen: string,
	Imagen: string,
	Telefono: string,
	IdCiudad: number,
	Obs: string,
	NombreImagenPerfil: string,
	IdPais: number,
	SrcImagenPefil: string
}


export const DefaultSedeView = (): SedeView => ({
	Id: -1,
	Nombre: "",
	Domicilio: "",
	IdImagenPerfil: 0,
	NombreImagen: "",
	Imagen: "",
	Telefono: "",
	IdCiudad: 0,
	Obs: "",
	NombreImagenPerfil: "",
	IdPais: 0,
	SrcImagenPefil: ""
});
