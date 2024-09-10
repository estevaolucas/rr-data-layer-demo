import { Suspense, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";
import {
  Await,
  defer,
  Outlet,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import { LoaderFunction } from "@remix-run/node";
import { TextField } from "@/components/form/TextField";
import { FormProvider, useForm } from "react-hook-form";
import { SelectField } from "@/components/form/SelectField";
import { HiddenField } from "@/components/form/HiddenField";
import { Skeleton } from "@/components/ui/skeleton";

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
      name: product.title,
      description: product.description,
      location: "atl",
    },
    product: {
      ...product,
      images: images.map((image) => ({
        id: window.crypto.getRandomValues(new Uint32Array(1))[0].toString(),
        url: image,
        name: Math.random().toString(36).substr(2, 5),
      })),
    },
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

export default function EditSheet() {
  const { product, locations, defaultValues } = useLoaderData<Data>();

  const [selectedImages, setSelectedImages] = useState<Image[]>([]);

  const navigate = useNavigate();

  const methods = useForm({ defaultValues });
  const { handleSubmit } = methods;

  const navigateToImages = () => navigate("images", { relative: "path" });
  const onImageBrowseClick = () => navigateToImages();
  const onImageEditClick = () => navigateToImages();
  const onImageUploadClick = () => navigateToImages();

  const onOpenChange = () => navigate(-1);

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
              {/* Two-column grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column - Form Fields */}
                <div className="md:col-span-2 space-y-6">
                  {/* Item Type Field */}
                  <div>
                    <label
                      htmlFor="itemType"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Item type
                    </label>
                    <SelectField
                      id="itemType"
                      name="itemType"
                      options={[
                        { label: "Package", value: "package" },
                        { label: "Single Item", value: "single" },
                      ]}
                    />
                  </div>

                  {/* Name Field */}
                  <TextField
                    label="Name"
                    id="name"
                    name="name"
                    rules={{ required: "Name is required" }}
                  />

                  {/* Price Field */}
                  <TextField
                    label="Price"
                    id="price"
                    name="price"
                    rules={{ required: "Price is required" }}
                  />

                  {/* Description Field */}
                  <TextField
                    label="Description"
                    id="description"
                    name="description"
                    rules={{ required: "Description is required" }}
                  />

                  {/* Image Upload Section */}
                  <div className="border border-dashed border-gray-300 rounded-md p-4">
                    <div className="flex items-center space-x-2">
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        Drag and drop images here,
                      </span>
                      <Button variant="link" className="text-sm p-0">
                        upload,
                      </Button>
                      <span className="text-sm text-gray-500">or</span>
                      <Button variant="link" className="text-sm p-0">
                        add from image library
                      </Button>
                    </div>
                  </div>

                  {/* Taxes */}
                  <div className="text-sm text-gray-500">
                    Taxes: All 3 taxes
                  </div>
                </div>

                {/* Right Column - Information Section */}
                <div className="space-y-4">
                  {/* Where it’s sold */}
                  <div className="border rounded-md p-4">
                    <h3 className="text-lg font-medium text-gray-700">
                      Where it's sold
                    </h3>
                    <div className="flex justify-between mt-2">
                      <span>Locations</span>
                      <Button variant="link" className="text-sm p-0">
                        Edit
                      </Button>
                    </div>

                    {/* Render the SelectField with Suspense and Await */}
                    <Suspense
                      fallback={
                        <div className="space-y-4">
                          <Skeleton className="h-8 w-full" />
                        </div>
                      }
                    >
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

                    <div className="flex justify-between mt-4">
                      <span>POS tile</span>
                      <Button variant="link" className="text-sm p-0">
                        Edit
                      </Button>
                    </div>

                    <div className="flex justify-between mt-4">
                      <span>Kiosks</span>
                      <Button variant="link" className="text-sm p-0">
                        <input type="checkbox" />
                      </Button>
                    </div>

                    <div className="flex justify-between mt-4">
                      <span>Online channels</span>
                      <Button variant="link" className="text-sm p-0">
                        Edit
                      </Button>
                    </div>

                    <div className="flex justify-between mt-4">
                      <span>Site visibility</span>
                      <Button variant="link" className="text-sm p-0">
                        Visible
                      </Button>
                    </div>
                  </div>

                  {/* Payment links */}
                  <div className="flex justify-between mt-4">
                    <span>Payment links</span>
                    <Button variant="link" className="text-sm p-0">
                      <input type="checkbox" />
                    </Button>
                  </div>

                  {/* Menus */}
                  <div className="flex justify-between mt-4">
                    <span>Menus</span>
                    <Button variant="link" className="text-sm p-0">
                      Add to menus
                    </Button>
                  </div>
                </div>
              </div>

              <HiddenField name="images" value={selectedImages} />

              <div className="flex justify-end mt-6">
                <Button type="submit" className="bg-blue-500 text-white">
                  Save
                </Button>
              </div>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
      <Outlet context={{ product, selectedImages, setSelectedImages }} />
    </>
  );
}
