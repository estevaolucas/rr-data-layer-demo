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

  return (
    <>
      <Dialog open={true} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[1200px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <Input id="name" value={data.product.title} />
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-grow">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <Textarea
                  id="description"
                  value={data.product.description}
                  className="h-32"
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
              <label
                htmlFor="locations"
                className="block text-sm font-medium text-gray-700"
              >
                Locations
              </label>
              <Select defaultValue="nyc">
                <SelectTrigger id="locations">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ncy">New York</SelectItem>
                  <SelectItem value="atl">Atlanta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <Button>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
      <Outlet
        context={{ product: data.product, selectedImages, setSelectedImages }}
      />
    </>
  );
}
