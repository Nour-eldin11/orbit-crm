from pathlib import Path

from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.util import Inches, Pt

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'docs' / 'Orbit_CRM_Presentation.pptx'
prs = Presentation()
prs.slide_width, prs.slide_height = Inches(13.333), Inches(7.5)
BG, INK, MUTED, ACC = [RGBColor(*rgb) for rgb in ((249, 247, 252), (47, 36, 60), (111, 96, 128), (132, 99, 211))]


def box(slide, x, y, w, h, color=RGBColor(255, 255, 255)):
    shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(x), Inches(y), Inches(w), Inches(h))
    shape.fill.solid()
    shape.fill.fore_color.rgb = color
    shape.line.fill.background()


def text(slide, x, y, w, h, value, size=20, color=INK, bold=False):
    shape = slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    paragraph = shape.text_frame.paragraphs[0]
    paragraph.text = value
    paragraph.font.name = 'Aptos'
    paragraph.font.size = Pt(size)
    paragraph.font.color.rgb = color
    paragraph.font.bold = bold


def new_slide(title):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    slide.background.fill.solid()
    slide.background.fill.fore_color.rgb = BG
    box(slide, .45, .52, .08, .32, ACC)
    text(slide, .72, .48, 9, .35, 'ORBIT CRM  /  FRONTEND DEMO', 12, ACC, True)
    text(slide, .72, 1.08, 11.8, .8, title, 34, INK, True)
    text(slide, .72, 7.03, 10, .2, 'NEXT.JS APP ROUTER  •  TYPESCRIPT  •  TAILWIND CSS', 9, MUTED)
    return slide


slide = new_slide('Relationships, in focus.')
text(slide, .72, 2.05, 5.8, 1.5, 'A responsive, frontend-only CRM that looks and behaves like a modern SaaS workspace.', 23, MUTED)
slide.shapes.add_picture(str(ROOT / 'docs/screenshots/login-desktop.jpg'), Inches(6.9), Inches(1.65), width=Inches(5.7))
text(slide, .72, 5.4, 5, .5, 'Orbit CRM  •  Student project', 17, ACC, True)

slide = new_slide('Seven core pages, one workspace')
pages = [('Login', 'Validated demo access'), ('Dashboard', 'KPIs, revenue & activity'), ('Customers', 'Search, sort, filter & page'), ('Customer details', 'Profile, deals & notes'), ('Deals', 'Six-stage Kanban pipeline'), ('Tasks', 'Priority, status & due date'), ('Settings', 'Profile, theme & alerts')]
for i, (name, detail) in enumerate(pages):
    x, y = .72 + (i % 2) * 6.1, 2.03 + (i // 2) * 1.14
    box(slide, x, y, 5.8, .97)
    text(slide, x + .2, y + .18, .55, .27, f'{i+1:02}', 12, ACC, True)
    text(slide, x + .8, y + .11, 4.7, .3, name, 17, INK, True)
    text(slide, x + .8, y + .51, 4.7, .28, detail, 11, MUTED)

slide = new_slide('Bonus features in the demo')
features = ['Extra charts & reports', 'Drag-and-drop deal board', 'Calendar view', 'Notifications panel', 'Command palette  Ctrl / ⌘ K', 'Global search', 'Theme customizer', 'English / Arabic UI', 'Interactive onboarding tour', 'Advanced filters']
for i, feature in enumerate(features):
    x, y = .72 + (i % 2) * 6.1, 2.1 + (i // 2) * .82
    box(slide, x, y, 5.8, .65)
    text(slide, x + .25, y + .16, 5.3, .3, feature, 15, INK)

slide = new_slide('Component architecture')
layers = [('Routes', 'App Router pages & dynamic customer IDs'), ('Shell', 'Session check, navigation, responsive chrome'), ('Views', 'Customers, deals, tasks, settings, reports, calendar'), ('UI primitives', 'Buttons, forms, cards, table, badges, modal, states'), ('Data & state', 'Typed mock data + localStorage persistence')]
for i, (name, detail) in enumerate(layers):
    y = 2.08 + i * .85
    box(slide, .72, y, 11.9, .68)
    box(slide, .72, y, 2.1, .68, RGBColor(232, 222, 250))
    text(slide, .9, y + .17, 1.8, .27, name, 13, ACC, True)
    text(slide, 3.08, y + .15, 9, .3, detail, 15, INK)

slide = new_slide('Build, review, and present')
text(slide, .72, 2.15, 11, .6, 'npm install   →   npm run typecheck   →   npm run build', 22, ACC, True)
text(slide, .72, 3.18, 10.7, 1.2, 'Deploy the static Next.js build on Vercel. Sign in with any valid email and a password of 8+ characters. No backend is required.', 20, MUTED)
text(slide, .72, 5.4, 10.6, .9, 'Design priorities: clear hierarchy, reusable components, responsive layouts, subtle motion, accessible reduced-motion behavior.', 18, INK)

prs.save(OUT)
print(f'{OUT}: {len(prs.slides)} slides')
