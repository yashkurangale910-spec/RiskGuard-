# RiskGuard Dashboard Implementation Plan

## Objective
Create a pixel-perfect React + Tailwind CSS implementation of the three RiskGuard application screens matching the provided mockups.

## Current Status
✅ Project scaffolding complete (Vite + React)
✅ Tailwind CSS configured
✅ Dependencies installed (react-router-dom, recharts, lucide-react)
✅ Basic component structure created
⏳ Need to finalize App.jsx with routing
⏳ Need to review and refine designs to match mockups exactly

## Three Target Screens

### 1. Risk Overview Dashboard (Main Dashboard)
**Location:** `src/pages/Dashboard.jsx`
**Key Elements:**
- 4 stat cards (Total Students, High Risk Students, Active Interventions, Improvement Rate)
- Line chart for Dropout Risk Trends
- Donut chart for Risk Factor Distribution
- High-Risk Student Alerts table with search and filters
- Color scheme: Dark background (#0a0e1a), accent blue/purple gradients

### 2. Edit Student Profile
**Location:** `src/pages/StudentProfile.jsx`
**Key Elements:**
- Left sidebar navigation (Personal Info, Academic Records, Contact Details, Risk Monitoring)
- Multiple form sections with inputs
- Breadcrumb navigation
- Risk Profile Summary card with badges
- Activity History timeline
- Save/Cancel action buttons
- Warning badges for attendance and GPA issues

### 3. Support Action Management (Kanban Board)
**Location:** `src/pages/InterventionManagement.jsx`
**Key Elements:**
- 3 column layout: Pending Action, In Progress, Resolved
- Student cards with avatar, risk scores, triggers, progress bars
- Filter tabs (All High-Risk, Critical Only, My Assignments)
- Sort dropdown
- Right sidebar for Intervention Entry form
- Floating action button

## Implementation Tasks

### Task 1: Complete App Router Setup
**Priority:** HIGH
**Files:** `src/App.jsx`, `src/main.jsx`
- Set up React Router with 3 routes
- Integrate Sidebar and Header layout
- Configure proper navigation

### Task 2: Review & Refine Dashboard Page
**Priority:** HIGH
**Files:** `src/pages/Dashboard.jsx`
- Verify stat cards match exact colors and layout
- Fine-tune line chart (colors, grid, tooltips)
- Improve donut chart SVG to match mockup exactly
- Ensure table styling matches (hover effects, badges)
- Add smooth animations and transitions

### Task 3: Review & Refine Student Profile Page
**Priority:** HIGH
**Files:** `src/pages/StudentProfile.jsx`
- Verify form field layouts match mockup
- Add proper input validation styling
- Ensure warning badges appear correctly
- Refine Risk Profile Summary card gradient
- Check sidebar navigation active states

### Task 4: Review & Refine Intervention Management Page
**Priority:** HIGH
**Files:** `src/pages/InterventionManagement.jsx`
- Verify Kanban column layouts
- Refine card designs (spacing, badges, progress bars)
- Ensure sidebar panel slides in smoothly
- Add drag-and-drop functionality (optional enhancement)
- Test responsive behavior

### Task 5: Polish Global Styles
**Priority:** MEDIUM
**Files:** `src/index.css`, `tailwind.config.js`
- Ensure consistent color palette across all pages
- Add smooth transitions and hover effects
- Refine scrollbar styling
- Add micro-animations for premium feel
- Verify font loading (Inter from Google Fonts)

### Task 6: Component Refinement
**Priority:** MEDIUM
**Files:** `src/components/Sidebar.jsx`, `src/components/Header.jsx`
- Ensure navigation highlights active page
- Add smooth hover effects
- Verify avatar images and icons
- Test responsive behavior on smaller screens

### Task 7: Final Testing & Launch
**Priority:** HIGH
- Test all navigation flows
- Verify all interactive elements work
- Check responsive design on different screen sizes
- Run development server and review in browser
- Fix any visual discrepancies

## Design Specifications

### Color Palette
```
Background: #0a0e1a (dark-bg)
Card Background: #111827 (dark-card)
Border: #1f2937 (dark-border)
Accent Blue: #6366f1
Accent Purple: #8b5cf6
Red (High Risk): #ef4444
Orange (Warning): #f97316
Green (Success): #22c55e
```

### Typography
- Font Family: Inter (Google Fonts)
- Headings: 700-800 weight
- Body: 400-500 weight
- Small text: 300 weight

### Spacing
- Card padding: 1.5rem (p-6)
- Gap between elements: 1.5rem (gap-6)
- Border radius: 0.75rem (rounded-xl)

## Success Criteria
✅ All three pages render correctly
✅ Navigation works between pages
✅ Visual design matches mockups 95%+
✅ Smooth animations and transitions
✅ Responsive on desktop screens
✅ All interactive elements functional
✅ Clean, maintainable code structure

## Next Steps
1. Create App.jsx with router configuration
2. Test the application in browser
3. Make iterative refinements based on visual comparison
4. Deploy or provide to user for review
