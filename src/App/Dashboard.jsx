import { useEffect, useState } from "react";
import { ApartmentTable } from "./ApartmentTable";
import { AddApartmentForm } from "./AddApartmentForm";
import { useAuth } from "../contexts/AuthContext";
import { useAuthActions } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { userId } = useAuth();
  const { logout } = useAuthActions();
  const [apartments, setApartments] = useState([]);

  useEffect(() => {
    if (!userId) return;

    async function fetchUserApartments() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${userId}/apartments`);
        if (!response.ok) {
          throw new Error("Failed to fetch apartments");
        }
        const data = await response.json();
        setApartments(data);
      } catch (error) {
        console.error(error.message);
      }
    }

    fetchUserApartments();
  }, [userId]);

  // Function to handle apartment addition
  const handleAddApartment = (newApartment) => {
    setApartments((prev) => [...prev, newApartment]);
  };

  // Function to handle apartment update
  const handleUpdate = (updatedApartments) => {
    setApartments(updatedApartments);
  };

  // Function to handle apartment deletion
  const handleDelete = async (apartmentId) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/apartments/${apartmentId}`, { method: "DELETE" });
      setApartments(apartments.filter((apartment) => apartment._id !== apartmentId));
    } catch (error) {
      console.error("Failed to delete apartment", error);
    }
  };

  // Function to handle logout
  const handleLogout = () => {
    logout();
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Welcome to Clync</h1>
        <Button onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <AddApartmentForm onAddApartment={handleAddApartment} />

      <ApartmentTable
        apartments={apartments}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />
    </div>
  );
}