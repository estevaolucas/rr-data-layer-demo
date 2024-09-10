import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import { useNavigate, useOutletContext } from "@remix-run/react";

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

export default function EditSheetImages() {
  const navigate = useNavigate();
  const { product, selectedImages, setSelectedImages } = useOutletContext<{
    product: Product;
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

  const onOpenChange = () => navigate(-1);
  const onUnselectAllClick = () => setLocalSelectedImages([]);
  const onUpdateImages = () => {
    setSelectedImages(selectedLocalImages);
    navigate(-1);
  };

  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Image library
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-5 gap-4">
          {product.images.map((image) => (
            <div key={image.id} className="relative">
              <img
                src={image.url}
                className="w-full h-auto object-cover rounded-md cursor-pointer"
                onClick={() => onToggleImageSelection(image)}
              />
              {selectedLocalImages.includes(image) && (
                <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                  <CheckIcon className="w-4 h-4 text-white" />
                </div>
              )}
              <p className="mt-1 text-sm text-gray-500">{image.name}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div>
            <span className="font-semibold">
              {selectedLocalImages.length} selected
            </span>
            <Button variant="link" onClick={onUnselectAllClick}>
              Unselect all
            </Button>
          </div>
          <Button onClick={onUpdateImages}>Update images</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
