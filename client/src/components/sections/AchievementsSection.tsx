import { useState } from "react";
import { useEditMode } from "@/context/EditModeContext";
import { Achievement } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash, Award, Trophy, Scroll, Medal, Star } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AchievementModal from "@/components/modals/AchievementModal";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

interface AchievementsSectionProps {
  achievements: Achievement[];
}

const AchievementsSection = ({ achievements }: AchievementsSectionProps) => {
  const { editMode } = useEditMode();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const { toast } = useToast();

  const handleAddAchievement = () => {
    setSelectedAchievement(null);
    setIsModalOpen(true);
  };

  const handleEditAchievement = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setIsModalOpen(true);
  };

  const handleDeleteAchievement = async (id: number) => {
    try {
      await apiRequest("DELETE", `/api/achievements/${id}`);
      queryClient.invalidateQueries({ queryKey: ['/api/achievements'] });
      toast({
        title: "Achievement deleted",
        description: "The achievement has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting achievement:", error);
      toast({
        title: "Error",
        description: "Failed to delete achievement. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getIconComponent = (icon: string) => {
    switch (icon) {
      case 'award':
        return <Award className="text-primary text-xl" />;
      case 'trophy':
        return <Trophy className="text-primary text-xl" />;
      case 'certificate':
        return <Scroll className="text-primary text-xl" />;
      case 'medal':
        return <Medal className="text-primary text-xl" />;
      case 'star':
        return <Star className="text-primary text-xl" />;
      default:
        return <Award className="text-primary text-xl" />;
    }
  };

  return (
    <section id="achievements" className="mb-10 bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Achievements</h2>
        {editMode && (
          <Button 
            size="sm" 
            onClick={handleAddAchievement}
            className="bg-secondary text-white px-3 py-1 rounded-md text-sm hover:bg-emerald-600 transition-colors"
          >
            <Plus className="mr-1 h-4 w-4" /> Add Achievement
          </Button>
        )}
      </div>

      {achievements.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <Trophy className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No achievements</h3>
          <p className="mt-1 text-sm text-gray-500">Showcase your accomplishments by adding achievements.</p>
          {editMode && (
            <Button
              className="mt-4"
              onClick={handleAddAchievement}
            >
              <Plus className="mr-1 h-4 w-4" /> Add Achievement
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {achievements.map((achievement) => (
            <div key={achievement.id} className="achievement-item flex">
              <div className="mr-4 flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  {getIconComponent(achievement.icon)}
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold text-lg text-gray-800">{achievement.title}</h3>
                <p className="text-gray-600 text-sm mb-1">{achievement.organization}</p>
                <p className="text-gray-700">{achievement.description}</p>
              </div>
              {editMode && (
                <div className="flex items-start gap-2 ml-4">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => handleEditAchievement(achievement)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="ghost" className="text-red-500">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Achievement</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete the achievement "{achievement.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteAchievement(achievement.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <AchievementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        achievement={selectedAchievement}
      />
    </section>
  );
};

export default AchievementsSection;
