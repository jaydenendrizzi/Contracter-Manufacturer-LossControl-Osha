---
name: rr-loss-control-report
description: Turns an R&R Insurance loss control site visit into a branded, client-ready report PDF. Use whenever someone shares a visit.json from the R&R loss control walkthrough, walkthrough notes or photos from a safety inspection, a request to write a loss control letter, visit report, follow-up report or recommendation letter, or says something like "write up my visit" or "turn these notes into a report" for a manufacturing plant, contractor or job site. Also use for follow-up emails about open loss control recommendations.
---

# R&R loss control report

Turn a consultant's walkthrough into the R&R report (R&R logo, teal and tan brand colors, built into the script): a cover letter, prioritized recommendations with photos, the status of past recommendations on follow-ups, and the required disclaimer, rendered as a branded PDF.

The report goes to a client and can end up in a claim or a lawsuit. Accuracy and careful wording matter more than polish.

## Inputs

Usually a `visit.json` (format `rr-loss-control-visit/1`) plus photos named `F<finding>-<n>.jpg`, shared from the R&R Loss Control site. Sometimes just pasted notes and photos. If there's no visit.json, build the same structure from what was pasted and ask for anything missing that the report needs: company, visit date, consultant name.

visit.json fields: `company`, `location`, `visit_date`, `consultant`, `site_type`, `prior_osha_citations`, `prior_severe_injuries`, `previous_recommendations` (follow-ups: title, priority, recommendation, status, note), `findings` (number, title, section, priority, reference, cited_before, observed, draft_recommendation, action_owner, action_due, photos), `reviewed_no_issues`, `not_checked`, `disclaimer`.

## Steps

1. Read visit.json and look at every photo. Check each photo against its finding's notes.
2. If a photo shows a hazard the consultant didn't note, or contradicts the notes, ask before writing it in. Never add observations the consultant didn't make.
3. If a finding has no notes, ask for one line on what they saw. Don't invent one from the title.
4. Write `report.json` (schema below) following `references/writing-guide.md`. Read that file first, every time.
5. Render: `python scripts/build_report.py report.json --photos <photo folder> --out "<Company> Loss Control Report <YYYY-MM-DD>.pdf"`. Save it to the outputs folder and present it.
6. Tell the consultant in two or three lines what to check before sending: anything you weren't sure about, any finding you merged or reworded heavily. The PDF says DRAFT until they confirm it's reviewed. Then rebuild with `"draft": false`.

For a follow-up email about open recommendations, skip the PDF and write the email in the reply.

## report.json schema

```json
{
  "company": "", "location": "", "visit_date": "November 7, 2026", "consultant": "",
  "report_type": "Visit | Follow-up Visit",
  "draft": true,
  "cover_letter": "Paragraphs separated by blank lines. Greeting, 2 to 4 short paragraphs, no sign-off block needed.",
  "summary": "2 to 3 sentences: how many recommendations, the one that matters most, follow-up progress if any.",
  "previous_recommendations": [{"title": "", "status": "Fixed | Partly fixed | Not fixed", "note": ""}],
  "recommendations": [{"number": 1, "title": "", "priority": "High | Medium | Low", "observed": "", "why_it_matters": "", "recommendation": "", "reference": "29 CFR 1910.147(c)(4)", "action_owner": "Mike, plant manager", "action_due": "December 8, 2026", "photos": ["F1-1.jpg"]}],
  "reviewed_no_issues": [""],
  "next_steps": "",
  "disclaimer": "Copied word for word from visit.json"
}
```

Order recommendations High, then Medium, then Low, and renumber them. Keep each finding's photo file names, action owner and due date attached to it. Photos may already have red or yellow circles and arrows from the consultant; refer to them ("circled in the photo") rather than describing them as part of the scene. Prefix OSHA references with "29 CFR" (for example "29 CFR 1926.501(b)(1)"). Leave non-OSHA references (NFPA, best practice) as written.

## Hard rules

- The disclaimer goes in exactly as given. If visit.json doesn't have one, stop and ask for R&R's approved disclaimer.
- Never say or imply the site is compliant, safe, or OSHA-approved. "Reviewed with no issues noted" is the strongest positive statement allowed.
- Never call something a "violation." That's a legal finding only OSHA makes. Say "condition," and cite the standard as a reference.
- Don't predict OSHA penalties or tell the client what OSHA would do.
- Only cite the standards the consultant listed, or ones you're certain apply. When unsure, leave the reference off rather than guess.
