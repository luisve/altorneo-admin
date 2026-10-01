import { TorneoView } from '../../views/torneo/TorneoView';
import { apiGET, apiPOST } from '../../utils/httpClient';
import { ApiResponseArray } from '../../types/ApiResponseType';
import { TorneoType } from '../../types/torneo/TorneoType';


// Obtener lista de torneos
export const getTorneoListService = async (): Promise<TorneoView[]> => {
	return await apiGET<TorneoView[]>('Torneo/Creados');
};


// Obtener torneo
export const getTorneoService = async (id: number): Promise<TorneoType> => {
	return await apiGET<TorneoType>('Torneo?Id=' + id);
};


export const postTorneoAltaService = async (torneo: TorneoType): Promise<ApiResponseArray<[]>> => {
	 return await apiPOST<ApiResponseArray<[]>, TorneoType>('/torneo/set', torneo);
};
