import { useState } from "react";
import { useEditMode } from "@/context/EditModeContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { type Profile, insertProfileSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Linkedin, Github, Twitter, Mail } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface ProfileSectionProps {
  profile?: Profile;
}

const ProfileSection = ({ profile }: ProfileSectionProps) => {
  const { editMode } = useEditMode();
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const profileSchema = insertProfileSchema.extend({
    photoUrl: z.string().optional(),
    linkedin: z.string().optional(),
    github: z.string().optional(),
    twitter: z.string().optional()
  });

  type ProfileFormValues = z.infer<typeof profileSchema>;

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name || "",
      title: profile?.title || "",
      university: profile?.university || "",
      bio: profile?.bio || "",
      photoUrl: profile?.photoUrl || "",
      linkedin: profile?.linkedin || "",
      github: profile?.github || "",
      twitter: profile?.twitter || "",
      email: profile?.email || ""
    }
  });

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      await apiRequest("PUT", "/api/profile", data);
      queryClient.invalidateQueries({ queryKey: ['/api/profile'] });
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!profile && !isEditing) {
    return (
      <Card className="mb-10">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <p>No profile information available.</p>
            {editMode && (
              <Button 
                className="mt-4" 
                onClick={() => setIsEditing(true)}
              >
                Create Profile
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <section id="profile" className="mb-10 bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
        {editMode && !isEditing && (
          <Button 
            size="sm" 
            onClick={() => setIsEditing(true)}
            className="bg-primary text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition-colors"
          >
            <Edit className="mr-1 h-4 w-4" /> Edit
          </Button>
        )}
      </div>

      {!isEditing ? (
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            <Avatar className="w-32 h-32">
              <AvatarImage 
                src={profile?.photoUrl || ""} 
                alt={profile?.name || "Profile"} 
                className="w-full h-full object-cover" 
              />
              <AvatarFallback>
                {profile?.name ? profile.name.split(' ').map(n => n[0]).join('') : 'JS'}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800">{profile?.name}</h3>
            <p className="text-gray-600 mb-2">{profile?.title}</p>
            <p className="text-gray-600 mb-4">{profile?.university}</p>
            <p className="text-gray-700 mb-4">{profile?.bio}</p>
            <div className="flex flex-wrap gap-2">
              {profile?.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
              {profile?.github && (
                <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                  <Github className="h-5 w-5" />
                </a>
              )}
              {profile?.twitter && (
                <a href={profile.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                  <Twitter className="h-5 w-5" />
                </a>
              )}
              {profile?.email && (
                <a href={`mailto:${profile.email}`} className="text-blue-600 hover:text-blue-800">
                  <Mail className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="mb-4 flex flex-col md:flex-row gap-6">
              <div className="w-32 flex-shrink-0">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-2">
                  {form.watch("photoUrl") ? (
                    <img
                      src={form.watch("photoUrl")}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Hide the broken image and show the fallback
                        e.currentTarget.style.display = 'none';
                        // Don't clear the photoUrl value to allow the user to fix it
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary text-white text-3xl">
                      {form.watch("name") ? form.watch("name").split(' ').map(n => n[0]).join('') : 'JS'}
                    </div>
                  )}
                </div>
                <FormField
                  control={form.control}
                  name="photoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Profile Photo URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/photo.jpg"
                          {...field}
                          className="w-full text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex-1 grid gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="university"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>University</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea rows={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="linkedin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn URL</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="github"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GitHub URL</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="twitter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter URL</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      )}
    </section>
  );
};

export default ProfileSection;
