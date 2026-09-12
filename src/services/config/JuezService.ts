import { JuezType } from '../../types/config/JuezType';
import { apiGET, apiPOSTForm } from '../../utils/httpClient';
import { ApiResponseArray } from '../../types/ApiResponseType';


// Obtener lista de jueces
export const getJuecesListService = async (): Promise<JuezType[]> => {
	return await apiGET<JuezType[]>('Juez');
};


// Obtener juez
export const getJuezService = async (id:number | null): Promise<JuezType> => {
	return await apiGET<JuezType>('Juez?Id=' + id);
};


export const postJuezService = async (juez: JuezType): Promise<ApiResponseArray<[]>> => {
	return await apiPOSTForm<ApiResponseArray<[]>, JuezType>('/Juez', juez);
};

