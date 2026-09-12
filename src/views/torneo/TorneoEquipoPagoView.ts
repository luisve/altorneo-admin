

export interface TorneoEquipoPagoView {
	Id: number,
	FechaPago: string,
	Importe: number,
	Obs: string,

	LinkPDF: string,
}


export const DefaultTorneoEquipoPagoView = (): TorneoEquipoPagoView => ({
	Id: 0,
	FechaPago: '',
	Importe: 0,
	Obs: "",

	LinkPDF: "",
})