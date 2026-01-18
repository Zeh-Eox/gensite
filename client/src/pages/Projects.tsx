import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Project } from "../types";
import { Loader2Icon } from "lucide-react";

type deviceType = "desktop" | "tablet" | "phone";

const Projects: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [Project, setProject] = React.useState<Project | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const [isGenerating, setIsGenerating] = React.useState<boolean>(true);
  const [device, setDevice] = React.useState<deviceType>("desktop");

  const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false);
  const [isSaving, setIsSaving] = React.useState<boolean>(false);

  const fetchProject = async () => {
    // Fetch project logic here
  };

  React.useEffect(() => {
    fetchProject();
  }, []);

  if (isLoading) {
    return (
      <>
        <div className="flex items-center justify-center h-[90vh]">
          <Loader2Icon className="size-7 animate-spin text-violet-400" />
        </div>
      </>
    );
  }

  return <div>Projects</div>;
};

export default Projects;
