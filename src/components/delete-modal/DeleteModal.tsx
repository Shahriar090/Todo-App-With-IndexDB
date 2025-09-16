import type { DeleteModalProps } from '@/types/types';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '../ui/alert-dialog';

const DeleteModal = ({ open, onClose, onConfirm, itemName }: DeleteModalProps) => {
	return (
		<AlertDialog open={open} onOpenChange={onClose}>
			<AlertDialogContent className='bg-zinc-900 border-zinc-700 text-zinc-200 w-full max-w-xl'>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you sure you want to delete this todo?</AlertDialogTitle>
					<AlertDialogDescription>
						You cannot undone this action once deleted.!
						{itemName && (
							<>
								It will permanently delete
								<span className='font-semibold'>{itemName}</span>
							</>
						)}
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<AlertDialogCancel className='text-black'>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={onConfirm}>Yes, Delete</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default DeleteModal;
