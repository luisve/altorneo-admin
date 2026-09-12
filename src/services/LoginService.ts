import { ApiResponseArray } from '../types/ApiResponseType';
import { CambioPasswordType } from '../types/CambioPasswordType';
import { LoginType } from '../types/LoginType';
import { apiGET } from '../utils/httpClient';
import { apiPOSTFront } from '../utils/httpClientFront';


// Post descontar tarjetas amarillas
export const postCambioPasswordService = async (jsonData: CambioPasswordType): Promise<ApiResponseArray<[]>> => {
	return await apiPOSTFront<ApiResponseArray<[]>, CambioPasswordType>('ChangePassword', jsonData);
};


// Post envío de reseteo de clave
export const PostResetpasswordService = async (login: LoginType): Promise<ApiResponseArray<[]>> => {
	return await apiPOSTFront<ApiResponseArray<[]>, LoginType>('/ResetPwd', login);
};


export const LoginService = async (login: LoginType): Promise<ApiResponseArray<[]>> => {
	return await apiPOSTFront<ApiResponseArray<[]>, LoginType>('/Login', login);
};


export const LogoutService = async (): Promise<ApiResponseArray<[]>> => {
	return await apiGET<ApiResponseArray<[]>>('Campeonato/Logout');
};

