import { useQuery } from "@tanstack/react-query";
import { type Profile, type Project, type Education, type Skill, type Experience, type Achievement, type Contact } from "@shared/schema";

export const usePortfolioData = () => {
  // Profile query
  const profileQuery = useQuery<Profile>({
    queryKey: ['/api/profile'],
  });

  // Projects query
  const projectsQuery = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  // Educations query
  const educationsQuery = useQuery<Education[]>({
    queryKey: ['/api/educations'],
  });

  // Skills query
  const skillsQuery = useQuery<Skill[]>({
    queryKey: ['/api/skills'],
  });

  // Experiences query
  const experiencesQuery = useQuery<Experience[]>({
    queryKey: ['/api/experiences'],
  });

  // Achievements query
  const achievementsQuery = useQuery<Achievement[]>({
    queryKey: ['/api/achievements'],
  });

  // Contact query
  const contactQuery = useQuery<Contact>({
    queryKey: ['/api/contact'],
  });

  return {
    profileQuery,
    projectsQuery,
    educationsQuery,
    skillsQuery,
    experiencesQuery,
    achievementsQuery,
    contactQuery,
  };
};
