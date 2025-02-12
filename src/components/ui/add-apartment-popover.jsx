"use client"

import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function AddApartmentPopover({ onAddApartment }) {
  const [propertyName, setPropertyName] = useState("")
  const [floorPlanType, setFloorPlanType] = useState("")
  const [floorPlanName, setFloorPlanName] = useState("")
  const [specialRequest, setSpecialRequest] = useState("")
  const [open, setOpen] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent double submit
    setIsSubmitting(true); // Disable button while submitting

    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("User ID is missing!");
      setIsSubmitting(false);
      return;
    }

    const apartmentData = {
      apartment_name: propertyName,
      unit_type: floorPlanType,
      floorplan: floorPlanName,
      special_request: specialRequest,
      users: [userId],
    };

    try {
      const response = await fetch("http://localhost:5000/api/apartments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apartmentData),
      });

      if (!response.ok) {
        throw new Error("Failed to add apartment");
      }

      const newApartment = await response.json();

      onAddApartment(newApartment); // Update UI
      setPropertyName("");
      setFloorPlanType("");
      setFloorPlanName("");
      setSpecialRequest("");
      setOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false); // Re-enable button
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button>Add Apartment</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="propertyName">Property Name</Label>
            <Input id="propertyName" value={propertyName} onChange={(e) => setPropertyName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="floorPlanType">Floor Plan Type</Label>
            <Input
              id="floorPlanType"
              value={floorPlanType}
              onChange={(e) => setFloorPlanType(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="floorPlanName">Floor Plan Name (Optional)</Label>
            <Input id="floorPlanName" value={floorPlanName} onChange={(e) => setFloorPlanName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialRequest">Special Request (Optional)</Label>
            <Textarea id="specialRequest" value={specialRequest} onChange={(e) => setSpecialRequest(e.target.value)} />
          </div>
          <Button type="submit" className="w-full">
            Add Apartment
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  )
}
