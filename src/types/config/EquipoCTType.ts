

export type EquipoCTType = {
	Id: number | null
	, IdEquipo: number
	, IdParticipante: number
	, IdImagen?: number
	, Activo?: boolean
	, Imagen?: string
};


export const DefaultEquipoCTType: EquipoCTType = {
	Id: null
	, IdEquipo: 0
	, IdParticipante: 0
	, IdImagen: 0
	, Activo: true
	, Imagen: ''
};
