"use client";

import { productDefaultValue } from "@/lib/constants";
import { insertProductSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import slugify from "slugify";
import { Textarea } from "../ui/textarea";
import { createProduct } from "@/lib/actions/product-actions";
import { toast } from "sonner";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { UploadButton } from "@/lib/uploadthing";
import { Checkbox } from "../ui/checkbox";

type FormInput = z.input<typeof insertProductSchema>;
type FormOutput = z.output<typeof insertProductSchema>;

function CreateProductForm() {
  const router = useRouter();

  const form = useForm<FormInput, FormOutput>({
    resolver: zodResolver(insertProductSchema),
    defaultValues: productDefaultValue, // by default all fileds are empty
  });

  async function onSubmit(data: FormOutput) {
    // console.log(data);
    const res = await createProduct(data);

    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }

    router.push("/admin/products");
  }

  // eslint-disable-next-line react-hooks/incompatible-library
  const images = form.watch("images");
  const isFeatured = form.watch("isFeatured");
  const banner = form.watch("banner");

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
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
      <div className="upload-field flex flex-col gap-5 mt-5 md:flex-row">
        {/* images */}
        <Controller
          name="images"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Images</FieldLabel>
              <Card>
                <CardContent className="space-y-2 mt-2 min-h-48">
                  <div className="flex-start space-x-2">
                    {images.map((image) => (
                      <Image
                        width={100}
                        height={100}
                        key={image}
                        src={image}
                        alt="product image"
                        className="w-20 h-20 object-center object-cover rounded-sm"
                      />
                    ))}
                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={(res: { url: string }[]) => {
                        form.setValue("images", [...images, res[0].url]);
                      }}
                      onUploadError={(error: Error) => {
                        toast.error(`ERROR!, ${error.message}`);
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
      <div className="upload-field mt-5">
        {/* isfeatured */}
        <Controller
          name="isFeatured"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Featured Product</FieldLabel>
              <Card>
                <CardContent className="space-y-2 mt-2">
                  <div className="flex gap-4">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <FieldLabel htmlFor={field.name}>
                      isFeatured?
                    </FieldLabel>{" "}
                  </div>

                  {isFeatured && banner && (
                    <Image
                      src={banner}
                      alt="banner image"
                      className="w-full object-cover object-center rounded-sm"
                      width={1920}
                      height={680}
                    />
                  )}
                  {/* check if isFeatured is true and banner is false, then render upload banner */}

                  {isFeatured && !banner && (
                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={(res: { url: string }[]) => {
                        form.setValue("banner", res[0].url);
                      }}
                      onUploadError={(error: Error) => {
                        toast.error(`ERROR!, ${error.message}`);
                      }}
                    />
                  )}
                </CardContent>
              </Card>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
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
          {form.formState.isSubmitting ? "Submitting" : "Create Product"}
        </Button>
      </div>
    </form>
  );
}

export default CreateProductForm;
