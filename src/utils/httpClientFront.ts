import axios, { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { API } from '../utils/constants';



const redirectToLogin = () => {
	setTimeout(() => {
		window.location.href = '/'; // Cambia '/login' por tu ruta de login
	}, 2000);
};



const apiClient = axios.create({
	baseURL: API,
	headers: { 'Content-Type': 'application/json' },
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



export const apiGETFront = async <T>(url: string): Promise<T> => {
	const response: AxiosResponse<T> = await apiClient.get(url, {withCredentials: true});
	return response.data;
};



export const apiPOSTFront = async <T, U>(url: string, data: U): Promise<T> => {
	const response: AxiosResponse<T> = await apiClient.post(url, data, {withCredentials: true});
	return response.data;
};
