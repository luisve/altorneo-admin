

export interface TorneoEquipoPagoView {
	Id: number,
	FechaPago: string,
	Importe: number,
	Obs: string,

	LinkPDF: string,
	NComprobante: string,
	EquipoNombre: string,
	TorneoNombre: string,
	TorneoCosto: number,
	CampeonatoNombre: string,
	ImagenLogo: string,
}


export const DefaultTorneoEquipoPagoView : TorneoEquipoPagoView = {
	Id: 0,
	FechaPago: '',
	Importe: 0,
	Obs: "",

	LinkPDF: "",
	NComprobante: '',
	EquipoNombre: '',
	TorneoNombre: '',
	TorneoCosto: 0,
	CampeonatoNombre: '',
	ImagenLogo: '',
}