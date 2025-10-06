import type { TodoType } from '../model-types/todoType';

export type EditModalProps = {
	open: boolean;
	onClose: () => void;
	todo: TodoType | null;
	onConfirm: (updatedTodo: TodoType) => void;
};
