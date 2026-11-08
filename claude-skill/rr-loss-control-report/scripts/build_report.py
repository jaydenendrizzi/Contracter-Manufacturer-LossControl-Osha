#!/usr/bin/env python3
"""Build the branded R&R loss control report PDF.

Usage:
  python build_report.py report.json --photos /path/to/photos --out report.pdf

report.json is the polished content Claude writes (schema in SKILL.md). Photos are matched by
file name (F1-1.jpg). If assets/logo.png exists in the skill folder, it goes in the header.
"""
import argparse, json, os, sys
from xml.sax.saxutils import escape
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, Table, TableStyle,
                                Image, KeepTogether, CondPageBreak)

NAVY = colors.HexColor("#1F4244")
AMBER = colors.HexColor("#9A7B3A")
TAN = colors.HexColor("#B8A77F")
RED = colors.HexColor("#B3261E")
GREEN = colors.HexColor("#2E7D4F")
GRAY = colors.HexColor("#596164")
LINE = colors.HexColor("#D3D8D2")
PRIORITY = {"High": RED, "Medium": AMBER, "Low": GRAY}
STATUS = {"Fixed": GREEN, "Partly fixed": AMBER, "Not fixed": RED}

S = {
    "title": ParagraphStyle("title", fontName="Helvetica-Bold", fontSize=20, leading=24, textColor=NAVY, spaceAfter=4),
    "meta": ParagraphStyle("meta", fontName="Helvetica", fontSize=10, leading=14, textColor=GRAY),
    "h2": ParagraphStyle("h2", fontName="Helvetica-Bold", fontSize=13, leading=16, textColor=NAVY, spaceBefore=14, spaceAfter=6),
    "h3": ParagraphStyle("h3", fontName="Helvetica-Bold", fontSize=11, leading=14, spaceAfter=3),
    "body": ParagraphStyle("body", fontName="Helvetica", fontSize=10, leading=14, spaceAfter=6),
    "small": ParagraphStyle("small", fontName="Helvetica", fontSize=8.5, leading=11, textColor=GRAY),
    "cell": ParagraphStyle("cell", fontName="Helvetica", fontSize=9, leading=12),
    "cellb": ParagraphStyle("cellb", fontName="Helvetica-Bold", fontSize=9, leading=12),
    "chip": ParagraphStyle("chip", fontName="Helvetica", fontSize=9, leading=12, textColor=colors.white),
}


def P(text, style="body"):
    return Paragraph(escape(str(text or "")).replace("\n", "<br/>"), S[style])


def labeled(label, text):
    return Paragraph(f"<b>{escape(label)}</b> {escape(str(text or ''))}", S["body"])


def paragraphs(text):
    return [P(chunk.strip()) for chunk in str(text or "").split("\n\n") if chunk.strip()]


def page_decor(data, logo):
    def draw(canvas, doc):
        w, h = letter
        canvas.saveState()
        # Same look as the R&R website header: white, tan rule on top, logo, thin line under
        canvas.setFillColor(TAN)
        canvas.rect(0, h - 5, w, 5, stroke=0, fill=1)
        if logo:
            canvas.drawImage(logo, 0.6 * inch, h - 0.68 * inch, height=0.46 * inch, width=1.15 * inch,
                             preserveAspectRatio=True, anchor="sw", mask="auto")
        else:
            canvas.setFillColor(NAVY)
            canvas.setFont("Helvetica-Bold", 14)
            canvas.drawString(0.6 * inch, h - 0.45 * inch, "R&R Insurance")
        canvas.setFillColor(NAVY)
        canvas.setFont("Helvetica-Bold", 11)
        canvas.drawRightString(w - 0.6 * inch, h - 0.36 * inch, "Loss Control")
        canvas.setFillColor(GRAY)
        canvas.setFont("Helvetica", 9)
        canvas.drawRightString(w - 0.6 * inch, h - 0.54 * inch, f"{data.get('company', '')}  |  {data.get('visit_date', '')}")
        canvas.setStrokeColor(LINE)
        canvas.setLineWidth(0.75)
        canvas.line(0.6 * inch, h - 0.76 * inch, w - 0.6 * inch, h - 0.76 * inch)
        canvas.setFillColor(GRAY)
        canvas.setFont("Helvetica", 8)
        canvas.drawString(0.6 * inch, 0.45 * inch, "Recommendations are advisory. See the disclaimer at the end of this report.")
        canvas.drawRightString(w - 0.6 * inch, 0.45 * inch, f"Page {doc.page}")
        if data.get("draft", True):
            canvas.setFillColor(colors.Color(0.7, 0.15, 0.12, alpha=0.08))
            canvas.setFont("Helvetica-Bold", 70)
            canvas.translate(w / 2, h / 2)
            canvas.rotate(35)
            canvas.drawCentredString(0, 0, "DRAFT")
        canvas.restoreState()
    return draw


def photo_grid(names, photo_dir, width):
    cells = []
    for n in names or []:
        path = os.path.join(photo_dir, n) if photo_dir else n
        if not os.path.exists(path):
            cells.append(P(f"[missing photo {n}]", "small"))
            continue
        img = Image(path)
        k = min(((width - 12) / 2) / img.imageWidth, (2.4 * inch) / img.imageHeight)
        img.drawWidth, img.drawHeight = img.imageWidth * k, img.imageHeight * k
        cells.append(img)
    if not cells:
        return None
    rows = [cells[i:i + 2] + [""] * (2 - len(cells[i:i + 2])) for i in range(0, len(cells), 2)]
    t = Table(rows, colWidths=[width / 2] * 2)
    t.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0),
                           ("BOTTOMPADDING", (0, 0), (-1, -1), 6)]))
    return t


def build(data, photo_dir, out):
    here = os.path.dirname(os.path.abspath(__file__))
    logo = os.path.join(here, "..", "assets", "logo.png")
    logo = logo if os.path.exists(logo) else None
    doc = BaseDocTemplate(out, pagesize=letter, leftMargin=0.75 * inch, rightMargin=0.75 * inch,
                          topMargin=1.05 * inch, bottomMargin=0.8 * inch,
                          title=f"Loss Control Report: {data.get('company', '')}",
                          author=data.get("consultant") or "R&R Insurance")
    doc.addPageTemplates([PageTemplate(id="p", frames=[Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height)],
                                       onPage=page_decor(data, logo))])
    W = doc.width
    story = [P(f"Loss Control {data.get('report_type', 'Visit')} Report", "title")]
    meta = [data.get("company"), data.get("location"), f"Visit date: {data.get('visit_date', '')}"]
    if data.get("consultant"):
        meta.append(f"Prepared by: {data['consultant']}, R&R Insurance")
    story += [Paragraph("<br/>".join(escape(str(m)) for m in meta if m), S["meta"]), Spacer(1, 14)]
    story += paragraphs(data.get("cover_letter"))

    recs = data.get("recommendations") or []
    counts = {p: sum(1 for r in recs if r.get("priority") == p) for p in ("High", "Medium", "Low")}
    chip = Table([[Paragraph(f"<b>{counts[p]}</b> {p.lower()} priority", S["chip"]) for p in counts]], colWidths=[W / 3] * 3)
    chip.setStyle(TableStyle([("BACKGROUND", (i, 0), (i, 0), PRIORITY[p]) for i, p in enumerate(counts)] +
                             [("LEFTPADDING", (0, 0), (-1, -1), 8), ("TOPPADDING", (0, 0), (-1, -1), 6),
                              ("BOTTOMPADDING", (0, 0), (-1, -1), 6), ("LINEAFTER", (0, 0), (1, 0), 2, colors.white)]))
    story += [CondPageBreak(2.5 * inch), P("Summary", "h2"), chip, Spacer(1, 8)] + paragraphs(data.get("summary"))

    prev = data.get("previous_recommendations") or []
    if prev:
        rows = [[P("Recommendation", "cellb"), P("Status", "cellb"), P("Notes", "cellb")]]
        for x in prev:
            c = STATUS.get(x.get("status"), GRAY).hexval()
            rows.append([P(x.get("title"), "cell"),
                         Paragraph(f"<font color='{c}'><b>{escape(str(x.get('status', '')))}</b></font>", S["cell"]),
                         P(x.get("note"), "cell")])
        t = Table(rows, colWidths=[W * 0.5, W * 0.17, W * 0.33], repeatRows=1)
        t.setStyle(TableStyle([("LINEBELOW", (0, 0), (-1, -1), 0.5, LINE), ("VALIGN", (0, 0), (-1, -1), "TOP"),
                               ("LEFTPADDING", (0, 0), (-1, -1), 4)]))
        story += [P("Status of previous recommendations", "h2"), t]

    story += [CondPageBreak(3.2 * inch), P("New recommendations" if prev else "Recommendations", "h2")]
    if not recs:
        story += [P("No new recommendations from this visit.")]
    for r in recs:
        color = PRIORITY.get(r.get("priority"), GRAY)
        inner = [Paragraph(f"{r.get('number', '')}. {escape(str(r.get('title', '')))} "
                           f"<font color='{color.hexval()}'>({escape(str(r.get('priority', '')))} priority)</font>", S["h3"])]
        for key, label in (("observed", "Observed:"), ("why_it_matters", "Why it matters:"), ("recommendation", "Recommendation:")):
            if r.get(key):
                inner.append(labeled(label, r[key]))
        if r.get("action_owner") or r.get("action_due"):
            who = f"assigned to {r['action_owner']}" if r.get("action_owner") else "owner to be assigned"
            due = f", due {r['action_due']}" if r.get("action_due") else ""
            inner.append(Paragraph(f"<font color='{NAVY.hexval()}'><b>Action:</b> {escape(who + due)}</font>", S["body"]))
        if r.get("reference"):
            inner.append(P(f"Reference: {r['reference']}", "small"))
        block = Table([[inner]], colWidths=[W - 4])
        block.setStyle(TableStyle([("LINEBEFORE", (0, 0), (0, -1), 3, color), ("LEFTPADDING", (0, 0), (-1, -1), 10),
                                   ("BOTTOMPADDING", (0, 0), (-1, -1), 2)]))
        parts = [block]
        grid = photo_grid(r.get("photos"), photo_dir, W - 14)
        if grid:
            parts.append(Table([[grid]], colWidths=[W - 4], style=[("LEFTPADDING", (0, 0), (-1, -1), 13)]))
        story.append(KeepTogether(parts + [Spacer(1, 10)]))

    ok = data.get("reviewed_no_issues") or []
    if ok:
        t = Table([[P(x, "cell")] for x in ok], colWidths=[W])
        t.setStyle(TableStyle([("LINEBELOW", (0, 0), (-1, -1), 0.5, LINE)]))
        story += [CondPageBreak(1.5 * inch), P("Reviewed with no issues noted", "h2"), t]
    if data.get("next_steps"):
        story += [P("Next steps", "h2")] + paragraphs(data["next_steps"])
    story += [Spacer(1, 18), Table([[P(data.get("disclaimer", ""), "small")]], colWidths=[W],
                                   style=[("LINEABOVE", (0, 0), (-1, 0), 1, GRAY), ("TOPPADDING", (0, 0), (-1, -1), 6)])]
    doc.build(story)


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("report_json")
    ap.add_argument("--photos", default="")
    ap.add_argument("--out", default="loss-control-report.pdf")
    a = ap.parse_args()
    with open(a.report_json) as f:
        data = json.load(f)
    if not data.get("disclaimer"):
        sys.exit("report.json needs the disclaimer from visit.json, word for word.")
    build(data, a.photos, a.out)
    print(a.out)
