export type CategoriaType = {
	Id: number | null,
	Nombre: string,
}



export const DefaultCategoriaType = (): CategoriaType => ({
	Id: null,
	Nombre: "",
})