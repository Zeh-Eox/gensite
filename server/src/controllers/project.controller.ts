import { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import openAIClient from "../configs/openai.js";
import sanitizeHtml from "../lib/sanitizeHtml.js";

export const makeRevision = async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId;
  const { projectId } = req.params;
  const { message } = req.body;

  try {
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!projectId || Array.isArray(projectId)) {
      res.status(400).json({ message: "Project ID is required" });
      return;
    }

    if (!message || message.trim() === "") {
      res.status(400).json({ message: "Please enter a valid prompt" });
      return;
    }

    const AI_AGENT_MODEL = process.env.AI_AGENT_MODEL;
    if (!AI_AGENT_MODEL) {
      throw new Error("Missing AI Agent Model");
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.credits < 3) {
      res.status(403).json({ message: "Forbidden : Add more credits" });
      return;
    }

    const currentProject = await prisma.websiteProject.findUnique({
      where: {
        id: projectId,
        userId,
      },
    });

    if (!currentProject) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    await prisma.conversation.create({
      data: {
        role: "user",
        content: message,
        projectId,
      },
    });

    const promptEnhanceResponse =
      await openAIClient.chat.completions.create({
        model: AI_AGENT_MODEL,
        messages: [
          {
            role: "system",
            content: `
            You are a prompt enhancement specialist. The user wants to make changes to their website. Enhance their request to be more specific and actionable for a web developer.

              Enhance this by:
              1. Being specific about what elements to change
              2. Mentioning design details (colors, spacing, sizes)
              3. Clarifying the desired outcome
              4. Using clear technical terms

            Return ONLY the enhanced request, nothing else. Keep it concise (1-2 sentences).
          `,
          },
          {
            role: "user",
            content: `User's request: "${message}"`,
          },
        ],
      });

    const enhancedPrompt =
      promptEnhanceResponse.choices[0].message.content;

    await prisma.conversation.create({
      data: {
        role: "assistant",
        content: `I've enhanced your prompt to: "${enhancedPrompt}"`,
        projectId,
      },
    });

    await prisma.conversation.create({
      data: {
        role: "assistant",
        content: "Now making changes to your website...",
        projectId,
      },
    });

    const codeGenerationResponse =
      await openAIClient.chat.completions.create({
        model: AI_AGENT_MODEL,
        messages: [
          {
            role: "system",
            content: `
            You are an expert web developer. 

              CRITICAL REQUIREMENTS:
              - Return ONLY the complete updated HTML code with the requested changes.
              - Use Tailwind CSS for ALL styling (NO custom CSS).
              - Use Tailwind utility classes for all styling changes.
              - Include all JavaScript in <script> tags before closing </body>
              - Make sure it's a complete, standalone HTML document with Tailwind CSS
              - Return the HTML Code Only, nothing else
            
            Apply the requested changes while maintaining the Tailwind CSS styling approach.
          `,
          },
          {
            role: "user",
            content: `Here is the current website code: "${currentProject.current_code}". The user wants this change "${enhancedPrompt}"`,
          },
        ],
      });

    const rawCode = codeGenerationResponse.choices[0].message.content || "";
    const cleanCode = sanitizeHtml(rawCode);

    const version = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: {
          credits: {
            decrement: 3,
          },
        },
      });

      const newVersion = await tx.version.create({
        data: {
          code: cleanCode,
          description: "changes made",
          projectId,
        },
      });

      await tx.websiteProject.update({
        where: { id: projectId },
        data: {
          current_code: cleanCode,
          current_version_index: newVersion.id,
        },
      });

      return newVersion;
    });

    await prisma.conversation.create({
      data: {
        role: "assistant",
        content: "I've made the changes to your website! You can now preview it",
        projectId,
      },
    });

    res.status(200).json({
      message: "Changes made successfully",
      versionId: version.id,
    });
  } catch (error: unknown) {
    console.error("Make revision error:", error);

    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const rollbackToVersion = async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId;
  const {projectId, versionId} = req.params;

  try {
    if(!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return 
    }

    if (!projectId || Array.isArray(projectId)) {
      res.status(400).json({ message: "Project ID is required" });
      return;
    }

    if (!versionId || Array.isArray(versionId)) {
      res.status(400).json({ message: "Version ID is required" });
      return;
    }

    const project = await prisma.websiteProject.findFirst({
      where: {
        id: projectId,
        userId,
      },
    });

    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    const version = await prisma.version.findFirst({
      where: {
        id: versionId,
        projectId,
      },
    });

    if (!version) {
      res.status(404).json({ message: "Version not found" });
      return;
    }

    await prisma.$transaction([
      prisma.websiteProject.update({
        where: { id: projectId },
        data: {
          current_code: version.code,
          current_version_index: version.id,
        },
      }),

      prisma.conversation.create({
        data: {
          role: "assistant",
          content: "I've rolled back your website to the selected version. You can now preview it.",
          projectId,
        },
      }),
    ]);

    res.status(200).json({ message: "Version rolled back" });

  } catch (error: unknown) {
    console.error("Rollback to version error:", error);

    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId;
  const { projectId } = req.params;

  try {
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!projectId || Array.isArray(projectId)) {
      res.status(400).json({ message: "Project ID is required" });
      return;
    }

    const project = await prisma.websiteProject.findFirst({
      where: {
        id: projectId,
        userId,
      },
    });

    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    await prisma.websiteProject.delete({
      where: {
        id: projectId,
      },
    });

    res.sendStatus(204);
  } catch (error: unknown) {
    console.error("Delete project error:", error);

    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Internal server error",
    });
  }
}

export const getProjectPreview = async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId;
  const { projectId } = req.params;

  try {
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!projectId || Array.isArray(projectId)) {
      res.status(400).json({ message: "Project ID is required" });
      return;
    }

    const project = await prisma.websiteProject.findFirst({
      where: {
        id: projectId,
        userId,
      },
      include: {
        versions: true
      }
    });

    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    res.status(200).json({ project });
  } catch (error: unknown) {
    console.error("Get project preview error:", error);

    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Internal server error",
    });
  }
}

export const getPublishedProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const projects = await prisma.websiteProject.findMany({
      where: {
        isPublished: true,
      },
      include: {
        user: true
      }
    });

    if (!projects) {
      res.status(404).json({ message: "Projects not found" });
      return;
    }

    res.status(200).json({ projects });
  } catch (error: unknown) {
    console.error("Get published project error:", error);

    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Internal server error",
    });
  }
}

export const getProjectById = async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.params;

  try {
    if (!projectId || Array.isArray(projectId)) {
      res.status(400).json({ message: "Project ID is required" });
      return;
    }

    const project = await prisma.websiteProject.findFirst({
      where: {
        id: projectId,
      }
    });

    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    if (project.isPublished === false || !project?.current_code) {
      res.status(400).json({ message: "Projects unavailable" });
      return;
    }

    res.status(200).json({ code: project.current_code });
  } catch (error: unknown) {
    console.error("Get project by id error:", error);

    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Internal server error",
    });
  }
}

export const saveProjectCode = async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.params;
  const userId = req.userId;
  const { code } = req.body;

  try {
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!projectId || Array.isArray(projectId)) {
      res.status(400).json({ message: "Project ID is required" });
      return;
    }

    if (!code) {
      res.status(400).json({ message: "Code is required" });
      return;
    }

    const project = await prisma.websiteProject.findUnique({
      where: {
        id: projectId,
        userId
      }
    });

    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    await prisma.websiteProject.update({
      where: {
        id: projectId
      },
      data: {
        current_code: code,
        current_version_index: ''
      }
    })

    res.status(200).json({ message: "Project saved successfully" });
  } catch (error: unknown) {
    console.error("Save project code error:", error);

    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Internal server error",
    });
  }
}