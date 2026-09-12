import { apiGET, apiPOST } from '../../utils/httpClient';
import { ApiResponseArray } from '../../types/ApiResponseType';
import { TorneoEquipoPagoType } from '../../types/torneo/TorneoEquipoPagoType';
import { TorneoEquipoPagoView } from '../../views/torneo/TorneoEquipoPagoView';
import { SelectType } from '../../types/SelectType';


// POST nuevo pago
export const postTorneoEquipoPagoService = async (jsonData: TorneoEquipoPagoType): Promise<ApiResponseArray<[]>> => {
	return await apiPOST<ApiResponseArray<[]>, TorneoEquipoPagoType>('TorneoEquiposPagos/SetPago', jsonData);
};


// Obtener lista de torneos
export const getTorneoEquipoPagosService = async (idTorneo: number, idEquipo: number): Promise<TorneoEquipoPagoView[]> => {
	return await apiGET<TorneoEquipoPagoView[]>('TorneoEquiposPagos/GetList?IdTorneo=' + idTorneo + '&IdEquipo=' + idEquipo);
};


// Obtener lista de torneos Pagos
export const getTorneoPagosListService = async (): Promise<SelectType[]> => {
	return await apiGET<SelectType[]>('Select/Torneo/Pago');
};

