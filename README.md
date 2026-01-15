# Portfolio

A high-performance, feature-rich portfolio website built with Next.js, showcasing professional work, case studies, and interactive architecture visualizations. Designed for speed, clarity, and technical depth.

## 🚀 Features

### Core Pages & Navigation

- **Home Page** - Overview with professional summary, signature metrics, and quick navigation
- **Start Tour** - 2-minute guided scan designed for fast decision-making
- **Case Studies** - Detailed technical case studies with interactive architecture diagrams
- **Work Timeline** - Progressive disclosure of work experience, projects, awards, and education
- **Postmortems** - Reliability thinking with RCA, fixes, and prevention strategies
- **Evidence** - Live performance metrics, receipts, and proof of work
- **Highlights** - PR and code review snapshots
- **Console** - Engineering dashboard with build status, Lighthouse scores, and project health
- **Brief Builder** - Customizable brief generation for different hiring intents

### Interactive Architecture Canvas (Beta v1)

A sophisticated, FAANG-level interactive visualization system for system architectures:

- **Three Visualization Modes**:
  - **Static** - Clean, readable diagram view
  - **Ambient** - Subtle continuous animations on active paths
  - **Guided** - Step-by-step playback with timeline control

- **Advanced Features**:
  - Real-time flow animations with particle effects
  - Visual grouping (swimlanes/clusters) with glassmorphism styling
  - Step-by-step commentary explaining each flow step
  - Export functionality (SVG and PNG)
  - Responsive layout with optimized spacing
  - Keyboard shortcuts (Space, Arrow keys)
  - Accessibility support (`prefers-reduced-motion`)

- **Architecture Diagrams**:
  1. **Distributed Consistency** - Kafka Exactly-Once Semantics (EOS) with zombie producer fencing
  2. **Fault Tolerance** - Netty + Bounded Pool + Resilience4j Bulkheads
  3. **RAG Optimization** - Voice AI Retrieval with Time Budgets

### Command Palette

- Global keyboard shortcut (`⌘K` / `Ctrl+K`)
- Fast navigation to all pages and sections
- Fuzzy search across case studies
- Intent-based filtering

### Intent-Based Experience

- **Intent Switching** - Tailored content based on visitor intent (Hiring Manager, Engineer, etc.)
- **Dynamic Content** - Case studies and sections adapt based on selected intent
- **Intent Banner** - Contextual guidance throughout the site

### Performance & Monitoring

- **Web Vitals Tracking** - Real-time Core Web Vitals monitoring
- **Live Metrics** - PageSpeed Insights (PSI) integration
- **CrUX Data** - Chrome User Experience Report integration
- **RUM (Real User Monitoring)** - Custom telemetry endpoint
- **Build Health** - Automated build status monitoring
- **Project Health Dashboard** - Multi-project health status

### Technical Excellence

- **TypeScript** - Full type safety throughout
- **Responsive Design** - Mobile-first, works on all devices
- **Accessibility** - ARIA labels, keyboard navigation, focus management
- **SEO Optimized** - Sitemap, robots.txt, structured data
- **Performance Optimized** - Memoization, code splitting, optimized renders
- **Modern UI** - Glassmorphism, smooth animations, premium styling

## 🛠 Tech Stack

### Core
- **Next.js 14.2.35** - React framework with App Router
- **React 18.2.0** - UI library
- **TypeScript 5.7.2** - Type safety

### Styling
- **Tailwind CSS 3.4.16** - Utility-first CSS framework
- **Custom Design System** - Brand colors, gradients, glassmorphism effects

### Libraries
- **@radix-ui/react-slot** - Component composition
- **html2canvas** - PNG export functionality
- **web-vitals** - Performance metrics
- **zod** - Schema validation

### APIs & Integrations
- **Google PageSpeed Insights API** - Performance scoring
- **Chrome UX Report API** - Real user metrics
- **Custom RUM Endpoint** - Real user monitoring

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── crux/         # Chrome UX Report API
│   │   ├── psi/          # PageSpeed Insights API
│   │   ├── rum/          # Real User Monitoring
│   │   └── health/       # Health check endpoints
│   ├── case-studies/     # Case study pages
│   ├── console/          # Engineering dashboard
│   ├── evidence/         # Performance evidence
│   ├── work/             # Work timeline
│   └── ...
├── components/            # React components
│   ├── caseStudies/      # Architecture canvas components
│   ├── console/          # Console dashboard components
│   ├── telemetry/        # Performance monitoring
│   └── ui/               # Reusable UI components
└── lib/                  # Utilities and data
    ├── content.ts        # Portfolio content data
    ├── architectures.ts  # Architecture diagram definitions
    └── utils.ts          # Helper functions
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone git@github.com:TejasSathe010/portfolio.git
cd portfolio

# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see the portfolio.

### Environment Variables

For full functionality, create a `.env.local` file:

```env
GOOGLE_API_KEY=your_google_api_key_here
```

**Note**: The API routes will return `503 Service Unavailable` if `GOOGLE_API_KEY` is not configured. The site will still function, but performance metrics (PSI, CrUX) will not be available.

### Build

```bash
# Production build
npm run build

# Start production server
npm start
```

## 📖 Key Features Explained

### Interactive Architecture Canvas

The architecture canvas is a sophisticated visualization system that renders complex system architectures as interactive diagrams. It supports:

- **Node-based Layout** - Automatic hierarchical positioning using BFS depth calculation
- **Edge Rendering** - Smooth Bezier curves with labels and animations
- **Visual Grouping** - Swimlanes/clusters with glassmorphism panels
- **Flow Animation** - Particle effects traveling along active edges
- **Guided Playback** - Step-by-step timeline with play/pause controls
- **Export** - SVG and PNG export with current state preservation

### Case Studies

Each case study includes:
- **Problem Statement** - Clear articulation of the challenge
- **Constraints** - Technical and business limitations
- **Approach** - Solution strategy and rationale
- **Architecture** - Interactive diagram with detailed flow
- **Outcomes** - Measurable results and impact
- **Tradeoffs** - Honest discussion of compromises
- **Evidence** - Links to PRs, docs, dashboards, repos
- **PDF View** - Full case study document available

### Performance Monitoring

The portfolio includes comprehensive performance tracking:

- **Web Vitals** - LCP, INP, CLS, FCP, TTFB tracking
- **PSI Scores** - Mobile and desktop performance scores
- **CrUX Data** - Real user experience metrics (p75)
- **Build Status** - Automated build health monitoring
- **Project Health** - Multi-project status dashboard

### Command Palette

Press `⌘K` (Mac) or `Ctrl+K` (Windows/Linux) to open the command palette. Features:

- **Fuzzy Search** - Find pages, case studies, and sections quickly
- **Keyboard Navigation** - Arrow keys to navigate, Enter to select
- **Grouped Results** - Organized by Actions, Pages, Work, Insights, Case Studies
- **Intent Awareness** - Results adapt based on current intent

## 🎨 Design System

The portfolio uses a custom design system with:

- **Color Palette** - Brand gradients (brand, brand2, brand3)
- **Glassmorphism** - Frosted glass effects with backdrop blur
- **Smooth Animations** - Respects `prefers-reduced-motion`
- **Responsive Typography** - Optimized for readability
- **Dark Mode Support** - Automatic theme detection

## 🔧 Development

### Code Quality

- **TypeScript Strict Mode** - Full type safety
- **ESLint** - Code linting with Next.js config
- **No Comments** - Production-ready, comment-free code
- **Optimized** - Memoization, code splitting, performance-first

### Key Components

- **ArchitectureCanvas** - Main architecture visualization component
- **FlowAnimator** - Particle animation system
- **useGuidedController** - Timeline playback logic
- **GroupContainer** - Visual grouping containers
- **FlowCommentary** - Step-by-step explanations
- **CommandPalette** - Global navigation
- **IntentProvider** - Intent-based content switching

## 📊 Performance

The portfolio is optimized for performance:

- **Fast Initial Load** - Code splitting and lazy loading
- **Optimized Images** - Next.js Image optimization
- **Efficient Rendering** - React memoization and useMemo
- **Minimal Bundle Size** - Tree shaking and dead code elimination
- **Caching** - API response caching with TTL

## 🌐 Deployment

The portfolio is ready for deployment on:

- **Vercel** (Recommended) - Zero-config Next.js deployment
- **Netlify** - Static site deployment
- **AWS Amplify** - Full-stack deployment
- **Self-hosted** - Any Node.js hosting

## 📝 License

Private project - All rights reserved.

## 👤 Author

**Tejas Sathe**

Software Engineer building distributed services with Python, React, Node.js, and AWS.

---

**Note**: The Interactive Architecture Canvas is currently in **Beta v1** and may have some issues. Improvements are being worked on.
