import type { UserType } from '../model-types/userType';

export type AuthResponseType = {
	token: string;
	user: UserType;
};
