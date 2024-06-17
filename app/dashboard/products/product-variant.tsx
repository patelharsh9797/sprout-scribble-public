"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { VariantsWithImagesTags } from "@/lib/infer-type";
import { createVariant, deleteVariant } from "@/server/actions/variant-actions";
import { VariantSchema, type VariantSchemaType } from "@/types/zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { forwardRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { InputTags } from "./input-tags";
import VariantImages from "./variant-images";

type VariantProps = {
  children: React.ReactNode;
  editMode: boolean;
  productID?: number;
  variant?: VariantsWithImagesTags;
};

export const ProductVariant = forwardRef<HTMLDivElement, VariantProps>(
  ({ children, editMode, productID, variant }, ref) => {
    const form = useForm<VariantSchemaType>({
      resolver: zodResolver(VariantSchema),
      defaultValues: {
        tags: [],
        variantImages: [],
        color: "#000000",
        editMode,
        id: undefined,
        productID,
        productType: "Black Notebook",
      },
    });

    const [open, setOpen] = useState(false);
    const [toastId, setToastId] = useState<String | number>("");

    const setEdit = () => {
      if (!editMode) {
        form.reset();
        return;
      }
      if (editMode && variant) {
        form.setValue("editMode", true);
        form.setValue("id", variant.id);
        form.setValue("productID", variant.productID);
        form.setValue("productType", variant.productType);
        form.setValue("color", variant.color);
        form.setValue(
          "tags",
          variant.variantTags.map((tag) => tag.tag),
        );
        form.setValue(
          "variantImages",
          variant.variantImages.map((img) => ({
            name: img.name,
            size: img.size,
            url: img.url,
          })),
        );
      }
    };

    useEffect(() => {
      setEdit();
    }, [variant]);

    const { execute, status } = useAction(createVariant, {
      onExecute() {
        const toast_id = toast.loading(
          editMode ? "Updating Variant" : "Creating variant",
          { duration: 1 },
        );
        setToastId(toast_id.toString());
      },
      onSuccess(data) {
        if (data?.error) {
          toast.error(data.error);
        }
        if (data?.success) {
          toast.success(data.success);
          setOpen(false);
        }
      },
      onSettled() {
        toast.dismiss(toastId as string);
      },
    });

    const variantAction = useAction(deleteVariant, {
      onExecute() {
        const toast_id = toast.loading("Deleting variant", { duration: 1 });
        setToastId(toast_id.toString());
      },
      onSuccess(data) {
        if (data?.error) {
          toast.error(data.error);
        }
        if (data?.success) {
          toast.success(data.success);
          setOpen(false);
        }
      },
      onSettled() {
        toast.dismiss(toastId as string);
      },
    });

    function onSubmit(values: VariantSchemaType) {
      execute(values);
    }

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-scroll lg:max-w-screen-lg">
          <DialogHeader>
            <DialogTitle>
              {editMode ? "Edit" : "Create"} your variant
            </DialogTitle>
            <DialogDescription>
              Manage your product variants here. You can add tags, images, and
              more.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="productType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variant Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Pick a title for your variant"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variant Color</FormLabel>
                    <FormControl>
                      <Input type="color" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <InputTags
                        {...field}
                        onChange={(e) => field.onChange(e)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <VariantImages />
              <div className="flex items-center justify-center gap-4">
                {editMode && variant && (
                  <Button
                    variant={"destructive"}
                    type="button"
                    disabled={variantAction.status === "executing"}
                    onClick={(e) => {
                      e.preventDefault();
                      variantAction.execute({ id: variant.id });
                    }}
                  >
                    Delete Variant
                  </Button>
                )}
                <Button
                  disabled={
                    status === "executing" ||
                    !form.formState.isValid ||
                    !form.formState.isDirty
                  }
                  type="submit"
                >
                  {editMode ? "Update Variant" : "Create Variant"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  },
);

ProductVariant.displayName = "ProductVariant";
