

export interface TorneoEquipoPagoType {
	IdTorneo: number,
	IdEquipo: number,
	Importe: number,
	FechaPago: Date,
	NComprobante: number,
	Obs: string,
}


export const DefaultTorneoEquipoPagoType = (): TorneoEquipoPagoType => ({
	IdTorneo: 0,
	IdEquipo: 0,
	Importe: 0,
	FechaPago: new Date(),
	NComprobante: 0,
	Obs: "",
})