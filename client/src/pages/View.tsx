import React from "react";
import { useParams } from "react-router-dom";
import { dummyProjects } from "../constants/assets";
import type { Project } from "../types";
import { Loader2Icon } from "lucide-react";
import ProjectPreview, {
  type ProjectPreviewRef,
} from "../components/ProjectPreview";

const View: React.FC = () => {
  const { projectId } = useParams();
  const [code, setCode] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const previewRef = React.useRef<ProjectPreviewRef>(null);

  const fetchCode = async () => {
    const sourceCode = dummyProjects.find(
      (project: Project) => project.id === projectId,
    )?.current_code;

    setTimeout(() => {
      if (sourceCode) {
        setCode(sourceCode);
        setIsLoading(false);
      }
    }, 2000);
  };

  React.useEffect(() => {
    fetchCode();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2Icon className="size-7 animate-spin text-indigo-200" />
      </div>
    );
  }

  return (
    <div className="h-screen">
      {code && (
        <ProjectPreview
          project={{ current_code: code } as Project}
          isGenerating={false}
          showEditorPanel={false}
          ref={previewRef}
        />
      )}
    </div>
  );
};

export default View;
