import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertProfileSchema,
  insertProjectSchema,
  insertEducationSchema,
  insertSkillSchema,
  insertExperienceSchema,
  insertAchievementSchema,
  insertContactSchema,
  insertMessageSchema
} from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Error handler for validation errors
  const handleValidationError = (error: unknown, res: any) => {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors
      });
    }
    console.error("Server error:", error);
    return res.status(500).json({ message: "Internal server error" });
  };

  // Profile routes
  app.get('/api/profile', async (req, res) => {
    try {
      const profile = await storage.getProfile();
      res.json(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.put('/api/profile', async (req, res) => {
    try {
      const profileData = insertProfileSchema.parse(req.body);
      const updatedProfile = await storage.updateProfile(profileData);
      res.json(updatedProfile);
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  // Projects routes
  app.get('/api/projects', async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get('/api/projects/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.post('/api/projects', async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const newProject = await storage.createProject(projectData);
      res.status(201).json(newProject);
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  app.put('/api/projects/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const projectData = insertProjectSchema.parse(req.body);
      const updatedProject = await storage.updateProject(id, projectData);
      
      if (!updatedProject) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(updatedProject);
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  app.delete('/api/projects/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const result = await storage.deleteProject(id);
      if (!result) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Education routes
  app.get('/api/educations', async (req, res) => {
    try {
      const educations = await storage.getEducations();
      res.json(educations);
    } catch (error) {
      console.error("Error fetching educations:", error);
      res.status(500).json({ message: "Failed to fetch educations" });
    }
  });

  app.post('/api/educations', async (req, res) => {
    try {
      const educationData = insertEducationSchema.parse(req.body);
      const newEducation = await storage.createEducation(educationData);
      res.status(201).json(newEducation);
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  app.put('/api/educations/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const educationData = insertEducationSchema.parse(req.body);
      const updatedEducation = await storage.updateEducation(id, educationData);
      
      if (!updatedEducation) {
        return res.status(404).json({ message: "Education not found" });
      }
      
      res.json(updatedEducation);
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  app.delete('/api/educations/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const result = await storage.deleteEducation(id);
      if (!result) {
        return res.status(404).json({ message: "Education not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting education:", error);
      res.status(500).json({ message: "Failed to delete education" });
    }
  });

  // Skills routes
  app.get('/api/skills', async (req, res) => {
    try {
      const skills = await storage.getSkills();
      res.json(skills);
    } catch (error) {
      console.error("Error fetching skills:", error);
      res.status(500).json({ message: "Failed to fetch skills" });
    }
  });

  app.post('/api/skills', async (req, res) => {
    try {
      const skillData = insertSkillSchema.parse(req.body);
      const newSkill = await storage.createSkill(skillData);
      res.status(201).json(newSkill);
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  app.put('/api/skills/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const skillData = insertSkillSchema.parse(req.body);
      const updatedSkill = await storage.updateSkill(id, skillData);
      
      if (!updatedSkill) {
        return res.status(404).json({ message: "Skill not found" });
      }
      
      res.json(updatedSkill);
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  app.delete('/api/skills/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const result = await storage.deleteSkill(id);
      if (!result) {
        return res.status(404).json({ message: "Skill not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting skill:", error);
      res.status(500).json({ message: "Failed to delete skill" });
    }
  });

  // Experience routes
  app.get('/api/experiences', async (req, res) => {
    try {
      const experiences = await storage.getExperiences();
      res.json(experiences);
    } catch (error) {
      console.error("Error fetching experiences:", error);
      res.status(500).json({ message: "Failed to fetch experiences" });
    }
  });

  app.post('/api/experiences', async (req, res) => {
    try {
      const experienceData = insertExperienceSchema.parse(req.body);
      const newExperience = await storage.createExperience(experienceData);
      res.status(201).json(newExperience);
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  app.put('/api/experiences/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const experienceData = insertExperienceSchema.parse(req.body);
      const updatedExperience = await storage.updateExperience(id, experienceData);
      
      if (!updatedExperience) {
        return res.status(404).json({ message: "Experience not found" });
      }
      
      res.json(updatedExperience);
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  app.delete('/api/experiences/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const result = await storage.deleteExperience(id);
      if (!result) {
        return res.status(404).json({ message: "Experience not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting experience:", error);
      res.status(500).json({ message: "Failed to delete experience" });
    }
  });

  // Achievement routes
  app.get('/api/achievements', async (req, res) => {
    try {
      const achievements = await storage.getAchievements();
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  app.get('/api/achievements/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const achievement = await storage.getAchievement(id);
      if (!achievement) {
        return res.status(404).json({ message: "Achievement not found" });
      }
      
      res.json(achievement);
    } catch (error) {
      console.error("Error fetching achievement:", error);
      res.status(500).json({ message: "Failed to fetch achievement" });
    }
  });

  app.post('/api/achievements', async (req, res) => {
    try {
      const achievementData = insertAchievementSchema.parse(req.body);
      const newAchievement = await storage.createAchievement(achievementData);
      res.status(201).json(newAchievement);
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  app.put('/api/achievements/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const achievementData = insertAchievementSchema.parse(req.body);
      const updatedAchievement = await storage.updateAchievement(id, achievementData);
      
      if (!updatedAchievement) {
        return res.status(404).json({ message: "Achievement not found" });
      }
      
      res.json(updatedAchievement);
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  app.delete('/api/achievements/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const result = await storage.deleteAchievement(id);
      if (!result) {
        return res.status(404).json({ message: "Achievement not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting achievement:", error);
      res.status(500).json({ message: "Failed to delete achievement" });
    }
  });

  // Contact routes
  app.get('/api/contact', async (req, res) => {
    try {
      const contact = await storage.getContact();
      res.json(contact);
    } catch (error) {
      console.error("Error fetching contact:", error);
      res.status(500).json({ message: "Failed to fetch contact" });
    }
  });

  app.put('/api/contact', async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const updatedContact = await storage.updateContact(contactData);
      res.json(updatedContact);
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  // Contact message routes
  app.post('/api/messages', async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse({
        ...req.body,
        createdAt: new Date().toISOString()
      });
      
      const newMessage = await storage.createMessage(messageData);
      res.status(201).json(newMessage);
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  app.get('/api/messages', async (req, res) => {
    try {
      const messages = await storage.getMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
