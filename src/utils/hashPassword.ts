export const hashPassword = (password: string) => {
	return btoa(password.split('').reverse().join(''));
};
