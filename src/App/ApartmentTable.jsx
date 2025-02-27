import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Edit2, Save, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export function ApartmentTable({ apartments, onDelete, onUpdate }) {
  const { userId } = useAuth();
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleEdit = (apartment) => {
    setEditingId(apartment._id);
    setEditForm({
      apartment_name: apartment.apartment_name,
      unit_type: apartment.unit_type,
      floorplan: apartment.floorplan || "",
      special_request: apartment.special_request || "",
    });
  };

  const handleSave = async (id) => {
    if (!userId) {
      console.error("No userId found");
      return;
    }

    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/api/apartments/${id}`;
      
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editForm, users: [userId] }),
        credentials: "include" // Include cookies if you're using session-based auth
      });

      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error response:", errorData);
        throw new Error(`Failed to update apartment: ${errorData.error || response.statusText}`);
      }

      const updatedApartment = await response.json();

      const updatedApartments = apartments.map((apt) =>
        apt._id === id ? updatedApartment : apt
      );

      onUpdate(updatedApartments);
      setEditingId(null);
    } catch (error) {
      console.error("Error updating apartment:", error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Property Name</TableHead>
          <TableHead>Floor Plan Type</TableHead>
          <TableHead>Floor Plan Name</TableHead>
          <TableHead>Special Request</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {apartments.map((apartment) => (
          <TableRow key={apartment._id}>
            <TableCell>
              {editingId === apartment._id ? (
                <Input
                  value={editForm.apartment_name}
                  onChange={(e) => setEditForm({...editForm, apartment_name: e.target.value})}
                />
              ) : (
                apartment.apartment_name
              )}
            </TableCell>
            <TableCell>
              {editingId === apartment._id ? (
                <Input
                  value={editForm.unit_type}
                  onChange={(e) => setEditForm({...editForm, unit_type: e.target.value})}
                />
              ) : (
                apartment.unit_type
              )}
            </TableCell>
            <TableCell>
              {editingId === apartment._id ? (
                <Input
                  value={editForm.floorplan}
                  onChange={(e) => setEditForm({...editForm, floorplan: e.target.value})}
                />
              ) : (
                apartment.floorplan || "N/A"
              )}
            </TableCell>
            <TableCell>
              {editingId === apartment._id ? (
                <Input
                  value={editForm.special_request}
                  onChange={(e) => setEditForm({...editForm, special_request: e.target.value})}
                />
              ) : (
                apartment.special_request || "N/A"
              )}
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                {editingId === apartment._id ? (
                  <>
                    <Button variant="outline" size="icon" onClick={() => handleSave(apartment._id)} title="Save">
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleCancel} title="Cancel">
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" size="icon" onClick={() => handleEdit(apartment)} title="Edit">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => onDelete(apartment._id)} title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}