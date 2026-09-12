export type SedeType = {
	Id: number | null,
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


export const DefaultSedeType = (): SedeType => ({
	Id: null,
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
