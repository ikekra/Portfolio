import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { User, Code, FileText, Trophy, Mail, LogOut } from "lucide-react";

const Sidebar = () => {
  const [location] = useLocation();
  
  const navigation = [
    { name: "Profile", href: "#profile", icon: <User className="h-5 w-5" /> },
    { name: "Projects", href: "#projects", icon: <Code className="h-5 w-5" /> },
    { name: "Resume", href: "#resume", icon: <FileText className="h-5 w-5" /> },
    { name: "Achievements", href: "#achievements", icon: <Trophy className="h-5 w-5" /> },
    { name: "Contact", href: "#contact", icon: <Mail className="h-5 w-5" /> }
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <aside className="md:w-64 md:fixed md:h-full bg-white shadow-lg z-10">
      <div className="p-4 h-full flex flex-col">
        <div className="flex items-center justify-center md:justify-start">
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
            JS
          </div>
          <h1 className="ml-2 font-bold text-xl text-gray-800">My Portfolio</h1>
        </div>
        
        <nav className="mt-8 flex-grow">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.href.substring(1));
                  }}
                  className={cn(
                    "flex items-center p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-all",
                    location === item.href && "bg-gray-100"
                  )}
                >
                  <span className="w-6 text-primary">{item.icon}</span>
                  <span>{item.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="pt-6">
          <button className="w-full bg-primary text-white p-2 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
