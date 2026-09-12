export type CategoriaView = {
	Id: number,
	Nombre: string,
}



export const DefaultCategoriaView = (): CategoriaView => ({
	Id: -1,
	Nombre: "",
})