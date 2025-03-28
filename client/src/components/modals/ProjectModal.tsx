import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { type Project, insertProjectSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Image } from "lucide-react";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

const ProjectModal = ({ isOpen, onClose, project }: ProjectModalProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const projectSchema = insertProjectSchema.extend({
    imageUrl: z.string().optional(),
    projectUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    githubUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    technologiesString: z.string().min(1, "Please specify at least one technology")
  }).omit({ technologies: true });

  type ProjectFormValues = z.infer<typeof projectSchema>;

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || "",
      description: project?.description || "",
      imageUrl: project?.imageUrl || "",
      projectUrl: project?.projectUrl || "",
      githubUrl: project?.githubUrl || "",
      technologiesString: project?.technologies.join(", ") || "",
    },
  });

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      setIsSubmitting(true);
      const { technologiesString, ...rest } = data;
      
      const formattedData = {
        ...rest,
        technologies: technologiesString.split(",").map(tech => tech.trim()).filter(tech => tech),
      };

      if (project) {
        // Update existing project
        await apiRequest("PUT", `/api/projects/${project.id}`, formattedData);
        toast({
          title: "Project updated",
          description: "The project has been updated successfully.",
        });
      } else {
        // Create new project
        await apiRequest("POST", "/api/projects", formattedData);
        toast({
          title: "Project added",
          description: "The new project has been added successfully.",
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      onClose();
      form.reset();
    } catch (error) {
      console.error("Error saving project:", error);
      toast({
        title: "Error",
        description: "Failed to save project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{project ? "Edit Project" : "Add New Project"}</DialogTitle>
          <DialogDescription>
            {project 
              ? "Update the details of your existing project." 
              : "Fill out the form below to add a new project to your portfolio."}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Personal Portfolio Website" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      rows={3} 
                      {...field} 
                      placeholder="Describe your project in detail..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Image URL</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input 
                        {...field} 
                        placeholder="https://example.com/image.jpg"
                      />
                      {field.value && (
                        <div className="h-48 bg-gray-100 rounded-md overflow-hidden">
                          <img 
                            src={field.value} 
                            alt="Project preview" 
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.currentTarget.src = "";
                              e.currentTarget.classList.add("flex", "items-center", "justify-center");
                              field.onChange("");
                              toast({
                                title: "Invalid image URL",
                                description: "The image URL provided is invalid or inaccessible.",
                                variant: "destructive",
                              });
                            }}
                          />
                          {!field.value && (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <SidebarIcons.image className="w-8 h-8" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="technologiesString"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technologies (comma separated)</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="e.g., HTML, CSS, JavaScript, React"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="projectUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project URL</FormLabel>
                    <FormControl>
                      <Input 
                        type="url" 
                        {...field} 
                        placeholder="https://example.com/project"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="githubUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub URL</FormLabel>
                    <FormControl>
                      <Input 
                        type="url" 
                        {...field} 
                        placeholder="https://github.com/username/repo"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onClose();
                  form.reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : (project ? "Update Project" : "Save Project")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;
