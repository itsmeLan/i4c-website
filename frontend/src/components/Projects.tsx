import { useMemo, useState } from "react";
import { Calendar, MapPin, User, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import ProjectDetailDialog from "./ProjectDetailDialog";

type ProjectItem = {
  id: string | number;
  title: string;
  category: string;
  location: string;
  year: string;
  client: string;
  description: string;
  image: string;
  status: string;
};

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const filters = [
    { id: "all", label: "All Projects" },
    { id: "commercial", label: "Commercial" },
    { id: "residential", label: "Residential" },
    { id: "infrastructure", label: "Infrastructure" },
    { id: "industrial", label: "Industrial" }
  ];

  const fallbackProjects: ProjectItem[] = [
    {
      id: 1,
      title: "Makati Business Center",
      category: "commercial",
      location: "Makati City, Metro Manila",
      year: "2023",
      client: "ABC Corporation",
      description: "40-story mixed-use development featuring office spaces, retail outlets, and premium facilities.",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      status: "Completed"
    },
    {
      id: 2,
      title: "Seaside Residential Village",
      category: "residential",
      location: "Cebu City, Cebu",
      year: "2023",
      client: "Sunshine Developers",
      description: "150-unit residential subdivision with modern Filipino architecture and sustainable features.",
      image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      status: "Completed"
    },
    {
      id: 3,
      title: "Metro Manila Skyway Extension",
      category: "infrastructure",
      location: "Metro Manila",
      year: "2024",
      client: "Department of Public Works",
      description: "15-kilometer elevated highway extension improving traffic flow and connectivity.",
      image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      status: "In Progress"
    },
    {
      id: 4,
      title: "Philippine Manufacturing Hub",
      category: "industrial",
      location: "Laguna",
      year: "2024",
      client: "TechManufacturing Inc.",
      description: "State-of-the-art manufacturing facility with sustainable design and smart automation.",
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      status: "In Progress"
    },
    {
      id: 5,
      title: "BGC Corporate Tower",
      category: "commercial",
      location: "Bonifacio Global City",
      year: "2022",
      client: "Global Enterprises",
      description: "35-story LEED-certified office tower with innovative sustainable features.",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      status: "Completed"
    },
    {
      id: 6,
      title: "Iloilo Convention Center",
      category: "infrastructure",
      location: "Iloilo City",
      year: "2023",
      client: "Iloilo City Government",
      description: "World-class convention and exhibition center promoting tourism and business.",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      status: "Completed"
    }
  ];

  const { data: apiData } = useQuery({
    queryKey: ["projects"],
    queryFn: () => apiFetch<{ ok: true; items: any[] }>("/api/projects"),
  });

  const projects = useMemo(() => {
    const items = apiData?.items ?? [];
    if (!items.length) return fallbackProjects;
    return items.map((p) => ({
      id: p._id,
      title: p.title,
      category: p.category,
      location: p.location || "",
      year: p.year || "",
      client: p.client || "",
      description: p.description || "",
      image: p.coverImageUrl || p.images?.[0]?.url || "",
      status: p.status || "Completed",
    }));
  }, [apiData]);

  const filteredProjects =
    activeFilter === "all" ? projects : projects.filter((project) => project.category.toLowerCase() === activeFilter.toLowerCase());

  const [showAll, setShowAll] = useState(false);
  const displayedProjects = showAll ? filteredProjects : filteredProjects.slice(0, 6);

  return (
    <section id="projects" className="section-padding">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-primary font-semibold text-lg">Our Portfolio</span>
          <h2 className="text-4xl lg:text-5xl font-bold">
            Showcase of <span className="gradient-text">Excellence</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our diverse portfolio of completed and ongoing projects that demonstrate 
            our commitment to quality, innovation, and Filipino craftsmanship.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              onClick={() => { setActiveFilter(filter.id); setShowAll(false); }}
              variant={activeFilter === filter.id ? "default" : "outline"}
              className={activeFilter === filter.id ? "btn-primary" : "btn-secondary"}
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedProjects.map((project, index) => (
            <div 
              key={project.id}
              className="card-construction group overflow-hidden animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Project Image */}
              <div className="relative h-64 mb-6 -m-6 mb-6">
                <img 
                  src={
                    project.image ||
                    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80"
                  }
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    project.status === 'Completed' 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-primary/20 text-primary border border-primary/30'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    size="sm"
                    className="btn-primary"
                    onClick={() => setSelectedProject(project)}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>

              {/* Project Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {project.description}
                  </p>
                </div>

                <div className="space-y-2 text-sm">
                  {project.location && (
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2 text-primary" />
                      {project.location}
                    </div>
                  )}
                  {project.year && (
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2 text-primary" />
                      {project.year}
                    </div>
                  )}
                  {project.client && (
                    <div className="flex items-center text-muted-foreground">
                      <User className="h-4 w-4 mr-2 text-primary" />
                      {project.client}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-border">
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full capitalize">
                    {project.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All / Show Less */}
        {filteredProjects.length > 6 && (
          <div className="text-center mt-12">
            <button
              className="btn-primary"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Show Less" : `View All Projects (${filteredProjects.length})`}
            </button>
          </div>
        )}
      </div>

      {/* Project Detail Dialog */}
      <ProjectDetailDialog
        project={selectedProject}
        open={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};

export default Projects;