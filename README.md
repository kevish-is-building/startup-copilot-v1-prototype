# Startup CoPilot V1 - Prototype

A fully functional Next.js application that helps founders go from idea to execution in 90 days with personalized blueprints, task management, legal templates, and playbook articles.

## 🚀 Features

### Core Functionality
- **Personalized Blueprint Generation** - AI-powered rule engine creates custom 90-day roadmaps based on:
  - Industry (SaaS, E-commerce, Fintech, etc.)
  - Stage (Idea, Prototype, MVP, Launched)
  - Founder count
  - Funding goals
  - Primary objectives

- **Multi-Step Onboarding Wizard** - Interactive 5-step form with:
  - Company basics
  - Founder information
  - Current state assessment
  - Goal selection
  - Review and confirmation
  - "Use Sample Profile" shortcut for quick demo

- **Dashboard** - Overview with:
  - Progress statistics (completion %, tasks remaining, timeline)
  - Visual progress bars
  - Next 3 upcoming tasks
  - Quick links to resources

- **Blueprint Page** - Week-by-week collapsible task cards with:
  - Task details and descriptions
  - Priority and category badges
  - Estimated hours
  - Dependencies and resources
  - Mark as complete functionality
  - Week-level progress tracking

- **Tasks Page** - Flat list view with:
  - Advanced filtering (category, priority, status)
  - Search functionality
  - Real-time status updates

- **Legal Toolkit** - Interactive checklist with:
  - 10 essential legal steps
  - Progress tracking
  - Links to templates and guides
  - Educational resources

- **Templates Library** - Downloadable documents:
  - Certificate of Incorporation
  - Founders' Agreement
  - SAFE Agreement
  - Employee Offer Letter
  - NDA
  - Download as text files (Blob URLs)

- **Playbook** - Expert articles covering:
  - Product strategy
  - Fundraising
  - Legal topics
  - Marketing
  - Growth
  - Search and filter by category
  - Full article detail pages with formatted content

- **Admin Panel** - Developer tools:
  - Edit blueprint generation rules
  - JSON editor with validation
  - Reset to defaults
  - Real-time rule engine testing

### Technical Features
- **LocalStorage Persistence** - All data persists locally:
  - User profile
  - Task completion status
  - Blueprint data
  - Custom rules
  - Auth state (mock)

- **Mock API Layer** - Simulated backend with:
  - Realistic latency (150-500ms)
  - Rule engine for blueprint generation
  - Sample data management

- **Responsive Design** - Mobile-first approach:
  - Tailwind CSS styling
  - Teal accent colors throughout
  - Accessible components
  - Smooth animations

## 🎨 Design System

### Color Palette
- **Primary (Teal)**: `oklch(0.48 0.14 180)` - Main brand color
- **Accent**: Complementary teal shades for highlights
- **Category Colors**:
  - Legal: Purple
  - Product: Blue
  - Marketing: Green
  - Fundraising: Orange
  - Operations: Gray

### Components
All components built with shadcn/ui and customized:
- Header with navigation
- TaskCard with expand/collapse
- ProgressBar with sizes
- TemplateCard with download
- PlaybookCard with metadata
- Loading states
- Accessibility features (ARIA labels, keyboard navigation)

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── onboarding/page.tsx      # 5-step wizard
│   ├── dashboard/page.tsx       # Progress overview
│   ├── blueprint/page.tsx       # Week-by-week tasks
│   ├── tasks/page.tsx           # Flat task list
│   ├── legal/page.tsx           # Legal checklist
│   ├── templates/page.tsx       # Document templates
│   ├── playbook/
│   │   ├── page.tsx            # Article list
│   │   └── [slug]/page.tsx     # Article detail
│   └── admin/page.tsx           # Rules editor
├── components/
│   ├── Header.tsx               # Navigation
│   ├── TaskCard.tsx             # Task display
│   ├── ProgressBar.tsx          # Progress visualization
│   ├── TemplateCard.tsx         # Template display
│   └── PlaybookCard.tsx         # Article preview
├── lib/
│   ├── types.ts                 # TypeScript interfaces
│   ├── mockApi.ts               # API simulation
│   └── localStorage.ts          # Persistence layer
├── hooks/
│   └── use-toast.ts             # Toast notifications
└── public/
    └── sampleData.json          # Mock data store
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- Modern web browser

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Start the development server:
```bash
npm run dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000)

### Quick Demo

1. Visit the landing page
2. Click "Get Started Free"
3. Click "Use Sample Profile (Quick Demo)" on the first step
4. Click through the onboarding wizard
5. Explore your personalized dashboard and blueprint

## 💡 Usage Guide

### Creating Your Profile
1. Navigate to `/onboarding`
2. Complete the 5-step form:
   - Enter company name and industry
   - Add founder details
   - Select your current stage
   - Choose your goals
   - Review and submit

### Managing Tasks
- **Mark Complete**: Click the checkmark on any task card
- **View Details**: Expand tasks to see dependencies and resources
- **Filter**: Use the filters on the Tasks page
- **Track Progress**: Watch progress bars update in real-time

### Using Templates
1. Go to Templates page
2. Browse or search for documents
3. Click "Download" to get a text file
4. Edit in your preferred document editor

### Reading Playbook Articles
1. Navigate to Playbook
2. Browse articles by category
3. Click "Read Article" for full content
4. Follow links to related resources

### Admin Features
1. Visit `/admin` (no auth required in prototype)
2. Edit the rules JSON
3. Test with different profile configurations
4. Reset to defaults if needed

## 🔧 Customization

### Adding New Tasks
Edit `public/sampleData.json`:
```json
{
  "id": "task-new",
  "week": 5,
  "title": "Your Task Title",
  "description": "Task description",
  "category": "product",
  "priority": "high",
  "estimatedHours": 8
}
```

### Creating Rules
Add to `blueprintRules` in `sampleData.json`:
```json
{
  "condition": {
    "stage": ["idea"],
    "goals": ["build_mvp"]
  },
  "tasks": ["task-1", "task-2"]
}
```

### Adding Templates
Include in `templates` array:
```json
{
  "id": "template-new",
  "title": "Template Name",
  "description": "Description",
  "category": "legal",
  "fileType": "docx",
  "content": "Template content..."
}
```

## 🎯 Key Features Demonstrated

### Mock Data System
- JSON-based data store
- Simulated API latency
- Rule engine for personalization

### State Management
- LocalStorage for persistence
- React hooks for local state
- Real-time UI updates

### Routing
- Next.js App Router
- Dynamic routes ([slug])
- Client-side navigation

### UX Patterns
- Multi-step forms
- Collapsible sections
- Filter and search
- Loading states
- Empty states

## 🚧 Future Enhancements

Potential features for V2:
- [ ] Real backend integration
- [ ] User authentication (OAuth)
- [ ] Team collaboration
- [ ] Email reminders
- [ ] Calendar integration
- [ ] AI-powered task recommendations
- [ ] Progress analytics
- [ ] Export to PDF
- [ ] Mobile app
- [ ] Integrations (Notion, Slack, etc.)

## 📄 License

This is a prototype/demonstration project.

## 🙏 Acknowledgments

- Next.js 15 and React 19
- shadcn/ui component library
- Tailwind CSS for styling
- Lucide React for icons

---

**Built with ❤️ for founders everywhere**

Start your 90-day journey today! 🚀