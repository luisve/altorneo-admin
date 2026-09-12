import { apiGET, apiPOST } from '../../utils/httpClient';
import { ApiResponseArray } from '../../types/ApiResponseType';
//import { EquipoType } from '../../types/config/equipoType';
import { EquipoView } from '../../views/config/EquipoView';


// Obtener lista de torneos
export const getEquiposXTorneoService = async ( idTorneo: number): Promise<EquipoView[]> => {
	return await apiGET<EquipoView[]>('TorneoEquipos/GetEquipos?IdTorneo=' + idTorneo);
};


// Obtener lista de torneos
export const getRecargarEquiposService = async (jsonData: Record<string,any>): Promise<ApiResponseArray<[]>> => {
	return await apiPOST<ApiResponseArray<[]>, Record<string,any>>('TorneoEquipos/GetEquipos?IdTorneo=',jsonData);
};


export const postTorneoEquipoCheckService = async (jsonData: Record<string,any>): Promise<ApiResponseArray<[]>> => {
	 return await apiPOST<ApiResponseArray<[]>, Record<string,any>>('TorneoEquipos/Check', jsonData);
};

export const postTorneoRecargarEquipoService = async (jsonData: Record<string,any>): Promise<ApiResponseArray<[]>> => {
	 return await apiPOST<ApiResponseArray<[]>, Record<string,any>>('Torneo/Recargar', jsonData);
};
