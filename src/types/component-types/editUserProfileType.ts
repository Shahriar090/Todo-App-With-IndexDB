export type EditUserProfileType = {
	id?: string;
	firstName?: string;
	lastName?: string;
	username?: string;
	email?: string;
	password?: string;
	avatarUrl?: string;
	createdAt?: string;
	updatedAt?: string;
};

export type EditUserProfileModalProps = {
	user: EditUserProfileType;
	closeModal: () => void;
};
