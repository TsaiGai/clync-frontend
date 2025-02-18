import { useEffect, useState, useContext } from "react";
import { ApartmentTable } from "./page";
import { AddApartmentPopover } from "../components/ui/add-apartment-popover"; // Import the Popover
import { useAuth } from "../contexts/AuthContext"; // Import AuthContext

export default function Dashboard() {
  const { userId } = useAuth(); // Get userId from context
  console.log(userId);
  const [apartments, setApartments] = useState([]);

  useEffect(() => {
    if (!userId) return; // Ensure userId exists before fetching

    async function fetchUserApartments() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${userId}/apartments`);
        if (!response.ok) {
          throw new Error("Failed to fetch apartments");
        }
        const data = await response.json();
        console.log("Fetched apartments:", data); // Debugging: Log the response data
        setApartments(data);
      } catch (error) {
        console.error(error.message);
      }
    }

    fetchUserApartments();
  }, [userId]);

  async function handleDelete(apartmentId) {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/apartments/${apartmentId}`, { method: "DELETE" });
      setApartments(apartments.filter((apartment) => apartment._id !== apartmentId));
    } catch (error) {
      console.error("Failed to delete apartment", error);
    }
  }

  const handleAddApartment = (newApartment) => {
    setApartments((prev) => [...prev, newApartment]); // ✅ Only updates state
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome to Clync</h1>

      {/* Replace Button with AddApartmentPopover */}
      <AddApartmentPopover onAddApartment={handleAddApartment} />

      <ApartmentTable
        apartments={apartments}
        onDelete={handleDelete}
      />
    </div>
  );
}
