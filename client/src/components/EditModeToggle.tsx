import { Button } from "@/components/ui/button";
import { useEditMode } from "@/context/EditModeContext";
import { Edit } from "lucide-react";

const EditModeToggle = () => {
  const { editMode, toggleEditMode } = useEditMode();

  return (
    <Button
      variant={editMode ? "default" : "outline"}
      size="sm"
      onClick={toggleEditMode}
      className="flex items-center gap-1"
    >
      <Edit className="h-4 w-4 mr-1" />
      <span>{editMode ? "Exit Edit Mode" : "Edit Mode"}</span>
    </Button>
  );
};

export default EditModeToggle;
