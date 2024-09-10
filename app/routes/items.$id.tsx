"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";
import { json, Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/node";
import { TextField } from "@/components/form/TextField";
import { FormProvider, useForm } from "react-hook-form";
import { SelectField } from "@/components/form/SelectField";
import { HiddenField } from "@/components/form/HiddenField";

export const clientLoader: LoaderFunction = async ({ params }) => {
  const response = await fetch(`https://dummyjson.com/products/${params.id}`);

  const data = await response.json();
  const newImages = Array.from({ length: 20 }, (_key, index) => {
    return `https://dummyjson.com/icon/abc${index}/500`;
  });
  const images = [...data.images, ...newImages];

  return json({
    product: {
      ...data,
      images: images.map((image) => ({
        id: window.crypto.getRandomValues(new Uint32Array(1))[0].toString(),
        url: image,
        name: Math.random().toString(36).substr(2, 5),
      })),
    },
  });
};

interface Image {
  id: string;
  url: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  images: Image[];
  description: string;
  title: string;
  thumbnail: string;
}

interface Data {
  product: Product;
}

export default function EditSheet() {
  const data = useLoaderData<Data>();

  const [selectedImages, setSelectedImages] = useState<Image[]>([]);

  const navigate = useNavigate();

  const navigateToImages = () => navigate("images", { relative: "path" });
  const onImageBrowseClick = () => navigateToImages();
  const onImageEditClick = () => navigateToImages();
  const onImageUploadClick = () => navigateToImages();

  const onOpenChange = () => navigate(-1);

  const methods = useForm({
    defaultValues: {
      name: data.product.title,
      description: data.product.description,
      location: "nyc",
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = (values: any) => {
    console.log(values);
  };

  return (
    <>
      <Dialog open={true} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[1200px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit item</DialogTitle>
          </DialogHeader>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <TextField
                label="Name"
                id="name"
                name="name"
                rules={{ required: "Name is required" }}
              />

              <div className="flex items-start space-x-4">
                <div className="flex-grow">
                  <TextField
                    label="Description"
                    id="description"
                    name="description"
                    rules={{ required: "Description is required" }}
                  />
                </div>
                <div className="w-1/6">
                  <img
                    src={data.product.thumbnail}
                    alt="Item"
                    className="w-full h-auto object-cover rounded-md"
                  />
                  <Button
                    variant="link"
                    className="mt-2"
                    onClick={onImageEditClick}
                  >
                    Edit
                  </Button>
                </div>
              </div>
              <div className="border border-dashed border-gray-300 rounded-md p-4">
                <div className="grid grid-cols-10 gap-4">
                  {selectedImages.map((image) => (
                    <div key={image.id} className="relative">
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-auto object-cover rounded-md"
                      />

                      <p className="mt-1 text-sm text-gray-500">{image.name}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-center space-x-2">
                  <ImageIcon className="w-6 h-6 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    Drag and drop images here,
                  </span>
                  <Button
                    variant="link"
                    className="text-sm p-0"
                    onClick={onImageUploadClick}
                  >
                    upload,
                  </Button>
                  <span className="text-sm text-gray-500">or</span>
                  <Button
                    variant="link"
                    className="text-sm p-0"
                    onClick={onImageBrowseClick}
                  >
                    browse image library.
                  </Button>
                </div>
              </div>
              <div>
                <SelectField
                  label="Locations"
                  id="locations"
                  name="location"
                  options={[
                    { label: "New York", value: "nyc" },
                    { label: "Atlanta", value: "atl" },
                  ]}
                />
              </div>

              <HiddenField name="images" value={selectedImages} />

              <div className="flex justify-between mt-6">
                <Button>Save</Button>
              </div>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
      <Outlet
        context={{ product: data.product, selectedImages, setSelectedImages }}
      />
    </>
  );
}
