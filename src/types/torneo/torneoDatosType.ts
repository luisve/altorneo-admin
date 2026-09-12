import { DefaultTorneoView, TorneoView } from "../../views/torneo/TorneoView"

export type TorneoDatosType = {
	cantidadEquipos: number;
	cantidadJugadores: number;
	fechas: number;
	torneo: TorneoView;
}


export const DefaultTorneoDatosType : TorneoDatosType = {
	cantidadEquipos: 0,
	cantidadJugadores: 0,
	fechas:0,
	torneo: DefaultTorneoView,
}