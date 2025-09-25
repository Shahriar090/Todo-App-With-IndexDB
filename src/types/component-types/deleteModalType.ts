export type DeleteModalProps = {
	open: boolean;
	onClose: () => void;
	onConfirm: () => void;
	itemName: string;
};
