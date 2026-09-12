import axios, { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { APIAdmin } from '../utils/constants';


const redirectToLogin = () => {
	setTimeout(() => {
		window.location.href = '/login'; // Cambia '/login' por tu ruta de login
	}, 2000);
};


const apiClient = axios.create({
	baseURL: APIAdmin,
	headers: { 'Content-Type': 'application/json',},
});


const apiClientForm = axios.create({
	baseURL: APIAdmin,
	headers: { 'Content-Type': 'multipart/form-data'}
});


apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response) {
			if (error.response.status === 404) {
				redirectToLogin();
			}
			if (error.response.status === 401) {
				redirectToLogin();
			}
		} else {
			toast.error('Error de red o inesperado:', error.message || error);
			redirectToLogin();
		}
		return Promise.reject(error.response?.data || 'Error inesperado');
	}
);


export const apiGET = async <T>(url: string): Promise<T> => {
	const response: AxiosResponse<T> = await apiClient.get(url,{ withCredentials:true});
	return response.data;
};


export const apiPOST = async <T, U>(url: string, data: U): Promise<T> => {
	const response: AxiosResponse<T> = await apiClient.post(url, data, { withCredentials:true, headers: { 'Content-Type': 'application/json',}});
	return response.data;
};


export const apiPOSTForm = async <T, U>(url: string, data: U): Promise<T> => {
	const response: AxiosResponse<T> = await apiClientForm.post(url, data, { withCredentials:true});
	return response.data;
};

