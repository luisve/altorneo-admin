export type ApiResponseArray<T> = {
	data?: T[];
	code?: number;
	msg?: string;
};

export type ApiResponseObject<T> = {
  data?: T;
  code?: number;
  msg?: string;
};