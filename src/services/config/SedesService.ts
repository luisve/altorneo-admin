//import { ClienteView } from '../../views/maestros/ClienteView';
//import { ApiResponseView } from '../../views/ApiResponseView';
import { SedeType } from '../../types/config/SedeType';
import { apiGET, apiPOSTForm } from '../../utils/httpClient';
import { ApiResponseArray } from '../../types/ApiResponseType';
//import { ClienteModel } from '../../models/maestros/ClienteModel';


// Obtener lista de sedes
export const getSedesListService = async (): Promise<SedeType[]> => {
	return await apiGET<SedeType[]>('Sede');
};


// Obtener sede
export const getSedeService = async (params:number | null): Promise<SedeType> => {
	return await apiGET<SedeType>('Sede?Id=' + params );
};


// Obtener un usuario
/*
export const getCliente = async (params:string | null): Promise<ClienteModel> => {
	return await apiGET<ClienteModel>('Clientes/Get' + params);
};
*/


export const postSedeService = async (sede: FormData): Promise<ApiResponseArray<[]>> => {
	return await apiPOSTForm<ApiResponseArray<[]>, FormData>('/Sede', sede);
};

