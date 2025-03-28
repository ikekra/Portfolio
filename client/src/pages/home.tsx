import Sidebar from "@/components/Sidebar";
import EditModeToggle from "@/components/EditModeToggle";
import ProfileSection from "@/components/sections/ProfileSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ResumeSection from "@/components/sections/ResumeSection";
import AchievementsSection from "@/components/sections/AchievementsSection";
import ContactSection from "@/components/sections/ContactSection";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { Skeleton } from "@/components/ui/skeleton";

const Home = () => {
  const { 
    profileQuery, 
    projectsQuery, 
    educationsQuery, 
    skillsQuery, 
    experiencesQuery, 
    achievementsQuery, 
    contactQuery 
  } = usePortfolioData();
  
  const isLoading = 
    profileQuery.isLoading || 
    projectsQuery.isLoading || 
    educationsQuery.isLoading || 
    skillsQuery.isLoading || 
    experiencesQuery.isLoading || 
    achievementsQuery.isLoading || 
    contactQuery.isLoading;
  
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        <div className="flex justify-end mb-4">
          <EditModeToggle />
        </div>
        
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <>
            <ProfileSection profile={profileQuery.data} />
            <ProjectsSection projects={projectsQuery.data || []} />
            <ResumeSection 
              educations={educationsQuery.data || []} 
              skills={skillsQuery.data || []} 
              experiences={experiencesQuery.data || []} 
            />
            <AchievementsSection achievements={achievementsQuery.data || []} />
            <ContactSection contact={contactQuery.data} />
          </>
        )}
      </main>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="space-y-8">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-20" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    ))}
  </div>
);

export default Home;
