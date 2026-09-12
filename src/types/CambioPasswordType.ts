export type CambioPasswordType = {
	PasswordActual: string,
	PasswordNueva: string,
	PasswordNueva2: string,
	TokenResetPwd?: string,

}


export const DefaultCambioPasswordType = (): CambioPasswordType => ({
	PasswordActual: "",
	PasswordNueva: "",
	PasswordNueva2: "",
	TokenResetPwd: "",
});
