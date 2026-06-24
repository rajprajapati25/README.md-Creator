export interface WorkspaceFile {
  id: string;
  name: string;
  path: string;           // E.g., 'package.json', 'src/index.js'
  content: string;
  isFolder: boolean;
  parentId: string | null; // For hierarchical folders
}

export interface ReadmeTemplate {
  id: string;
  name: string;
  description: string;
  content: string;
  category: 'general' | 'minimal' | 'modern' | 'developer' | 'academic';
  tags: string[];
}

export interface BadgeCreator {
  label: string;
  message: string;
  color: string;
  style: 'flat' | 'flat-square' | 'plastic' | 'for-the-badge' | 'social';
}

export interface TechIcon {
  name: string;
  slug: string;
  color: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'languages';
}
