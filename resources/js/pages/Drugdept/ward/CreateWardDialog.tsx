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
import { Plus } from 'lucide-react';

const CreateWardDialog = () => {
  const [open, setOpen] = React.useState(false);

  const closeModal = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Ward
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Ward</DialogTitle>
          <DialogDescription>
            Add a new ward to the hospital management system.
          </DialogDescription>
        </DialogHeader>
        <WardForm closeModal={closeModal} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateWardDialog;

