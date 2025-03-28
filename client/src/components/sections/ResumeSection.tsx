import { useState } from "react";
import { useEditMode } from "@/context/EditModeContext";
import { Education, Experience, Skill } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Briefcase, 
  Code, 
  Plus, 
  Edit, 
  Trash, 
  Award, 
  Star, 
  Calendar,
  Clock
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

interface ResumeSectionProps {
  educations: Education[];
  skills: Skill[];
  experiences: Experience[];
}

const ResumeSection = ({ educations, skills, experiences }: ResumeSectionProps) => {
  const { editMode } = useEditMode();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("education");
  const { toast } = useToast();

  // Education form
  const [selectedEducation, setSelectedEducation] = useState<Education | null>(null);
  const [isAddingEducation, setIsAddingEducation] = useState(false);

  const educationSchema = z.object({
    degree: z.string().min(1, "Degree is required"),
    institution: z.string().min(1, "Institution is required"),
    dateRange: z.string().min(1, "Date range is required"),
    gpa: z.string().optional(),
    description: z.string().optional(),
  });

  const educationForm = useForm<z.infer<typeof educationSchema>>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      degree: "",
      institution: "",
      dateRange: "",
      gpa: "",
      description: "",
    },
  });

  // Skills form
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [isAddingSkill, setIsAddingSkill] = useState(false);

  const skillSchema = z.object({
    category: z.string().min(1, "Category is required"),
    items: z.string().min(1, "Skills are required"),
  });

  const skillForm = useForm<z.infer<typeof skillSchema>>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      category: "",
      items: "",
    },
  });

  // Experience form
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [isAddingExperience, setIsAddingExperience] = useState(false);

  const experienceSchema = z.object({
    position: z.string().min(1, "Position is required"),
    company: z.string().min(1, "Company is required"),
    dateRange: z.string().min(1, "Date range is required"),
    responsibilities: z.string().min(1, "Responsibilities are required"),
  });

  const experienceForm = useForm<z.infer<typeof experienceSchema>>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      position: "",
      company: "",
      dateRange: "",
      responsibilities: "",
    },
  });

  // Handlers for Education
  const handleAddEducation = () => {
    setSelectedEducation(null);
    educationForm.reset({
      degree: "",
      institution: "",
      dateRange: "",
      gpa: "",
      description: "",
    });
    setIsAddingEducation(true);
    setActiveTab("education");
  };

  const handleEditEducation = (education: Education) => {
    setSelectedEducation(education);
    educationForm.reset({
      degree: education.degree,
      institution: education.institution,
      dateRange: education.dateRange,
      gpa: education.gpa || "",
      description: education.description || "",
    });
    setIsAddingEducation(true);
    setActiveTab("education");
  };

  const handleEducationSubmit = async (data: z.infer<typeof educationSchema>) => {
    try {
      if (selectedEducation) {
        await apiRequest("PUT", `/api/educations/${selectedEducation.id}`, data);
        toast({
          title: "Education updated",
          description: "Education has been updated successfully.",
        });
      } else {
        await apiRequest("POST", "/api/educations", data);
        toast({
          title: "Education added",
          description: "New education has been added successfully.",
        });
      }
      queryClient.invalidateQueries({ queryKey: ['/api/educations'] });
      setIsAddingEducation(false);
    } catch (error) {
      console.error("Error saving education:", error);
      toast({
        title: "Error",
        description: "Failed to save education. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEducation = async (id: number) => {
    try {
      await apiRequest("DELETE", `/api/educations/${id}`);
      queryClient.invalidateQueries({ queryKey: ['/api/educations'] });
      toast({
        title: "Education deleted",
        description: "Education has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting education:", error);
      toast({
        title: "Error",
        description: "Failed to delete education. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handlers for Skills
  const handleAddSkill = () => {
    setSelectedSkill(null);
    skillForm.reset({
      category: "",
      items: "",
    });
    setIsAddingSkill(true);
    setActiveTab("skills");
  };

  const handleEditSkill = (skill: Skill) => {
    setSelectedSkill(skill);
    skillForm.reset({
      category: skill.category,
      items: skill.items.join(", "),
    });
    setIsAddingSkill(true);
    setActiveTab("skills");
  };

  const handleSkillSubmit = async (data: z.infer<typeof skillSchema>) => {
    try {
      const formattedData = {
        ...data,
        items: data.items.split(",").map(item => item.trim()).filter(item => item),
      };
      
      if (selectedSkill) {
        await apiRequest("PUT", `/api/skills/${selectedSkill.id}`, formattedData);
        toast({
          title: "Skills updated",
          description: "Skills have been updated successfully.",
        });
      } else {
        await apiRequest("POST", "/api/skills", formattedData);
        toast({
          title: "Skills added",
          description: "New skills category has been added successfully.",
        });
      }
      queryClient.invalidateQueries({ queryKey: ['/api/skills'] });
      setIsAddingSkill(false);
    } catch (error) {
      console.error("Error saving skills:", error);
      toast({
        title: "Error",
        description: "Failed to save skills. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSkill = async (id: number) => {
    try {
      await apiRequest("DELETE", `/api/skills/${id}`);
      queryClient.invalidateQueries({ queryKey: ['/api/skills'] });
      toast({
        title: "Skills deleted",
        description: "Skills category has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting skills:", error);
      toast({
        title: "Error",
        description: "Failed to delete skills. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handlers for Experience
  const handleAddExperience = () => {
    setSelectedExperience(null);
    experienceForm.reset({
      position: "",
      company: "",
      dateRange: "",
      responsibilities: "",
    });
    setIsAddingExperience(true);
    setActiveTab("experience");
  };

  const handleEditExperience = (experience: Experience) => {
    setSelectedExperience(experience);
    experienceForm.reset({
      position: experience.position,
      company: experience.company,
      dateRange: experience.dateRange,
      responsibilities: experience.responsibilities,
    });
    setIsAddingExperience(true);
    setActiveTab("experience");
  };

  const handleExperienceSubmit = async (data: z.infer<typeof experienceSchema>) => {
    try {
      if (selectedExperience) {
        await apiRequest("PUT", `/api/experiences/${selectedExperience.id}`, data);
        toast({
          title: "Experience updated",
          description: "Experience has been updated successfully.",
        });
      } else {
        await apiRequest("POST", "/api/experiences", data);
        toast({
          title: "Experience added",
          description: "New experience has been added successfully.",
        });
      }
      queryClient.invalidateQueries({ queryKey: ['/api/experiences'] });
      setIsAddingExperience(false);
    } catch (error) {
      console.error("Error saving experience:", error);
      toast({
        title: "Error",
        description: "Failed to save experience. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteExperience = async (id: number) => {
    try {
      await apiRequest("DELETE", `/api/experiences/${id}`);
      queryClient.invalidateQueries({ queryKey: ['/api/experiences'] });
      toast({
        title: "Experience deleted",
        description: "Experience has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting experience:", error);
      toast({
        title: "Error",
        description: "Failed to delete experience. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleToggleEditMode = () => {
    if (isEditing) {
      // Reset all forms and states when exiting edit mode
      setIsAddingEducation(false);
      setIsAddingSkill(false);
      setIsAddingExperience(false);
    }
    setIsEditing(!isEditing);
  };

  return (
    <section id="resume" className="mb-10 bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Resume/CV</h2>
        <div className="flex gap-2">
          {editMode && (
            <Button
              size="sm"
              onClick={handleToggleEditMode}
              className="bg-primary text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition-colors"
            >
              <Edit className="mr-1 h-4 w-4" /> 
              {isEditing ? "Exit Edit Mode" : "Edit"}
            </Button>
          )}
          <a 
            href="#" 
            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-200 transition-colors inline-flex items-center"
          >
            <Award className="mr-1 h-4 w-4" /> Download PDF
          </a>
        </div>
      </div>

      {!isEditing ? (
        <div id="resume-view">
          {/* Education */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Education</h3>
            {educations.length === 0 ? (
              <p className="text-gray-500">No education information available.</p>
            ) : (
              <div className="space-y-6">
                {educations.map((education) => (
                  <div key={education.id}>
                    <div className="flex justify-between">
                      <h4 className="font-medium text-lg text-gray-800">{education.degree}</h4>
                      <span className="text-gray-600 text-sm">{education.dateRange}</span>
                    </div>
                    <p className="text-primary">{education.institution}</p>
                    {education.gpa && <p className="text-gray-600 text-sm mt-1">GPA: {education.gpa}</p>}
                    {education.description && <p className="text-gray-700 mt-2">{education.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Skills */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Skills</h3>
            {skills.length === 0 ? (
              <p className="text-gray-500">No skills information available.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skills.map((skill) => (
                  <div key={skill.id}>
                    <h4 className="font-medium text-gray-800 mb-2">{skill.category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {skill.items.map((item, index) => (
                        <Badge key={index} variant="outline" className="bg-gray-100 text-gray-800 px-3 py-1 rounded-md text-sm">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Experience */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Experience</h3>
            {experiences.length === 0 ? (
              <p className="text-gray-500">No experience information available.</p>
            ) : (
              <div className="space-y-6">
                {experiences.map((experience) => (
                  <div key={experience.id}>
                    <div className="flex justify-between">
                      <h4 className="font-medium text-lg text-gray-800">{experience.position}</h4>
                      <span className="text-gray-600 text-sm">{experience.dateRange}</span>
                    </div>
                    <p className="text-primary">{experience.company}</p>
                    <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                      {experience.responsibilities.split('\n').map((item, index) => (
                        <li key={index}>{item.replace(/^•\s*/, '')}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div id="resume-edit">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
            </TabsList>
            
            <TabsContent value="education">
              {isAddingEducation ? (
                <Form {...educationForm}>
                  <form onSubmit={educationForm.handleSubmit(handleEducationSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={educationForm.control}
                        name="degree"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Degree/Certificate</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={educationForm.control}
                        name="institution"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Institution</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={educationForm.control}
                        name="dateRange"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date Range</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g. 2020 - 2024" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={educationForm.control}
                        name="gpa"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>GPA (optional)</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={educationForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description/Coursework</FormLabel>
                          <FormControl>
                            <Textarea rows={3} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsAddingEducation(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">
                        {selectedEducation ? "Update Education" : "Add Education"}
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">Education</h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleAddEducation}
                      className="text-primary hover:text-blue-700 flex items-center text-sm"
                    >
                      <Plus className="mr-1 h-4 w-4" /> Add Education
                    </Button>
                  </div>
                  
                  {educations.length === 0 ? (
                    <p className="text-gray-500 p-4 bg-gray-50 rounded-md">No education entries yet. Add your first one!</p>
                  ) : (
                    <div className="space-y-4">
                      {educations.map((education) => (
                        <Card key={education.id} className="bg-gray-50">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium text-gray-800">{education.degree}</h4>
                                <p className="text-primary">{education.institution}</p>
                                <p className="text-gray-600 text-sm">{education.dateRange}</p>
                                {education.gpa && <p className="text-gray-600 text-sm">GPA: {education.gpa}</p>}
                                {education.description && <p className="text-gray-700 mt-2">{education.description}</p>}
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => handleEditEducation(education)}
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
                                      <AlertDialogTitle>Delete Education</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete this education entry? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDeleteEducation(education.id)}>
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </>
              )}
            </TabsContent>
            
            <TabsContent value="skills">
              {isAddingSkill ? (
                <Form {...skillForm}>
                  <form onSubmit={skillForm.handleSubmit(handleSkillSubmit)} className="space-y-4">
                    <FormField
                      control={skillForm.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g. Programming Languages" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={skillForm.control}
                      name="items"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Skills (comma separated)</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="e.g. JavaScript, Python, Java, C++"
                              rows={3}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsAddingSkill(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">
                        {selectedSkill ? "Update Skills" : "Add Skills"}
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">Skills</h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleAddSkill}
                      className="text-primary hover:text-blue-700 flex items-center text-sm"
                    >
                      <Plus className="mr-1 h-4 w-4" /> Add Skill Category
                    </Button>
                  </div>
                  
                  {skills.length === 0 ? (
                    <p className="text-gray-500 p-4 bg-gray-50 rounded-md">No skills added yet. Add your first skill category!</p>
                  ) : (
                    <div className="space-y-4">
                      {skills.map((skill) => (
                        <Card key={skill.id} className="bg-gray-50">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="w-full">
                                <div className="flex justify-between items-center mb-2">
                                  <h4 className="font-medium text-gray-800">{skill.category}</h4>
                                  <div className="flex gap-2">
                                    <Button 
                                      size="sm" 
                                      variant="ghost" 
                                      onClick={() => handleEditSkill(skill)}
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
                                          <AlertDialogTitle>Delete Skill Category</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Are you sure you want to delete the skill category "{skill.category}"? This action cannot be undone.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction onClick={() => handleDeleteSkill(skill.id)}>
                                            Delete
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {skill.items.map((item, index) => (
                                    <Badge key={index} variant="outline" className="bg-gray-100 text-gray-800 px-3 py-1 rounded-md text-sm">
                                      {item}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </>
              )}
            </TabsContent>
            
            <TabsContent value="experience">
              {isAddingExperience ? (
                <Form {...experienceForm}>
                  <form onSubmit={experienceForm.handleSubmit(handleExperienceSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={experienceForm.control}
                        name="position"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Position</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={experienceForm.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company/Organization</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={experienceForm.control}
                      name="dateRange"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date Range</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g. Summer 2023 or 2020 - Present" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={experienceForm.control}
                      name="responsibilities"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Responsibilities/Achievements</FormLabel>
                          <FormControl>
                            <Textarea 
                              rows={4} 
                              {...field} 
                              placeholder="Use bullet points (•) for each responsibility"
                            />
                          </FormControl>
                          <p className="text-xs text-gray-500 mt-1">Use bullet points (•) for each line</p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsAddingExperience(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">
                        {selectedExperience ? "Update Experience" : "Add Experience"}
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">Experience</h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleAddExperience}
                      className="text-primary hover:text-blue-700 flex items-center text-sm"
                    >
                      <Plus className="mr-1 h-4 w-4" /> Add Experience
                    </Button>
                  </div>
                  
                  {experiences.length === 0 ? (
                    <p className="text-gray-500 p-4 bg-gray-50 rounded-md">No experience entries yet. Add your first one!</p>
                  ) : (
                    <div className="space-y-4">
                      {experiences.map((experience) => (
                        <Card key={experience.id} className="bg-gray-50">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="w-full">
                                <div className="flex justify-between items-center">
                                  <h4 className="font-medium text-gray-800">{experience.position}</h4>
                                  <span className="text-gray-600 text-sm">{experience.dateRange}</span>
                                </div>
                                <p className="text-primary">{experience.company}</p>
                                <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                                  {experience.responsibilities.split('\n').map((item, index) => (
                                    <li key={index}>{item.replace(/^•\s*/, '')}</li>
                                  ))}
                                </ul>
                              </div>
                              <div className="flex gap-2 ml-4 flex-shrink-0">
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => handleEditExperience(experience)}
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
                                      <AlertDialogTitle>Delete Experience</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete this experience entry? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDeleteExperience(experience.id)}>
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </section>
  );
};

export default ResumeSection;
