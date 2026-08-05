# NAOOLIFT AGENT DESIGN & CODING RULES

## 🎨 Design System & Taste Skill Directives
- **Always read and follow `taste-skill` rules** in `z:\Portofolio\NaooLift\taste-skill` and `.agents/skills/`.
- **Color Palette (`Plate.jpg`)**:
  - `Caviar`: `#010101` (Background Canvas)
  - `Rein`: `#121212` / `#1A1919` / `#242222` (Cards & Surfaces)
  - `Shadow`: `#312E2E` / `#4E4949` (Borders & Dividers)
  - `Mustang`: `#7D7D7D` (Muted Secondary Text)
  - `Text Light`: `#F9F9F9` / `#FFFFFF` (Primary Titles & Numbers)
  - `Accent Gold / Amber`: `#F59E0B` (Rank & PR Highlights)
  - `Accent Emerald`: `#10B981` (Completed Set Actions)
- **Folder & Data Architecture**:
  - Keep code modular, clean, and well-structured:
    - `src/types/` (TypeScript definitions)
    - `src/lib/` (Data service & rank logic)
    - `src/components/ui/` (Reusable clean UI elements)
    - `src/components/gym/` (Domain-specific workout & rank components)
    - `src/app/` (Next.js Pages)
