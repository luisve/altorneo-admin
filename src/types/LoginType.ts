export type LoginType = {
	Mail?: string,
	Password?: string,
	MailReset?: string,
}


export const DefaultLoginType = (): LoginType => ({
	Mail: "",
	Password: "",
	MailReset: "",
});
