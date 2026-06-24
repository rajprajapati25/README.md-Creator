import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  FileText,
  Badge as BadgeIcon,
  Terminal,
  Grid,
  FileCode,
  Layers,
  Heart,
  Undo2,
  Redo2,
  PanelRightOpen,
  PanelLeftOpen,
  Download,
  Table,
  Copy,
  Plus,
  Trash2,
  Edit3,
  List,
  Eye,
  Info,
  FolderPlus,
  CheckCircle,
  HelpCircle,
  Play,
  RotateCcw,
  Maximize2,
  FilePlus,
  RefreshCw,
  FolderOpen,
  BookOpen,
  Sliders,
  Check,
  ChevronRight,
  ChevronLeft,
  EyeOff,
  Image as ImageIcon,
  Link as LinkIcon,
  GitBranch,
  Tag,
  Clock,
  Code,
  ExternalLink,
  Sun,
  Moon,
  Folder,
  File,
  X,
  FileJson,
  PlusCircle,
  Save,
  Compass,
  FileDown,
  Search,
  UploadCloud
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { README_TEMPLATES, TECH_ICONS } from "./data/templates";
import { RAW_BADGES_DATA } from "./data/badges";
import { WorkspaceFile, BadgeCreator, TechIcon } from "./types";
import photo1 from "../assets/photo-1618005182384-a83a8bd57fbe.jpg";
import photo2 from "../assets/photo-1551288049-bebda4e38f71.jpg";
import photo3 from "../assets/photo-1531403009284-440f080d1e12.jpg";

interface RawBadge {
  id: string;
  name: string;
  imageUrl: string;
  markdown: string;
}

export default function App() {
  // State: Markdown editor content
  const [markdown, setMarkdown] = useState<string>(README_TEMPLATES[0].content);
  const [markdownHistoryPast, setMarkdownHistoryPast] = useState<string[]>([]);
  const [markdownHistoryFuture, setMarkdownHistoryFuture] = useState<string[]>([]);
  
  // State: Active sidebar tab
  const [activeTab, setActiveTab] = useState<"toolbox" | "workspace" | "templates">("toolbox");
  
  // State: Is Sidebar open or closed (Hide/Show Slide bar)
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  
  // Hide sidebar by default on mobile devices, but keep desktop open
  useEffect(() => {
    if (window.innerWidth < 640) {
      setIsSidebarOpen(false);
    }
  }, []);
  
  // State: Preview style theme (GitHub Light vs GitHub Dark)
  const [previewTheme, setPreviewTheme] = useState<"light" | "dark">("light");

  // State: Selected / Active Virtual File for detail modal/drawer
  const [activeWorkspaceFile, setActiveWorkspaceFile] = useState<WorkspaceFile | null>(null);
  const [viewingFileId, setViewingFileId] = useState<string | null>(null);
  
  // State: Notification messages
  const [notification, setNotification] = useState<{ message: string; type: "success" | "info" } | null>(null);
  
  // State: Interactive Sync Scroll toggling
  const [syncScroll, setSyncScroll] = useState<boolean>(true);

  // Scroll Container Refs for side-by-side synchronized scroll experience
  const editorContainerRef = useRef<HTMLTextAreaElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingEditor = useRef<boolean>(false);
  const isScrollingPreview = useRef<boolean>(false);
  
  // Responsive split state (percentage for first panel)
  const [splitPercent, setSplitPercent] = useState<number>(50);
  const mainRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef<boolean>(false);

  // Synchronized scroll handlers
  const handleEditorScroll = () => {
    if (!syncScroll || !editorContainerRef.current || !previewContainerRef.current) return;
    if (isScrollingPreview.current) {
      isScrollingPreview.current = false;
      return;
    }
    isScrollingEditor.current = true;
    
    const textarea = editorContainerRef.current;
    const preview = previewContainerRef.current;
    
    const scrollPercentage = textarea.scrollTop / (textarea.scrollHeight - textarea.clientHeight);
    preview.scrollTop = scrollPercentage * (preview.scrollHeight - preview.clientHeight);
  };

  const handlePreviewScroll = () => {
    if (!syncScroll || !editorContainerRef.current || !previewContainerRef.current) return;
    if (isScrollingEditor.current) {
      isScrollingEditor.current = false;
      return;
    }
    isScrollingPreview.current = true;
    
    const textarea = editorContainerRef.current;
    const preview = previewContainerRef.current;
    
    const scrollPercentage = preview.scrollTop / (preview.scrollHeight - preview.clientHeight);
    textarea.scrollTop = Math.round(scrollPercentage * (textarea.scrollHeight - textarea.clientHeight));
  };

  // State: Preset Badge Creator tools
  const [badgeForm, setBadgeForm] = useState<BadgeCreator>({
    label: "build",
    message: "passing",
    color: "3b82f6",
    style: "for-the-badge"
  });

  // State: Selected Tech Icons configuration for Tech Stack generator
  const [selectedTechs, setSelectedTechs] = useState<TechIcon[]>([
    TECH_ICONS[0], // React
    TECH_ICONS[6], // Tailwind CSS
    TECH_ICONS[7], // TypeScript
    TECH_ICONS[10] // Node.js
  ]);

  // State: Interactive Custom Image Tool
  const [imageUrlForm, setImageUrlForm] = useState({
    url: "assets/photo-1618005182384-a83a8bd57fbe.jpg",
    alt: "Application Hero Dashboard Mockup",
    align: "center",
    width: "100%",
    rounded: "lg"
  });

  // State: Interactive Custom Button Tool
  const [buttonForm, setButtonForm] = useState({
    type: "vercel", // vercel, netlify, custom, coffee
    label: "View Documentation",
    url: "https://github.com/",
    color: "000000",
    icon: "github"
  });

  // State: Interactive Link Helper
  const [linkForm, setLinkForm] = useState({
    title: "Visit Official Website",
    url: "https://example.com",
    isExternalIcon: true
  });

  // State: Interactive SemVer Version Control tool
  const [projectVersion, setProjectVersion] = useState<string>("1.2.0");
  const [versionStatus, setVersionStatus] = useState<string>("Stable Release");

  // State: Searchable raw badge list
  const [badgeSearchQuery, setBadgeSearchQuery] = useState<string>("");

  const parsedRawBadges = useMemo<RawBadge[]>(() => {
    const badges: RawBadge[] = [];
    const regex = /!\[(.*?)\]\((.*?)\)/g;
    let match;

    while ((match = regex.exec(RAW_BADGES_DATA)) !== null) {
      const [, name, imageUrl] = match;
      badges.push({
        id: name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        name,
        imageUrl,
        markdown: match[0]
      });
    }

    return badges;
  }, []);

  // State: Local Virtual Workspace files (Simulated file tree with editable contents)
  const [workspaceFiles, setWorkspaceFiles] = useState<WorkspaceFile[]>([
    { 
      id: "1", 
      name: "package.json", 
      path: "package.json", 
      isFolder: false, 
      parentId: null, 
      content: `{
  "name": "hyper-react-engine",
  "version": "1.2.0",
  "description": "High performance state-synchronizer and layout renderer",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "motion": "^12.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "tailwindcss": "^4.0.0"
  }
}` 
    },
    { 
      id: "2", 
      name: "src", 
      path: "src", 
      isFolder: true, 
      parentId: null, 
      content: "" 
    },
    { 
      id: "3", 
      name: "main.tsx", 
      path: "src/main.tsx", 
      isFolder: false, 
      parentId: "2", 
      content: `import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);` 
    },
    { 
      id: "4", 
      name: "App.tsx", 
      path: "src/App.tsx", 
      isFolder: false, 
      parentId: "2", 
      content: `export default function App() {
  return (
    <div className="p-8 text-center bg-slate-900 text-white min-h-screen">
      <h1 className="text-3xl font-extrabold text-blue-400">Welcome to Hyper Engine</h1>
      <p className="mt-2 text-slate-400">Real-time reactive renderer configured successfully.</p>
    </div>
  );
}` 
    },
    { 
      id: "5", 
      name: "assets", 
      path: "assets", 
      isFolder: true, 
      parentId: null, 
      content: "" 
    },
    { 
      id: "6", 
      name: "dashboard-mockup.png", 
      path: "assets/dashboard-mockup.png", 
      isFolder: false, 
      parentId: "5", 
      content: "IMAGE_MOCK_DATA_URL:assets/photo-1551288049-bebda4e38f71.jpg" 
    }
  ]);

  // State: Add File popup form values
  const [newFileName, setNewFileName] = useState<string>("");
  const [newFileContent, setNewFileContent] = useState<string>("");
  const [newFileParent, setNewFileParent] = useState<string>("root");
  const [newFileIsFolder, setNewFileIsFolder] = useState<boolean>(false);
  const [workspaceInputExpanded, setWorkspaceInputExpanded] = useState<boolean>(false);

  // Quick Flash Alert notifier helper
  const closeNotification = () => {
    setNotification(null);
  };

  const triggerNotification = (message: string, type: "success" | "info" = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const updateMarkdown = (nextMarkdown: string, pushHistory = true) => {
    setMarkdown((prevMarkdown) => {
      if (prevMarkdown === nextMarkdown) return prevMarkdown;
      if (pushHistory) {
        setMarkdownHistoryPast((past) => [...past, prevMarkdown]);
        setMarkdownHistoryFuture([]);
      }
      return nextMarkdown;
    });
  };

  const undoMarkdown = () => {
    setMarkdownHistoryPast((past) => {
      if (past.length === 0) return past;
      const previous = past[past.length - 1];
      setMarkdownHistoryFuture((future) => [markdown, ...future]);
      setMarkdown(previous);
      return past.slice(0, -1);
    });
  };

  const redoMarkdown = () => {
    setMarkdownHistoryFuture((future) => {
      if (future.length === 0) return future;
      const next = future[0];
      setMarkdownHistoryPast((past) => [...past, markdown]);
      setMarkdown(next);
      return future.slice(1);
    });
  };

  // Switch template contents
  const loadTemplate = (templateContent: string, templateName: string) => {
    updateMarkdown(templateContent);
    triggerNotification(`Adding: ${templateName}`, "info");
  };

  // Append markdown helper at the current cursor selection point
  const insertAtCursor = (textToInsert: string) => {
    const textarea = editorContainerRef.current;
    if (!textarea) {
      setMarkdown(prev => prev + "\n" + textToInsert);
      return;
    }
    
    // Save current scroll positions to prevent page/container jumping
    const currentScrollTop = textarea.scrollTop;
    const previewScrollTop = previewContainerRef.current ? previewContainerRef.current.scrollTop : null;

    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const textBefore = markdown.substring(0, startPos);
    const textAfter = markdown.substring(endPos);
    
    updateMarkdown(textBefore + textToInsert + textAfter);
    
    // Resume focus and restore scroll positions
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = startPos + textToInsert.length;
      textarea.selectionEnd = startPos + textToInsert.length;
      
      // Restore scroll positions exactly where they were
      textarea.scrollTop = currentScrollTop;
      if (previewContainerRef.current && previewScrollTop !== null) {
        previewContainerRef.current.scrollTop = previewScrollTop;
      }
    }, 50);
  };

  // --- Insertion Helper Actions ---
  const addBadgePreset = () => {
    const badgeMarkdown = `![${badgeForm.label}](https://img.shields.io/badge/${encodeURIComponent(badgeForm.label)}-${encodeURIComponent(badgeForm.message)}-${badgeForm.color}?style=${badgeForm.style})`;
    insertAtCursor(badgeMarkdown);
    triggerNotification("Inserted successfully!");
  };

  const addTechStackBadges = () => {
    if (selectedTechs.length === 0) return;
    const badgeLines = selectedTechs.map(tech => {
      const label = encodeURIComponent(tech.name);
      const color = encodeURIComponent(tech.color.replace(/^#/, ""));
      const logo = encodeURIComponent(tech.slug);
      const src = `https://img.shields.io/badge/${label}-%23${color}.svg?style=for-the-badge&logo=${logo}&logoColor=white`;
      return `<a href="#" target="_blank" rel="noopener noreferrer"><img src="${src}" alt="${tech.name} badge" style="height:28px;margin:4px;vertical-align:middle;" /></a>`;
    }).join("\n");

    const wrapper = `\n<div align="center">\n  ${badgeLines}\n</div>\n`;
    insertAtCursor(wrapper);
    triggerNotification("Tech Stack Grid inserted!");
  };

  const toggleSelectTechIcon = (tech: TechIcon) => {
    if (selectedTechs.some(t => t.slug === tech.slug)) {
      setSelectedTechs(prev => prev.filter(t => t.slug !== tech.slug));
    } else {
      setSelectedTechs(prev => [...prev, tech]);
    }
  };

  const addInstallationPreset = () => {
    const code = `\n## 🛠️ Installation & Setup

Follow these streamlined instructions to clone and run the project locally:

### Prerequisites
- **Node.js** (v18.0.0 or higher is recommended)
- **npm** or **yarn** package manager

### 1. Acquire the Repository
\`\`\`bash
git clone https://github.com/your-username/my-awesome-project.git
cd my-awesome-project
\`\`\`

### 2. Configure Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Establish Local Environment Variables
Create a \`.env\` file in the root folder and configure:
\`\`\`env
PORT=3000
DATABASE_URL=your-database-connection-url
\`\`\`

### 4. Boot Up Local Development Server
\`\`\`bash
npm run dev
\`\`\`
`;
    insertAtCursor(code);
    triggerNotification("Installation Guide appended!");
  };

  const addFeaturesGridPreset = () => {
    const gridBlock = `\n## ✨ Awesome Highlighted Features

Our application workspace provides high-density features ready for enterprise scaling:

| Feature | Advantage | Tech Stack |
| :--- | :--- | :--- |
| **⚡ Ultra Latency** | Optimized algorithms resolve UI rendering changes in less than 2ms. | React 19 + custom state core |
| **🔒 High Security** | Continuous network validation with integrated security tokens. | AES-256 + TLS 1.3 protocol |
| **📂 Virtual Repository** | Dynamic file directory hierarchy layout mapping. | Unified responsive layout |
| **📈 Metrics Visualization** | High contrast graphs with real-time word counters. | Lucid-react integration |
`;
    insertAtCursor(gridBlock);
    triggerNotification("Features Grid component inserted!");
  };

  const addCodeSnippetPreset = () => {
    const snippet = `\n## 📦 Implementation Syntax

Easily import and launch the high-density rendering engine in your application scope:

\`\`\`typescript
import { createEngine, RenderTunnel } from 'hyper-react-engine';

// Configure the engine parameters
const engine = createEngine({
  port: 3000,
  syncToken: '0x0D1117',
  debugMode: true
});

engine.on('stateChange', (updatedPayload) => {
  console.log('Synchronized State Update Received:', updatedPayload);
});

await engine.broadcast('INIT_BOOTSTRAP_SEQUENCE');
\`\`\`
`;
    insertAtCursor(snippet);
    triggerNotification("Code Snippet inserted!");
  };

  const addCalloutPreset = () => {
    const block = `\n> [!NOTE]\n> **Dynamic Information Indicator**: Customize this notification or warning dialog with your specific context details. Standard GitHub styling supports \`[!NOTE]\`, \`[!TIP]\`, \`[!IMPORTANT]\`, \`[!WARNING]\`, and \`[!CAUTION]\` tags.\n`;
    insertAtCursor(block);
    triggerNotification("Callout Alert block inserted!");
  };

  const addRoadmapPreset = () => {
    const block = `\n## 🗺️ Project Roadmap & Mileposts\n\n- [x] **Phase 1: Foundation Setup**: Repository layout, workspace mapping, and responsive rendering established.\n- [ ] **Phase 2: Scalability Optimization**: Dynamic memory allocation and near-zero latency streaming.\n- [ ] **Phase 3: Multi-Platform Compatibility**: Native desktop wrappers and mobile companion synchronization.\n`;
    insertAtCursor(block);
    triggerNotification("Roadmap Checklist block inserted!");
  };

  const addAPITablePreset = () => {
    const block = `\n## 🔌 API Gateway Configuration Matrix\n\n| Variable Parameter | Type | Default Value | Functional Role / Purpose |\n| :--- | :--- | :--- | :--- |\n| \`PORT\` | Number | \`3000\` | Sets the local HTTP listening socket |\n| \`SYNC_INTERVAL_MS\` | Number | \`1000\` | Throttle rate for real-time synchronization updates |\n| \`ENABLE_TLS\` | Boolean | \`true\` | Forces secure client payload tunneling |\n| \`API_KEY\` | Secret String | \`none\` | Authorizes request payloads in production environment |\n`;
    insertAtCursor(block);
    triggerNotification("API Config Matrix inserted!");
  };

  const addFAQSectionPreset = () => {
    const block = `\n## ❓ Frequently Asked Questions\n\n<details>\n  <summary><b>Is this repository secure for production deployment?</b></summary>\n  <p>Absolutely. The architecture is configured from scratch with standard TLS 1.3 encryption tunnels and tenant isolation protocols.</p>\n</details>\n\n<details>\n  <summary><b>Can I synchronize my local repository files automatically?</b></summary>\n  <p>Yes. The integrated Local Files tree allows real-time project workspace analysis and compilation.</p>\n</details>\n`;
    insertAtCursor(block);
    triggerNotification("Interactive FAQ block inserted!");
  };

  const addCustomImagePreset = () => {
    let imgCode = "";
    if (imageUrlForm.align === "center") {
      imgCode = `\n<div align="center">\n  <img src="${imageUrlForm.url}" alt="${imageUrlForm.alt}" width="${imageUrlForm.width}" style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" />\n</div>\n`;
    } else {
      imgCode = `\n![${imageUrlForm.alt}](${imageUrlForm.url})\n`;
    }
    insertAtCursor(imgCode);
    triggerNotification("Custom image markdown appended!");
  };

  const addCustomButtonPreset = () => {
    let buttonCode = "";
    if (buttonForm.type === "vercel") {
      buttonCode = `[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)`;
    } else if (buttonForm.type === "netlify") {
      buttonCode = `[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy)`;
    } else if (buttonForm.type === "coffee") {
      buttonCode = `[![Buy Me A Coffee](https://img.shields.io/badge/Buy_Me_A_Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/)`;
    } else {
      buttonCode = `[![${buttonForm.label}](https://img.shields.io/badge/${encodeURIComponent(buttonForm.label)}-%23${buttonForm.color}.svg?style=for-the-badge&logo=${buttonForm.icon}&logoColor=white)](${buttonForm.url})`;
    }
    insertAtCursor(`\n${buttonCode}\n`);
    triggerNotification("Styled Action Button added!");
  };

  const addCustomLinkPreset = () => {
    const linkCode = `[${linkForm.title}](${linkForm.url})${linkForm.isExternalIcon ? " 🔗" : ""}`;
    insertAtCursor(linkCode);
    triggerNotification("Hyperlink added!");
  };

  const insertRawBadge = (badge: RawBadge) => {
    insertAtCursor(`\n${badge.markdown}\n`);
  };

  const generateUniqueId = (): string => Math.random().toString(36).substring(2, 9);

  const isTextFileName = (fileName: string): boolean => /\.(txt|md|json|js|ts|tsx|jsx|css|html|xml|yaml|yml|sh|py|go|rs|java|c|cpp|h|ini|conf|env|env\.example|lock)$/i.test(fileName);

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const isImage = /\.(png|jpg|jpeg|gif|svg|webp)$/i.test(file.name);
      const readCallback = (event: ProgressEvent<FileReader>) => {
        const result = event.target?.result;
        if (typeof result === "string") {
          resolve(isImage ? `IMAGE_MOCK_DATA_URL:${result}` : result);
        } else {
          reject(new Error("Unsupported file format"));
        }
      };
      reader.onload = readCallback;
      reader.onerror = () => reject(new Error("Failed to read file"));

      if (isImage || !isTextFileName(file.name)) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    });
  };

  const collectFilesFromDataTransferItems = async (items: DataTransferItemList): Promise<File[]> => {
    const fileList: File[] = [];

    const traverseEntry = async (entry: any, pathPrefix = ""): Promise<void> => {
      if (!entry) return;
      if (entry.isFile) {
        await new Promise<void>(resolve => {
          entry.file((file: File) => {
            (file as any).webkitRelativePath = `${pathPrefix}${file.name}`;
            fileList.push(file);
            resolve();
          });
        });
      } else if (entry.isDirectory) {
        const reader = entry.createReader();
        await new Promise<void>(resolve => {
          reader.readEntries(async (entries: any[]) => {
            if (!entries || entries.length === 0) {
              resolve();
              return;
            }
            for (const childEntry of entries) {
              await traverseEntry(childEntry, `${pathPrefix}${entry.name}/`);
            }
            resolve();
          });
        });
      }
    };

    const promises = Array.from(items).map(async (item) => {
      const entry = item.webkitGetAsEntry?.();
      if (entry) {
        await traverseEntry(entry);
        return;
      }
      const file = item.getAsFile();
      if (file) {
        fileList.push(file);
      }
    });

    await Promise.all(promises);
    return fileList;
  };

  const addUploadedFilesToWorkspace = async (files: File[]) => {
    if (files.length === 0) return;

    const currentFiles = [...workspaceFiles];
    const folderMap = new Map<string, string>(currentFiles.filter(f => f.isFolder).map(f => [normalizePath(f.path), f.id]));

    const ensureFolderNode = (folderPath: string): string | null => {
      const normalized = normalizePath(folderPath);
      if (!normalized) return null;

      const segments = normalized.split("/");
      let parentId: string | null = null;
      let currentPath = "";

      for (const segment of segments) {
        currentPath = currentPath ? `${currentPath}/${segment}` : segment;
        if (folderMap.has(currentPath)) {
          parentId = folderMap.get(currentPath)!;
          continue;
        }

        const folderId = generateUniqueId();
        const folderNode: WorkspaceFile = {
          id: folderId,
          name: segment,
          path: currentPath,
          isFolder: true,
          parentId,
          content: ""
        };
        currentFiles.push(folderNode);
        folderMap.set(currentPath, folderId);
        parentId = folderId;
      }

      return parentId;
    };

    const newNodes: WorkspaceFile[] = [];

    for (const file of files) {
      const pathSource = (file as any).webkitRelativePath || file.name;
      const normalizedPath = normalizePath(pathSource);
      const pathParts = normalizedPath.split("/");
      const fileName = pathParts.pop() || file.name;
      const folderSegmentPath = pathParts.join("/");
      const parentId = folderSegmentPath ? ensureFolderNode(folderSegmentPath) : null;
      const fileContent = await readFileContent(file);

      const fileNode: WorkspaceFile = {
        id: generateUniqueId(),
        name: fileName,
        path: normalizedPath,
        content: fileContent,
        isFolder: false,
        parentId
      };
      newNodes.push(fileNode);
    }

    setWorkspaceFiles(recomputeWorkspacePaths([...currentFiles, ...newNodes]));
    triggerNotification(`Imported ${newNodes.length} ${newNodes.length === 1 ? "item" : "items"}.`, "success");
  };

  const handleUploadedFiles = async (files: FileList | File[]) => {
    const items = Array.from(files as any as File[]);
    if (items.length === 0) return;
    await addUploadedFilesToWorkspace(items);
  };

  const handleUploaderDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      const files = await collectFilesFromDataTransferItems(e.dataTransfer.items);
      if (files.length > 0) {
        await addUploadedFilesToWorkspace(files);
        return;
      }
    }

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await addUploadedFilesToWorkspace(Array.from(e.dataTransfer.files));
    }
  };

  const handleUploadedFile = (file: File) => {
    handleUploadedFiles([file]);
  };

  const resolveWorkspaceImageSource = (file: WorkspaceFile): string | null => {
    if (!file || file.isFolder) return null;
    if (file.content.startsWith("IMAGE_MOCK_DATA_URL:")) {
      return file.content.replace("IMAGE_MOCK_DATA_URL:", "").trim();
    }
    if (file.content.startsWith("data:") || /^https?:\/\//i.test(file.content)) {
      return file.content.trim();
    }
    return null;
  };

  // SemVer Version Control and Release Logs
  const triggerIncrementVersion = (type: "patch" | "minor" | "major") => {
    const parts = projectVersion.split(".").map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) {
      triggerNotification("Invalid SemVer code format.", "info");
      setProjectVersion("1.0.0");
      return;
    }
    if (type === "patch") parts[2] += 1;
    if (type === "minor") {
      parts[1] += 1;
      parts[2] = 0;
    }
    if (type === "major") {
      parts[0] += 1;
      parts[1] = 0;
      parts[2] = 0;
    }
    const newVer = parts.join(".");
    setProjectVersion(newVer);
    triggerNotification(`Version to ${newVer}!`, "success");
  };

  const insertVersionShield = () => {
    const badge = `[![Version](https://img.shields.io/badge/version-${projectVersion}-blue.svg?style=flat-square)](https://github.com/)\n[![Status](https://img.shields.io/badge/status-${encodeURIComponent(versionStatus)}-green.svg?style=flat-square)](https://github.com/)`;
    insertAtCursor(badge);
    triggerNotification("Project Version Shields inserted!");
  };

  const insertChangelogSnippet = () => {
    const today = new Date().toISOString().split("T")[0];
    const snippet = `\n## 📋 Release Changelog

### 🚀 Version ${projectVersion} (${today})
* **[${versionStatus}]** Integrated core multi-scrolling rendering framework.
* **Feature**: Added custom live workspace repository nodes for graphic previews.
* **Optimization**: Enhanced UI visual styling matching high density design specifications.
* **Fix**: Patched scroll offsets on rapid window layout switches.
`;
    insertAtCursor(snippet);
    triggerNotification("Structured Release Changelog added!");
  };

  // Generate directory tree structures client-side dynamically
  const generateWorkspaceTreeString = (): string => {
    let result = "```\n";
    result += "my-awesome-project/\n";
    
    const rootFiles = workspaceFiles.filter(f => f.parentId === null);
    
    const printNode = (file: WorkspaceFile, prefix: string, isLast: boolean) => {
      const marker = isLast ? "└── " : "├── ";
      result += `${prefix}${marker}${file.name}${file.isFolder ? "/" : ""}\n`;
      
      if (file.isFolder) {
        const children = workspaceFiles.filter(f => f.parentId === file.id);
        children.forEach((child, index) => {
          printNode(child, prefix + (isLast ? "    " : "│   "), index === children.length - 1);
        });
      }
    };

    rootFiles.forEach((file, index) => {
      printNode(file, "", index === rootFiles.length - 1);
    });

    result += "```";
    return result;
  };

  const insertWorkspaceTreePreset = () => {
    const treeString = `\n## 📂 System Project Structure

Here is a visual map of the workspace modules in this simulated repository:

${generateWorkspaceTreeString()}
`;
    insertAtCursor(treeString);
    triggerNotification("Injected simulated file hierarchy map!");
  };

  // Dynamic CLIENT-SIDE "Instant Repo Compiler" that parses package.json and file list (No AI model requested)
  const compileWorkspaceDocsClientSide = () => {
    // 1. Try to parse metadata from simulated package.json
    let projName = "My Awesome App";
    let projDesc = "High performance solution built on advanced developer toolsets.";
    let projDeps: string[] = [];
    let projScripts: { [key: string]: string } = {};

    const packageJsonFile = workspaceFiles.find(f => f.name === "package.json");
    if (packageJsonFile && packageJsonFile.content) {
      try {
        const parsed = JSON.parse(packageJsonFile.content);
        if (parsed.name) projName = parsed.name.replace(/-/g, " ");
        if (parsed.description) projDesc = parsed.description;
        if (parsed.dependencies) {
          projDeps = Object.keys(parsed.dependencies);
        }
        if (parsed.scripts) {
          projScripts = parsed.scripts;
        }
      } catch (e) {
        console.warn("Could not parse package.json for client-side auto-compile.", e);
      }
    }

    // 2. Map file counts
    const foldersCount = workspaceFiles.filter(f => f.isFolder).length;
    const filesCount = workspaceFiles.filter(f => !f.isFolder).length;

    // 3. Formulate the masterpiece README.md client-side
    const today = new Date().toISOString().split("T")[0];
    const generatedMarkdown = `# 🚀 ${projName.toUpperCase()}

<div align="center">
  <img src="{photo1}" alt="${projName} Logo" width="140" style="border-radius: 20%;" />
  <h3>${projDesc}</h3>
  <p>Providing pristine reactive pipelines, optimized package dependencies, and robust environment setups.</p>

  [![Version](https://img.shields.io/badge/version-${projectVersion}-blue.svg?style=for-the-badge)](https://github.com/)
  [![Status](https://img.shields.io/badge/status-${encodeURIComponent(versionStatus)}-green.svg?style=for-the-badge)](https://github.com/)
  [![License](https://img.shields.io/badge/license-MIT-purple.svg?style=for-the-badge)](https://github.com/)
</div>

---

## ⚡ Key Highlights
- **⚡ Supercharged State Pipeline**: Dynamic reactivity model with extremely small visual bundle overhead.
- **📂 Clean Hierarchical Repository**: Comprises **${foldersCount} folders** and **${filesCount} structured files** ready for deployment.
- **🛡️ Secure TLS Encryption**: Automatic cryptographic handshakes for state transfers.

---

## 📂 System Project Structure

Here is a visual map of the files in this simulated repository:

${generateWorkspaceTreeString()}

---

## 🛠️ Installation & Setup Guide

### Prerequisites
- Make sure you have **Node.js v18+** installed in your host container.

### 1. Acquire Workspace Repository
\`\`\`bash
git clone https://github.com/your-username/${projName.toLowerCase().replace(/\s+/g, "-")}.git
cd ${projName.toLowerCase().replace(/\s+/g, "-")}
\`\`\`

### 2. Configure Node Modules
\`\`\`bash
npm install
\`\`\`

${Object.keys(projScripts).length > 0 ? `### 3. Integrated Package Scripts

Run any of the pre-configured scripts inside the workspace:
${Object.entries(projScripts).map(([key, cmd]) => `- **${key}**: \`npm run ${key}\` *(launches \`${cmd}\`)*`).join("\n")}
` : `### 3. Development Launch
\`\`\`bash
npm run dev
\`\`\`
`}

---

## 🗃️ Built With

We utilized high performance technology coordinates to bootstrap this repository:
${projDeps.length > 0 ? projDeps.map(dep => `- **${dep}** - Core functional library integration`).join("\n") : `
- **React 19** - Component logic rendering
- **Tailwind CSS v4** - High density layout styling
- **TypeScript** - Strict runtime security typing
`}

---

## 📋 Release Changelog
### 🚀 Version ${projectVersion} (${today})
* **Initial Release**: Packaged the core rendering pipeline.
* **Repository Layout**: Visual file tree synchronization established.

---

## 🤝 Contributing
Contributions, issue reports, and visual optimization requests are welcome! Feel free to review our pull request guidelines.

---

## 📜 License & Citation
Distributed under the **MIT License**. Created by Raj Prajapati.
`;

    setMarkdown(generatedMarkdown);
    triggerNotification("Compilling Workspace!", "success");
  };

  // Manage Simulated Files List
  const addNewVirtualFile = () => {
    if (!newFileName.trim()) return;
    const parentVal = newFileParent === "root" ? null : newFileParent;
    const generatedPath = parentVal 
      ? `${workspaceFiles.find(f => f.id === parentVal)?.path}/${newFileName.trim()}`
      : newFileName.trim();

    // Determine type by extension
    const isImage = /\.(png|jpg|jpeg|gif|svg|webp)$/i.test(newFileName);
    const contentPlaceholder = isImage 
      ? `IMAGE_MOCK_DATA_URL:assets/photo-1531403009284-440f080d1e12.jpg`
      : newFileContent || `// Contents of ${newFileName}\n// Add code or details here.`;

    const newFile: WorkspaceFile = {
      id: Math.random().toString(36).substring(2, 9),
      name: newFileName.trim(),
      path: generatedPath,
      content: contentPlaceholder,
      isFolder: newFileIsFolder,
      parentId: parentVal
    };

    setWorkspaceFiles(prev => recomputeWorkspacePaths([...prev, newFile]));
    setNewFileName("");
    setNewFileContent("");
    setNewFileIsFolder(false);
    setWorkspaceInputExpanded(false);
    triggerNotification(`Added "${newFile.name}"!`);
  };

  const deleteVirtualFile = (id: string, name: string) => {
    setWorkspaceFiles(prev => recomputeWorkspacePaths(prev.filter(f => f.id !== id && f.parentId !== id)));
    triggerNotification(`Deleted "${name}"`);
    if (viewingFileId === id) {
      setViewingFileId(null);
      setActiveWorkspaceFile(null);
    }
  };

  // File Opened for Viewing and Editing (Task 5: "open and view inside simulated folder")
  const openVirtualFileForViewing = (file: WorkspaceFile) => {
    // On mobile, hide the left slidebar when opening a file for focused viewing
    if (window.innerWidth < 640) {
      setIsSidebarOpen(false);
    }

    setActiveWorkspaceFile({ ...file });
    setViewingFileId(file.id);
  };

  const saveVirtualFileContent = () => {
    if (!activeWorkspaceFile) return;
    setWorkspaceFiles(prev => recomputeWorkspacePaths(prev.map(f => {
      if (f.id === activeWorkspaceFile.id) {
        return { ...f, content: activeWorkspaceFile.content, name: activeWorkspaceFile.name };
      }
      return f;
    })));
    triggerNotification(`Saved changes to "${activeWorkspaceFile.name}"!`, "success");
    setViewingFileId(null);
    setActiveWorkspaceFile(null);

    // After saving, re-open the slidebar on mobile so user can continue navigating
    if (window.innerWidth < 640) {
      setIsSidebarOpen(true);
    }
  };

  // Copy raw content to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdown);
    triggerNotification("README is Copping....", "success");
  };

  // Download raw README.md file
  const downloadReadmeFile = () => {
    const element = document.createElement("a");
    const file = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = "README.md";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    triggerNotification("README.md is Downloading....");
  };

  const normalizePath = (rawPath: string): string => rawPath.replace(/^(?:\.\/|\/)+/, "");

  const recomputeWorkspacePaths = (files: WorkspaceFile[]): WorkspaceFile[] => {
    const fileMap = new Map(files.map(file => [file.id, file]));

    const computePath = (file: WorkspaceFile, visited = new Set<string>()): string => {
      if (!file.parentId) return file.name;
      if (visited.has(file.id)) return file.name;
      visited.add(file.id);
      const parent = fileMap.get(file.parentId);
      if (!parent) return file.name;
      return `${computePath(parent, visited)}/${file.name}`;
    };

    return files.map(file => ({ ...file, path: computePath(file) }));
  };

  const findWorkspaceFileByPath = (path?: string | null): WorkspaceFile | null => {
    if (!path) return null;
    const normalizedTarget = normalizePath(path);
    return workspaceFiles.find(file => normalizePath(file.path) === normalizedTarget) || null;
  };

  const resolveMarkdownContent = (rawMarkdown: string): string => {
    return rawMarkdown || "";
  };

  const renderMarkdownLink = ({ href, children, ...props }: any) => {
    const linkedFile = findWorkspaceFileByPath(href);
    if (linkedFile) {
      return (
        <a
          href="#"
          onClick={(event) => {
            event.preventDefault();
            openVirtualFileForViewing(linkedFile);
          }}
          className="text-blue-500 hover:underline"
          {...props}
        >
          {children}
        </a>
      );
    }

    return (
      <a href={href ?? "#"} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  };

  const renderMarkdownImage = ({ src, alt, ...props }: any) => {
    const linkedFile = findWorkspaceFileByPath(src);
    if (linkedFile) {
      const imageSrc = resolveWorkspaceImageSource(linkedFile);
      if (imageSrc) {
        return <img src={imageSrc} alt={alt || linkedFile.name} {...props} />;
      }
    }
    return <img src={src} alt={alt} {...props} />;
  };

  const renderWorkspaceFileNodes = (parentId: string | null, depth = 0): JSX.Element[] => {
    return workspaceFiles
      .filter(file => file.parentId === parentId)
      .sort((a, b) => {
        if (a.isFolder === b.isFolder) return a.name.localeCompare(b.name);
        return a.isFolder ? -1 : 1;
      })
      .map(file => {
        const isImage = file.content.startsWith("IMAGE_MOCK_DATA_URL:") || /\.(png|jpg|jpeg|gif|svg|webp)$/i.test(file.name);
        return (
          <div key={file.id}>
            <div
              className="group flex items-center justify-between p-1.5 rounded bg-[#0D1117]/65 border border-transparent hover:border-[#30363D] hover:bg-[#1e232b] transition-all"
              style={{ paddingLeft: `${depth * 12}px` }}
            >
              <button
                onClick={() => openVirtualFileForViewing(file)}
                className="flex items-center gap-2 truncate text-left flex-1 cursor-pointer"
                title="Click to Open and View file"
              >
                {file.isFolder ? (
                  <Folder className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20 shrink-0" />
                ) : isImage ? (
                  <ImageIcon className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                ) : (
                  <File className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                )}
                <div className="text-xs truncate">
                  <span className="text-white font-medium group-hover:text-blue-400 transition-colors">{file.name}</span>
                  <span className="text-[10px] text-[#8B949E] ml-1.5">({file.path})</span>
                </div>
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openVirtualFileForViewing(file)}
                  className="text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all p-0.5 text-[10px] font-bold"
                  title="Open Viewer Window"
                >
                  View
                </button>
                <button
                  onClick={() => deleteVirtualFile(file.id, file.name)}
                  className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-0.5 cursor-pointer"
                  title="Delete file node"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
            {file.isFolder && renderWorkspaceFileNodes(file.id, depth + 1)}
          </div>
        );
      });
  };

  // --- Resizer handlers (pointer events unified for mouse/touch)
  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      if (!draggingRef.current || !mainRef.current) return;
      const rect = mainRef.current.getBoundingClientRect();
      const isColumn = window.matchMedia('(max-width: 639px)').matches;
      let percent = splitPercent;
      if (isColumn) {
        const y = e.clientY - rect.top;
        percent = (y / rect.height) * 100;
      } else {
        const x = e.clientX - rect.left;
        percent = (x / rect.width) * 100;
      }
      if (percent < 10) percent = 10;
      if (percent > 90) percent = 90;
      setSplitPercent(percent);
    };

    const onPointerUp = () => {
      draggingRef.current = false;
      document.body.style.userSelect = "auto";
      document.body.style.touchAction = "auto";
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [splitPercent]);

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0D1117] text-[#C9D1D9] font-sans overflow-hidden select-none">
      
      {/* Top Banner & Main Controls */}
      <header className="h-12 border-b border-[#30363D] flex items-center justify-between px-5 bg-[#161B22] shrink-0 z-10 shadow-lg">
        <div className="flex items-center gap-3">
          {/* Sidebar Toggle Trigger */}
<button 
  onClick={() => setIsSidebarOpen(prev => !prev)}
  className="p-1.5 hover:bg-[#21262D] hover:text-white rounded-md border border-[#30363D] transition-all cursor-pointer flex items-center gap-1 text-[#8B949E] whitespace-nowrap"
  title={isSidebarOpen ? "Collapse sidebar panel" : "Expand sidebar panel"}
>
  {/* Chevrons show ONLY on desktop/tablet */}
  <span className="hidden sm:inline">
    {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
  </span>

  {/* Panels show ONLY on mobile */}
  <span className="text-[10px] font-bold uppercase tracking-wider inline sm:hidden">
    {isSidebarOpen ? <PanelRightOpen className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
  </span>
</button>

          <div className="w-px h-6 bg-[#30363D]"></div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center text-white text-xs font-black shadow-inner">
              M↓
            </div>
            <div>
              <h1 className="text-sm hidden md:block font-bold text-white tracking-tight flex items-center gap-2">
                README.md Creator
              </h1>
              <p className="text-[10px] text-[#8B949E] hidden md:block">Real-time side-by-side workspace & version log configurator</p>
            </div>
          </div>
        </div>

        {/* Status indicator / Live notifications */}
        <div className="flex items-center gap-4">
                          <button
                  onClick={undoMarkdown}
                  className="p-1 px-1.5 text-xs text-[#8B949E] hover:text-white rounded hover:bg-[#21262D] font-semibold cursor-pointer"
                  title="Undo editor change"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={redoMarkdown}
                  className="p-1 px-1.5 text-xs text-[#8B949E] hover:text-white rounded hover:bg-[#21262D] font-semibold cursor-pointer"
                  title="Redo editor change"
                >
                  <Redo2 className="w-3.5 h-3.5" />
                </button>

          <div className="flex items-center gap-2">
            {/* Sync Scroll Toggle */}
            <button 
              onClick={() => setSyncScroll(p => !p)} 
              title="Toggle Connected Synchronous Scrolling"
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded border transition-all cursor-pointer ${
                syncScroll 
                  ? "bg-blue-600/20 text-blue-400 border-blue-500/40" 
                  : "bg-[#21262D] text-[#8B949E] border-[#30363D] hover:text-white"
              }`}
            >
              <Sliders className="w-3 h-3" />
              <span className="hidden md:block">{syncScroll ? "Sync Scroll On" : "Sync Off"}</span>
            </button>
          </div>

          <div className="w-px h-6 bg-[#30363D]"></div>

          {/* Core file action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-[#21262D] border border-[#30363D] rounded-md hover:bg-[#30363D] active:translate-y-0.5 transition-all cursor-pointer"
              title="Copy markdown code to system clipboard"
            >
              <Copy className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Copy Raw</span>
            </button>

            <button
              onClick={downloadReadmeFile}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 border border-emerald-500 rounded-md hover:bg-emerald-500 active:translate-y-0.5 transition-all cursor-pointer shadow-lg"
              title="Download README.md direct to disk"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:block">Export File</span>
            </button>
          </div>
        </div>
      </header>

{notification && (
  <div className="fixed left-1/2 md:top-2 top-4 z-50 -translate-x-1/2 w-auto max-w-max px-4">
    <div className={`flex items-center gap-2 rounded-full border p-1.5 pl-3 pr-2 shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-all duration-300 ${
      notification.type === "success" 
        ? "bg-emerald-500/30 border-emerald-400/50 text-emerald-100" 
        : "bg-sky-500/30 border-sky-400/50 text-sky-100"
    }`}>
      <div className="flex-1 whitespace-nowrap">
        <p className="text-xs font-medium text-white/90">{notification.message}</p>
      </div>
      <button 
        onClick={closeNotification} 
        className="rounded-full p-1 text-slate-300 hover:bg-white/10 hover:text-white transition"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  </div>
)}

      {/* Main Content Pane Split */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* SIDEBAR: Slide-bar toolset panel with transition-all */}
        <aside
          className={`border-r border-[#30363D] bg-[#0D1117] flex flex-col shrink-0 transition-all duration-300 z-30
            ${isSidebarOpen ? "fixed inset-x-0 top-12 bottom-7 w-full sm:static sm:w-80" : "hidden sm:static sm:w-0 sm:overflow-hidden sm:border-r-0"}
          `}
        >
          {/* Navigation Category Tabs - AI Tab removed per "No AI model" */}
          <div className="grid grid-cols-3 border-b border-[#30363D] bg-[#161B22] text-[#8B949E] text-center shrink-0">
            <button
              onClick={() => setActiveTab("toolbox")}
              className={`py-3.5 text-[10px] uppercase font-black tracking-wider border-b-2 transition-all cursor-pointer ${
                activeTab === "toolbox" ? "border-blue-500 text-white bg-[#0D1117]" : "border-transparent hover:text-white hover:bg-[#161B22]"
              }`}
              title="Interactive Layout Components Builder"
            >
              Toolbox
            </button>
            <button
              onClick={() => setActiveTab("workspace")}
              className={`py-3.5 text-[10px] uppercase font-black tracking-wider border-b-2 transition-all cursor-pointer ${
                activeTab === "workspace" ? "border-blue-500 text-white bg-[#0D1117]" : "border-transparent hover:text-white hover:bg-[#161B22]"
              }`}
              title="Local Repository File Tree & Mock Viewer"
            >
              Local Files
            </button>
            <button
              onClick={() => setActiveTab("templates")}
              className={`py-3.5 text-[10px] uppercase font-black tracking-wider border-b-2 transition-all cursor-pointer ${
                activeTab === "templates" ? "border-blue-500 text-white bg-[#0D1117]" : "border-transparent hover:text-white hover:bg-[#161B22]"
              }`}
              title="Selectable Markdown Boilerplate Starter Kits"
            >
              Boilers
            </button>
          </div>

          {/* Interactive tabs scrollable panel */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            
            {/* TAB: TOOLBOX */}
            {activeTab === "toolbox" && (
              <div className="space-y-5">
                
                {/* 1. Quick Component Block Injectors */}
                <div className="space-y-2">
                  <h3 className="text-[10px] font-bold text-[#8B949E] uppercase tracking-wider flex items-center justify-between">
                    <span>Layout Block kits</span>
                    <span className="text-[9px] text-blue-500">Insert instantly</span>
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={addInstallationPreset}
                      className="group flex flex-col justify-between p-2.5 rounded-lg bg-[#161B22] border border-[#30363D] hover:border-blue-500/50 hover:bg-[#1e232b] text-left transition-all cursor-pointer"
                      title="Insert comprehensive clone, setup, env, and run code guidelines"
                    >
                      <Terminal className="w-4 h-4 text-blue-400 mb-1.5" />
                      <div>
                        <p className="text-xs font-bold text-white leading-none">Setup Guide</p>
                        <p className="text-[9px] text-[#8B949E] mt-1">Installation commands</p>
                      </div>
                    </button>

                    <button 
                      onClick={addFeaturesGridPreset}
                      className="group flex flex-col justify-between p-2.5 rounded-lg bg-[#161B22] border border-[#30363D] hover:border-purple-500/50 hover:bg-[#1e232b] text-left transition-all cursor-pointer"
                      title="Insert elegant formatted metrics table"
                    >
                      <Grid className="w-4 h-4 text-purple-400 mb-1.5" />
                      <div>
                        <p className="text-xs font-bold text-white leading-none">Features Grid</p>
                        <p className="text-[9px] text-[#8B949E] mt-1">Comparison charts</p>
                      </div>
                    </button>

                    <button 
                      onClick={addCodeSnippetPreset}
                      className="group flex flex-col justify-between p-2.5 rounded-lg bg-[#161B22] border border-[#30363D] hover:border-green-500/50 hover:bg-[#1e232b] text-left transition-all cursor-pointer"
                      title="Insert code execution handbook blocks"
                    >
                      <FileCode className="w-4 h-4 text-green-400 mb-1.5" />
                      <div>
                        <p className="text-xs font-bold text-white leading-none">TypeScript Code</p>
                        <p className="text-[9px] text-[#8B949E] mt-1">Setup syntax blocks</p>
                      </div>
                    </button>

                    <button 
                      onClick={insertWorkspaceTreePreset}
                      className="group flex flex-col justify-between p-2.5 rounded-lg bg-[#161B22] border border-[#30363D] hover:border-amber-500/50 hover:bg-[#1e232b] text-left transition-all cursor-pointer"
                      title="Print simulated folders directory map"
                    >
                      <Layers className="w-4 h-4 text-amber-500 mb-1.5" />
                      <div>
                        <p className="text-xs font-bold text-white leading-none">Folder Map</p>
                        <p className="text-[9px] text-[#8B949E] mt-1">Visual code tree</p>
                      </div>
                    </button>

                    <button 
                      onClick={addCalloutPreset}
                      className="group flex flex-col justify-between p-2.5 rounded-lg bg-[#161B22] border border-[#30363D] hover:border-emerald-500/50 hover:bg-[#1e232b] text-left transition-all cursor-pointer"
                      title="Insert styled Warning/Note alert box callout block"
                    >
                      <Info className="w-4 h-4 text-emerald-400 mb-1.5" />
                      <div>
                        <p className="text-xs font-bold text-white leading-none">Callout Alert</p>
                        <p className="text-[9px] text-[#8B949E] mt-1">Note & Warning box</p>
                      </div>
                    </button>

                    <button 
                      onClick={addRoadmapPreset}
                      className="group flex flex-col justify-between p-2.5 rounded-lg bg-[#161B22] border border-[#30363D] hover:border-blue-500/50 hover:bg-[#1e232b] text-left transition-all cursor-pointer"
                      title="Insert progress task checklist / roadmap"
                    >
                      <List className="w-4 h-4 text-blue-400 mb-1.5" />
                      <div>
                        <p className="text-xs font-bold text-white leading-none">Roadmap List</p>
                        <p className="text-[9px] text-[#8B949E] mt-1">Progress checklist</p>
                      </div>
                    </button>

                    <button 
                      onClick={addAPITablePreset}
                      className="group flex flex-col justify-between p-2.5 rounded-lg bg-[#161B22] border border-[#30363D] hover:border-amber-500/50 hover:bg-[#1e232b] text-left transition-all cursor-pointer"
                      title="Insert styled environment/API parameter reference matrix table"
                    >
                      <Grid className="w-4 h-4 text-amber-500 mb-1.5" />
                      <div>
                        <p className="text-xs font-bold text-white leading-none">API Matrix</p>
                        <p className="text-[9px] text-[#8B949E] mt-1">Config parameters</p>
                      </div>
                    </button>

                    <button 
                      onClick={addFAQSectionPreset}
                      className="group flex flex-col justify-between p-2.5 rounded-lg bg-[#161B22] border border-[#30363D] hover:border-purple-500/50 hover:bg-[#1e232b] text-left transition-all cursor-pointer"
                      title="Insert collapsible frequently asked questions block"
                    >
                      <HelpCircle className="w-4 h-4 text-purple-400 mb-1.5" />
                      <div>
                        <p className="text-xs font-bold text-white leading-none">FAQ Accordion</p>
                        <p className="text-[9px] text-[#8B949E] mt-1">Collapsible details</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* 2. Version Control & Release Logs (New Request) */}
                <div className="p-3 bg-[#161B22] border border-[#30363D] rounded-lg space-y-3">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-amber-500" />
                    <span>Version Control Builder</span>
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between gap-1">
                      <div>
                        <label className="block text-[9px] text-[#8B949E] uppercase mb-0.5">SemVer Version</label>
                        <input 
                          type="text"
                          value={projectVersion}
                          onChange={(e) => setProjectVersion(e.target.value)}
                          className="w-24 px-2 py-1 bg-[#0D1117] border border-[#30363D] rounded text-white text-xs font-mono focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] text-[#8B949E] uppercase mb-0.5">Release Status</label>
                        <select
                          value={versionStatus}
                          onChange={(e) => setVersionStatus(e.target.value)}
                          className="w-full px-1.5 py-1 bg-[#0D1117] border border-[#30363D] rounded text-white text-[11px]"
                        >
                          <option value="Stable Release">Stable Release</option>
                          <option value="Beta Preview">Beta Preview</option>
                          <option value="Alpha Testing">Alpha Testing</option>
                          <option value="Under Active Dev">Active Dev</option>
                          <option value="Deprecated">Deprecated</option>
                        </select>
                      </div>
                    </div>

                    {/* Quick increment toggles */}
                    <div className="grid grid-cols-3 gap-1">
                      <button
                        onClick={() => triggerIncrementVersion("patch")}
                        className="py-1 bg-[#21262D] hover:bg-[#30363D] text-[#C9D1D9] text-[10px] font-bold rounded cursor-pointer"
                        title="Increment patch version code (+0.0.1)"
                      >
                        + Patch
                      </button>
                      <button
                        onClick={() => triggerIncrementVersion("minor")}
                        className="py-1 bg-[#21262D] hover:bg-[#30363D] text-[#C9D1D9] text-[10px] font-bold rounded cursor-pointer"
                        title="Increment minor features (+0.1.0)"
                      >
                        + Minor
                      </button>
                      <button
                        onClick={() => triggerIncrementVersion("major")}
                        className="py-1 bg-[#21262D] hover:bg-[#30363D] text-[#C9D1D9] text-[10px] font-bold rounded cursor-pointer"
                        title="Increment major version (+1.0.0)"
                      >
                        + Major
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      <button
                        onClick={insertVersionShield}
                        className="py-1 bg-amber-600/25 hover:bg-amber-600/40 text-amber-300 font-semibold rounded text-[11px] text-center cursor-pointer flex items-center justify-center gap-1 border border-amber-500/30"
                      >
                        <Tag className="w-3 h-3" />
                        <span>Insert Shields</span>
                      </button>
                      <button
                        onClick={insertChangelogSnippet}
                        className="py-1 bg-blue-600/25 hover:bg-blue-600/40 text-blue-300 font-semibold rounded text-[11px] text-center cursor-pointer flex items-center justify-center gap-1 border border-blue-500/30"
                      >
                        <Clock className="w-3 h-3" />
                        <span>Insert Logs</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. Action Buttons Generator (New Request) */}
                <div className="p-3 bg-[#161B22] border border-[#30363D] rounded-lg space-y-3">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <ExternalLink className="w-4 h-4 text-emerald-400" />
                    <span>Deployment & Social Buttons</span>
                  </h4>

                  <div className="space-y-2.5 text-xs">
                    <div>
                      <label className="block text-[9px] text-[#8B949E] uppercase mb-0.5">Button Style Type</label>
                      <select 
                        value={buttonForm.type}
                        onChange={(e) => setButtonForm(prev => ({ ...prev, type: e.target.value }))}
                        className="w-full px-2 py-1.5 bg-[#0D1117] border border-[#30363D] rounded text-white text-xs focus:outline-none"
                      >
                        <option value="vercel">Deploy on Vercel Button</option>
                        <option value="netlify">Deploy to Netlify Button</option>
                        <option value="coffee">Buy Me a Coffee Badge</option>
                        <option value="custom">Custom Flat-Square Badge Button</option>
                      </select>
                    </div>

                    {buttonForm.type === "custom" && (
                      <div className="space-y-2 bg-[#0D1117] p-2 rounded border border-[#30363D] transition-all">
                        <div>
                          <label className="block text-[9px] text-[#8B949E] uppercase mb-0.5">Button Text</label>
                          <input 
                            type="text"
                            value={buttonForm.label}
                            onChange={(e) => setButtonForm(prev => ({ ...prev, label: e.target.value }))}
                            className="w-full px-2 py-0.5 bg-[#161B22] border border-[#30363D] rounded text-white text-xs"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[9px] text-[#8B949E] uppercase mb-0.5">Logo Icon</label>
                            <input 
                              type="text"
                              value={buttonForm.icon}
                              onChange={(e) => setButtonForm(prev => ({ ...prev, icon: e.target.value }))}
                              className="w-full px-2 py-0.5 bg-[#161B22] border border-[#30363D] rounded text-white text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] text-[#8B949E] uppercase mb-0.5">Hex Color</label>
                            <input 
                              type="text"
                              value={buttonForm.color}
                              onChange={(e) => setButtonForm(prev => ({ ...prev, color: e.target.value }))}
                              className="w-full px-2 py-0.5 bg-[#161B22] border border-[#30363D] rounded text-white text-xs"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[9px] text-[#8B949E] uppercase mb-0.5">Redirect URL</label>
                          <input 
                            type="text"
                            value={buttonForm.url}
                            onChange={(e) => setButtonForm(prev => ({ ...prev, url: e.target.value }))}
                            className="w-full px-2 py-0.5 bg-[#161B22] border border-[#30363D] rounded text-white text-xs"
                          />
                        </div>
                      </div>
                    )}

                    <button
                      onClick={addCustomButtonPreset}
                      className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 font-bold rounded text-white text-xs text-center transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Insert Action Button</span>
                    </button>
                  </div>
                </div>

                {/* 4. Custom Media & Banner Injector (New Request) */}
                <div className="p-3 bg-[#161B22] border border-[#30363D] rounded-lg space-y-3">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-purple-400" />
                    <span>Graphics & Images Tool</span>
                  </h4>

                  <div className="space-y-2.5 text-xs">
                    <div>
                      <label className="block text-[9px] text-[#8B949E] uppercase mb-0.5">Select Beautiful Mock Preset</label>
                      <select 
                        onChange={(e) => setImageUrlForm(prev => ({ ...prev, url: e.target.value }))}
                        className="w-full px-2 py-1.5 bg-[#0D1117] border border-[#30363D] rounded text-white text-xs"
                      >
                        <option value={photo1}>Geometric Slate Art Background</option>
                        <option value={photo2}>Modern Dashboard Analytics</option>
                        <option value={photo3}>Productivity Mockup Board</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9px] text-[#8B949E] uppercase mb-0.5">Or Paste Custom Image URL</label>
                      <input 
                        type="text"
                        value={imageUrlForm.url}
                        onChange={(e) => setImageUrlForm(prev => ({ ...prev, url: e.target.value }))}
                        className="w-full px-2 py-1 bg-[#0D1117] border border-[#30363D] rounded text-white text-xs focus:ring-1 focus:ring-purple-500"
                        placeholder="https://example.com/logo.png"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-1">
                      <div>
                        <label className="block text-[9px] text-[#8B949E] uppercase mb-0.5">Alignment</label>
                        <select 
                          value={imageUrlForm.align}
                          onChange={(e) => setImageUrlForm(prev => ({ ...prev, align: e.target.value }))}
                          className="w-full px-1 py-1 bg-[#0D1117] border border-[#30363D] rounded text-white text-[11px]"
                        >
                          <option value="center">Center</option>
                          <option value="left">Left</option>
                          <option value="right">Right </option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[9px] text-[#8B949E] uppercase mb-0.5">Display Width</label>
                        <input 
                          type="text"
                          value={imageUrlForm.width}
                          onChange={(e) => setImageUrlForm(prev => ({ ...prev, width: e.target.value }))}
                          className="w-full px-2 py-1 bg-[#0D1117] border border-[#30363D] rounded text-white text-xs font-mono"
                          placeholder="e.g. 100% or 150"
                        />
                      </div>
                    </div>

                    <button
                      onClick={addCustomImagePreset}
                      className="w-full py-1.5 bg-purple-600 hover:bg-purple-700 font-bold rounded text-white text-xs text-center transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Insert Image Block</span>
                    </button>
                  </div>
                </div>

                {/* 5. Custom Hyperlinks Maker */}
                <div className="p-3 bg-[#161B22] border border-[#30363D] rounded-lg space-y-3">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <LinkIcon className="w-4 h-4 text-blue-400" />
                    <span>Dynamic Link Hyperlinker</span>
                  </h4>

                  <div className="space-y-2.5 text-xs">
                    <div>
                      <label className="block text-[9px] text-[#8B949E] uppercase mb-0.5">Link Text Title</label>
                      <input 
                        type="text" 
                        value={linkForm.title}
                        onChange={(e) => setLinkForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-2 py-1 bg-[#0D1117] border border-[#30363D] rounded text-white text-xs focus:ring-1 focus:ring-blue-500"
                        placeholder="e.g. Visit documentation website"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-[#8B949E] uppercase mb-0.5">Target Web Address</label>
                      <input 
                        type="text" 
                        value={linkForm.url}
                        onChange={(e) => setLinkForm(prev => ({ ...prev, url: e.target.value }))}
                        className="w-full px-2 py-1 bg-[#0D1117] border border-[#30363D] rounded text-white text-xs focus:ring-1 focus:ring-blue-500"
                        placeholder="https://example.com"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id="externalIconCheck"
                        checked={linkForm.isExternalIcon}
                        onChange={(e) => setLinkForm(prev => ({ ...prev, isExternalIcon: e.target.checked }))}
                        className="rounded bg-[#0D1117] border-[#30363D]"
                      />
                      <label htmlFor="externalIconCheck" className="text-[10px] text-[#C9D1D9]">Append external link emoji 🔗</label>
                    </div>

                    <button
                      onClick={addCustomLinkPreset}
                      className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 font-bold rounded text-white text-xs text-center transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Insert Hyperlink</span>
                    </button>
                  </div>
                </div>

                {/* 6. Shields.io Dynamic Badge Generator */}
                <div className="p-3 bg-[#161B22] border border-[#30363D] rounded-lg space-y-3">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <BadgeIcon className="w-4 h-4 text-blue-400" />
                    <span>Pristine Badge Builder</span>
                  </h4>
                  
                  <div className="space-y-2.5 text-xs">
                    <div>
                      <label className="block text-[9px] text-[#8B949E] uppercase mb-0.5">Badge Label Left</label>
                      <input 
                        type="text" 
                        value={badgeForm.label}
                        onChange={(e) => setBadgeForm(prev => ({ ...prev, label: e.target.value }))}
                        className="w-full px-2 py-1 bg-[#0D1117] border border-[#30363D] rounded text-white text-xs focus:outline-none"
                        placeholder="e.g. build"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-[#8B949E] uppercase mb-0.5">Badge Info Right</label>
                      <input 
                        type="text" 
                        value={badgeForm.message}
                        onChange={(e) => setBadgeForm(prev => ({ ...prev, message: e.target.value }))}
                        className="w-full px-2 py-1 bg-[#0D1117] border border-[#30363D] rounded text-white text-xs focus:outline-none"
                        placeholder="e.g. passing"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[9px] text-[#8B949E] uppercase mb-0.5">Theme Color</label>
                        <select 
                          value={badgeForm.color}
                          onChange={(e) => setBadgeForm(prev => ({ ...prev, color: e.target.value }))}
                          className="w-full px-1.5 py-1 bg-[#0D1117] border border-[#30363D] rounded text-white text-xs"
                        >
                          <option value="3b82f6">Slate Blue</option>
                          <option value="10b981">Green Success</option>
                          <option value="f59e0b">Amber Alert</option>
                          <option value="ef4444">Cherry Crimson</option>
                          <option value="8b5cf6">Purple Logic</option>
                          <option value="000000">Ink Black</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-[9px] text-[#8B949E] uppercase mb-0.5">Layout Style</label>
                        <select 
                          value={badgeForm.style}
                          onChange={(e) => setBadgeForm(prev => ({ ...prev, style: e.target.value as any }))}
                          className="w-full px-1.5 py-1 bg-[#0D1117] border border-[#30363D] rounded text-white text-xs"
                        >
                          <option value="plastic">Plastic bevel</option>
                          <option value="flat">Standard Flat</option>
                          <option value="flat-square">Flat Boxy</option>
                          <option value="for-the-badge">Blocky Heavy</option>
                        </select>
                      </div>
                    </div>

                    <div className="bg-[#0D1117] p-2 rounded border border-[#30363D] flex items-center justify-center min-h-[44px]">
                      <img 
                        src={`https://img.shields.io/badge/${encodeURIComponent(badgeForm.label || "label")}-${encodeURIComponent(badgeForm.message || "msg")}-${badgeForm.color}?style=${badgeForm.style}`} 
                        alt="Badge Preview"
                        className="max-h-7"
                      />
                    </div>

                    <button
                      onClick={addBadgePreset}
                      className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 font-bold rounded text-white text-xs text-center transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Insert Badge</span>
                    </button>
                  </div>
                </div>

                {/* 7. Technology Stack Badges */}
                <div className="p-3 bg-[#161B22] border border-[#30363D] rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-purple-400" />
                      <span>Stack Badges Grid</span>
                    </h4>
                    <span className="text-[10px] text-purple-400 font-bold">{selectedTechs.length} active</span>
                  </div>

                  <div className="grid grid-cols-4 gap-1 max-h-36 overflow-y-auto p-1.5 bg-[#0D1117] rounded border border-[#30363D]">
                    {TECH_ICONS.map(tech => {
                      const isSelected = selectedTechs.some(t => t.slug === tech.slug);
                      return (
                        <button
                          key={tech.slug}
                          onClick={() => toggleSelectTechIcon(tech)}
                          className={`p-1 rounded text-2xs truncate font-medium text-center transition-all cursor-pointer ${
                            isSelected 
                              ? "bg-purple-900/40 text-purple-300 border border-purple-500/50" 
                              : "bg-[#161B22] text-[#8B949E] border border-transparent hover:border-[#30363D] hover:text-white"
                          }`}
                          title={`${tech.name} (${tech.category})`}
                        >
                          <div className="text-[9px] truncate">{tech.name}</div>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={addTechStackBadges}
                    disabled={selectedTechs.length === 0}
                    className="w-full py-1.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:hover:bg-purple-600 font-bold rounded text-white text-xs transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Insert Stack Grid</span>
                  </button>
                </div>

                {/* 8. Raw Badge Search & Insert Library */}
                <div className="p-3 bg-[#161B22] border border-[#30363D] rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <BadgeIcon className="w-4 h-4 text-[#F4AA41]" />
                      <span>Badge Library</span>
                    </h4>
                    <span className="text-[10px] text-[#F4AA41] font-bold">Search & Insert</span>
                  </div>

                  {/* Search bar */}
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
                    <input 
                      type="text"
                      value={badgeSearchQuery}
                      onChange={(e) => setBadgeSearchQuery(e.target.value)}
                      placeholder="Search badges (e.g., Bruno, Store)..."
                      className="w-full pl-8 pr-3 py-1.5 bg-[#0D1117] border border-[#30363D] rounded text-white text-xs focus:ring-1 focus:ring-blue-500 placeholder-slate-500"
                    />
                  </div>


                  {/* Badges list */}
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {(() => {
                      const search = badgeSearchQuery.toLowerCase();
                      const list = parsedRawBadges.filter(badge => badge.name.toLowerCase().includes(search));

                      if (list.length === 0) {
                        return <p className="text-[10px] text-slate-500 text-center py-4">No matching badges found.</p>;
                      }

                      return list.map(badge => (
<div 
  key={badge.id} 
  className="group p-3 bg-[#0D1117] border border-[#30363D] rounded-lg space-y-3 transition-all duration-200 hover:border-[#8B949E] hover:shadow-md"
>
  {/* Header: Name and Action Button */}
  <div className="flex items-center justify-between gap-2">
    <span 
      className="text-xs font-semibold text-[#C9D1D9] truncate" 
      title={badge.name}
    >
      {badge.name}
    </span>
    
    <button
      onClick={() => insertRawBadge(badge)}
      className="p-1 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white rounded-md transition-colors flex items-center justify-center cursor-pointer shrink-0"
      aria-label={`Add ${badge.name}`}
    >
      <Plus className="w-3.5 h-3.5" />
    </button>
  </div>

  {/* Badge Image Preview Container */}
  <div className="flex items-center justify-center bg-[#161B22] p-3 rounded-md border border-[#30363D] min-h-[48px] w-full transition-colors group-hover:border-[#30363D]">
    <img
      src={badge.imageUrl}
      alt={badge.name}
      className="max-h-6 w-auto object-contain select-none"
      referrerPolicy="no-referrer"
    />
  </div>
</div>
                      ));
                    })()}
                  </div>
                </div>

              </div>
            )}

            {/* TAB: LOCAL VIRTUAL FILES SYSTEM (Interactive viewer & image mock view) */}
            {activeTab === "workspace" && (
              <div className="space-y-4">
<div className="flex items-center justify-between">
  <h3 className="text-xs font-extrabold text-[#8B949E] uppercase tracking-wider">
    Virtual Project Workspace
  </h3>
  <button
    onClick={() => setWorkspaceInputExpanded(p => !p)}
    className="text-[11px] text-blue-500 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
  >
    <FilePlus className="w-3 h-3" />
    <span>Add File</span>
  </button>
</div>
                
                <p className="text-[10px] text-[#8B949E] leading-relaxed">
                  Simulate local files or images inside folders. Click any file node below to <b>Open & View</b> or <b>Edit</b> its source code or visualize mock diagrams directly!
                </p>

                {/* Create New Node Form */}
                {workspaceInputExpanded && (
                  <div className="p-3 bg-[#161B22] border border-[#30363D] rounded-lg text-xs space-y-2.5">
                    <p className="font-bold text-white text-[10px] uppercase tracking-wider flex items-center gap-1">
                      <FilePlus className="w-3.5 h-3.5 text-blue-400" />
                      <span>Simulate File Node</span>
                    </p>
                    
                    {/* Drag-and-drop file uploader */}
                    <div className="space-y-1">
                      <label className="block text-[9px] text-[#8B949E] uppercase font-bold">Upload Local File / Folder / Project</label>
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onDrop={handleUploaderDrop}
                        className="border-2 border-dashed border-[#30363D] hover:border-blue-500 rounded-lg p-3 text-center bg-[#0D1117]/40 hover:bg-[#0D1117]/85 transition-all cursor-pointer relative"
                        onClick={() => {
                          const fileInput = document.getElementById("file-uploader-input");
                          if (fileInput) fileInput.click();
                        }}
                      >
                        <input 
                          type="file" 
                          id="file-uploader-input" 
                          className="hidden" 
                          multiple
                          webkitdirectory="true"
                          mozdirectory="true"
                          directory="true"
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              handleUploadedFiles(e.target.files);
                            }
                          }}
                        />
                        <UploadCloud className="w-5 h-5 mx-auto text-blue-400 mb-1" />
                        <p className="text-[10px] font-bold text-white">Drag & drop or click to upload</p>
                        <p className="text-[8px] text-slate-500 mt-0.5">Supports files, folders, and full project imports on supported browsers.</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] text-[#8B949E] uppercase mb-0.5">File or Folder Name</label>
                      <input 
                        type="text"
                        value={newFileName}
                        onChange={(e) => setNewFileName(e.target.value)}
                        className="w-full px-2 py-1 bg-[#0D1117] border border-[#30363D] rounded text-white text-xs focus:ring-1 focus:ring-blue-500"
                        placeholder="e.g. index.tsx or docs/"
                      />
                    </div>

                    <div className="flex items-center gap-2 my-1">
                      <input 
                        type="checkbox" 
                        id="isFolderNode"
                        checked={newFileIsFolder} 
                        onChange={(e) => setNewFileIsFolder(e.target.checked)}
                        className="rounded bg-[#0D1117] border-[#30363D]"
                      />
                      <label htmlFor="isFolderNode" className="text-[11px] text-[#C9D1D9]">Is this a Directory Folder?</label>
                    </div>

                    {!newFileIsFolder && (
                      <div>
                        <label className="block text-[9px] text-[#8B949E] uppercase mb-0.5">Simulated Contents / Excerpts</label>
                        <textarea 
                          rows={2}
                          value={newFileContent}
                          onChange={(e) => setNewFileContent(e.target.value)}
                          className="w-full px-2 py-1 bg-[#0D1117] border border-[#30363D] rounded text-white font-mono text-[10px]"
                          placeholder="// Add code, config properties or text..."
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-[9px] text-[#8B949E] uppercase mb-0.5">Parent Directory Location</label>
                      <select
                        value={newFileParent}
                        onChange={(e) => setNewFileParent(e.target.value)}
                        className="w-full px-1 py-1 bg-[#0D1117] border border-[#30363D] rounded text-white text-xs"
                      >
                        <option value="root">/ (Repository Root)</option>
                        {workspaceFiles.filter(f => f.isFolder).map(f => (
                          <option key={f.id} value={f.id}>/{f.path}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button 
                        onClick={addNewVirtualFile}
                        className="flex-1 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-xs text-center cursor-pointer"
                      >
                        Add Node
                      </button>
                      <button 
                        onClick={() => setWorkspaceInputExpanded(false)}
                        className="px-2.5 py-1 bg-[#21262D] hover:bg-[#30363D] text-[#8B949E] rounded text-xs text-center cursor-pointer"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}

                {/* Simulated File List tree */}
                <div className="p-2 bg-[#161B22] rounded-lg border border-[#30363D] space-y-1">
                  <div className="flex items-center gap-1.5 pb-2 border-b border-[#30363D] mb-1.5 text-[10px] text-white font-extrabold uppercase">
                    <FolderOpen className="w-3.5 h-3.5 text-blue-400" />
                    <span>Project File Tree</span>
                  </div>

                  <div className="space-y-1">
                    {renderWorkspaceFileNodes(null)}
                  </div>
                </div>

                {/* Compilation Banner with instant client-side analysis */}
                <div className="p-3 bg-blue-950/20 border border-blue-900/40 rounded-lg text-xs space-y-2">
                  <p className="font-bold text-white flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
                    <span>Auto-Document Repository</span>
                  </p>
                  <p className="text-[10px] text-[#8B949E]">
                    Generate a premium markdown README file completely offline from your local project files with custom SemVer release logs.
                  </p>
                  <button
                    onClick={compileWorkspaceDocsClientSide}
                    className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-xs text-center transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Compile Workspace README</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB: GENERAL BOILERPLATES */}
            {activeTab === "templates" && (
              <div className="space-y-4">
                <h3 className="text-2xs font-extrabold text-[#8B949E] uppercase tracking-wider">
                  Boilerplate Starters
                </h3>
                <p className="text-[10px] text-[#8B949E] leading-relaxed">
                  Populate your editor immediately with a gorgeous, high-fidelity developer layout boilerplate:
                </p>

                <div className="space-y-2.5">
                  {README_TEMPLATES.map(template => (
                    <button
                      key={template.id}
                      onClick={() => loadTemplate(template.content, template.name)}
                      className="w-full p-3 bg-[#161B22] border border-[#30363D] hover:border-blue-500/50 hover:bg-[#1e232b] rounded-lg text-left transition-all group block cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                          {template.name}
                        </span>
                        <span className="text-[8px] bg-blue-900/40 text-blue-400 font-extrabold px-1.5 py-0.5 rounded tracking-widest uppercase">
                          {template.category}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#8B949E] line-clamp-2 leading-relaxed mb-2">
                        {template.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {template.tags.map(tag => (
                          <span key={tag} className="text-[9px] bg-[#0D1117] text-[#8B949E] leading-none px-1.5 py-0.5 rounded-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
          </div>

        </aside>

        {/* WORKSPACE CENTRAL WORKSPACE SPLIT (Synchronized side-by-side editing & preview) */}
        <main ref={mainRef} className="flex-1 min-h-0 flex flex-col sm:flex-row overflow-hidden bg-[#0D1117] relative">
          
          {/* Side Drawer: Virtual Workspace File Viewer and Code/Image Editor (Task 5) */}
          {activeWorkspaceFile && (
            <div className="absolute top-0 left-0 h-full w-full sm:w-[450px] bg-[#161B22] border-r border-[#30363D] z-20 shadow-2xl flex flex-col transition-all duration-300">
              
              {/* Header */}
              <div className="h-12 border-b border-[#30363D] flex items-center justify-between px-4 bg-[#0D1117]">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <div>
                    <h4 className="text-xs font-bold text-white truncate max-w-[200px]">{activeWorkspaceFile.name}</h4>
                    <p className="text-[9px] text-[#8B949E]">Simulated Repository Asset Viewer</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => {
                    setActiveWorkspaceFile(null);
                    setViewingFileId(null);
                    if (window.innerWidth < 640) {
                      setIsSidebarOpen(true);
                    }
                  }}
                  className="p-1 hover:bg-[#21262D] rounded text-[#8B949E] hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">

                                {/* 🔗 Integration shortcuts in README */}
                {!activeWorkspaceFile.isFolder && (
                  <div className="p-3 bg-blue-950/20 border border-blue-900/40 rounded-lg text-xs space-y-2">
                    <p className="font-bold text-white text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                      <LinkIcon className="w-3.5 h-3.5 text-blue-400" />
                      <span>README Integration Shortcuts</span>
                    </p>
                    <p className="text-[10px] text-[#8B949E]">
                      Instantly insert this file's live connected link/graphic into your current editor location!
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {((activeWorkspaceFile.content.startsWith("IMAGE_MOCK_DATA_URL:") || /\.(png|jpg|jpeg|gif|svg|webp)$/i.test(activeWorkspaceFile.name))) ? (
                        <button
                          onClick={() => {
                            insertAtCursor(`\n![${activeWorkspaceFile.name}](${activeWorkspaceFile.path})\n`);
                            triggerNotification(`Inserted ${activeWorkspaceFile.name}!`);
                          }}
                          className="w-full py-1 p-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded text-[10px] text-center cursor-pointer transition-all flex items-center justify-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Insert as Image Markdown</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            insertAtCursor(`\n[${activeWorkspaceFile.name}](${activeWorkspaceFile.path})\n`);
                            triggerNotification(`Inserted ${activeWorkspaceFile.name}!`);
                          }}
                          className="w-full py-1 p-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-[10px] text-center cursor-pointer transition-all flex items-center justify-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Insert as Link Markdown</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Meta details */}
                <div className="bg-[#0D1117] p-3 rounded-lg border border-[#30363D] text-[11px] space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[#8B949E]">File Name:</span>
                    <span className="text-white font-semibold font-mono">{activeWorkspaceFile.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8B949E]">Repository Path:</span>
                    <span className="text-white font-mono">{activeWorkspaceFile.path}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8B949E]">Structure Type:</span>
                    <span className="text-white">{activeWorkspaceFile.isFolder ? "Directory Folder" : "File Object"}</span>
                  </div>
                </div>

                {/* Edit File Name option */}
                <div>
                  <label className="block text-[10px] text-[#8B949E] uppercase mb-1 font-bold">Rename Node</label>
                  <input 
                    type="text" 
                    value={activeWorkspaceFile.name}
                    onChange={(e) => setActiveWorkspaceFile(p => p ? { ...p, name: e.target.value } : null)}
                    className="w-full px-3 py-1.5 bg-[#0D1117] border border-[#30363D] rounded text-white text-xs font-mono focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* If image file node, render image visually for connect and view (Task 5: open and view image folder) */}
                {(!activeWorkspaceFile.isFolder && (activeWorkspaceFile.content.startsWith("IMAGE_MOCK_DATA_URL:") || /\.(png|jpg|jpeg|gif|svg|webp)$/i.test(activeWorkspaceFile.name))) ? (
                  <div className="space-y-3">
                    <span className="block text-[10px] text-[#8B949E] uppercase font-bold">Image Visibility Preview</span>
                    
                                    <div className="bg-[#0D1117] p-4 rounded-lg border border-[#30363D] flex flex-col items-center justify-center min-h-[220px]">
                        {(() => {
                          const imageSrc = resolveWorkspaceImageSource(activeWorkspaceFile);
                          if (!imageSrc) {
                            return (
                              <div className="text-center space-y-3 w-full">
                                <div className="text-[12px] text-slate-400">No valid image source found for this file.</div>
                                <div className="text-[10px] text-[#8B949E]">Make sure the uploaded file is an image or the file content is a supported data URL.</div>
                              </div>
                            );
                          }
                          return (
                            <div className="text-center space-y-3 w-full">
                              <img 
                                src={imageSrc} 
                                alt="Local Simulated Preview" 
                                className="max-h-40 mx-auto rounded border border-[#30363D] shadow-lg object-contain w-full"
                                referrerPolicy="no-referrer"
                              />
                              <p className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950/40 py-1 rounded border border-emerald-900/40">
                                📷 Simulated Graphic Rendering Active
                              </p>
                            </div>
                          );
                        })()}
                      </div>


                  </div>
                ) : activeWorkspaceFile.isFolder ? (
                  <div className="bg-[#0D1117] p-6 rounded-lg border border-[#30363D] text-center text-slate-500 space-y-2">
                    <FolderOpen className="w-10 h-10 text-amber-400 mx-auto fill-amber-400/20" />
                    <p className="font-bold text-xs text-white">Folder Directory Node</p>
                    <p className="text-[10px] text-[#8B949E]">This is a simulated folder container path. You can nesting files inside it using parent parameters.</p>
                  </div>
                ) : (
                  // Text File Code Editor
                  <div className="space-y-2">
                    <label className="block text-[10px] text-[#8B949E] uppercase mb-1 font-bold">Simulated Source Code</label>
                    <textarea 
                      rows={12}
                      value={activeWorkspaceFile.content}
                      onChange={(e) => setActiveWorkspaceFile(p => p ? { ...p, content: e.target.value } : null)}
                      className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded text-white font-mono text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none leading-relaxed"
                    />
                  </div>
                )}



              </div>

              {/* Drawer Action Bar */}
              <div className="p-3 border-t border-[#30363D] bg-[#0D1117] flex items-center gap-2">
                <button
                  onClick={saveVirtualFileContent}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-xs text-center flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
                <button
                  onClick={() => {
                    setActiveWorkspaceFile(null);
                    setViewingFileId(null);
                    if (window.innerWidth < 640) {
                      setIsSidebarOpen(true);
                    }
                  }}
                  className="px-4 py-2 bg-[#21262D] hover:bg-[#30363D] text-[#8B949E] hover:text-white rounded text-xs text-center cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* PANEL 1: Dynamic Code Editing Pane */}
          <div
            style={{ flexBasis: `${splitPercent}%` }}
            className="w-full sm:w-1/2 min-h-0 flex flex-col border-r border-[#30363D]"
          >
            
            {/* Control Strip */}
            <div className="h-10 flex items-center justify-between px-4 bg-[#161B22] border-b border-[#30363D] shrink-0 text-xs">
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                <span className="font-mono md:block hidden text-[11px] font-bold text-white">README.md Editor</span>
              </div>
              
              {/* Quick Editing Shortcuts */}
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => insertAtCursor("# Heading 1\n")}
                  className="p-1 px-1.5 text-xs text-[#8B949E] hover:text-white rounded hover:bg-[#21262D] font-bold cursor-pointer"
                  title="Insert H1 heading"
                >
                  H1
                </button>
                <button 
                  onClick={() => insertAtCursor("## Heading 2\n")}
                  className="p-1 px-1.5 text-xs text-[#8B949E] hover:text-white rounded hover:bg-[#21262D] font-bold cursor-pointer"
                  title="Insert H2 heading"
                >
                  H2
                </button>
                <button 
                  onClick={() => insertAtCursor("Paragraph text goes here.\n")}
                  className="p-1 px-1.5 text-xs text-[#8B949E] hover:text-white rounded hover:bg-[#21262D] cursor-pointer"
                  title="Insert paragraph text"
                >
                  p
                </button>
                <button 
                  onClick={() => insertAtCursor("[Link text](https://example.com)\n")}
                  className="p-1 px-1.5 text-xs text-[#8B949E] hover:text-white rounded hover:bg-[#21262D] cursor-pointer"
                  title="Insert markdown link"
                >
                  a
                </button>
                <button 
                  onClick={() => insertAtCursor("**Bold Text**")} 
                  className="p-1 px-1.5 text-xs text-[#8B949E] hover:text-white rounded hover:bg-[#21262D] font-bold cursor-pointer"
                  title="Make selection Bold (**Bold**)"
                >
                  B
                </button>
                <button 
                  onClick={() => insertAtCursor("*Italic Text*")} 
                  className="p-1 px-1.5 text-xs text-[#8B949E] hover:text-white rounded hover:bg-[#21262D] italic font-semibold cursor-pointer"
                  title="Make selection Italic (*Italic*)"
                >
                  I
                </button>
                <button 
                  onClick={() => insertAtCursor("`codeBlock`")} 
                  className="p-1 text-[10px] text-[#8B949E] hover:text-white rounded hover:bg-[#21262D] font-mono cursor-pointer"
                  title="In-line Code block (`code`)"
                >
                  &lt;/&gt;
                </button>
                <button 
                  onClick={() => insertAtCursor("\n- Bullet List Item")} 
                  className="p-1 text-[#8B949E] hover:text-white rounded hover:bg-[#21262D] cursor-pointer"
                  title="List Item"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => insertAtCursor("\n| Col 1 | Col 2 |\n| :--- | :--- |\n| Data A | Data B |\n")} 
                  className="p-1 text-[11px] text-[#8B949E] hover:text-white rounded hover:bg-[#21262D] font-mono font-bold cursor-pointer"
                  title="Insert dynamic markdown table"
                >
                  <Table className="w-3.5 h-3.5" />
                </button>

              </div>
            </div>

            {/* Editing Textarea Form */}
            <div className="flex-1 min-h-0 relative">
              <textarea
                ref={editorContainerRef}
                value={markdown}
                onChange={(e) => updateMarkdown(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === "z") {
                    e.preventDefault();
                    undoMarkdown();
                  }
                  if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === "y" || (e.shiftKey && e.key.toLowerCase() === "z"))) {
                    e.preventDefault();
                    redoMarkdown();
                  }
                }}
                onScroll={handleEditorScroll}
                className="w-full h-full p-5 font-mono text-[13px] leading-relaxed text-[#79C0FF] bg-[#0D1117] placeholder-slate-500 focus:outline-none resize-none overflow-y-auto select-text"
                style={{ tabSize: 4 }}
                placeholder="# Dynamic README Title

Use this text area to craft premium markdown documentation..."
              />
            </div>
          </div>

          {/* PANEL 2: GitHub-Accurate Visual Preview window (Task 3: Github preview properly fix) */}
          {/* Divider / Resizer */}
          <div
            onPointerDown={(e) => {
              draggingRef.current = true;
              (e.target as Element).setPointerCapture?.(e.pointerId);
              document.body.style.userSelect = "none";
              document.body.style.touchAction = "none";
            }}
            className="z-20 sm:w-2 w-full sm:cursor-col-resize cursor-row-resize flex items-center justify-center select-none touch-none"
            aria-hidden
          >
            <div className="sm:hidden h-1 w-full bg-slate-700/30 rounded" />
            <div className="hidden sm:block w-1 h-full bg-slate-700/30 rounded" />
          </div>

          <div
            style={{ flexBasis: `${100 - splitPercent}%` }}
            className={`w-full sm:w-1/2 min-h-0 flex flex-col transition-all duration-200 ${
             previewTheme === "light" ? "bg-white text-[#1F2328]" : "bg-[#0d1117] text-[#c9d1d9]"
           }`}>
            <div className={`h-10 flex items-center justify-between px-4 shrink-0 text-xs border-b ${
              previewTheme === "light" 
                ? "bg-[#F6F8FA] border-[#D0D7DE] text-slate-700" 
                : "bg-[#161B22] border-[#30363D] text-[#8B949E]"
            }`}>
              <div className="flex items-center gap-2">
                <Eye className="w-3.5 h-3.5 text-blue-500" />
                <span className={`font-semibold ${previewTheme === "light" ? "text-[#24292F]" : "text-white"}`}>
                  README.md Preview
                </span>
              </div>

{/* Theme Selector Toggle (Light vs Dark markdown representation) */}
<div className="flex items-center gap-1.5">
  <button 
    onClick={() => setPreviewTheme(prev => prev === "light" ? "dark" : "light")}
    className={`p-1.5 rounded transition-all cursor-pointer border ${
      previewTheme === "light" 
        ? "bg-blue-500 text-white border-blue-600 hover:bg-blue-600" 
        : "bg-[#21262D] text-white border-[#30363D] hover:bg-[#30363D]"
    }`}
    title={previewTheme === "light" ? "Switch preview to GitHub Dark mode" : "Switch preview to GitHub Light mode"}
  >
    {previewTheme === "light" ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
  </button>
</div>
            </div>

            {/* Markdown rendering stage with dynamic GitHub theme classes (Task 3: Github preview properly showing) */}
            <div 
              ref={previewContainerRef}
              onScroll={handlePreviewScroll}
              className="flex-1 min-h-0  overflow-y-auto select-text"
            >
              <div className={`max-w-2xl mx-auto p-4 rounded-lg transition-all ${
                previewTheme === "light" ? "gh-markdown-light" : "gh-markdown-dark"
              }`}>
                {markdown ? (
                  <div className="markdown-body">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw]}
                      components={{ a: renderMarkdownLink, img: renderMarkdownImage }}
                    >
                      {resolveMarkdownContent(markdown)}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="py-24 text-center">
                    <BookOpen className="w-12 h-12 stroke-1 mx-auto mb-3 text-slate-400" />
                    <p className="text-sm font-semibold">Ready for rendering</p>
                    <p className="text-xs text-slate-400 mt-1">Insert template components on the left sidebar to generate beautiful README content</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </main>
      </div>

      {/* Bottom Status Bar */}
      <footer className="h-7 border-t border-[#30363D] bg-[#161B22] flex items-center justify-between px-4 shrink-0 text-[10px] text-[#8B949E] z-10">
        <div className="flex items-center gap-4">
          <div className="flex hidden md:block items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-inner animate-pulse"></span>
            <span className="font-semibold text-slate-300">Local Compiler Ready</span>
          </div>
          <div className="hidden sm:inline border-l border-[#30363D] pl-3">
          <span>UTF-8</span>
          </div>
          <div className="border-l border-[#30363D] pl-3">
            Words: <span className="text-white font-mono font-bold">{markdown.trim().split(/\s+/).filter(Boolean).length}</span>
          </div>
          <div className="border-l border-[#30363D] pl-3">
            Lines: <span className="text-white font-mono font-bold">{markdown.split("\n").length}</span>
          </div>

        </div>

        <div className="flex items-center gap-3 font-semibold uppercase tracking-wider text-[9px]">
          <span>Dev:</span>
          <a href="https://github.com/rajprajapati2001" target="_blank" rel="noopener noreferrer" className="text-blue-400">Raj Prajapati</a>
        </div>
      </footer>
    </div>
  );
}
