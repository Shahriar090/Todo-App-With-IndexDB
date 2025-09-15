import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";

const DeleteModal = ({ open, onClose, onConfirm, itemName }) => {
	return <AlertDialog open={open} onOpenChange={onClose}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          Are you sure you want to delete this todo?
        </AlertDialogTitle>
        <AlertDialogDescription>
          You cannot undone this action once deleted.!
          {
            itemName && (
              <>
              It will permanently delete
              <span className="font-semibold">{itemName}</span>
              </>
            )
          }
        </AlertDialogDescription>
      </AlertDialogHeader>

      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={onConfirm}>
          Yes, Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>;
};

export default DeleteModal;
