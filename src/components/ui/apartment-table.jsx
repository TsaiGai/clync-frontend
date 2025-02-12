import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Trash2, ToggleLeft, ToggleRight } from "lucide-react"

export function ApartmentTable({ apartments, onDelete, onToggleStatus }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Property Name</TableHead>
          <TableHead>Floor Plan Type</TableHead>
          <TableHead>Floor Plan Name</TableHead>
          <TableHead>Special Request</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {apartments.map((apartment) => (
          <TableRow key={apartment.id}>
            <TableCell>{apartment.propertyName}</TableCell>
            <TableCell>{apartment.floorPlanType}</TableCell>
            <TableCell>{apartment.floorPlanName || "N/A"}</TableCell>
            <TableCell>{apartment.specialRequest || "N/A"}</TableCell>
            <TableCell>{apartment.status}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onToggleStatus(apartment.id)}
                  title={`Toggle ${apartment.status === "active" ? "Inactive" : "Active"}`}
                >
                  {apartment.status === "active" ? (
                    <ToggleRight className="h-4 w-4" />
                  ) : (
                    <ToggleLeft className="h-4 w-4" />
                  )}
                </Button>
                <Button variant="outline" size="icon" onClick={() => onDelete(apartment.id)} title="Delete">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}