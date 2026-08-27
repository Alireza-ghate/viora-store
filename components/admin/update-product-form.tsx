"use client";

import { updateProduct } from "@/lib/actions/product-actions";
import { updateProductSchema } from "@/lib/validators";
import { Product } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import slugify from "slugify";
import { toast } from "sonner";
import z from "zod";
import { Button } from "../ui/button";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

interface UpdateProductFormProps {
  product: Product;
  productId: string;
}

type FormInput = z.input<typeof updateProductSchema>;
type FormOutput = z.output<typeof updateProductSchema>;

function UpdateProductForm({ product, productId }: UpdateProductFormProps) {
  const router = useRouter();

  const form = useForm<FormInput, FormOutput>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: product,
  });

  async function onSubmit(data: FormOutput) {
    if (!productId) router.push("/admin/products");

    const res = await updateProduct({ ...data, id: productId });

    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }

    router.push("/admin/products");
  }
  return (
    <form method="POST" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-5 md:flex-row">
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Name</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Enter product name"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="slug"
          control={form.control}
          render={({ field, fieldState }) => (
            <div className="relative w-full">
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Slug</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter product slug"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
              <Button
                onClick={() => {
                  form.setValue(
                    "slug",
                    slugify(form.getValues("name"), { lower: true }),
                  );
                }}
                type="button"
                className="bg-gray-600 hover:bg-gray-700 mt-2 px-4 py-2 text-white"
              >
                Generate
              </Button>
            </div>
          )}
        />
      </div>
      <div className="flex flex-col gap-5 md:flex-row mt-5">
        <Controller
          name="category"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Category</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Enter product's category"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="brand"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Brand</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Enter product's brand"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
      <div className="flex flex-col gap-5 md:flex-row mt-5">
        {/* price */}
        <Controller
          name="price"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Price</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Enter product's price"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        {/* stock */}
        <Controller
          name="stock"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Stock</FieldLabel>
              <Input
                type="number"
                {...field}
                value={field.value ?? ""}
                onChange={(e) => {
                  field.onChange(
                    e.target.value === "" ? undefined : e.target.valueAsNumber,
                  );
                }}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Enter product's stock"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
      <div className="upload-field flex flex-col gap-5 md:flex-row">
        {/* images */}
      </div>
      <div className="upload-field">{/* isfeatured */}</div>
      <div className="mt-5">
        {/* description */}
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Description</FieldLabel>
              <Textarea
                {...field}
                className="resize-none"
                placeholder="Enter product's description"
                id={field.name}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <div className="mt-5">
        <Button
          size={"lg"}
          type="submit"
          disabled={form.formState.isSubmitting}
          className="button col-span-2 w-full"
        >
          {form.formState.isSubmitting ? "Submitting" : "Update Product"}
        </Button>
      </div>
    </form>
  );
}

export default UpdateProductForm;
