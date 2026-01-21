import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { Project } from "@/types";
import {
  ArrowLeft,
  Download,
  EyeIcon,
  EyeOffIcon,
  Fullscreen,
  LaptopIcon,
  Loader2Icon,
  MessageSquareIcon,
  Save,
  SmartphoneIcon,
  TabletIcon,
  XIcon,
} from "lucide-react";
import {
  dummyConversations,
  dummyProjects,
  dummyVersion,
} from "@/constants/assets";
import Sidebar from "@/components/Sidebar";
import ProjectPreview, {
  type ProjectPreviewRef,
} from "@/components/ProjectPreview";

type deviceType = "desktop" | "tablet" | "phone";

const Projects: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = React.useState<Project | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isGenerating, setIsGenerating] = React.useState<boolean>(true);
  const [device, setDevice] = React.useState<deviceType>("desktop");
  const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false);
  const [isSaving, setIsSaving] = React.useState<boolean>(false);
  const projectPreviewRef = React.useRef<ProjectPreviewRef>(null);

  const fetchProject = async () => {
    const projectResponse = dummyProjects.find((proj) => proj.id === projectId);

    setTimeout(() => {
      if (projectResponse) {
        setProject({
          ...projectResponse,
          conversation: dummyConversations,
          versions: dummyVersion,
        });
        setIsLoading(false);
        setIsGenerating(projectResponse.current_code ? false : true);
      }
    }, 1000);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const togglePublish = () => {
    if (project) {
      setProject({ ...project, isPublished: !project.isPublished });
    }
  };

  const downloadCode = () => {
    if (isGenerating) return;

    const code = projectPreviewRef.current?.getCode() || project?.current_code;

    if (!code) {
      return;
    }

    const blob = new Blob([code], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "index.html";

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const saveProject = async () => {
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
    }, 2000);
  };

  React.useEffect(() => {
    fetchProject();
  }, []);

  if (isLoading) {
    return (
      <>
        <div className="flex items-center justify-center h-screen">
          <Loader2Icon className="size-7 animate-spin text-violet-400" />
        </div>
      </>
    );
  }

  return project ? (
    <div className="flex flex-col h-screen w-full bg-gray-900 text-white">
      {/* builder navabar */}
      <div className="flex max-sm:flex-col sm:items-center gap-4 px-4 py-2 no-scrollbar">
        {/* left */}
        <div className="flex items-center gap-2 sm:min-w-90 text-nowrap">
          <img
            src="/favicon.png"
            alt="Logo"
            className="h-6 cursor-pointer"
            onClick={() => navigate("/")}
          />

          <div className="max-w-64 sm:max-w-xs">
            <p className="text-sm text-medium capitalize truncate">
              {project.name}
            </p>
            <p className="text-xs text-gray-400 -mt-0.5">
              Previewing last saved version
            </p>
          </div>

          <div className="sm:hidden flex flex-1 justify-end">
            {isMenuOpen ? (
              <MessageSquareIcon
                onClick={toggleMenu}
                className="size-6 cursor-pointer"
              />
            ) : (
              <XIcon onClick={toggleMenu} className="size-6 cursor-pointer" />
            )}
          </div>
        </div>

        {/* middle */}
        <div className="hidden sm:flex gap-2 bg-gray-950 p-1.5 rounded-md">
          <SmartphoneIcon
            onClick={() => setDevice("phone")}
            className={`size-6 p-1 rounded cursor-pointer ${device === "phone" ? "bg-gray-700" : ""}`}
          />
          <TabletIcon
            onClick={() => setDevice("tablet")}
            className={`size-6 p-1 rounded cursor-pointer ${device === "tablet" ? "bg-gray-700" : ""}`}
          />
          <LaptopIcon
            onClick={() => setDevice("desktop")}
            className={`size-6 p-1 rounded cursor-pointer ${device === "desktop" ? "bg-gray-700" : ""}`}
          />
        </div>

        {/* right */}
        <div className="flex items-center justify-end gap-3 flex-1 text-xs sm:text-sm">
          <Link
            to={"/projects"}
            className="flex items-center gap-2 px-4 py-1 rounded sm:rounded-sm border border-purple-700 hover:bg-purple-700 transition-colors"
          >
            <ArrowLeft size={16} /> Go Back
          </Link>
          <button
            disabled={isSaving}
            className="max-sm:hidden bg-gray-800 hover:bg-gray-700 text-white px-3.5 py-1 flex items-center gap-2 rounded sm:rounded-sm transition-colors border border-gray-700"
            onClick={saveProject}
          >
            {isSaving ? (
              <Loader2Icon size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {isSaving ? "Saving" : "Save"}
          </button>

          <Link
            className="flex items-center gap-2 px-4 py-1 rounded sm:rounded-sm border border-gray-700 hover:bg-gray-700 transition-colors"
            to={`/preview/${projectId}`}
            target="_blank"
          >
            <Fullscreen size={16} /> Preview
          </Link>

          <button
            className="bg-linear-to-br from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white px-3.5 py-1 flex items-center gap-2 rounded sm:rounded-sm transition-colors"
            onClick={downloadCode}
          >
            <Download size={16} /> Download
          </button>

          <button
            className="bg-linear-to-br from-indigo-700 to-indigo-600 hover:from-indigo-600 hover:to-indigo-500 text-white px-3.5 py-1 flex items-center gap-2 rounded sm:rounded-sm transition-colors"
            onClick={togglePublish}
          >
            {project.isPublished ? (
              <EyeOffIcon size={16} />
            ) : (
              <EyeIcon size={16} />
            )}
            {project.isPublished ? "Unpublish" : "Publish"}
          </button>
        </div>
      </div>

      {/* builder main content */}
      <div className="flex flex-1 overflow-auto">
        {/* left */}
        <Sidebar
          isMenuOpen={isMenuOpen}
          project={project}
          // setProject={(p) => setProject(p)}
          isGenerating={isGenerating}
          setIsGenerating={setIsGenerating}
        />
        <div className="flex-1 p-2 pl-10">
          <ProjectPreview
            ref={projectPreviewRef}
            project={project}
            isGenerating={isGenerating}
            device={device}
          />
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-[90vh]">
      <p className="text-2xl font-medium text-gray-200">
        Unable to load project
      </p>
    </div>
  );
};

export default Projects;
