import { useState } from "react";
import { useEditMode } from "@/context/EditModeContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type Contact, insertContactSchema, insertMessageSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Mail, Phone, MapPin, Edit, Linkedin, Github, Twitter, MessageCircle } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";

interface ContactSectionProps {
  contact?: Contact;
}

const ContactSection = ({ contact }: ContactSectionProps) => {
  const { editMode } = useEditMode();
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Contact form schema
  const contactSchema = insertContactSchema.extend({
    // Allow optional values
    phone: z.string().optional(),
    location: z.string().optional(),
    linkedin: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    github: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    twitter: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    instagram: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    successMessage: z.string().optional(),
  });

  type ContactFormValues = z.infer<typeof contactSchema>;

  const contactForm = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      email: contact?.email || "",
      phone: contact?.phone || "",
      location: contact?.location || "",
      linkedin: contact?.linkedin || "",
      github: contact?.github || "",
      twitter: contact?.twitter || "",
      instagram: contact?.instagram || "",
      formEmail: contact?.formEmail || "",
      successMessage: contact?.successMessage || "Thank you for your message! I'll get back to you soon.",
    },
  });

  // Message form schema
  const messageSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    subject: z.string().min(1, "Subject is required"),
    message: z.string().min(1, "Message is required"),
  });

  type MessageFormValues = z.infer<typeof messageSchema>;

  const messageForm = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmitContact = async (data: ContactFormValues) => {
    try {
      await apiRequest("PUT", "/api/contact", data);
      queryClient.invalidateQueries({ queryKey: ['/api/contact'] });
      setIsEditing(false);
      toast({
        title: "Contact updated",
        description: "Your contact information has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating contact:", error);
      toast({
        title: "Error",
        description: "Failed to update contact information. Please try again.",
        variant: "destructive",
      });
    }
  };

  const onSubmitMessage = async (data: MessageFormValues) => {
    try {
      setIsSubmitting(true);
      const messageData = {
        ...data,
        createdAt: new Date().toISOString(),
      };
      
      await apiRequest("POST", "/api/messages", messageData);
      
      toast({
        title: "Message sent",
        description: contact?.successMessage || "Thank you for your message! I'll get back to you soon.",
      });
      
      messageForm.reset();
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!contact && !isEditing) {
    return (
      <Card className="mb-10">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <p>No contact information available.</p>
            {editMode && (
              <Button 
                className="mt-4" 
                onClick={() => setIsEditing(true)}
              >
                Add Contact Information
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <section id="contact" className="mb-10 bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Contact</h2>
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
        <div id="contact-view" className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Send Me a Message</h3>
            <Form {...messageForm}>
              <form onSubmit={messageForm.handleSubmit(onSubmitMessage)} className="space-y-4">
                <FormField
                  control={messageForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={messageForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={messageForm.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={messageForm.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea rows={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Form>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
            <div className="space-y-4">
              {contact?.email && (
                <div className="flex items-start">
                  <div className="mr-3 h-10 w-10 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
                    <Mail className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-800">{contact.email}</p>
                  </div>
                </div>
              )}
              
              {contact?.phone && (
                <div className="flex items-start">
                  <div className="mr-3 h-10 w-10 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
                    <Phone className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-800">{contact.phone}</p>
                  </div>
                </div>
              )}
              
              {contact?.location && (
                <div className="flex items-start">
                  <div className="mr-3 h-10 w-10 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
                    <MapPin className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-gray-800">{contact.location}</p>
                  </div>
                </div>
              )}
              
              <div className="pt-4">
                <h4 className="font-medium text-gray-800 mb-3">Connect With Me</h4>
                <div className="flex space-x-4">
                  {contact?.linkedin && (
                    <a 
                      href={contact.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-primary hover:bg-blue-200 transition-colors"
                    >
                      <Linkedin />
                    </a>
                  )}
                  
                  {contact?.github && (
                    <a 
                      href={contact.github} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-primary hover:bg-blue-200 transition-colors"
                    >
                      <Github />
                    </a>
                  )}
                  
                  {contact?.twitter && (
                    <a 
                      href={contact.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-primary hover:bg-blue-200 transition-colors"
                    >
                      <Twitter />
                    </a>
                  )}
                  
                  {contact?.instagram && (
                    <a 
                      href={contact.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-primary hover:bg-blue-200 transition-colors"
                    >
                      <MessageCircle />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Form {...contactForm}>
          <form onSubmit={contactForm.handleSubmit(onSubmitContact)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Form Settings</h3>
                
                <FormField
                  control={contactForm.control}
                  name="formEmail"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Forward Form Submissions To:</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={contactForm.control}
                  name="successMessage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Success Message</FormLabel>
                      <FormControl>
                        <Textarea rows={2} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
                
                <div className="space-y-4">
                  <FormField
                    control={contactForm.control}
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
                  
                  <FormField
                    control={contactForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input type="tel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={contactForm.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <h4 className="font-medium text-gray-800 mt-6 mb-3">Social Media Links</h4>
                
                <div className="space-y-4">
                  <FormField
                    control={contactForm.control}
                    name="linkedin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn URL</FormLabel>
                        <FormControl>
                          <Input type="url" {...field} placeholder="https://linkedin.com/in/..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={contactForm.control}
                    name="github"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GitHub URL</FormLabel>
                        <FormControl>
                          <Input type="url" {...field} placeholder="https://github.com/..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={contactForm.control}
                      name="twitter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Twitter URL</FormLabel>
                          <FormControl>
                            <Input type="url" {...field} placeholder="https://twitter.com/..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={contactForm.control}
                      name="instagram"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Instagram URL</FormLabel>
                          <FormControl>
                            <Input type="url" {...field} placeholder="https://instagram.com/..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
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

export default ContactSection;
