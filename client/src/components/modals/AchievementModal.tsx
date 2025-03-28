import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { type Achievement, insertAchievementSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievement: Achievement | null;
}

const AchievementModal = ({ isOpen, onClose, achievement }: AchievementModalProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const achievementSchema = insertAchievementSchema;

  type AchievementFormValues = z.infer<typeof achievementSchema>;

  const form = useForm<AchievementFormValues>({
    resolver: zodResolver(achievementSchema),
    defaultValues: {
      title: achievement?.title || "",
      organization: achievement?.organization || "",
      description: achievement?.description || "",
      icon: achievement?.icon || "award",
    },
  });

  const onSubmit = async (data: AchievementFormValues) => {
    try {
      setIsSubmitting(true);
      
      if (achievement) {
        // Update existing achievement
        await apiRequest("PUT", `/api/achievements/${achievement.id}`, data);
        toast({
          title: "Achievement updated",
          description: "The achievement has been updated successfully.",
        });
      } else {
        // Create new achievement
        await apiRequest("POST", "/api/achievements", data);
        toast({
          title: "Achievement added",
          description: "The new achievement has been added successfully.",
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ['/api/achievements'] });
      onClose();
      form.reset();
    } catch (error) {
      console.error("Error saving achievement:", error);
      toast({
        title: "Error",
        description: "Failed to save achievement. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{achievement ? "Edit Achievement" : "Add Achievement"}</DialogTitle>
          <DialogDescription>
            {achievement 
              ? "Update the details of your existing achievement." 
              : "Add a new achievement to showcase your accomplishments."}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Achievement Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Dean's List Scholar" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="organization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization & Date</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="e.g., University of Technology • 2020-2023"
                    />
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
                      placeholder="Describe your achievement in detail..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an icon" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="award">Award</SelectItem>
                      <SelectItem value="trophy">Trophy</SelectItem>
                      <SelectItem value="certificate">Certificate</SelectItem>
                      <SelectItem value="medal">Medal</SelectItem>
                      <SelectItem value="star">Star</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
                {isSubmitting ? "Saving..." : (achievement ? "Update Achievement" : "Add Achievement")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AchievementModal;
