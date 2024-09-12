import { Suspense, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ImageIcon,
  MoreHorizontal,
  Star,
  Building2,
  MonitorIcon,
  GlobeIcon,
  DollarSign,
} from "lucide-react";
import {
  Await,
  defer,
  Outlet,
  ShouldRevalidateFunction,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import { LoaderFunction } from "@remix-run/node";
import { TextField } from "@/components/form/TextField";
import { FormProvider, useForm } from "react-hook-form";
import { SelectField } from "@/components/form/SelectField";
import { HiddenField } from "@/components/form/HiddenField";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

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
  defaultValues: { name: string; description: string; location: string };
  locations: { label: string; value: string }[];
}

export const clientLoader: LoaderFunction = async ({ params }) => {
  const response = await fetch(`https://dummyjson.com/products/${params.id}`);
  const product = await response.json();
  const newImages = Array.from({ length: 20 }, (_key, index) => {
    return `https://dummyjson.com/icon/abc${index}/500`;
  });
  const images = [...product.images, ...newImages];

  return defer({
    defaultValues: {
      itemType: "product",
      name: product.title,
      description: product.description,
      location: "atl",
      price: 100,
    },
    product: new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ...product,
          images: images.map((image) => ({
            id: window.crypto.getRandomValues(new Uint32Array(1))[0].toString(),
            url: image,
            name: Math.random().toString(36).substr(2, 5),
          })),
        });
      }, 1000);
    }),
    locations: new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { label: "New York", value: "nyc" },
          { label: "Atlanta", value: "atl" },
        ]);
      }, 2000);
    }),
  });
};

export const shouldRevalidate: ShouldRevalidateFunction = ({ currentUrl }) => {
  return false;
};

export default function EditSheet() {
  const { product, locations, defaultValues } = useLoaderData<Data>();

  const [selectedImages, setSelectedImages] = useState<Image[]>([]);
  const navigate = useNavigate();
  const methods = useForm({ defaultValues });
  const { handleSubmit } = methods;

  const navigateToImages = () => navigate("images", { relative: "path" });
  const onImageBrowseClick = () => navigateToImages();
  const onImageUploadClick = () => navigateToImages();

  const onLocationsClick = () => navigate("locations", { relative: "path" });

  const onOpenChange = () => navigate("..");
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-8">
              {/* Two-column grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Suspense
                  fallback={
                    <div className="md:col-span-2 space-y-4">
                      <Skeleton className="h-12 w-full rounded-lg" />{" "}
                      <Skeleton className="h-12 w-full rounded-lg" />{" "}
                      <Skeleton className="h-12 w-full rounded-lg" />{" "}
                      <Skeleton className="h-12 w-full rounded-lg" />{" "}
                      <Skeleton className="h-12 w-full rounded-lg" />{" "}
                      <Skeleton className="h-36 w-full rounded-lg" />{" "}
                    </div>
                  }
                >
                  <Await resolve={product}>
                    {() => (
                      <div className="md:col-span-2 space-y-4">
                        {/* Item Type Field */}
                        <SelectField
                          name="itemType"
                          id="itemType"
                          label="Item Type"
                          options={[
                            { label: "Package", value: "package" },
                            { label: "Product", value: "product" },
                            { label: "Service", value: "service" },
                          ]}
                        />

                        {/* Name Field */}
                        <TextField
                          name="name"
                          id="name"
                          label="Name"
                          rules={{ required: "Name is required" }}
                        />

                        {/* Price Field */}
                        <TextField
                          name="price"
                          id="price"
                          label="Price"
                          placeholder="Enter price"
                          currency={true}
                          rules={{ required: "Price is required" }}
                        />

                        {/* Description Field */}
                        <TextField
                          label="Description"
                          id="description"
                          name="description"
                          placeholder="Description"
                        />

                        {/* Image Upload Section */}
                        <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center">
                          <div className="grid grid-cols-5 gap-10">
                            {selectedImages.map((image) => (
                              <div key={image.id} className="relative">
                                <img
                                  src={image.url}
                                  alt={image.name}
                                  className="w-full h-auto object-cover rounded-md"
                                />

                                <p className="mt-1 text-sm text-gray-500">
                                  {image.name}
                                </p>
                              </div>
                            ))}
                          </div>

                          <ImageIcon className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-500">
                            Drag and drop images here,{" "}
                            <Button
                              variant="link"
                              className="p-0"
                              onClick={onImageUploadClick}
                            >
                              upload
                            </Button>
                            , or{" "}
                            <Button
                              variant="link"
                              className="p-0"
                              onClick={onImageBrowseClick}
                            >
                              add from image library
                            </Button>
                          </p>
                        </div>
                      </div>
                    )}
                  </Await>
                </Suspense>

                {/* Right Column - Information Section */}
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2 flex justify-between items-center">
                      Where it's sold
                      <Button variant="link" className="text-blue-600">
                        Add
                      </Button>
                    </h3>
                    <div className="space-y-4">
                      {/* Locations */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Building2 className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="font-medium">Locations</p>
                            <p className="text-sm text-gray-500">
                              All 3 locations
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="link"
                          className="text-blue-600"
                          onClick={onLocationsClick}
                        >
                          Edit
                        </Button>
                      </div>

                      <Suspense fallback={<Skeleton className="h-8 w-full" />}>
                        <Await resolve={locations}>
                          {(
                            locationOptions: { label: string; value: string }[]
                          ) => (
                            <SelectField
                              label="Locations"
                              id="locations"
                              name="location"
                              options={locationOptions}
                            />
                          )}
                        </Await>
                      </Suspense>

                      <Button variant="link" className="text-blue-600 p-0">
                        Edit POS tile
                      </Button>

                      {/* Kiosks */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <MonitorIcon className="w-5 h-5 text-gray-500" />
                          <p className="font-medium">Kiosks</p>
                        </div>
                        <Switch />
                      </div>

                      {/* Online Channels */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <GlobeIcon className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="font-medium">Online channels</p>
                            <p className="text-sm text-gray-500">
                              All 5 channels
                            </p>
                          </div>
                        </div>
                        <Button variant="link" className="text-blue-600">
                          Edit
                        </Button>
                      </div>

                      {/* Site Visibility */}
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Site visibility</p>
                        <Select defaultValue="visible">
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Select visibility" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="visible">Visible</SelectItem>
                            <SelectItem value="hidden">Hidden</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Payment Links */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="font-medium">Payment links</p>
                            <p className="text-sm text-gray-500">
                              Collect payments with a link or buy button.{" "}
                              <Button
                                variant="link"
                                className="p-0 text-blue-600"
                              >
                                Learn more
                              </Button>
                            </p>
                          </div>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <HiddenField name="images" value={selectedImages} />

              <div className="flex justify-between mt-6">
                <Button type="submit" className="bg-blue-500 text-white">
                  Save
                </Button>
              </div>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>

      <Suspense>
        <Await resolve={product}>
          {(resolvedProduct) => (
            <Outlet
              context={{
                product: resolvedProduct,
                selectedImages,
                setSelectedImages,
              }}
            />
          )}
        </Await>
      </Suspense>
    </>
  );
}
