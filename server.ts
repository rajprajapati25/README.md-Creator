import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json({ limit: "15mb" }));
  
  // Serve static files from the public folder (Accessible in both dev & prod)
  app.use(express.static(path.join(process.cwd(), "public")));

  // --- API Routes ---

  // API Route: Standard generator proxy
  app.post("/api/generate", async (req, res) => {
    try {
      const { prompt, systemInstruction } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: systemInstruction ? { systemInstruction } : undefined,
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini Generation Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate content" });
    }
  });

  // API Route: Map whole workspace files dynamically into a unified README.md card
  app.post("/api/document-workspace", async (req, res) => {
    try {
      const { files, projectInfo, userInstructions } = req.body;
      
      const fileSummary = files && files.length > 0 
        ? files.map((f: any) => `### File: ${f.path}\n\`\`\`\n${f.content ? f.content.substring(0, 1500) : "(empty)"}\n\`\`\``).join("\n\n")
        : "No workspace files provided.";

      const prompt = `You are an expert technical documentation creator. Generate an outstanding, comprehensive, highly visual, and modern README.md file designed for high impact. Use HTML-styled badges, clear structure, tables, and typography.

Here is the source file tree and partial content of the project workspace:
${fileSummary}

Optional Custom Details provided by user:
- Project Name/Pitch: ${projectInfo || "Not specified."}
- Formatting / Style guidelines: ${userInstructions || "Clean, elegant, with descriptive guides."}

Please output a beautiful full-length README.md template containing:
1. Header section with badging, clear main title, an original description, and neat layout structure.
2. A beautiful visual Folder Directory Tree layout representing the virtual files provided.
3. Step-by-step Installation and Setup guide matching the technologies (e.g. Node, HTML, CSS, Dotenv) found.
4. Comprehensive detailed walk-throughs of the features.
5. Tech stacks, libraries list nicely formatted with badges or a clean table.
6. A guide on Contributing, License details (MIT), and beautiful Authors section.

CRITICAL: Return ONLY raw printable markdown formatted content. Do NOT wrap your entire output in a triple backtick (\`\`\`markdown) block — start directly with the markdown content (e.g. badges or titles), so the editor can receive the text block directly.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      res.json({ markdown: response.text });
    } catch (error: any) {
      console.error("Workspace Documentation Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate README" });
    }
  });

  // --- Frontend Routing & Vite Middleware ---

  if (process.env.NODE_ENV !== "production") {
    // Development: Use Vite's Dev Server Middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production: Serve pre-built assets from the dist folder
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    
    // Fallback all SPA routes to index.html
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // --- Start Server ---
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server launched on port ${PORT}`);
  });
}

startServer();