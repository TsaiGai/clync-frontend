import { useEffect, useState } from "react"
import { ApartmentTable } from "./page"
import { Button } from "@/components/ui/button"
import { AddApartmentPopover } from "../components/ui/add-apartment-popover"  // Import the Popover

export default function Dashboard({ userId }) {
  const [apartments, setApartments] = useState([])

  useEffect(() => {
    if (!userId) return  // Ensure userId exists before fetching

    async function fetchUserApartments() {
      try {
        const response = await fetch(`http://localhost:5000/api/users/${userId}/apartments`)
        if (!response.ok) {
          throw new Error("Failed to fetch apartments")
        }
        const data = await response.json()
        setApartments(data)
      } catch (error) {
        console.error(error.message)
      }
    }

    fetchUserApartments()
  }, [userId])

  async function handleDelete(apartmentId) {
    try {
      await fetch(`http://localhost:5000/api/apartments/${apartmentId}`, { method: "DELETE" })
      setApartments(apartments.filter((apartment) => apartment._id !== apartmentId))
    } catch (error) {
      console.error("Failed to delete apartment", error)
    }
  }

  async function handleToggleStatus(apartmentId) {
    try {
      const response = await fetch(`http://localhost:5000/api/apartments/${apartmentId}/toggle`, {
        method: "PUT",
      })
      const updatedApartment = await response.json()
      setApartments(
        apartments.map((apt) =>
          apt._id === apartmentId ? { ...apt, status: updatedApartment.status } : apt
        )
      )
    } catch (error) {
      console.error("Failed to update apartment status", error)
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
        onToggleStatus={handleToggleStatus}
      />
    </div>
  )
}
