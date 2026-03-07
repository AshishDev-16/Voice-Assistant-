# WhatsApp AgentFlow Frontend

This is a modern SaaS frontend built with Next.js (App Router), TailwindCSS, Shadcn UI, and Framer Motion. 
It features a full Landing Page with a 3D Tubes Background (built via Three.js and React Three Fiber) and a comprehensive Dashboard Architecture.

## Features Built
- **Next.js App Router**: Optimized and scalable `/app` directory structure.
- **Landing Page Elements**: Animated Hero, Features board, How It Works, Pricing tiers, Footer.
- **3D Hero Canvas**: `TubesInteractiveBackground` integrated seamlessly inside the landing space behind the Hero text.
- **Dashboard Layout**: Reusable inner layout wrapping a Sidebar, Topbar, and standard UI elements.
- **Mock Dashboards**: Includes overview, conversations list, products table, analytics placeholders, and a settings manager built with mock SaaS data.
- **Clean UI**: Heavily optimized dark mode utilizing Tailwind and Radix primitives UI structures.

## Setup and Running Locally

1. Ensure you have Node.js version >= 18 installed.
2. Inside the `/frontend` directory, run:
```bash
npm install
```
3. Run the development server:
```bash
npm run dev
```
4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Architecture

```text
/frontend
  /app                     # Next.js App Router root
    /dashboard             # Dashboard sub-routes (Conversations, Products, etc.)
      layout.tsx           # Inner layout logic (Sidebar/Topbar integration)
      page.tsx             # Stats overview
    page.tsx               # Main landing page
    layout.tsx             # Root layout and global providers
    globals.css            # Tailwind + Shadcn global base
  /components
    /landing               # Landing localized structures (Hero, Tubes 3D, Pricing)
    /dashboard             # Common dashboard items (Sidebar, Topbar)
    /ui                    # Base ui generic Shadcn constructs (Button, Cards)
```
