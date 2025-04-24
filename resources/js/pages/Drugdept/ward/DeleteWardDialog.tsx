import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';

const DeleteWardDialog = ({ ward }) => {
  const [open, setOpen] = React.useState(false);
  const { delete: destroy, processing } = useForm();

  const closeModal = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    destroy(route('wards.destroy', ward.id), {
      onSuccess: () => closeModal(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="mr-1 h-3 w-3" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Ward</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the ward "{ward.name}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex items-center justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={processing}>
            Delete Ward
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteWardDialog;
