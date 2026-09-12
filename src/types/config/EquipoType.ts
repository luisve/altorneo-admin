export interface EquipoType {
	Id: number | null,
	IdImagenEscudo: number,
	IdImagenPerfil: number,
	Nombre: string,
	NombreCategoria: string,
	NombreImagen: string,
	NombreImagenEscudo: string,

	IdCategoria: number,
	Instagram: string,
	Observaciones: string,
	NombreImagenPerfil: string,
	Habilitado: number,
	ImagenPerfil: string,
	Saldo?: number,
};


export const DefaultEquipoType = (): EquipoType => ({
	Id: null,
	IdImagenEscudo: 0,
	IdImagenPerfil: 0,
	Nombre: "",
	NombreCategoria: "",
	NombreImagen: "",
	NombreImagenEscudo: "",

	IdCategoria: 0,
	Instagram: "",
	Observaciones: "",
	NombreImagenPerfil: "",
	Habilitado: -1,
	ImagenPerfil: "",
	Saldo: 0,
});
