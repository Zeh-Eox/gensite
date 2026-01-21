import React from "react";
import type { Message, Project, Version } from "../types";
import {
  BotIcon,
  EyeIcon,
  Loader2Icon,
  SendHorizonalIcon,
  UserIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

interface SidebarProps {
  isMenuOpen: boolean;
  project: Project;
  // setProject: React.Dispatch<React.SetStateAction<Project | null>>;
  isGenerating: boolean;
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({
  isMenuOpen,
  project,
  isGenerating,
  setIsGenerating,
  // setProject,
}) => {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const [input, setInput] = React.useState<string>("");

  const handleRollback = async (versionId: string) => {
    console.log(versionId);
  };

  const handleRevisions = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [project.conversation.length, isGenerating]);

  return (
    <div
      className={`h-full sm:max-w-sm rounded-xl bg-gray-900 border-gray-800 transition-all ${isMenuOpen ? "max-sm:w-0 overflow-hidden" : "w-full"}`}
    >
      <div className="flex flex-col h-full">
        {/* Message container */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-3 flex flex-col">
          {[...project.conversation, ...project.versions]
            .sort(
              (a, b) =>
                new Date(a.timestamp).getTime() -
                new Date(b.timestamp).getTime(),
            )
            .map((message) => {
              const isMessage = "content" in message;
              if (isMessage) {
                const msg = message as Message;
                const isUser = msg.role === "user";

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    {!isUser && (
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-600 to-indigo-700 flex items-center justify-center">
                        <BotIcon className="size-5 text-white" />
                      </div>
                    )}

                    <div
                      className={`max-w-[80%] p-2 px-4 rounded-2xl shadow-sm text-sm mt-5 leading-relaxed ${isUser ? "bg-linear-to-r from-indigo-500 to-indigo-600 text-white rounded-tr-none" : "bg-gray-800 text-gray-100 rounded-bl-none"}`}
                    >
                      {msg.content}
                    </div>

                    {isUser && (
                      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                        <UserIcon className="size-5 text-white" />
                      </div>
                    )}
                  </div>
                );
              } else {
                const version = message as Version;
                return (
                  <div
                    key={version.id}
                    className="w-4/5 mx-auto my-2 p-3 rounded-xl bg-gray-800 text-gray-100 shadow flex flex-col gap-2"
                  >
                    <div className="text-xs font-medium">
                      code updated <br />{" "}
                      <span className="text-gray-500 text-xs font-normal">
                        {new Date(version.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      {project.current_version_index === version.id ? (
                        <button className="px-3 py-1 rounded-md text-xs bg-gray-700">
                          Current version
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRollback(version.id)}
                          className="px-3 py-1 rounded-md text-xs bg-indigo-500 hover:bg-indigo-600 text-white"
                        >
                          Rollback to this version
                        </button>
                      )}
                      <Link
                        to={`/preview/${project.id}/${version.id}`}
                        target="_blank"
                      >
                        <EyeIcon className="size-6 p-1 bg-gray-700 hover:bg-indigo-500 transition-colors rounded" />
                      </Link>
                    </div>
                  </div>
                );
              }
            })}

          {isGenerating && (
            <div className="flex items-start gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-600 to-indigo-700 flex items-center justify-center">
                <BotIcon className="size-5 text-white" />
              </div>
              {/* three dots loading animation */}
              <div className="flex gap-1.5 h-full items-end">
                <span
                  className="size-2 rounded-full animate-bounce bg-gray-600"
                  style={{ animationDelay: "0s" }}
                />
                <span
                  className="size-2 rounded-full animate-bounce bg-gray-600"
                  style={{ animationDelay: "0.2s" }}
                />
                <span
                  className="size-2 rounded-full animate-bounce bg-gray-600"
                  style={{ animationDelay: "0.4s" }}
                />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div>
          <form onSubmit={handleRevisions} className="m-3 relative">
            <div className="flex items-center gap-2">
              <textarea
                rows={4}
                placeholder="Describe your website or request change..."
                className="flex-1 p-3 rounded-xl resize-none text-sm outline-none ring ring-gray-700 focus:ring-indigo-500 bg-gray-800 text-gray-100 placeholder-gray-400 transition-all"
                disabled={isGenerating}
                value={input}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setInput(e.target.value)
                }
              />

              <button
                disabled={isGenerating || !input.trim()}
                className="absolute bottom-2.5 right-2.5 rounded-full bg-linear-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white transition-colors disabled:opacity-60"
              >
                {isGenerating ? (
                  <Loader2Icon className="size-7 p-1.5 animate-spin text-white" />
                ) : (
                  <SendHorizonalIcon className="size-7 p-1.5 text-white" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
