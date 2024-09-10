import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Search, X } from "lucide-react";
import { useNavigate } from "@remix-run/react";

interface Location {
  id: string;
  name: string;
}

const initialLocations: Location[] = [
  { id: "1", name: "Locations" },
  { id: "2", name: "Square" },
  { id: "3", name: "Test 2" },
  { id: "4", name: "Available at all future locations" },
];

export default function EditLocationsDialog() {
  const navigate = useNavigate();

  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [selectedLocations, setSelectedLocations] = useState<string[]>(
    initialLocations.map((loc) => loc.id)
  );
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLocations = locations.filter((location) =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCheckboxChange = (locationId: string) => {
    setSelectedLocations((prev) =>
      prev.includes(locationId)
        ? prev.filter((id) => id !== locationId)
        : [...prev, locationId]
    );
  };

  const onSaveClick = () => {};
  const onOpenChange = () => navigate(-1);

  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex justify-between items-center w-full">
            <DialogTitle className="text-xl font-bold">
              Edit locations
            </DialogTitle>
          </div>
        </DialogHeader>
        <div className="mt-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-8"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-4 space-y-4">
          {filteredLocations.map((location) => (
            <div key={location.id} className="flex items-center space-x-2">
              <Checkbox
                id={location.id}
                checked={selectedLocations.includes(location.id)}
                onCheckedChange={() => handleCheckboxChange(location.id)}
              />
              <Label htmlFor={location.id}>{location.name}</Label>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-6">
          <Button onClick={onSaveClick}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
