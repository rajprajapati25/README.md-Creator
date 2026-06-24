import { ReadmeTemplate, TechIcon } from "../types";

export const README_TEMPLATES: ReadmeTemplate[] = [
  {
    id: "modern-professional",
    name: "Modern Professional",
    description: "The gold standard: Beautiful badges, clear feature breakdown, grid elements, and organized setup instructions.",
    category: "modern",
    tags: ["Standard", "NodeJS", "Frontend"],
    content: `# 🚀 Supercharge App

<div align="center">
  <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80" alt="Supercharge App Logo" width="120" style="border-radius: 20%;" />
  <h3>An extraordinary solution for real-time performance rendering.</h3>
  <p>Providing seamless state-synchronization with zero latency and high visual fidelity.</p>

  [![Version](https://img.shields.io/badge/version-2.4.0-blue.svg?style=for-the-badge)](https://github.com/)
  [![License](https://img.shields.io/badge/license-MIT-green.svg?style=for-the-badge)](https://github.com/)
  [![Platform](https://img.shields.io/badge/platform-web%20%7C%20mobile-orange.svg?style=for-the-badge)](https://github.com/)
</div>

---

## ⚡ Key Features

Here is why this platform stands out among legacy architectures:

- **📦 Plug-and-Play Integration**: Connect your systems seamlessly in less than 3 minutes.
- **🌐 Geo-Replicated Cluster**: Near-zero latency responses distributed globally.
- **🔐 State-of-the-Art Security**: Encrypted payload transmission with standard TLS 1.3 tunnels.
- **📊 Real-time Visualizer**: In-dashboard analytics showcasing state mutations.

---

## 🛠️ Technology Stack

| Component | Library/Tool | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Tailwind CSS v4 | Visual layouts & responsive designs |
| **Backend** | Express + TypeScript | Performance APIs |
| **Database** | Firebase Firestore | Cloud-native multi-user syncing |

---

## 📦 Setting Up the Workspace

Follow these steps to configure your local development server:

### Prerequisites
Make sure you have Node.js (v18+) and npm installed.

### 1. Repository Installation
\`\`\`bash
git clone https://github.com/your-username/supercharge-app.git
cd supercharge-app
\`\`\`

### 2. Dependency Resolution
\`\`\`bash
npm install
\`\`\`

### 3. Environment Declaration
Create a \`.env\` file in the root folder and supply your keys:
\`\`\`env
# Local Server Configuration
PORT=3000
API_SECRET_KEY=your_secured_jwt_token
\`\`\`

### 4. Development Launch
\`\`\`bash
npm run dev
\`\`\`

---

## 🤝 Contribution Guidelines

We welcome pull requests! To contribute:
1. Fork the workspace repository.
2. Create your module branch (\`git checkout -b feature/awesome-addition\`).
3. Commit improvements (\`git commit -m 'Add some feature'\`).
4. Push content (\`git push origin feature/awesome-addition\`).
5. Open a Pull Request for code review.

---

## 📜 License & Acknowledgement

Distributed under the **MIT License**. See \`LICENSE\` for more details. Special thanks to all our maintainers.
`
  },
  {
    id: "minimalist-aesthetic",
    name: "Minimalist Aesthetic",
    description: "Ultra-sleek, clean layout. Ideal for helper libraries, individual utilities, and personal scratchpads.",
    category: "minimal",
    tags: ["Minimal", "Rust", "Library"],
    content: `# Minimalist Toolkit

> A lightweight, dependency-free React utility designed to handle state-driven synchronized layouts.

![Build](https://img.shields.io/badge/build-passing-success?style=flat-square)
![Coverage](https://img.shields.io/badge/coverage-99%25-green?style=flat-square)

## Why use this toolkit?
* **Invisible bundle cost**: Less than 1.2KB after gzipped minification.
* **No downstream issues**: Fully custom written, no external dependencies.
* **Fully typed**: Built from the ground-up in standard TypeScript.

## Quickstart

### Install
\`\`\`bash
npm install @yourname/minimalist-toolkit
\`\`\`

### Use Case
\`\`\`typescript
import { createStore } from '@yourname/minimalist-toolkit';

const store = createStore({ counter: 0 });
store.subscribe(state => console.log(\`Counter: \${state.counter}\`));
store.update(state => { state.counter++ });
\`\`\`

## Architecture
- \`src/core.ts\`: High-performance observer implementation.
- \`src/hooks.ts\`: Elegant state bindings.

## License
MIT (c) 2026.
`
  },
  {
    id: "scifi-terminal",
    name: "Neo Sci-Fi Tech",
    description: "A dark cyberpunk terminal style that feels ultra-technical. Great for CLI libraries and core architectures.",
    category: "developer",
    tags: ["Terminal", "Hacker", "Rust", "Go"],
    content: `# 🛸 PROJECT_MATRIX: TERMINAL_CORE

\`\`\`
  __  __       _        _      
 |  \\/  |     | |      (_)     
 | \\  / | __ _| |_ _ __ ___  __
 | |\\/| |/ _\` | __| '__| \\ \\/ /
 | |  | | (_| | |_| |  | |>  < 
 |_|  |_|\\__,_|\\__|_|  |_/_/\\_\\
                               
     [SYS STATUS: ACTIVE // ENCRYPT_LEVEL: AES_256]
\`\`\`

---

### // HARDWARE SPECIFICATION REQUIRED
- **OS**: Linux Kernel 5.4+ or macOS Darwin.
- **ARCHITECTURE**: x86_64, ARM64.
- **ENGINE**: LLVM 15 compiler suite.

---

## 🛰️ PROTOCOL FEATURES

- [x] **HEX_DECODER**: Dynamic payload decryption with near-zero registry overhead.
- [x] **P2P_SOCKET**: Multi-node cluster streaming utilizing secure WebSockets.
- [x] **AUTO_GARBAGE**: Real-time memory allocation optimization.

---

## 🛠️ BOOTSTRAPPING ENGINE

Execute deep network analysis initialization script:

\`\`\`bash
# Install tool globally
npm install -g @matrix/terminal-core

# Initialize subsystem network
matrix-core --init --port 3000 --verbose
\`\`\`

*System payload sample responses:*
\`\`\`json
{
  "status": "ONLINE",
  "nodes": ["STATION_A", "STATION_B", "STATION_C"],
  "ping": "2ms",
  "entropy": 0.985
}
\`\`\`

---

## 🧪 PROTOCOL MATRIX CONVENTIONS

Defines the structure of internal packets:
- **0x0A**: Handshake preamble header.
- **0x0D**: Multi-turn response payload.
- **0x0F**: Sub-node termination signal.

---

## 🛰️ CORE AUTHORS
* **Operator Alpha** - Deep Core Engine Architect
* **Sub-node Beta** - WebSocket Proxy Integrator
`
  },
  {
    id: "academic-notebook",
    name: "Academic Researcher",
    description: "Structured design focused on technical analysis, LaTeX equations, scientific methodology, and citations.",
    category: "academic",
    tags: ["LaTeX", "Data Science", "Research"],
    content: `# Deep Learning Hyper-parameter Optimization Engine

This repository provides the core software package for evaluating multi-dimensional global minima in complex loss landscapes. It uses adaptive Bayesian search algorithms to scale computation across parallel CPU/GPU clusters.

## 🔬 Scientific Methodology

The optimizing agent searches for hyper-parameters $\\theta$ that minimize the generalization error over some parameter space $\\Omega$:

$$\\theta^* = \\arg\\min_{\\theta \\in \\Omega} f(\\theta)$$

Where the evaluation function $f$ represents the cross-validation loss of a residual neural network architecture.

### Convergence Progression Table

| Epoch | Learning Rate | Accuracy | Loss |
| :---: | :---: | :---: | :---: |
| 1 | $1e-2$ | 78.4% | 0.452 |
| 10 | $5e-3$ | 91.2% | 0.210 |
| 50 | $1e-3$ | 97.8% | 0.054 |

---

## 🌌 Core Datasets

Ensure you download and unzip the reference databases under the relative path:
\`\`\`
./datasets/raw/
\`\`\`

- **MNIST-v2 (Residual Edition)**: 60,000 augmented grayscale pixel values of handwritten signatures.
- **WIKITEXT-103-Tokenized**: Pre-tokenized English language dataset containing the entire clean corpus.

---

## 📜 Scientific Citation

If you use this source repository in your research paper, format the bibtex citation as follows:

\`\`\`bibtex
@article{optimengine2026,
  author    = {Submateur, Julia and Scholar, Thomas},
  title     = {Bayesian Gradients Over Heterogeneous Compute Grids},
  journal   = {Journal of Deep Analytics Science},
  year      = {2026},
  volume    = {42},
  pages     = {112--128}
}
\`\`\`
`
  },
  {
    id: "saas-application",
    name: "Enterprise SaaS WebApp",
    description: "Highly polished template featuring modern metrics dashboards, self-hosting pipelines, payment models, and interactive API tables.",
    category: "modern",
    tags: ["SaaS", "NextJS", "Stripe"],
    content: `# 🚀 SaaSify: Ultimate Enterprise Scaffold

<div align="center">
  <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80" alt="SaaSify Platform Banner" width="480" style="border-radius: 12px; margin-bottom: 20px;" />
  
  <h3>The ultimate production-ready micro-services engine for subscription applications.</h3>
  
  [![Build Status](https://img.shields.io/badge/Build-Passing-emerald.svg?style=flat-square)](https://github.com/)
  [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
  [![Database](https://img.shields.io/badge/Database-PostgreSQL-blue.svg?style=flat-square)](https://github.com/)
  [![License](https://img.shields.io/badge/License-MIT-purple.svg?style=flat-square)](https://github.com/)
</div>

---

## ✨ System Architecture & Key Capabilities

SaaSify abstracts the boilerplate out of your subscription software, leaving you with clean code and high reliability:

*   **💳 Multi-tenant Stripe Billing**: Pre-integrated Stripe checkout loops supporting free-trials, webhooks, and billing portals.
*   **🔐 Row-level Database Isolation**: Database schema built from scratch to prevent cross-tenant data leaks.
*   **📊 Dynamic High-Density Dashboard**: Responsive UI detailing live active usage, API limits, and transaction telemetry.
*   **⚡ Optimized Performance Engine**: Zero-overhead server-side hydration for maximum SEO and page index rankings.

---

## 🗺️ Product Roadmap

- [x] **Phase 1**: Authentication & RBAC Core
- [x] **Phase 2**: Stripe checkout & billing portal webhook loop
- [ ] **Phase 3**: Multi-regional Redis session replication (In development)
- [ ] **Phase 4**: Native mobile companion builds (iOS/Android)

---

## 🛠️ Tech Stack & Dependencies

Our unified cloud architecture consists of these top-tier services:

| Layer | Service / Tool | Purpose |
| :--- | :--- | :--- |
| **Client Interface** | React 19 + Tailwind CSS | Fluid micro-interactions & utility designs |
| **Backend Core** | NestJS / Express | Type-safe RESTful API controller routing |
| **Persistence** | PostgreSQL + Prisma ORM | Relational data storing & schema migration |
| **Caching / PubSub** | Redis Cluster | High-throughput session management |

---

## 🔌 API Reference & Configurations

Our SaaS gateway utilizes these critical environment declarations:

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| \`PORT\` | Number | \`3000\` | Port bound by the local Express gateway |
| \`DATABASE_URL\` | String | \`none\` | Secure PostgreSQL connection string with TLS |
| \`STRIPE_SECRET_KEY\` | String | \`none\` | Merchant credentials required for webhooks |
| \`ENABLE_RATE_LIMIT\` | Boolean | \`true\` | Throttles connections to 100 requests per minute |

### Authenticating API Calls
\`\`\`bash
curl -X GET "https://api.saasify.com/v1/billing/usage" \\
  -H "Authorization: Bearer <your_jwt_token>" \\
  -H "X-Tenant-ID: tenant_uuid_8a2d"
\`\`\`

---

## ❓ Frequently Asked Questions

<details>
  <summary><b>Can I deploy this to standard cloud providers?</b></summary>
  <p>Yes, standard Dockerfiles are packaged inside the repository allowing seamless deployments to AWS ECS, GCP Cloud Run, or any custom Kubernetes node.</p>
</details>

<details>
  <summary><b>Does it support single sign-on (SSO)?</b></summary>
  <p>OAuth 2.0 integration for Google, GitHub, and Enterprise SAML are fully supported through configured environment providers.</p>
</details>

---

## 🤝 Contributing & License

Feel free to open an issue or pull request for enhancements. Distributed under the **MIT License**.
`
  },
  {
    id: "game-project",
    name: "Modern Indie Game Studio",
    description: "Sleek, atmospheric template tailored for game engines, desktop projects, controls, and multimedia releases.",
    category: "developer",
    tags: ["Game Dev", "C#", "Unity", "Godot"],
    content: `# 🎮 Nebulae: Void Explorer

<div align="center">
  <img src="https://images.unsplash.com/photo-1542744094-3a31f103e35f?w=800&auto=format&fit=crop&q=80" alt="Nebulae Game Banner" width="480" style="border-radius: 8px;" />
  
  <h3>An immersive cosmic action-sandbox game written in Godot Engine.</h3>
  
  [![Platform](https://img.shields.io/badge/Platform-PC%20%7C%20Mac%20%7C%20SteamDeck-orange.svg?style=for-the-badge)](https://store.steampowered.com/)
  [![Language](https://img.shields.io/badge/Engine-Godot%20%2F%20C%23-blue.svg?style=for-the-badge)](https://godotengine.org/)
  [![Status](https://img.shields.io/badge/Release-Beta_V0.8-emerald.svg?style=for-the-badge)](https://github.com/)
</div>

---

## 🌌 Gameplay Concept

Navigate the uncharted outer rings of the Cygnus constellation. Harvest dark matter, customize your scout starship with modular weapon hulls, and survive rogue gravity anomalies in a fully deterministic physics engine.

### 🎮 Keyboard & Controller Bindings

| Control / Action | Keyboard Binding | Gamepad Button |
| :--- | :--- | :--- |
| **Thrust Forward** | \`W\` / \`Up Arrow\` | \`R2 Trigger\` |
| **Strafing Left/Right** | \`A\` / \`D\` | \`Left Joystick\` |
| **Primary Shield Weapon** | \`Spacebar\` | \`Button South (A)\` |
| **Tactical Galactic Map** | \`M\` / \`Tab\` | \`Select / Options\` |

---

## 🛠️ Local Development & Asset Packaging

To set up the Godot environment and build binaries locally:

### Prerequisites
- **Godot Mono Engine (v4.2+)** supporting C# type compiling.
- **.NET 8 SDK** installed on system path.

### 1. Build Subsystem Assets
\`\`\`bash
# Clone repository
git clone https://github.com/studio/nebulae-void.git
cd nebulae-void

# Restore .NET packages
dotnet restore source/Nebulae.sln
\`\`\`

### 2. Launch Godot Editor
Import \`project.godot\` from the root folder, or run directly via CLI:
\`\`\`bash
godot --path ./source/ -e
\`\`\`

---

## 🚀 Future Roadmap & Milestones

- [x] **0.5 Alpha**: Gravitational physics orbit models
- [x] **0.8 Beta**: Core multiplayer lobby sync & starship editor
- [ ] **1.0 Release**: Expanded cosmic boss fights, achievement tables, and Steam Workshop integration.

---

## 🤝 Special Credits

Built with devotion by the **Studio Void** collective. Distributed under custom software assets terms.
`
  },
  {
    id: "ai-llm-workspace",
    name: "AI & LLM Model Integration",
    description: "Geared towards AI engineers, featuring Python local environments, huggingface models, and GPU hardware requirements.",
    category: "academic",
    tags: ["LLM", "Python", "PyTorch", "AI"],
    content: `# 🧠 MindGate: Local LLM Proxy Engine

<div align="center">
  <img src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80" alt="MindGate AI Banner" width="480" style="border-radius: 12px;" />
  
  <h3>High-throughput local orchestration for open-source LLMs with optimized quantized layers.</h3>
  
  [![Python](https://img.shields.io/badge/Python-3.10%20%7C%203.11-blue.svg?style=flat-square)](https://www.python.org/)
  [![PyTorch](https://img.shields.io/badge/Framework-PyTorch_2.2-red.svg?style=flat-square)](https://pytorch.org/)
  [![Ollama](https://img.shields.io/badge/Integration-Ollama%20%2F%20HuggingFace-orange.svg?style=flat-square)](https://huggingface.co/)
  [![License](https://img.shields.io/badge/License-Apache_2.0-black.svg?style=flat-square)](https://www.apache.org/licenses/LICENSE-2.0)
</div>

---

## 💡 Engine Overview

MindGate is a highly optimized client-side proxy designed to manage local model execution. It allows developers to deploy quantized models (e.g., Llama 3, Mistral) on standard workstations while maintaining sub-millisecond connection times.

### ⚡ Key Features

*   **⚡ CUDA-Optimized Quantization**: Runs FP16 models in 4-bit (GGUF) with minimal loss of perplexity metrics.
*   **🔗 Unified OpenAI Spec API**: Swap models instantaneously without restructuring backend codebases.
*   **🧠 Intelligent Context-Window Compressing**: Dynamically prunes semantic layers to fit deep conversations inside local buffers.
*   **🛡️ Complete Air-Gapped Operation**: Run models with zero internet access, perfect for private workspace environments.

---

## 🛠️ Technical Pre-requisites & GPU Configurations

| GPU Model | Video Memory | Recommended Quantization | Max Context Length |
| :--- | :--- | :--- | :--- |
| **NVIDIA RTX 4090** | 24 GB VRAM | 8-bit quantized weights | 32,768 tokens |
| **NVIDIA RTX 4070** | 12 GB VRAM | 4-bit quantized weights | 16,384 tokens |
| **Apple M3 Max** | 48 GB Unified | 8-bit quantized weights | 32,768 tokens |

---

## 📦 Setting Up PyTorch Workspace

Configure your local hardware acceleration:

### 1. Conda Environment Setup
\`\`\`bash
conda create -n mindgate python=3.10 -y
conda activate mindgate
\`\`\`

### 2. GPU Toolkit Resolution
\`\`\`bash
# Install PyTorch with native CUDA 12.1 drivers
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
pip install llama-cpp-python transformers
\`\`\`

### 3. Model Weight Loading
\`\`\`bash
python -c "from transformers import AutoModel; AutoModel.from_pretrained('mistralai/Mistral-7B-Instruct-v0.2')"
\`\`\`

---

## 🔌 API Command Execution

Deploy your secure proxy service locally:
\`\`\`bash
python -m mindgate.server --port 8000 --model mistral-7b-q4
\`\`\`

Send query stream payload directly via cURL:
\`\`\`bash
curl http://localhost:8000/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer mock_key" \\
  -H "X-MindGate-System: Your system context guide" \\
  -d '{
    "model": "mistral-7b-q4",
    "messages": [{"role": "user", "content": "Explain gravity in 10 words."}],
    "stream": true
  }'
\`\`\`

---

## 🤝 License

Governed by the **Apache 2.0 License**. See \`LICENSE\` for legal compliance terms.
`
  }
];

export const TECH_ICONS: TechIcon[] = [
  { name: "React", slug: "react", color: "61DAFB", category: "frontend" },
  { name: "Vue", slug: "vue", color: "4FC08D", category: "frontend" },
  { name: "Angular", slug: "angular", color: "DD0031", category: "frontend" },
  { name: "Svelte", slug: "svelte", color: "FF3E00", category: "frontend" },
  { name: "HTML5", slug: "html5", color: "E34F26", category: "frontend" },
  { name: "CSS3", slug: "css3", color: "1572B6", category: "frontend" },
  { name: "Tailwind CSS", slug: "tailwindcss", color: "06B6D4", category: "frontend" },
  { name: "TypeScript", slug: "typescript", color: "3178C6", category: "languages" },
  { name: "JavaScript", slug: "javascript", color: "F7DF1E", category: "languages" },
  { name: "Python", slug: "python", color: "3776AB", category: "languages" },
  { name: "Node.js", slug: "nodedotjs", color: "5FA04E", category: "backend" },
  { name: "Express", slug: "express", color: "000000", category: "backend" },
  { name: "FastAPI", slug: "fastapi", color: "009688", category: "backend" },
  { name: "Go", slug: "go", color: "00ADD8", category: "languages" },
  { name: "Rust", slug: "rust", color: "000000", category: "languages" },
  { name: "MongoDB", slug: "mongodb", color: "47A248", category: "database" },
  { name: "PostgreSQL", slug: "postgresql", color: "4169E1", category: "database" },
  { name: "MySQL", slug: "mysql", color: "4479A1", category: "database" },
  { name: "Redis", slug: "redis", color: "FF4438", category: "database" },
  { name: "Docker", slug: "docker", color: "2496ED", category: "devops" },
  { name: "Kubernetes", slug: "kubernetes", color: "326CE5", category: "devops" },
  { name: "GitHub Actions", slug: "githubactions", color: "2088FF", category: "devops" },
  { name: "AWS", slug: "amazonwebservices", color: "232F3E", category: "devops" },
  { name: "Firebase", slug: "firebase", color: "FFCA28", category: "database" }
];
