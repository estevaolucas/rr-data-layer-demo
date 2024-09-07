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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckIcon, XIcon, ImageIcon } from "lucide-react";
import { useNavigate } from "@remix-run/react";

interface Image {
  id: string;
  src: string;
  name: string;
}

const images: Image[] = [
  {
    id: "1",
    src: "https://i.imgur.com/QkIa5tT.jpeg",
    name: "400 (1).png",
  },
  {
    id: "2",
    src: "https://i.imgur.com/ZKGofuB.jpeg",
    name: "400 (2).png",
  },
  {
    id: "3",
    src: "https://i.imgur.com/mp3rUty.jpeg",
    name: "400 (3).png",
  },
];

export default function EditSheet() {
  const navigate = useNavigate();

  const [isEditModalOpen, setIsEditModalOpen] = useState(true);
  const [isImageLibraryOpen, setIsImageLibraryOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemImage, setItemImage] = useState(
    "https://i.imgur.com/mp3rUty.jpeg"
  );

  const filteredImages = images.filter((image) =>
    image.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleImageSelection = (id: string) => {
    setSelectedImages((prev) =>
      prev.includes(id)
        ? prev.filter((imageId) => imageId !== id)
        : [...prev, id]
    );
  };

  const handleImageLibraryOpen = () => {
    setIsImageLibraryOpen(true);
  };

  const handleImageLibraryClose = () => {
    navigate(-1);
    console.log("--a");
    setIsImageLibraryOpen(false);
  };

  const handleImageUpdate = () => {
    if (selectedImages.length > 0) {
      const newImage = images.find((img) => img.id === selectedImages[0]);
      if (newImage) {
        setItemImage(newImage.src);
      }
    }
    handleImageLibraryClose();
  };

  const onOpenChange = (open: boolean) => {
    setIsEditModalOpen(open);

    if (!open) {
      handleImageLibraryClose();
    }
  };

  return (
    <>
      <Dialog open={isEditModalOpen} onOpenChange={onOpenChange}>
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
              <Input
                id="name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
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
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  className="h-32"
                />
              </div>
              <div className="w-1/6">
                <img
                  src={itemImage}
                  alt="Item"
                  className="w-full h-auto object-cover rounded-md"
                />
                <Button
                  variant="link"
                  className="mt-2"
                  onClick={handleImageLibraryOpen}
                >
                  Edit
                </Button>
              </div>
            </div>
            <div className="border border-dashed border-gray-300 rounded-md p-4">
              <div className="flex items-center justify-center space-x-2">
                <ImageIcon className="w-6 h-6 text-gray-400" />
                <span className="text-sm text-gray-500">
                  Drag and drop images here,
                </span>
                <Button
                  variant="link"
                  className="text-sm p-0"
                  onClick={handleImageLibraryOpen}
                >
                  upload,
                </Button>
                <span className="text-sm text-gray-500">or</span>
                <Button
                  variant="link"
                  className="text-sm p-0"
                  onClick={handleImageLibraryOpen}
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

      <Dialog open={isImageLibraryOpen} onOpenChange={setIsImageLibraryOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Image library
            </DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="library">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="item-images">Item images</TabsTrigger>
              <TabsTrigger value="library">Library</TabsTrigger>
            </TabsList>
            <TabsContent value="library" className="mt-4">
              <div className="flex justify-between mb-4">
                <Select defaultValue="alphabetical">
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alphabetical">
                      Sort by: Alphabetical A-Z
                    </SelectItem>
                    <SelectItem value="date">Sort by: Date</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  className="w-[300px]"
                  placeholder="Search images"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {filteredImages.map((image) => (
                  <div key={image.id} className="relative">
                    <img
                      src={image.src}
                      alt={image.name}
                      className="w-full h-auto object-cover rounded-md cursor-pointer"
                      onClick={() => toggleImageSelection(image.id)}
                    />
                    {selectedImages.includes(image.id) && (
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
                    {selectedImages.length} selected
                  </span>
                  <Button variant="link" onClick={() => setSelectedImages([])}>
                    Unselect all
                  </Button>
                </div>
                <Button onClick={handleImageUpdate}>Update images</Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
