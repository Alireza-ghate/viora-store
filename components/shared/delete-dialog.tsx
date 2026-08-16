"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import Spinner from "./spinner";

interface DeleteDialogProps {
  id: string;
  action: (id: string) => Promise<{ success: boolean; message: string }>;
}

function DeleteDialog({ id, action }: DeleteDialogProps) {
  const [open, setOpen] = useState(false); //represent the dialog will open or not
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const res = await action(id);
      if (res.success) {
        toast.success(res.message);
        // close dialog
        setOpen(false);
      } else {
        toast.error(res.message);
      }
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <Dialog>
        <AlertDialogTrigger asChild>
          <Button
            size={"sm"}
            variant={"destructive"}
            className="hover:cursor-pointer"
          >
            Delete
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete order
              from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel size={"sm"} onClick={() => setOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <Button
              onClick={handleDelete}
              variant={"destructive"}
              size={"sm"}
              disabled={isPending}
            >
              Delete {isPending && <Spinner className="text-red-800" />}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </Dialog>
    </AlertDialog>
  );
}

export default DeleteDialog;
