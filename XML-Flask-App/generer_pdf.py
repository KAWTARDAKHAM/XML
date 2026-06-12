#!/usr/bin/env python3
"""
Generate PDF documentation from the docs/ folder
"""

from fpdf import FPDF
import os

class PDF(FPDF):
    def header(self):
        if self.page_no() > 1:
            self.set_font('DejaVu', '', 8)
            self.set_text_color(150, 150, 150)
            self.cell(0, 10, 'FluentGantt XML - Documentation', align='L')
            self.cell(0, 10, f'Page {self.page_no()}', align='R')
            self.ln(15)
    
    def footer(self):
        self.set_y(-15)
        self.set_font('DejaVu', '', 8)
        self.set_text_color(150, 150, 150)
        self.cell(0, 10, 'Projet FluentGantt XML', align='C')
    
    def h1(self, title):
        self.ln(10)
        self.set_font('DejaVu', 'B', 20)
        self.set_text_color(132, 94, 247)
        self.cell(0, 10, title, new_x="LMARGIN", new_y="NEXT", align='L')
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(5)
    
    def h2(self, title):
        self.ln(8)
        self.set_font('DejaVu', 'B', 16)
        self.set_text_color(255, 255, 255)
        self.cell(0, 10, title, new_x="LMARGIN", new_y="NEXT", align='L')
        self.set_draw_color(132, 94, 247)
        self.line(10, self.get_y(), 100, self.get_y())
        self.ln(3)
    
    def h3(self, title):
        self.ln(6)
        self.set_font('DejaVu', 'B', 12)
        self.set_text_color(200, 200, 200)
        self.cell(0, 8, title, new_x="LMARGIN", new_y="NEXT", align='L')
    
    def body(self, text):
        self.set_font('DejaVu', '', 10)
        self.set_text_color(200, 200, 200)
        self.multi_cell(0, 6, text, new_x="LMARGIN", new_y="NEXT")
        self.ln(2)
    
    def code(self, code):
        self.set_fill_color(20, 20, 20)
        self.set_draw_color(60, 60, 60)
        self.set_font('DejaVu', '', 8)
        self.set_text_color(150, 150, 150)
        self.multi_cell(0, 5, code, border=1, fill=True, new_x="LMARGIN", new_y="NEXT")
        self.ln(3)

# Initialize PDF
pdf = PDF()
pdf.set_auto_page_break(auto=True, margin=25)

# Add Unicode font
try:
    pdf.add_font('DejaVu', '', 'C:/Windows/Fonts/arial.ttf')
    pdf.add_font('DejaVu', 'B', 'C:/Windows/Fonts/arialbd.ttf')
except:
    try:
        pdf.add_font('DejaVu', '', 'C:/Windows/Fonts/calibri.ttf')
        pdf.add_font('DejaVu', 'B', 'C:/Windows/Fonts/calibrib.ttf')
    except:
        pass

# Background color for cover and content
draw_color = (132, 94, 247)
bg_color = (9, 9, 11)

# ========== COVER PAGE ==========
pdf.add_page()
pdf.set_fill_color(*bg_color)
pdf.rect(0, 0, 210, 297, 'F')

# Title
pdf.set_y(80)
pdf.set_font('DejaVu', 'B', 28)
pdf.set_text_color(132, 94, 247)
pdf.cell(0, 20, 'FluentGantt XML', align='C')
pdf.ln(12)

pdf.set_font('DejaVu', '', 13)
pdf.set_text_color(150, 150, 150)
pdf.cell(0, 10, 'Documentation Technique Complete', align='C')
pdf.ln(8)
pdf.cell(0, 10, 'Projet de Gestion de Taches avec XML, XSD, DTD, XSLT', align='C')

pdf.ln(25)

# Tech Stack Box
pdf.set_fill_color(25, 25, 30)
pdf.set_draw_color(132, 94, 247)
pdf.set_line_width(0.5)
pdf.rect(40, 160, 130, 60, style='DF')

pdf.set_y(168)
pdf.set_font('DejaVu', 'B', 12)
pdf.set_text_color(255, 255, 255)
pdf.cell(0, 8, 'Technologies', align='C')
pdf.ln(8)

stack_items = [
    'Python 3, Flask, SQLite',
    'XML, XSD, DTD, XSLT',
    'HTML5, CSS3, JavaScript (Vanilla)',
    'Design: Glassmorphism'
]

pdf.set_font('DejaVu', '', 10)
pdf.set_text_color(150, 150, 150)
for item in stack_items:
    pdf.cell(0, 6, f'   {item}', align='C')
    pdf.ln(6)

pdf.ln(20)
pdf.set_font('DejaVu', '', 10)
pdf.cell(0, 10, 'Genere le: 12 Juin 2026', align='C')

# ========== TABLE OF CONTENTS ==========
pdf.add_page()
pdf.set_fill_color(*bg_color)
pdf.rect(0, 0, 210, 297, 'F')

pdf.h1('Table des Matieres')

toc_items = [
    ('01-vue-ensemble.md', "Vue d'ensemble du Projet"),
    ('02-conception.md', 'Conception & Architecture'),
    ('03-fichiers.md', 'Documentation des Fichiers'),
    ('04-base-donnees.md', 'Base de Donnees SQLite'),
    ('05-etapes-creation.md', 'Etapes de Creation'),
]

pdf.set_font('DejaVu', '', 11)
for i, (file, title) in enumerate(toc_items, 1):
    pdf.set_text_color(200, 200, 200)
    pdf.cell(20, 8, f'{i}.', align='L')
    pdf.cell(0, 8, title, align='L')
    pdf.set_font('DejaVu', '', 9)
    pdf.set_text_color(100, 100, 100)
    pdf.cell(0, 8, f'  (Source: {file})', align='L')
    pdf.set_font('DejaVu', '', 11)
    pdf.ln(8)

# ========== DOCUMENTATION CONTENT ==========
docs_path = 'C:/Users/fuji/Desktop/projet final/XML-Flask/docs'
files_order = [
    '01-vue-ensemble.md',
    '02-conception.md', 
    '03-fichiers.md',
    '04-base-donnees.md',
    '05-etapes-creation.md'
]

for filename in files_order:
    filepath = os.path.join(docs_path, filename)
    
    if not os.path.exists(filepath):
        continue
    
    pdf.add_page()
    pdf.set_fill_color(*bg_color)
    pdf.rect(0, 0, 210, 297, 'F')
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    lines = content.split('\n')
    
    # Extract H1 title
    title = filename.replace('.md', '').replace('-', ' ').title()
    for line in lines:
        if line.startswith('# '):
            title = line.replace('# ', '').strip()
            break
    
    pdf.h1(title)
    
    # Parse content
    in_code = False
    code_lines = []
    
    for line in lines:
        # Skip H1 title line
        if line.startswith('# ') and line == f'# {title}':
            continue
        
        # Code block handling
        if line.strip().startswith('```'):
            if in_code:
                pdf.code('\n'.join(code_lines))
                code_lines = []
                in_code = False
            else:
                in_code = True
            continue
            
        if in_code:
            code_lines.append(line)
            continue
        
        if not line.strip():
            continue
        
        # H2
        if line.startswith('## '):
            pdf.h2(line.replace('## ', '').strip())
        # H3
        elif line.startswith('### '):
            pdf.h3(line.replace('### ', '').strip())
        elif line.startswith('#### '):
            pdf.set_font('DejaVu', 'B', 11)
            pdf.set_text_color(200, 150, 255)
            pdf.cell(0, 8, line.replace('#### ', '').strip(), new_x="LMARGIN", new_y="NEXT", align='L')
            pdf.ln(2)
            
        # Bullet list
        elif line.strip().startswith('- ') or line.strip().startswith('* '):
            item_text = line.strip()[2:]
            if '**' in item_text:
                pdf.set_font('DejaVu', 'B', 10)
                pdf.set_text_color(255, 255, 255)
                pdf.write(6, '- ')
                parts = item_text.split('**')
                for i, part in enumerate(parts):
                    if i % 2 == 1:
                        pdf.set_font('DejaVu', 'B', 10)
                        pdf.set_text_color(255, 255, 255)
                    else:
                        pdf.set_font('DejaVu', '', 10)
                        pdf.set_text_color(200, 200, 200)
                    pdf.write(6, part)
                pdf.ln(6)
            else:
                pdf.set_font('DejaVu', '', 10)
                pdf.set_text_color(200, 200, 200)
                pdf.multi_cell(0, 6, f'- {item_text}', new_x="LMARGIN", new_y="NEXT")
        
        # Numbered list
        elif line.strip() and line.strip()[0].isdigit() and '. ' in line:
            parts = line.strip().split('. ', 1)
            if len(parts) == 2:
                pdf.set_font('DejaVu', '', 10)
                pdf.set_text_color(200, 200, 200)
                pdf.multi_cell(0, 6, f'{parts[0]}. {parts[1]}', new_x="LMARGIN", new_y="NEXT")
        
        # Regular text with bold support
        elif line.strip():
            text = line.strip()
            pdf.set_font('DejaVu', '', 10)
            pdf.set_text_color(200, 200, 200)
            
            if '**' in text:
                pdf.ln(1)
                parts = text.split('**')
                for i, part in enumerate(parts):
                    if i % 2 == 1:
                        pdf.set_font('DejaVu', 'B', 10)
                        pdf.set_text_color(255, 255, 255)
                    else:
                        pdf.set_font('DejaVu', '', 10)
                        pdf.set_text_color(200, 200, 200)
                    pdf.write(6, part)
                pdf.ln(7)
            else:
                # Check for table content
                if '|' in text and not text.startswith('|') and not text.endswith('|'):
                    pdf.body(text)
                else:
                    pdf.multi_cell(0, 6, text, new_x="LMARGIN", new_y="NEXT")
                    pdf.ln(2)

# Save PDF
output_path = 'C:/Users/fuji/Desktop/projet final/XML-Flask/docs/FluentGantt_XML_Documentation.pdf'
pdf.output(output_path)
print(f'PDF genere avec succes: {output_path}')
print(f'Nombre de pages: {pdf.page_no()}')
