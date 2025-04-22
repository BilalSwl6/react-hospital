import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import WardForm from './WardForm';
import { Pencil } from 'lucide-react';

const EditWardDialog = ({ ward }) => {
  const [open, setOpen] = React.useState(false);

  const closeModal = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="mr-1 h-3 w-3" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Ward</DialogTitle>
          <DialogDescription>
            Update the ward information.
          </DialogDescription>
        </DialogHeader>
        <WardForm ward={ward} closeModal={closeModal} isEditing={true} />
      </DialogContent>
    </Dialog>
  );
};

export default EditWardDialog;
