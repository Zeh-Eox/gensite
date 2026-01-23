import "dotenv/config"
import { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import openAIClient from "../configs/openai.js";
import sanitizeHtml from "../lib/sanitizeHtml.js";


export const getUserCredits = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if(!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return 
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true }
    })

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ credits: user?.credits })
  } catch (error: unknown) {
    console.error("Get user credits error:", error);

    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Internal server error",
    });
  }
}

export const createUserProject = async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId;
  const { initial_prompt } = req.body;

  try {
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!initial_prompt || initial_prompt.trim() === "") {
      res.status(400).json({ message: "Initial prompt is required" });
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

    if (user.credits < 5) {
      res
        .status(403)
        .json({ message: "Forbidden : Add more credits" });
      return;
    }

    const project = await prisma.$transaction(async (tx) => {
      const createdProject = await tx.websiteProject.create({
        data: {
          name:
            initial_prompt.length > 50
              ? `${initial_prompt.substring(0, 47)}...`
              : initial_prompt,
          initial_prompt,
          userId,
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: {
          credits: { decrement: 5 },
          totalCreation: { increment: 1 },
        },
      });

      await tx.conversation.create({
        data: {
          role: "user",
          content: initial_prompt,
          projectId: createdProject.id,
        },
      });

      return createdProject;
    });

    res.status(200).json({ projectId: project.id });

    const promptEnhanceResponse =
      await openAIClient.chat.completions.create({
        model: AI_AGENT_MODEL,
        messages: [
          {
            role: "system",
            content: `
            You are a prompt enhancement specialist. Take the user's website request and expand it into a detailed, comprehensive prompt that will help create the best possible website.

              Enhance this prompt by:
              1. Adding specific design details (layout, color scheme, typography)
              2. Specifying key sections and features
              3. Describing the user experience and interactions
              4. Including modern web design best practices
              5. Mentioning responsive design requirements
              6. Adding any missing but important elements

            Return ONLY the enhanced prompt, nothing else. Make it detailed but concise (2-3 paragraphs max).
          `,
          },
          {
            role: "user",
            content: initial_prompt,
          },
        ],
      });

    const enhancedPrompt =
      promptEnhanceResponse.choices[0].message.content;

    await prisma.conversation.create({
      data: {
        role: "assistant",
        content: `I've enhanced your prompt to: "${enhancedPrompt}"`,
        projectId: project.id,
      },
    });

    await prisma.conversation.create({
      data: {
        role: "assistant",
        content: "Now generating your website...",
        projectId: project.id,
      },
    });

    const codeGenerationResponse =
      await openAIClient.chat.completions.create({
        model: AI_AGENT_MODEL,
        messages: [
          {
            role: "system",
            content: `
            You are an expert web developer. Create a complete, production-ready, single-page website based on this request: "${enhancedPrompt}"

              CRITICAL REQUIREMENTS:
              - You MUST output valid HTML ONLY. 
              - Use Tailwind CSS for ALL styling
              - Include this EXACT script in the <head>: <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
              - Use Tailwind utility classes extensively for styling, animations, and responsiveness
              - Make it fully functional and interactive with JavaScript in <script> tag before closing </body>
              - Use modern, beautiful design with great UX using Tailwind classes
              - Make it responsive using Tailwind responsive classes (sm:, md:, lg:, xl:)
              - Use Tailwind animations and transitions (animate-*, transition-*)
              - Include all necessary meta tags
              - Use Google Fonts CDN if needed for custom fonts
              - Use placeholder images from https://placehold.co/600x400
              - Use Tailwind gradient classes for beautiful backgrounds
              - Make sure all buttons, cards, and components use Tailwind styling

              CRITICAL HARD RULES:
              1. You MUST put ALL output ONLY into message.content.
              2. You MUST NOT place anything in "reasoning", "analysis", "reasoning_details", or any hidden fields.
              3. You MUST NOT include internal thoughts, explanations, analysis, comments, or markdown.
              4. Do NOT include markdown, explanations, notes, or code fences.

            The HTML should be complete and ready to render as-is with Tailwind CSS.
          `,
          },
          {
            role: "user",
            content: enhancedPrompt || "",
          },
        ],
      });

    const rawCode =
      codeGenerationResponse.choices[0].message.content || "";
    const cleanCode = sanitizeHtml(rawCode);

    const version = await prisma.version.create({
      data: {
        code: cleanCode,
        description: "Initial version",
        projectId: project.id,
      },
    });

    await prisma.websiteProject.update({
      where: { id: project.id },
      data: {
        current_code: cleanCode,
        current_version_index: version.id,
      },
    });

    await prisma.conversation.create({
      data: {
        role: "assistant",
        content:
          "I've created your website! You can now preview it and request any changes.",
        projectId: project.id,
      },
    });

    res.status(201).json({ message: "Project created successfully" })
  } catch (error: unknown) {
    console.error("Create user project error:", error);

    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const getUserProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { projectId } = req.params;

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
        conversation: {
          orderBy: { timestamp: "asc" },
        },
        versions: {
          orderBy: { timestamp: "asc" },
        },
      },
    });

    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    res.status(200).json({ project });
  } catch (error: unknown) {
    console.error("Get user project error:", error);

    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const getUserAllProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const userProjects = await prisma.websiteProject.findMany({
      where: { userId },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    if (!userProjects) {
      res.status(404).json({ message: "User projects not found" });
      return;
    }

    res.status(200).json({ userProjects });
  } catch (error: unknown) {
    console.error("Get user all projects error:", error);

    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const togglePublish = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const {projectId} = req.params;

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
        userId
      }
    })

    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    await prisma.websiteProject.update({
      where: { id: projectId },
      data: {
        isPublished: !project.isPublished
      }
    })

    res.status(200).json({ message: project.isPublished ? "Project unpublished" : "Project published" });
  } catch (error: unknown) {
    console.error("Toggle publish error:", error);

    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const purchaseCredits = async (req: Request, res: Response) => {
  
}