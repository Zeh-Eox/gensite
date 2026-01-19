import React from "react";
import type { Project } from "../types";
import { iframeScript } from "../constants/assets";
import { screenResolutions } from "../constants";
import EditorPanel from "./EditorPanel";

export interface ProjectPreviewRef {
  getCode: () => string | undefined;
}

interface ProjectPreviewProps {
  project: Project;
  isGenerating: boolean;
  device?: "desktop" | "tablet" | "phone";
  showEditorPanel?: boolean;
  ref: React.Ref<ProjectPreviewRef>;
}

const ProjectPreview: React.FC<ProjectPreviewProps> = React.forwardRef<
  ProjectPreviewRef,
  ProjectPreviewProps
>(
  (
    { project, isGenerating, device = "desktop", showEditorPanel = true },
    ref,
  ) => {
    React.useImperativeHandle(ref, () => ({
      getCode: () => {
        return project.current_code;
      },
    }));

    const [selectedElement, setSelectedEelement] = React.useState<any>(null);
    const iframeRef = React.useRef<HTMLIFrameElement>(null);

    React.useEffect(() => {
      const handleMessage = (event: MessageEvent) => {
        if (event.data.type === "ELEMENT_SELECTED") {
          setSelectedEelement(event.data.payload);
        } else if (event.data.type === "CLEAR_SELECTION") {
          setSelectedEelement(null);
        }
      };

      window.addEventListener("message", handleMessage);

      return () => window.removeEventListener("message", handleMessage);
    }, []);

    const injectPreviewCode = (sourceCode: string) => {
      if (!sourceCode) return "";
      if (!showEditorPanel) return sourceCode;

      if (sourceCode.includes("</body>")) {
        return sourceCode.replace("</body>", iframeScript + "</body>");
      } else {
        return sourceCode + iframeScript;
      }
    };

    const handleUpdate = (updates: any) => {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          {
            type: "UPDATE_ELEMENT",
            payload: updates,
          },
          "*",
        );
      }
    };

    return (
      <div className="relative h-full bg-gray-900 flex-1 rounded-xl overflow-hidden max-sm:ml-2">
        {project.current_code ? (
          <>
            <iframe
              ref={iframeRef}
              srcDoc={injectPreviewCode(project.current_code)}
              className={`h-full max-sm:w-full ${screenResolutions[device]} mx-auto transition-all`}
            />

            {showEditorPanel && selectedElement && (
              <EditorPanel
                selectedElement={selectedElement}
                onUpdate={handleUpdate}
                onClose={() => {
                  setSelectedEelement(null);
                  if (iframeRef.current?.contentWindow) {
                    iframeRef.current.contentWindow.postMessage(
                      { type: "CLEAR_SELECTION_REQUEST" },
                      "*",
                    );
                  }
                }}
              />
            )}
          </>
        ) : (
          isGenerating && <div>Loading</div>
        )}
      </div>
    );
  },
);

export default ProjectPreview;
