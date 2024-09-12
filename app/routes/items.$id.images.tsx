import { Suspense, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import {
  Await,
  defer,
  useLoaderData,
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "@remix-run/react";
import { twMerge } from "tailwind-merge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoaderFunction } from "@remix-run/node";
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

export const clientLoader: LoaderFunction = async ({ params }) => {
  const response = await fetch(`https://dummyjson.com/products/${params.id}`);
  const product = await response.json();
  const newImages = Array.from({ length: 20 }, (_key, index) => {
    return `https://dummyjson.com/icon/abc${index}/500`;
  });
  const images = [...product.images, ...newImages];

  return defer({
    images: new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          images.map((image) => ({
            id: window.crypto.getRandomValues(new Uint32Array(1))[0].toString(),
            url: image,
            name: Math.random().toString(36).substr(2, 5),
          }))
        );
      }, 1000);
    }),
  });
};

interface Data {
  images: Image[];
}

export default function EditSheetImages() {
  const navigate = useNavigate();
  const { images } = useLoaderData<Data>();

  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const sortOrder = searchParams.get("sortOrder") || "newest";

  const { selectedImages, setSelectedImages } = useOutletContext<{
    selectedImages: Image[];
    setSelectedImages: React.Dispatch<React.SetStateAction<Image[]>>;
  }>();
  const [selectedLocalImages, setLocalSelectedImages] =
    useState<Image[]>(selectedImages);

  const onToggleImageSelection = (selectedImage: Image) => {
    setLocalSelectedImages((prev) =>
      prev.includes(selectedImage)
        ? prev.filter((image) => image.id !== selectedImage.id)
        : [...prev, selectedImage]
    );
  };

  const onOpenChange = () => navigate("..");

  const onUnselectAllClick = () => setLocalSelectedImages([]);
  const onUpdateImages = () => {
    setSelectedImages(selectedLocalImages);
    navigate("..");
  };

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams({ search: e.currentTarget.value }, { replace: true });
  };

  const onSortOrderToggle = () => {
    setSearchParams(
      (prev) => {
        const sortOrder = prev.get("sortOrder") || "newest";
        prev.set("sortOrder", sortOrder === "newest" ? "oldest" : "newest");
        return prev;
      },
      { replace: true }
    );
  };

  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Image library
          </DialogTitle>
        </DialogHeader>
        <p className="text-gray-500">Select images to add to this item.</p>

        <div className="flex items-center space-x-4 mt-4">
          <div className="relative flex items-center">
            <Search className="absolute  left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4" />
            <Input
              name="search"
              className="pl-8 w-64"
              placeholder="Filter products..."
              defaultValue={searchQuery}
              onChange={onSearchChange}
            />
          </div>
          <Select value={sortOrder} onValueChange={onSortOrderToggle}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-8 gap-4 mt-4">
          <Suspense
            fallback={
              <>
                <Skeleton className="h-12 w-full rounded-lg" />{" "}
                <Skeleton className="h-12 w-full rounded-lg" />{" "}
                <Skeleton className="h-12 w-full rounded-lg" />{" "}
                <Skeleton className="h-12 w-full rounded-lg" />{" "}
                <Skeleton className="h-12 w-full rounded-lg" />{" "}
                <Skeleton className="h-12 w-full rounded-lg" />{" "}
                <Skeleton className="h-12 w-full rounded-lg" />{" "}
                <Skeleton className="h-12 w-full rounded-lg" />{" "}
              </>
            }
          >
            <Await resolve={images}>
              {(images) =>
                images.map((image) => (
                  <div
                    key={image.id}
                    className={twMerge(
                      "relative cursor-pointer rounded-lg overflow-hidden",
                      selectedLocalImages.includes(image) &&
                        "ring-2 ring-blue-500"
                    )}
                    onClick={() => onToggleImageSelection(image)}
                  >
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-fullobject-cover"
                    />
                    <div className="p-2 bg-white">
                      <p className="text-sm font-medium truncate">
                        {image.name}
                      </p>
                    </div>
                  </div>
                ))
              }
            </Await>
          </Suspense>
        </div>

        <DialogFooter>
          <div>
            <span className="font-semibold">
              {selectedLocalImages.length} selected
            </span>
            <Button variant="link" onClick={onUnselectAllClick}>
              Unselect all
            </Button>
          </div>
          <Button onClick={onUpdateImages}>Update images</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
