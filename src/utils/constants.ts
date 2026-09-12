

export const API: string = import.meta.env.VITE_API_URL;
export const URLROOT: string | undefined = import.meta.env.VITE_ROOT_URL;

export const APIAdmin: string = API + 'Admin/';
export const URL_IMAGES: string = URLROOT + 'admin/images/';
export const URL_UPLOAD: string = import.meta.env.VITE_UPLOAD_URL;


export const URL_IMAGEN_TECNICO: string = URL_UPLOAD + 'tecnico/';
export const URL_IMAGEN_JUGADOR: string = URL_UPLOAD + 'jugador/';
/**
 * Las de abajo hay que eliminarlas
 */
// export const urlUserAPI: string = 'https://altorneo.com/api/User/api/';
// export const urlUserAuth: string = 'https://altorneo.com/api/auth/api/';
// export const urlUser: string = 'https://altorneo.com/api/User/';

// export const HEADER_GET: any = { 'method': 'GET', 'credentials': 'include', 'withCredentials': true };
// export const HEADER_POST: any =  { 'method': 'POST', 'body': null, 'credentials': 'include', 'withCredentials': true};
// export const HEADER_GET =  {'withCredentials': true };
// export const HEADER_POST =  {'method': 'POST', 'body': null, 'withCredentials': true};