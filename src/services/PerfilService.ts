import { CampeonatoType } from '../types/CampeonatoType';
import { apiGET, apiPOSTForm } from '../utils/httpClient';
import { ApiResponseArray } from '../types/ApiResponseType';
import { CambioPasswordType } from '../types/CambioPasswordType';


export const postCambioPassword = async (form: CambioPasswordType): Promise<ApiResponseArray<[]>> => {
	return await apiPOSTForm<ApiResponseArray<[]>, CambioPasswordType>('Campeonato/CPassword', form);
};


export const postPerfilDatos = async (form: FormData): Promise<ApiResponseArray<[]>> => {
	return await apiPOSTForm<ApiResponseArray<[]>, FormData>('Campeonato/Set', form);
};


export const postPerfilLogo = async (form: FormData): Promise<ApiResponseArray<[]>> => {
	return await apiPOSTForm<ApiResponseArray<[]>, FormData>('Campeonato/SetLogo', form);
};


export const getDatos = async (): Promise<CampeonatoType> => {
	return await apiGET<CampeonatoType>('Campeonato/Get');
};

