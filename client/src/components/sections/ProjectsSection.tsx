import { useState } from "react";
import { useEditMode } from "@/context/EditModeContext";
import { Project } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Plus, Edit, Trash, FolderPlus, Image, Github } from "lucide-react";
import ProjectModal from "@/components/modals/ProjectModal";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

interface ProjectsSectionProps {
  projects: Project[];
}

const ProjectsSection = ({ projects }: ProjectsSectionProps) => {
  const { editMode } = useEditMode();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { toast } = useToast();

  const handleAddProject = () => {
    setSelectedProject(null);
    setIsModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleDeleteProject = async (id: number) => {
    try {
      await apiRequest("DELETE", `/api/projects/${id}`);
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      toast({
        title: "Project deleted",
        description: "The project has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <section id="projects" className="mb-10 bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Projects</h2>
        {editMode && (
          <Button 
            size="sm" 
            onClick={handleAddProject}
            className="bg-secondary text-white px-3 py-1 rounded-md text-sm hover:bg-emerald-600 transition-colors"
          >
            <Plus className="mr-1 h-4 w-4" /> Add Project
          </Button>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <FolderPlus className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No projects</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
          {editMode && (
            <Button
              className="mt-4"
              onClick={handleAddProject}
            >
              <Plus className="mr-1 h-4 w-4" /> Add Project
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="project-card overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-48 bg-gray-200 relative">
                {project.imageUrl ? (
                  <img 
                    src={project.imageUrl} 
                    alt={project.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                    <Image className="h-12 w-12" />
                  </div>
                )}
                
                {editMode && (
                  <div className="absolute top-2 right-2 flex flex-col gap-2">
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="h-8 w-8 rounded-full bg-white text-gray-700 shadow hover:bg-gray-100"
                      onClick={() => handleEditProject(project)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          size="icon" 
                          variant="destructive" 
                          className="h-8 w-8 rounded-full bg-white text-red-500 shadow hover:bg-gray-100"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the project "{project.title}". This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteProject(project.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                <p className="text-gray-600 text-sm mb-3">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, index) => (
                    <Badge key={index} variant="outline" className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              
              <CardFooter className="px-4 pb-4 pt-0 flex justify-between items-center">
                {project.projectUrl && (
                  <a 
                    href={project.projectUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-primary hover:text-blue-700 text-sm font-medium"
                  >
                    View Project
                  </a>
                )}
                
                {project.githubUrl && (
                  <a 
                    href={project.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-600 hover:text-gray-800 text-sm"
                  >
                    <Github className="inline h-4 w-4 mr-1" /> Source
                  </a>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={selectedProject}
      />
    </section>
  );
};

export default ProjectsSection;
