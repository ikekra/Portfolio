import {
  profiles, type Profile, type InsertProfile,
  projects, type Project, type InsertProject,
  educations, type Education, type InsertEducation,
  skills, type Skill, type InsertSkill,
  experiences, type Experience, type InsertExperience,
  achievements, type Achievement, type InsertAchievement,
  contacts, type Contact, type InsertContact,
  messages, type Message, type InsertMessage
} from "@shared/schema";

export interface IStorage {
  // Profile
  getProfile(): Promise<Profile | undefined>;
  updateProfile(profile: InsertProfile): Promise<Profile>;
  
  // Projects
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: InsertProject): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
  
  // Education
  getEducations(): Promise<Education[]>;
  createEducation(education: InsertEducation): Promise<Education>;
  updateEducation(id: number, education: InsertEducation): Promise<Education | undefined>;
  deleteEducation(id: number): Promise<boolean>;
  
  // Skills
  getSkills(): Promise<Skill[]>;
  getSkill(id: number): Promise<Skill | undefined>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  updateSkill(id: number, skill: InsertSkill): Promise<Skill | undefined>;
  deleteSkill(id: number): Promise<boolean>;
  
  // Experience
  getExperiences(): Promise<Experience[]>;
  createExperience(experience: InsertExperience): Promise<Experience>;
  updateExperience(id: number, experience: InsertExperience): Promise<Experience | undefined>;
  deleteExperience(id: number): Promise<boolean>;
  
  // Achievements
  getAchievements(): Promise<Achievement[]>;
  getAchievement(id: number): Promise<Achievement | undefined>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  updateAchievement(id: number, achievement: InsertAchievement): Promise<Achievement | undefined>;
  deleteAchievement(id: number): Promise<boolean>;
  
  // Contact
  getContact(): Promise<Contact | undefined>;
  updateContact(contact: InsertContact): Promise<Contact>;
  
  // Messages
  createMessage(message: InsertMessage): Promise<Message>;
  getMessages(): Promise<Message[]>;
}

export class MemStorage implements IStorage {
  private profile: Profile | undefined;
  private projects: Map<number, Project>;
  private educations: Map<number, Education>;
  private skills: Map<number, Skill>;
  private experiences: Map<number, Experience>;
  private achievements: Map<number, Achievement>;
  private contact: Contact | undefined;
  private messages: Map<number, Message>;
  private currentIds: {
    project: number;
    education: number;
    skill: number;
    experience: number;
    achievement: number;
    message: number;
  };

  constructor() {
    this.profile = {
      id: 1,
      name: "Vishal Raju Honde",
      title: "Computer Science Student",
      university: "Shivaji University, Class of 2022",
      bio: "I'm a passionate computer science student with interests in web development, AI, and mobile applications. I'm currently seeking internship opportunities to apply my skills in a professional environment.",
      photoUrl: "https://ibb.co/0pL7sQLH", // Publicly accessible image URL
      linkedin: "https://linkedin.com/in/janesmith",
      github: "https://github.com/janesmith",
      twitter: "https://twitter.com/janesmith",
      email: "vishalhonde67@gmail.com",
    };
    

    this.projects = new Map();
    this.projects.set(1, {
      id: 1,
      title: "Personal Portfolio Website",
      description: "A responsive portfolio website built with HTML, CSS, and JavaScript to showcase my projects and skills.",
      imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      technologies: ["HTML", "CSS", "JavaScript"],
      projectUrl: "https://example.com/portfolio",
      githubUrl: "https://github.com/ikekra/portfolio",
    });
    
    this.projects.set(2, {
      id: 2,
      title: "Fitness Tracker App",
      description: "A mobile application that helps users track their fitness goals, workouts, and nutrition using React Native.",
      imageUrl: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      technologies: ["React Native", "Firebase", "Redux"],
      projectUrl: "https://example.com/fitness-app",
      githubUrl: "https://github.com/janesmith/fitness-app",
    });
    
    this.projects.set(3, {
      id: 3,
      title: "AI Image Classifier",
      description: "A machine learning model that classifies images using TensorFlow and Python, deployed as a web service.",
      imageUrl: "https://images.unsplash.com/photo-1550063873-ab792950096b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      technologies: ["Python", "TensorFlow", "Flask"],
      projectUrl: "https://example.com/image-classifier",
      githubUrl: "https://github.com/janesmith/image-classifier",
    });

    this.educations = new Map();
    this.educations.set(1, {
      id: 1,
      degree: "Bachelor of Technology in Computer Science Engineering",
      institution: "Bharati vidyapeeth's College of Engineering and Pharmacy,Kolhapur",
      dateRange: "2022 - 2026",
      gpa: "8.8/10",
      description: "Coursework: Data Structures & Algorithms, Web Development, Database Systems, Machine Learning, Operating Systems",
    });
    
    this.educations.set(2, {
      id: 2,
      degree: "Higher Secondary Certificate ",
      institution: "SMT Mathura Devi College of Secondary Education",
      dateRange: "2019 - 2021",
      gpa: "83%",
      description: "Advanced courses in Computer Science, Mathematics, and Physics",
    });

    this.skills = new Map();
    this.skills.set(1, {
      id: 1,
      category: "Programming Languages",
      items: ["JavaScript", "Python", "Java", "C++", "SQL"],
    });
    
    this.skills.set(2, {
      id: 2,
      category: "Web Technologies",
      items: ["React", "Node.js", "HTML/CSS", "Express", "MongoDB"],
    });
    
    this.skills.set(3, {
      id: 3,
      category: "Tools & Platforms",
      items: ["Git", "Docker", "AWS", "Firebase", "Heroku"],
    });
    
    this.skills.set(4, {
      id: 4,
      category: "Soft Skills",
      items: ["Team Collaboration", "Problem Solving", "Time Management", "Communication",""],
    });

    this.experiences = new Map();
    this.experiences.set(1, {
      id: 1,
      position: "Web Developer Intern",
      company: "Tech Innovations Inc.",
      dateRange: "Summer 2023",
      responsibilities: "• Developed and maintained features for the company's web application using React and Node.js\n• Collaborated with a team of 5 developers using Agile methodologies\n• Implemented responsive UI components that improved user engagement by 15%\n• Participated in code reviews and contributed to technical documentation",
    });
    
    this.experiences.set(2, {
      id: 2,
      position: "Teaching Assistant",
      company: "University of Technology, Computer Science Department",
      dateRange: "2022 - Present",
      responsibilities: "• Assisted professors in teaching Introduction to Programming and Data Structures courses\n• Held weekly office hours to help students with assignments and concepts\n• Graded assignments and provided constructive feedback to improve student performance\n• Created supplementary learning materials that increased student comprehension",
    });

    this.achievements = new Map();
    this.achievements.set(1, {
      id: 1,
      title: "Dean's List Scholar",
      organization: "University of Technology • 2020-2023",
      description: "Maintained a GPA above 3.7 for six consecutive semesters, earning a place on the Dean's List.",
      icon: "award",
    });
    
    this.achievements.set(2, {
      id: 2,
      title: "Hackathon Winner",
      organization: "TechFest 2022 • October 2022",
      description: "Led a team of 4 students to win first place in the university's annual hackathon with an innovative healthcare application.",
      icon: "trophy",
    });
    
    this.achievements.set(3, {
      id: 3,
      title: "AWS Certified Developer",
      organization: "Amazon Web Services • January 2023",
      description: "Obtained the AWS Certified Developer - Associate certification, demonstrating expertise in developing and maintaining applications on AWS.",
      icon: "certificate",
    });

    this.contact = {
      id: 1,
      email: "vishalhonde67@gmail.com",
      phone: "(91) 9175318745",
      location: "Kolhapur,India",
      linkedin: "https://linkedin.com/in/janesmith",
      github: "https://github.com/janesmith",
      twitter: "https://twitter.com/janesmith",
      instagram: "https://instagram.com/janesmith",
      formEmail: "jane.smith@example.com",
      successMessage: "Thank you for your message! I'll get back to you soon.",
    };

    this.messages = new Map();

    this.currentIds = {
      project: 4,
      education: 3,
      skill: 5,
      experience: 3,
      achievement: 4,
      message: 1,
    };
  }

  // Profile methods
  async getProfile(): Promise<Profile | undefined> {
    return this.profile;
  }

  async updateProfile(profile: InsertProfile): Promise<Profile> {
    this.profile = { id: 1, ...profile };
    return this.profile;
  }

  // Project methods
  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(project: InsertProject): Promise<Project> {
    const id = this.currentIds.project++;
    const newProject = { id, ...project };
    this.projects.set(id, newProject);
    return newProject;
  }

  async updateProject(id: number, project: InsertProject): Promise<Project | undefined> {
    if (!this.projects.has(id)) return undefined;
    
    const updatedProject = { id, ...project };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Education methods
  async getEducations(): Promise<Education[]> {
    return Array.from(this.educations.values());
  }

  async createEducation(education: InsertEducation): Promise<Education> {
    const id = this.currentIds.education++;
    const newEducation = { id, ...education };
    this.educations.set(id, newEducation);
    return newEducation;
  }

  async updateEducation(id: number, education: InsertEducation): Promise<Education | undefined> {
    if (!this.educations.has(id)) return undefined;
    
    const updatedEducation = { id, ...education };
    this.educations.set(id, updatedEducation);
    return updatedEducation;
  }

  async deleteEducation(id: number): Promise<boolean> {
    return this.educations.delete(id);
  }

  // Skill methods
  async getSkills(): Promise<Skill[]> {
    return Array.from(this.skills.values());
  }

  async getSkill(id: number): Promise<Skill | undefined> {
    return this.skills.get(id);
  }

  async createSkill(skill: InsertSkill): Promise<Skill> {
    const id = this.currentIds.skill++;
    const newSkill = { id, ...skill };
    this.skills.set(id, newSkill);
    return newSkill;
  }

  async updateSkill(id: number, skill: InsertSkill): Promise<Skill | undefined> {
    if (!this.skills.has(id)) return undefined;
    
    const updatedSkill = { id, ...skill };
    this.skills.set(id, updatedSkill);
    return updatedSkill;
  }

  async deleteSkill(id: number): Promise<boolean> {
    return this.skills.delete(id);
  }

  // Experience methods
  async getExperiences(): Promise<Experience[]> {
    return Array.from(this.experiences.values());
  }

  async createExperience(experience: InsertExperience): Promise<Experience> {
    const id = this.currentIds.experience++;
    const newExperience = { id, ...experience };
    this.experiences.set(id, newExperience);
    return newExperience;
  }

  async updateExperience(id: number, experience: InsertExperience): Promise<Experience | undefined> {
    if (!this.experiences.has(id)) return undefined;
    
    const updatedExperience = { id, ...experience };
    this.experiences.set(id, updatedExperience);
    return updatedExperience;
  }

  async deleteExperience(id: number): Promise<boolean> {
    return this.experiences.delete(id);
  }

  // Achievement methods
  async getAchievements(): Promise<Achievement[]> {
    return Array.from(this.achievements.values());
  }

  async getAchievement(id: number): Promise<Achievement | undefined> {
    return this.achievements.get(id);
  }

  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const id = this.currentIds.achievement++;
    const newAchievement = { id, ...achievement };
    this.achievements.set(id, newAchievement);
    return newAchievement;
  }

  async updateAchievement(id: number, achievement: InsertAchievement): Promise<Achievement | undefined> {
    if (!this.achievements.has(id)) return undefined;
    
    const updatedAchievement = { id, ...achievement };
    this.achievements.set(id, updatedAchievement);
    return updatedAchievement;
  }

  async deleteAchievement(id: number): Promise<boolean> {
    return this.achievements.delete(id);
  }

  // Contact methods
  async getContact(): Promise<Contact | undefined> {
    return this.contact;
  }

  async updateContact(contact: InsertContact): Promise<Contact> {
    this.contact = { id: 1, ...contact };
    return this.contact;
  }

  // Message methods
  async createMessage(message: InsertMessage): Promise<Message> {
    const id = this.currentIds.message++;
    const newMessage = { id, ...message };
    this.messages.set(id, newMessage);
    return newMessage;
  }

  async getMessages(): Promise<Message[]> {
    return Array.from(this.messages.values());
  }
}

export const storage = new MemStorage();
