"use client";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteProduct } from "@/server/actions/products";
import { useTransition } from "react";
import { toast } from "sonner";

export function DeleteProductAlertDialogContent({ id }: { id: string }) {
  const [isDeletePending, startDeleteTransition] = useTransition();
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permenantly delete this
          product.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={() => {
            startDeleteTransition(async () => {
              const data = await deleteProduct(id);
              if (data?.message) {
                if (data.error) {
                  toast.error("An error occurred", {
                    description: data.message,
                    position: 'top-center',
                    richColors: true
                  });
                } else {
                  toast.success("Product deleted successfully!", {
                    description: data.message,
                    position: "top-center",
                    richColors: true,
                  });
                }
              }
            });
          }}
          disabled={isDeletePending}
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
