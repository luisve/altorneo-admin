export type EquipoView = {
	Id: number | null,
	Nombre: string,
	NombreCategoria: string,
	ImagenPerfil: string,
	ImagenEscudo: string,
	Saldo: number,
	Habilitado: number,
};


export const DefaultEquipoView = (): EquipoView => ({
	Id: null,
	Nombre: '',
	NombreCategoria: '',
	ImagenPerfil: '',
	ImagenEscudo: '',
	Saldo: 0,
	Habilitado: 0,
});
