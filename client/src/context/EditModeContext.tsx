import { createContext, useContext, useState, ReactNode } from "react";

interface EditModeContextType {
  editMode: boolean;
  toggleEditMode: () => void;
}

const EditModeContext = createContext<EditModeContextType>({
  editMode: false,
  toggleEditMode: () => {},
});

export const useEditMode = () => useContext(EditModeContext);

interface EditModeProviderProps {
  children: ReactNode;
}

export const EditModeProvider = ({ children }: EditModeProviderProps) => {
  const [editMode, setEditMode] = useState(false);

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
  };

  return (
    <EditModeContext.Provider value={{ editMode, toggleEditMode }}>
      {children}
    </EditModeContext.Provider>
  );
};
