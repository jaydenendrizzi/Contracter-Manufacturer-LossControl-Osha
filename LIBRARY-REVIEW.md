# Library cleanup

Done on 2026-11-10 at your direction. The library went from **5,351 to 4,742 items**.

## What changed

1. **Removed 221 templates that named a company, street address, postcode, phone number, email or private link** (company websites, SharePoint, Google Drive). The check covered titles, descriptions, every question and every course lesson. 208 were caught by the scan. 13 more were found by hand: descriptions like "from C and D Consultancy" or "developed by CBRE" that have no Ltd or Inc to catch. Links to public agencies and trade bodies (osha.gov, cdc.gov, HSE, RoSPA, .org sites) didn't count.
2. **Professional services cut to your approved safety and risk list.** 388 HR and admin templates dropped. 299 of the 319 you approved are left: the other 20 also named a company, so rule 1 removed them.
3. **SafetyCulture and iAuditor removed from 126 templates.** Phrases were rewritten in place ("complete via iAuditor" became "complete in the inspection app", "iAuditor forms" became "inspection forms"). Promo lines ("Powered by iAuditor", "This is an example of how you can use iAuditor...") and SafetyCulture links were deleted, and question counts recalculated. Nothing in the library mentions either name now. The ordinary phrase "safety culture" (two words) was left alone because it's a real safety topic.
4. **Every item has a new id** made from its title plus a short hash. The old ids carried company and person names (`peter-ashley-ltd-...`, `cleanliness-inspection-lena-montalbano-...`).
5. **Internal document codes dropped from 6 titles**, like "(F-SHEQ-A.7-01)".
6. **Library cache bumped to `rr-lib-v2`** in `sw.js` and `index.html`, so phones throw away packs saved under the old ids.

## Counts by industry

| Industry | Templates before | after | Courses before | after |
|---|---|---|---|---|
| Agriculture | 298 | 282 | 0 | 0 |
| Construction | 683 | 651 | 16 | 16 |
| Energy and utilities | 690 | 662 | 3 | 3 |
| Environmental | 19 | 19 | 5 | 5 |
| Health and safety | 252 | 239 | 12 | 12 |
| Health care | 591 | 564 | 10 | 10 |
| Manufacturing | 686 | 659 | 30 | 30 |
| Professional services | 721 | 299 | 0 | 0 |
| Property and facilities | 586 | 566 | 0 | 0 |
| Risk and compliance | 125 | 124 | 22 | 22 |
| Transport and logistics | 589 | 566 | 13 | 13 |
| **Total** | 5240 | 4631 | 111 | 111 |

## What's left that you should know about

- **Names without a legal suffix inside questions.** The scan catches Ltd, LLC, Inc, Pty, GmbH and PLC, plus addresses, phones, emails, links and "by X" or "from X" attributions in descriptions. A question like "Is the Acme toolbox talk signed?" can't be told apart from normal text by a script, so expect a few left. If you spot one, send me the title and I'll pull it.
- **App instructions.** About a dozen templates still say things like "tap the paperclip icon to add notes" or "swipe right to view the risk calculator". No brand name, but they were written for a phone app and would look odd in a printed report. I can strip them.
- **One junk template**, "Form [Sample template]", is still there. Easy cut.

## Removed templates

<details><summary>609 templates (titles as they were)</summary>

| Industry | Title | Why |
|---|---|---|
| Agriculture | COVID-19 Berry Farm Checklist | Named a company, address or contact (link: berries.net.au) |
| Agriculture | Daily Wheeled Loading Shovel Checklist | Named a company, address or contact (postcode: CV13 6LD) |
| Agriculture | Employee Training Record | Named a company, address or contact (company: Farms Limited) |
| Agriculture | Farm Paddock Planning Template | Named a company, address or contact (company: Pty Ltd) |
| Agriculture | Generator Test and Power Outage Checklist | Named a company, address or contact (phone: 0800 496 444) |
| Agriculture | Golf Course Pesticide Inspection Checklist | Named a company, address or contact (email: queanbeyan@epa.nsv.gov.au) |
| Agriculture | Handling Animals Safely Checklist | Named a company, address or contact (link: connect.avivab2b.co.uk) |
| Agriculture | Hygiene Log for Food Handling Staff | Named a company, address or contact (company: Park Inc; postcode: V4W 1J2) |
| Agriculture | Job Safety Analysis Template | Named a company, address or contact (street: 198 Lakes Dr; postcode: QLD 4884) |
| Agriculture | Machine Induction Checklist | Named a company, address or contact (company: Logging Ltd) |
| Agriculture | Monthly Chainsaw Safety Audit Checklist | Named a company, address or contact (company: Logging Limited) |
| Agriculture | New Worker Safety Orientation | Named a company, address or contact (company: Farms Limited) |
| Agriculture | Organic Farm Internal Inspection Form | Named a company, address or contact (company: Glover Limited) |
| Agriculture | South Africa Ethical Visit Template | Named a company, address or contact (company: (Pty) Ltd) |
| Agriculture | Unloading Feed Contractors Checklist | Named a company, address or contact (phone: 02 6033 8026) |
| Agriculture | Volunteer Work Party Checklist | Named a company, address or contact (phone: 1300 368 333) |
| Construction | Construction Legal Compliance Audit | Named a company, address or contact (phone: (074 870 3904) |
| Construction | Construction OHS and Environmental Hazard Inspection | Named a company, address or contact (company: Pty. Ltd) |
| Construction | Construction Work Audit Checklist | Named a company, address or contact (link: iff.sharepoint.com; link: dupont.sharepoint.com) |
| Construction | Contractor Safety Equipment Inspection Checklist | Named a company, address or contact (company: Fallstop Ltd) |
| Construction | Directors and Senior Management Health and Safety Inspection | Named a company, address or contact (company: Kimpton Ltd) |
| Construction | Electrical On Site Sheet | Named a company, address or contact (company: Bros Ltd; email: enquiries@proctercontracts.co.ukW) |
| Construction | Electrical Safety Compliance Certificate Checklist | Named a company, address or contact (email: EATONELQ@housing.wa.gov.au) |
| Construction | Electrical Site Hazard Assessment and SWMS | Named a company, address or contact (link: drive.google.com) |
| Construction | Field Safety Inspection Checklist 2.0 | Named a company, address or contact (phone: 301-699-2390) |
| Construction | Health and Safety Inspection Tool | Named a company, address or contact (company: Services Ltd; email: daniel.manchester@arrowinternational.co.nz) |
| Construction | Health, Safety and Environment Workshop Inspection | Named a company, address or contact (company: Hire Limited) |
| Construction | Heights (working at) EWP SWMS 10515 | Named a company, address or contact (company: Pty Ltd; street: 12 Cassam St) |
| Construction | HSEQ Site Audit Checklist for Construction | Named a company, address or contact (company: Kilwex Ltd) |
| Construction | Install Replace and Test Electrical Safety Devices SWMS | Named a company, address or contact (phone: 94 322 922 169) |
| Construction | ITP Concrete Repair Inspection Test Plan | Named a company, address or contact (street: 16 Booralee St; postcode: NSW 2019) |
| Construction | Jobsite Safety Analysis Checklist | Named a company, address or contact (street: 510 S Skinner Ave) |
| Construction | Jobsite Safety Inspection - Foreman weekly version - 2 | Named a company, address or contact (company: Mechanical, Inc) |
| Construction | Lifting Operations Workplace Inspection | Named a company, address or contact (email: Tom.Gabris@m4e.com.au) |
| Construction | Painting (General Safety) SWMS 10183-4 | Named a company, address or contact (postcode: SA 5110) |
| Construction | Permit to Break Ground Excavation Permit | Company named in the description (found by hand) |
| Construction | Plumbing and Drain Safety Inspection | Named a company, address or contact (company: Plumbing, Inc) |
| Construction | Project Management Tool for Site Safety | Named a company, address or contact (company: Ecoserv, LLC) |
| Construction | Site Audit Compliance Checklist | Named a company, address or contact (company: Pty Ltd; phone: 43 123 149 539) |
| Construction | Site hazards assessment and SWMS | Named a company, address or contact (link: drive.google.com) |
| Construction | Site Operatives Induction and Health Surveillance | Named a company, address or contact (phone: 0845 366 7899) |
| Construction | SWMS for Electrical Repairs Requiring Isolation | Named a company, address or contact (phone: 61 054 742 264) |
| Construction | SWMS JSEA Template for Construction Safety | Named a company, address or contact (phone: 1800 057 981) |
| Construction | Traffic Control Audit Checklist and Compliance Guide | Named a company, address or contact (link: tcaudit.net.auwww.tcaudit.net.au) |
| Construction | UK GOV Working Safely in Construction During COVID-19 | Named a company, address or contact (phone: 0300 790 6787) |
| Construction | Worker Site Inspection Form | Named a company, address or contact (company: Services Ltd) |
| Construction | Working Safely in Other Peoples Homes UK GOV Guide | Named a company, address or contact (link: hsegov.microsoftcrmportals.com; phone: 0300 790 6787) |
| Construction | Works Reinstatement Inspection Master Template | Company named in the description (found by hand) |
| Energy and utilities | Compliance and Enforcement Form with Photos | Named a company, address or contact (link: melbwater.sharepoint.com) |
| Energy and utilities | Electrical Boiler Inspection Report V 2.0 | Named a company, address or contact (email: donna.gilbert@corsan.co.uk) |
| Energy and utilities | Electrical Safety Device - Compliance Certificate - v1.2.3 | Named a company, address or contact (email: EATONELQ@housing.wa.gov.au) |
| Energy and utilities | Electrical Site Audit | Named a company, address or contact (company: Unit, Inc) |
| Energy and utilities | Electrical Switchboard Audit Checklist | Named a company, address or contact (email: facilitiesmaintenance@boroondara.vic.gov.au) |
| Energy and utilities | Engineer Completion Form | Named a company, address or contact (email: salesadmin@theboilernetwork.comIf) |
| Energy and utilities | Fall Preventative Maintenance Checklist | Named a company, address or contact (link: www.hcr-inc.com) |
| Energy and utilities | Gas Elec Gas Audit Work In Progress | Company named in the description (found by hand) |
| Energy and utilities | High Voltage Network Transfer of Control Form | Named a company, address or contact (company: Rose Limited) |
| Energy and utilities | Household Support Fund (Energy) Reporting Form | Named a company, address or contact (email: peter@ridgewaterenergy.co.uk) |
| Energy and utilities | HSEQ Checklist for Fuel Storage Installations | Named a company, address or contact (link: engen.co.zahttp) |
| Energy and utilities | HV Substation Inspection Checklist 2023 | Company named in the description (found by hand) |
| Energy and utilities | HV Switchboard Cleaning and Inspection Report | Named a company, address or contact (phone: 62 128 821) |
| Energy and utilities | IMS Hazard and Near-Miss Report V2 | Named a company, address or contact (email: box.SHE.Incident@cadentgas.comExport) |
| Energy and utilities | Onsite Assessment: Common Property Energy Audit | Named a company, address or contact (link: energyefficiencyassist.com.au) |
| Energy and utilities | Outdoor Work Depots and Facilities Inspection Checklist | Company named in the description (found by hand) |
| Energy and utilities | Power Factor Correction Units Inspection Sheet | Named a company, address or contact (phone: 62 128 821 698) |
| Energy and utilities | Power Station Daily Checks - 3 Sets | Named a company, address or contact (phone: (02) 8294 8836) |
| Energy and utilities | Power Station Daily Checks 4 Set Template | Named a company, address or contact (phone: (02) 8294 8836) |
| Energy and utilities | Radiation Protection Program Audit Checklist | Named a company, address or contact (link: www.apnga.com) |
| Energy and utilities | Risk Management Compliance Agreement | Named a company, address or contact (link: propanemarc.com; link: energilive.com) |
| Energy and utilities | Safety Management System Audit Checklist Part 1 | Named a company, address or contact (phone: 780-449-5258; email: ireport@flint-energy.com) |
| Energy and utilities | Sewer Pump Station Workplace Review Checklist | Named a company, address or contact (link: msdsonline.com.au) |
| Energy and utilities | Sewer Pump Stations Workplace Review Checklist | Named a company, address or contact (link: msdsonline.com.au) |
| Energy and utilities | Site Works Report | Named a company, address or contact (email: service.trinastorage@trinasolar.comMake) |
| Energy and utilities | Switchboard Clean and Inspection Report | Named a company, address or contact (phone: 62 128 821) |
| Energy and utilities | Transformer Oil Spill Report | Named a company, address or contact (phone: 1-800-424-8802; phone: 4 (615) 532-0109) |
| Energy and utilities | Water and Sewer General Inspection Record | Named a company, address or contact (email: Inspections@goldcoast.qld.gov.au; link: seqcode.com.au) |
| Health and safety | Beauty and Skin Penetration Business Inspection Checklist | Named a company, address or contact (email: council@thehills.nsw.gov.au; phone: (02) 9843 0555) |
| Health and safety | Complete Emergency Action Plan Guide for Workplace Safety | Named a company, address or contact (phone: (540) 693-5978) |
| Health and safety | Electrical Safety Walkthrough Checklist Guide | Named a company, address or contact (phone: 15652-2006) |
| Health and safety | Environmental, Health, and Safety (EHS) Checklist | Company named in the description (found by hand) |
| Health and safety | Fire Safety Inspection Checklist and Building Audit Guide | Named a company, address or contact (email: wellstonfiredepartment@gmail.com; phone: 740-384-2128) |
| Health and safety | Food Business Inspection Checklist and Guidelines | Named a company, address or contact (email: council@thehills.nsw.gov.au; phone: (02) 9843 0555) |
| Health and safety | Food Receiving Guidelines and Temperature Control Standards | Named a company, address or contact (company: Raw Inc; street: 600 Read Road St) |
| Health and safety | Forklift Operator Safety Assessment Guide | Named a company, address or contact (email: Ian.lumsden2@gmail.com) |
| Health and safety | Halal Audit Checklist and Compliance Guidelines | Named a company, address or contact (phone: 03-5161 3228) |
| Health and safety | Maintenance Inspection | Named a company, address or contact (company: Systems Inc) |
| Health and safety | Monthly Fire Door Safety Inspection Checklist | Named a company, address or contact (company: OMEGA PLC) |
| Health and safety | SQF Food Safety Management Requirements Guide | Named a company, address or contact (email: foodsafetycrisis@sqfi.com) |
| Health and safety | Swimming Pool Safety Inspection Checklist and Guidelines | Named a company, address or contact (email: council@thehills.nsw.gov.au; phone: (02) 9843 0555) |
| Health care | Annual Workplace Safety Assessment | Named a company, address or contact (link: nula.northcott.local) |
| Health care | Beauty Salon and Skin Penetration Inspection | Named a company, address or contact (email: council@ballina.nsw.gov.au; phone: (02) 6686 1210) |
| Health care | Cardiac-Protected Area Inspection Report | Named a company, address or contact (phone: 62 128 821) |
| Health care | Care Worker Interview Assessment Form Guide | Named a company, address or contact (company: Home Ltd) |
| Health care | Commissioning Inspection for Cardiac-Protected Areas | Named a company, address or contact (phone: 62 128 821 698) |
| Health care | COVID-19 Cleaning and Personal Hygiene Inspection | Named a company, address or contact (link: www.americanchemistry.com) |
| Health care | COVID-19 Fogging and Filtration Controls Checklist | Named a company, address or contact (link: connect.avivab2b.co.uk) |
| Health care | Face Masks and Coverings Compliance Checklist | Named a company, address or contact (link: connect.avivab2b.co.uk) |
| Health care | First Aid Risk Assessment UK | Named a company, address or contact (link: sheqsy.com) |
| Health care | First Aid Treatment Form | Named a company, address or contact (email: Sportsdutymanagers@lboro.ac.uk) |
| Health care | First Aid, Burns Kit and Eye Wash Monthly Check | Company named in the description (found by hand) |
| Health care | General Workplace Hazard Inspection Checklist | Company named in the description (found by hand) |
| Health care | Health and Wellbeing During COVID-19 Checklist | Named a company, address or contact (link: broker.aviva.co.uk) |
| Health care | House Structure Night Shift Checklist | Named a company, address or contact (email: audit@icgrp.co.uk) |
| Health care | Mens Health Checklist UK: 7-Point Self-Check | Named a company, address or contact (email: jo@samaritans.org) |
| Health care | Notification of Health and Safety Incident | Named a company, address or contact (email: callcentre@unitedpe.com.au; phone: 13 0030 3642) |
| Health care | Oregon COVID-19 Guidance for Employers Checklist | Named a company, address or contact (link: govstatus.egov.com) |
| Health care | Safeguarding During a Pandemic Checklist | Named a company, address or contact (link: broker.aviva.co.uk) |
| Health care | Safeguarding of Children and Vulnerable Adults Checklist | Named a company, address or contact (link: connect.avivab2b.co.uk) |
| Health care | Sheltered Housing and Community Alarm Compliance Audit | Named a company, address or contact (email: CHST@milton-keynes.gov.uk) |
| Health care | Shift Check Sheet-General | Named a company, address or contact (email: Brent.Koester@Presencehealth.orgNight) |
| Health care | Skin Penetration Inspection Report | Named a company, address or contact (email: council@canadabay.nsw.gov.au; phone: (02) 9911 6555) |
| Health care | Skin Penetration Premises Inspection Checklist | Named a company, address or contact (email: trc@tamworth.nsw.gov.au; phone: (02) 6767 5555) |
| Health care | UK GOV: Working Safely in Labs During COVID-19 | Named a company, address or contact (phone: 0300 790 6787; link: hsegov.microsoftcrmportals.com) |
| Health care | Working Safely in Labs and Research Facilities | Named a company, address or contact (phone: 0300 790 6787) |
| Health care | Workplace COVID-19 Safety Checklist | Named a company, address or contact (phone: (1800 020 080) |
| Health care | Workplace Reopening Checklist for COVID-19 | Named a company, address or contact (phone: (1800 020 080) |
| Manufacturing | Branch Manager 3-Monthly Safety Checklist | Named a company, address or contact (email: andrew@firesolve.co.uk; link: app.moralbox.com) |
| Manufacturing | CNC Machine Annual Service Checklist | Named a company, address or contact (link: www.haascnc.com) |
| Manufacturing | Control of Hazardous Energy LOTO Procedure | Named a company, address or contact (company: Safety Inc) |
| Manufacturing | COVID-19 Safety for Factories, Plants and Warehouses | Named a company, address or contact (phone: 0300 790 6787; link: hsegov.microsoftcrmportals.com) |
| Manufacturing | Electrical Safety Inspection Report - Industry Vetted | Named a company, address or contact (phone: 15652-2006) |
| Manufacturing | First Aid Provisions Risk Assessment (UK) | Named a company, address or contact (link: www.defibfinder.uk) |
| Manufacturing | Flammable Liquids Fire Safety Checklist | Named a company, address or contact (link: connect.avivab2b.co.uk) |
| Manufacturing | Forklift Truck Operator Safety Evaluation 1.1 | Named a company, address or contact (email: Ian.lumsden2@gmail.com) |
| Manufacturing | GMP Audit Checklist for Food and Beverage | Named a company, address or contact (company: Water Inc; postcode: A0K 4S0) |
| Manufacturing | GMP Audit Checklist for Manufacturing | Named a company, address or contact (phone: 512-00-000-047) |
| Manufacturing | GMP Warehouse and Maintenance Inspection Checklist | Named a company, address or contact (company: Foods, Inc) |
| Manufacturing | Health, Safety and Environmental Audit Checklist | Company named in the description (found by hand) |
| Manufacturing | ISO 17025 2017 Compliance Assessment | Named a company, address or contact (phone: 17025 2017) |
| Manufacturing | ISO 45001 2018 Internal Gap Analysis Audit | Named a company, address or contact (phone: 45001 2018) |
| Manufacturing | Lifting Device Quarterly Inspection Checklist | Named a company, address or contact (company: Kinking Inc) |
| Manufacturing | Manufacturing and Distribution Jobsite Safety Checklist | Named a company, address or contact (email: allsafety@eastridge.com) |
| Manufacturing | Monthly Product Safety Audit Checklist | Named a company, address or contact (email: cindy.goehring@polyone.com) |
| Manufacturing | New Machinery Induction Checklist | Named a company, address or contact (company: Logging Ltd) |
| Manufacturing | Pest Control Policy and Inspection | Named a company, address or contact (phone: 020 8503 3380) |
| Manufacturing | Plant and Equipment Reinstatement Checklist | Named a company, address or contact (link: broker.aviva.co.uk) |
| Manufacturing | Powered Industrial Truck PIT Audit Checklist | Named a company, address or contact (company: Industries Inc) |
| Manufacturing | Pressure Vessel Inspection Checklist | Named a company, address or contact (phone: 1800 807 203) |
| Manufacturing | Project Compliance Audit Checklist | Named a company, address or contact (company: Pro, PLC) |
| Manufacturing | SQF Audit Checklist - Primary Production | Named a company, address or contact (email: foodsafetycrisis@sqfi.com.) |
| Manufacturing | Supplier Operational Audit Checklist | Named a company, address or contact (company: (Pty) Ltd) |
| Manufacturing | Working Safely During COVID-19 in Factories and Warehouses | Named a company, address or contact (phone: 0300 790 6787; link: hsegov.microsoftcrmportals.com) |
| Manufacturing | Zone 6 GMP Inspection Checklist | Named a company, address or contact (company: Foods, Inc) |
| Professional services | 360 Feedback Template | Professional services: HR or admin, not on the keep list |
| Professional services | 360 Leadership Assessment | Professional services: HR or admin, not on the keep list |
| Professional services | 360 Leadership Assessment Template | Professional services: HR or admin, not on the keep list |
| Professional services | 5 Whys Analysis Template | Professional services: HR or admin, not on the keep list |
| Professional services | 5 Whys Form Template | Professional services: HR or admin, not on the keep list |
| Professional services | 5s Office Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | 5S Office Walk Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | 645 Probation Review Form | Professional services: HR or admin, not on the keep list |
| Professional services | A3 Report Template | Professional services: HR or admin, not on the keep list |
| Professional services | A3 Report Template for Problem Solving | Professional services: HR or admin, not on the keep list |
| Professional services | After Hours Call-Out Report | Professional services: HR or admin, not on the keep list |
| Professional services | Agent One-to-One Meeting Template | Professional services: HR or admin, not on the keep list |
| Professional services | Alarm Install | Named a company, address or contact (link: dealers.qolsys.com) |
| Professional services | Animal Information Form (City Regulation) | Professional services: HR or admin, not on the keep list |
| Professional services | Animal Returned to Owner Form | Professional services: HR or admin, not on the keep list |
| Professional services | Annual Car Service Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Annual Leave Request Form Template | Professional services: HR or admin, not on the keep list |
| Professional services | Application Form V1.0 April 2022 | Professional services: HR or admin, not on the keep list |
| Professional services | Area Leaders Cell Evaluation Form | Professional services: HR or admin, not on the keep list |
| Professional services | Area Manager Cleaning Check | Professional services: HR or admin, not on the keep list |
| Professional services | Assign an Action | Professional services: HR or admin, not on the keep list |
| Professional services | Assistants Timesheet Template | Professional services: HR or admin, not on the keep list |
| Professional services | Attendance Record Template | Professional services: HR or admin, not on the keep list |
| Professional services | Automotive Preventative Maintenance Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Basic Asset Management Template | Professional services: HR or admin, not on the keep list |
| Professional services | Basic Decision Matrix Template | Professional services: HR or admin, not on the keep list |
| Professional services | Basic Staff Appraisal | Professional services: HR or admin, not on the keep list |
| Professional services | Before Car Service Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Branch Operational Audit Checklist 4.2015 | Professional services: HR or admin, not on the keep list |
| Professional services | Business Case Analysis Template | Professional services: HR or admin, not on the keep list |
| Professional services | Business Emergency Preparedness Checklist | Named a company, address or contact (phone: 1300 164 884; link: www.mitti.com.au) |
| Professional services | Business Health Check | Professional services: HR or admin, not on the keep list |
| Professional services | Business Health Check Template | Professional services: HR or admin, not on the keep list |
| Professional services | Business Resumption Plan Template Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Business Resumption Plan Template Checklist for Retail Stores | Professional services: HR or admin, not on the keep list |
| Professional services | Change Impact Assessment Template | Professional services: HR or admin, not on the keep list |
| Professional services | Change Management Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Change of Details Form Template | Professional services: HR or admin, not on the keep list |
| Professional services | Change of Staff Details Form | Professional services: HR or admin, not on the keep list |
| Professional services | Change Order Form Template | Professional services: HR or admin, not on the keep list |
| Professional services | Change Request Template | Professional services: HR or admin, not on the keep list |
| Professional services | Cleaning - Weekly Site Inspection | Professional services: HR or admin, not on the keep list |
| Professional services | Client Needs Analysis | Professional services: HR or admin, not on the keep list |
| Professional services | Client Review and Service Feedback | Professional services: HR or admin, not on the keep list |
| Professional services | Client Survey 2024 | Professional services: HR or admin, not on the keep list |
| Professional services | Client Visit Report Template | Professional services: HR or admin, not on the keep list |
| Professional services | Club Compliance Assessment Checklist | Named a company, address or contact (company: Safewise Limited; email: operations@maxserv.co.nz.) |
| Professional services | Code of Conduct Policies and Procedures Template | Professional services: HR or admin, not on the keep list |
| Professional services | Collective Labor Agreement Renewal Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Competency Evaluator | Professional services: HR or admin, not on the keep list |
| Professional services | Comprehensive New Employee Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Comprehensive Procurement Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Comprehensive Procurement Checklist for Local Government | Professional services: HR or admin, not on the keep list |
| Professional services | Comprehensive Supplier Audit | Professional services: HR or admin, not on the keep list |
| Professional services | Condition Survey Template (Commercial) | Professional services: HR or admin, not on the keep list |
| Professional services | Condition Survey Template (Residential) | Professional services: HR or admin, not on the keep list |
| Professional services | Consultant Performance Review | Professional services: HR or admin, not on the keep list |
| Professional services | Context of the Organisation, Interested Parties & Scope | Professional services: HR or admin, not on the keep list |
| Professional services | Contract Details Change Form | Professional services: HR or admin, not on the keep list |
| Professional services | Contract Guarding KPI Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Contract Review Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Corrective Action Plan Template | Professional services: HR or admin, not on the keep list |
| Professional services | Corrective Action Request Form | Professional services: HR or admin, not on the keep list |
| Professional services | Crisis Management Plan Template | Professional services: HR or admin, not on the keep list |
| Professional services | Customer Feedback Form | Professional services: HR or admin, not on the keep list |
| Professional services | Customer Representative Competency Assessment | Professional services: HR or admin, not on the keep list |
| Professional services | Customer Satisfaction Product Survey Template | Professional services: HR or admin, not on the keep list |
| Professional services | Customer Satisfaction Survey Template | Professional services: HR or admin, not on the keep list |
| Professional services | Customer-Facing Employee Evaluation Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Daily Log | Professional services: HR or admin, not on the keep list |
| Professional services | Daily Shift Handover | Professional services: HR or admin, not on the keep list |
| Professional services | Daily Work Log | Professional services: HR or admin, not on the keep list |
| Professional services | Day Sheet Template | Professional services: HR or admin, not on the keep list |
| Professional services | Desk Audit Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Disability Friendly Workplace – Self Assessment | Professional services: HR or admin, not on the keep list |
| Professional services | Disaster Preparedness Kit Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Disciplinary Action and Counseling Report | Professional services: HR or admin, not on the keep list |
| Professional services | Disciplinary Write-up Template | Professional services: HR or admin, not on the keep list |
| Professional services | Discipline | Named a company, address or contact (company: Spratt, Inc) |
| Professional services | Discipline Warning Notice Template | Professional services: HR or admin, not on the keep list |
| Professional services | Display Screen Equipment Risk Assessment Checklist | Named a company, address or contact (link: static.aviva.io) |
| Professional services | Distribution Agreement Template | Professional services: HR or admin, not on the keep list |
| Professional services | Diversity and Inclusion Employee Survey | Professional services: HR or admin, not on the keep list |
| Professional services | Diversity and Inclusion Questionnaire | Professional services: HR or admin, not on the keep list |
| Professional services | Diversity and Inclusion Questions for Employee Surveys | Professional services: HR or admin, not on the keep list |
| Professional services | Document Control Audit Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Documented Discussion Form | Professional services: HR or admin, not on the keep list |
| Professional services | Drug and Alcohol Screening Consent Form | Professional services: HR or admin, not on the keep list |
| Professional services | Due Diligence Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Duty Officer Journal | Professional services: HR or admin, not on the keep list |
| Professional services | Dynamic Field Template | Professional services: HR or admin, not on the keep list |
| Professional services | Effective Supervision Template | Professional services: HR or admin, not on the keep list |
| Professional services | EHS Interview Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | EMPLOYEE APPRAISAL | Professional services: HR or admin, not on the keep list |
| Professional services | Employee Appraisal Template | Professional services: HR or admin, not on the keep list |
| Professional services | Employee Check-in and Performance Review Form | Professional services: HR or admin, not on the keep list |
| Professional services | Employee Counseling Form | Professional services: HR or admin, not on the keep list |
| Professional services | Employee Disciplinary | Professional services: HR or admin, not on the keep list |
| Professional services | Employee Disciplinary Warning Form | Professional services: HR or admin, not on the keep list |
| Professional services | Employee Engagement Questionnaire | Professional services: HR or admin, not on the keep list |
| Professional services | Employee Engagement Survey | Professional services: HR or admin, not on the keep list |
| Professional services | Employee Engagement Survey Template | Professional services: HR or admin, not on the keep list |
| Professional services | Employee Evaluation Form | Professional services: HR or admin, not on the keep list |
| Professional services | Employee Handbook Sign Off Form | Professional services: HR or admin, not on the keep list |
| Professional services | Employee Meeting Form Template | Professional services: HR or admin, not on the keep list |
| Professional services | Employee Offboarding Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Employee Onboarding Audit Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Employee performance appraisal | Professional services: HR or admin, not on the keep list |
| Professional services | EMPLOYEE PERFORMANCE EVALUATION | Professional services: HR or admin, not on the keep list |
| Professional services | Employee Performance Review Template | Professional services: HR or admin, not on the keep list |
| Professional services | Employee Personal Details Change Form | Professional services: HR or admin, not on the keep list |
| Professional services | Employee Review Meeting Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Employee Review Template for Office Staff | Professional services: HR or admin, not on the keep list |
| Professional services | Employee Satisfaction Form Template | Professional services: HR or admin, not on the keep list |
| Professional services | Employee Satisfaction Survey | Professional services: HR or admin, not on the keep list |
| Professional services | Employee Timesheet Template | Professional services: HR or admin, not on the keep list |
| Professional services | Employee Training Acknowledgment Form Template | Professional services: HR or admin, not on the keep list |
| Professional services | Employee Warning Form | Professional services: HR or admin, not on the keep list |
| Professional services | Employee Welfare Checks | Professional services: HR or admin, not on the keep list |
| Professional services | Employee Write Up and Suspension Form | Professional services: HR or admin, not on the keep list |
| Professional services | Employment Application Form | Professional services: HR or admin, not on the keep list |
| Professional services | Entry Condition Report for Rental Property | Professional services: HR or admin, not on the keep list |
| Professional services | EPA Report | Professional services: HR or admin, not on the keep list |
| Professional services | Ergonomics Plus Office Ergonomics Checklist | Company named in the description (found by hand) |
| Professional services | ESG Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | ESG Checklist for Compliance and Reporting | Professional services: HR or admin, not on the keep list |
| Professional services | ESG Due Diligence | Professional services: HR or admin, not on the keep list |
| Professional services | Ethical Trade Audit Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Event Security Appraisal for Crowd Controllers | Professional services: HR or admin, not on the keep list |
| Professional services | Event Sign in Sheet Template | Professional services: HR or admin, not on the keep list |
| Professional services | Exit Interview / Survey | Professional services: HR or admin, not on the keep list |
| Professional services | Exit Interview Survey Template | Professional services: HR or admin, not on the keep list |
| Professional services | Expectant Mothers Assessment | Professional services: HR or admin, not on the keep list |
| Professional services | Expense Claim Form | Professional services: HR or admin, not on the keep list |
| Professional services | Expenses Form Template | Professional services: HR or admin, not on the keep list |
| Professional services | Explosive Ordnance Inspection Checklist | Named a company, address or contact (phone: 690-66-050-7713; phone: 690-66-149-1062) |
| Professional services | Facilities Reopening Readiness Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Failed Customer Visit Feedback Form | Professional services: HR or admin, not on the keep list |
| Professional services | Feedback Template Format | Professional services: HR or admin, not on the keep list |
| Professional services | Field Service Survey Template | Professional services: HR or admin, not on the keep list |
| Professional services | Final Check and Sign Off Template Best Practices | Professional services: HR or admin, not on the keep list |
| Professional services | Find and Fix 2014 Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Find and Fix Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | FMEA Control Plan Template | Professional services: HR or admin, not on the keep list |
| Professional services | FMEA Template | Professional services: HR or admin, not on the keep list |
| Professional services | FMEA Template (Machinery) | Professional services: HR or admin, not on the keep list |
| Professional services | Force Field Analysis Template | Professional services: HR or admin, not on the keep list |
| Professional services | Full ISO 9001, 14001 and 45001 Audit Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Full ISO 9001:2015 and ISO 45001:2018 Audit Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Gap Analysis ISO 9001 Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | General 360 Feedback Template | Professional services: HR or admin, not on the keep list |
| Professional services | General Appraisal Form | Professional services: HR or admin, not on the keep list |
| Professional services | General Business Reopening Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | General Competency Assessment | Professional services: HR or admin, not on the keep list |
| Professional services | General Daily Attendance Sheet Template | Professional services: HR or admin, not on the keep list |
| Professional services | General Employee Evaluation Form | Professional services: HR or admin, not on the keep list |
| Professional services | General Job Sheet Template | Professional services: HR or admin, not on the keep list |
| Professional services | General Officers Report Template (2021) | Professional services: HR or admin, not on the keep list |
| Professional services | General Report Template | Professional services: HR or admin, not on the keep list |
| Professional services | General Training Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | H and S MANAGEMENT REVIEW | Professional services: HR or admin, not on the keep list |
| Professional services | Health and Safety Audit Template | Named a company, address or contact (link: mentordigital.natwestmentor.co.uk) |
| Professional services | Health Questionnaire Template | Professional services: HR or admin, not on the keep list |
| Professional services | Heat Action Plan | Professional services: HR or admin, not on the keep list |
| Professional services | Hiring and Crew training manager | Professional services: HR or admin, not on the keep list |
| Professional services | Holiday Request Form | Professional services: HR or admin, not on the keep list |
| Professional services | Hot work - Critical Process Confirmation | Professional services: HR or admin, not on the keep list |
| Professional services | House of Quality Template | Professional services: HR or admin, not on the keep list |
| Professional services | Housing Disrepair Assessment Template | Professional services: HR or admin, not on the keep list |
| Professional services | Housing Disrepair Client Questionnaire | Professional services: HR or admin, not on the keep list |
| Professional services | Housing Quality Standards Inspection Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | HR Employee Record | Professional services: HR or admin, not on the keep list |
| Professional services | HR Employee Record Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | HR Standard Operating Procedure (SOP) Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | HR Store Visit | Professional services: HR or admin, not on the keep list |
| Professional services | Human Resource Policy Checklist / Needs Analysis v3 | Professional services: HR or admin, not on the keep list |
| Professional services | HVAC Installation Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Information Asset Register Template | Professional services: HR or admin, not on the keep list |
| Professional services | Integrated Internal ISO Audit Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Internal Audit - ISO 9001, 14001 and 45001 | Professional services: HR or admin, not on the keep list |
| Professional services | Internal Audit Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Internal Audit for ISO 9001, 14001 and 45001 | Professional services: HR or admin, not on the keep list |
| Professional services | Internal ISO 14001:2015 Audit Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Interview Application Form Template | Professional services: HR or admin, not on the keep list |
| Professional services | Interview Feedback Template | Professional services: HR or admin, not on the keep list |
| Professional services | Intruder Alarm Maintenance Report | Professional services: HR or admin, not on the keep list |
| Professional services | ISO 17025 2017 Compliance Assessment Checklist | Named a company, address or contact (phone: 17025 2017) |
| Professional services | ISO 17025:2017 Compliance Assessment | Professional services: HR or admin, not on the keep list |
| Professional services | ISO 26000 Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | ISO 37301 Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | ISO 37301 Compliance Management Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | ISO 45001 Safety Gap Analysis Report | Named a company, address or contact (phone: 45001 2018) |
| Professional services | ISO 56002 Internal Audit Checklist | Named a company, address or contact (link: www.sensaco.com) |
| Professional services | ISO 9001 2008 Quality Management Audit Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | ISO 9001 2008 System Audit Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | ISO 9001 2015 Audit Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | ISO 9001 Audit Checklist: Clauses 4-7 | Professional services: HR or admin, not on the keep list |
| Professional services | ISO 9001 Clause 8 Audit Record Form | Professional services: HR or admin, not on the keep list |
| Professional services | ISO 9001 Clause 9 and 10 Audit Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | ISO 9001 Clauses 4-7 Audit Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | ISO 9001 Management Review Template | Professional services: HR or admin, not on the keep list |
| Professional services | ISO 9001 QMS Audit for HR and Administration | Professional services: HR or admin, not on the keep list |
| Professional services | ISO 9001 QMS Internal Audit Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | ISO 9001 Quality Audit Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | ISO 9001 Quality Management Review | Professional services: HR or admin, not on the keep list |
| Professional services | ISO 9001 Section 5 Leadership Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | ISO 9001, 14001 & 45001 Internal Audit Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | ISO 9001:2008 Internal System Audit Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | ISO 9001:2015 and 45001:2018 | Professional services: HR or admin, not on the keep list |
| Professional services | ISO 9001:2015 and ISO 45001:2018 Audit Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | ISO 9001:2015 Audit Checklist (Sample) | Professional services: HR or admin, not on the keep list |
| Professional services | ISO 9001:2015 Evidence Based Decisions | Professional services: HR or admin, not on the keep list |
| Professional services | ISO 9001:2015 Process Audit | Professional services: HR or admin, not on the keep list |
| Professional services | ISO 9001:2015 Process Audit Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | ISO 9001:2015 QMS Compliance Audit | Professional services: HR or admin, not on the keep list |
| Professional services | ISO 9001:2015 Relationship Management Audit | Professional services: HR or admin, not on the keep list |
| Professional services | ISO IEC 17025 2017 Clause 7 Checklist | Named a company, address or contact (phone: 17025 2017) |
| Professional services | ISO/IEC 17020:2012 Audit Checklist | Named a company, address or contact (phone: 17020-2012) |
| Professional services | ISO/IEC 17025:2017 Clause 8 Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Job Application Form Template | Professional services: HR or admin, not on the keep list |
| Professional services | K9 Daily Activity Log | Professional services: HR or admin, not on the keep list |
| Professional services | Kaizen Report Template | Professional services: HR or admin, not on the keep list |
| Professional services | KPI Evaluation Form | Professional services: HR or admin, not on the keep list |
| Professional services | Leader Performance Review | Professional services: HR or admin, not on the keep list |
| Professional services | Leadership Competency Assessment Template | Professional services: HR or admin, not on the keep list |
| Professional services | Leave Application Form | Professional services: HR or admin, not on the keep list |
| Professional services | Leavers Certificate | Professional services: HR or admin, not on the keep list |
| Professional services | Leavers Form Template (Employee Offboarding) | Professional services: HR or admin, not on the keep list |
| Professional services | Legal Checklist Template | Professional services: HR or admin, not on the keep list |
| Professional services | Legal Due Diligence Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Life Cell Weekly Report Form | Professional services: HR or admin, not on the keep list |
| Professional services | Major Car Service Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Management Audit Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Management of Change Form Template | Professional services: HR or admin, not on the keep list |
| Professional services | Management of Proposed Change Form | Professional services: HR or admin, not on the keep list |
| Professional services | Management Review Attendance Sheet | Professional services: HR or admin, not on the keep list |
| Professional services | Management Review Template for QMS Meetings | Professional services: HR or admin, not on the keep list |
| Professional services | Management System Gap Analysis Template | Professional services: HR or admin, not on the keep list |
| Professional services | Manager and Assistant Manager Performance Assessment | Professional services: HR or admin, not on the keep list |
| Professional services | Manager and Assistant Manager Self Assessment | Professional services: HR or admin, not on the keep list |
| Professional services | Manager Self-Evaluation Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Manager Training Review | Professional services: HR or admin, not on the keep list |
| Professional services | Manager, AM and Supervisor 360 Form | Professional services: HR or admin, not on the keep list |
| Professional services | Market Research Survey - Product Feedback | Professional services: HR or admin, not on the keep list |
| Professional services | Market Survey Template - Field Research | Professional services: HR or admin, not on the keep list |
| Professional services | Master After Action Report Template | Professional services: HR or admin, not on the keep list |
| Professional services | Maternity Risk Assessment Template | Named a company, address or contact (company: Golf Ltd) |
| Professional services | Mechanic Work Order Form (Automotive) | Professional services: HR or admin, not on the keep list |
| Professional services | Meeting Form 2025 | Professional services: HR or admin, not on the keep list |
| Professional services | Meeting Form Template | Professional services: HR or admin, not on the keep list |
| Professional services | Meeting Minutes Form | Professional services: HR or admin, not on the keep list |
| Professional services | Membership Tour Evaluation Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Montana General Business Reopening Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Monthly Client Meeting | Professional services: HR or admin, not on the keep list |
| Professional services | Needs Assessment Template (Business/Department) | Professional services: HR or admin, not on the keep list |
| Professional services | Needs Assessment Template for Business and Departments | Professional services: HR or admin, not on the keep list |
| Professional services | Needs Assessment Training Survey | Professional services: HR or admin, not on the keep list |
| Professional services | New Client Intake Form | Professional services: HR or admin, not on the keep list |
| Professional services | New Employee Onboarding Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | New Employee Training Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | New Hire Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | New Hire Training Evaluation Form | Professional services: HR or admin, not on the keep list |
| Professional services | New Starter Day 1 Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | New Starter Day 1 Onboarding Form | Professional services: HR or admin, not on the keep list |
| Professional services | New Starter Form | Professional services: HR or admin, not on the keep list |
| Professional services | New Starter Onboarding Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | New York Office Reopening Plan Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Night Worker Package | Named a company, address or contact (email: Healthandsafety@omnifm.com) |
| Professional services | Numeric Input Template | Professional services: HR or admin, not on the keep list |
| Professional services | Office 5S Audit Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Office Audit Checklist | Named a company, address or contact (company: UK Ltd) |
| Professional services | Office Employee Performance Review | Professional services: HR or admin, not on the keep list |
| Professional services | Office Evaluation Form Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Office Level 3.0 Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Office WHS Audit Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Ohio COVID-19 Checklist for Businesses and Employers | Named a company, address or contact (phone: 1-833-427-5634) |
| Professional services | OHS Manager People Capability Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | On-Site Drug and Alcohol Authorization Form | Professional services: HR or admin, not on the keep list |
| Professional services | One-to-One Meeting Template | Professional services: HR or admin, not on the keep list |
| Professional services | Online Marketing Audit Report | Professional services: HR or admin, not on the keep list |
| Professional services | Order Picker Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Organizational Health Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Patrol Evaluation Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Peer Employee Evaluation Form | Professional services: HR or admin, not on the keep list |
| Professional services | Pennsylvania Reopening Checklist for In-Person Business | Professional services: HR or admin, not on the keep list |
| Professional services | Performance Appraisal Form | Professional services: HR or admin, not on the keep list |
| Professional services | Performance Appraisal Template | Professional services: HR or admin, not on the keep list |
| Professional services | Performance Discussion Record Template | Professional services: HR or admin, not on the keep list |
| Professional services | Performance Improvement Plan for Agents | Professional services: HR or admin, not on the keep list |
| Professional services | Performance Management Template | Professional services: HR or admin, not on the keep list |
| Professional services | Performance Review | Professional services: HR or admin, not on the keep list |
| Professional services | Performance Review - Local | Professional services: HR or admin, not on the keep list |
| Professional services | Performance Review for Probationary Employees | Professional services: HR or admin, not on the keep list |
| Professional services | Pet Spa Daily Opening Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Phase 3 Implementation | Professional services: HR or admin, not on the keep list |
| Professional services | Phone Experience Mystery Shopper Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Placement Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Planning Application Form | Professional services: HR or admin, not on the keep list |
| Professional services | Police Report Template | Professional services: HR or admin, not on the keep list |
| Professional services | Policies and Procedures Template for Small Business | Professional services: HR or admin, not on the keep list |
| Professional services | Post Employee Assault Report | Professional services: HR or admin, not on the keep list |
| Professional services | Post-Issue Resolution Customer Feedback | Professional services: HR or admin, not on the keep list |
| Professional services | Post-Training Evaluation Form | Professional services: HR or admin, not on the keep list |
| Professional services | Preflight Checklist and Scope of Work | Professional services: HR or admin, not on the keep list |
| Professional services | Pregnancy Risk Assessment Template | Named a company, address or contact (link: sl.safesmart.co.uk) |
| Professional services | Preparing for Home Working or Flexible Working | Professional services: HR or admin, not on the keep list |
| Professional services | Probation Period Assessment | Named a company, address or contact (email: Karen.stubbings@westwayservices.com) |
| Professional services | Probation Period Performance Review Template | Professional services: HR or admin, not on the keep list |
| Professional services | Probation Review Form | Professional services: HR or admin, not on the keep list |
| Professional services | Process Documentation Template | Professional services: HR or admin, not on the keep list |
| Professional services | Procurement Audit Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Product Development Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Product Launch Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Professional Photography Model Release Form | Professional services: HR or admin, not on the keep list |
| Professional services | Project Audit Interview Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Project Charter Template | Professional services: HR or admin, not on the keep list |
| Professional services | Project Execution Plan Template | Professional services: HR or admin, not on the keep list |
| Professional services | Project Initiation Document Template | Professional services: HR or admin, not on the keep list |
| Professional services | Project Kickoff Audit Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Project Management Plan Guide and Template | Professional services: HR or admin, not on the keep list |
| Professional services | Project Meeting Minutes | Professional services: HR or admin, not on the keep list |
| Professional services | Project Meeting Minutes Template | Professional services: HR or admin, not on the keep list |
| Professional services | Project Status Report Template | Professional services: HR or admin, not on the keep list |
| Professional services | Property Information Form | Professional services: HR or admin, not on the keep list |
| Professional services | Public Administration Management | Professional services: HR or admin, not on the keep list |
| Professional services | QMS Systems Internal Audit Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Quality Audit | Professional services: HR or admin, not on the keep list |
| Professional services | Real Estate Buyer Agent Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Real Estate Due Diligence Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Real Estate Listing Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Real Estate Listing Form | Professional services: HR or admin, not on the keep list |
| Professional services | Real Estate Seller Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Real Estate Sellers Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Real Estate Transaction Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Reasonable Suspicion Observation Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Record of Interview 2019 | Professional services: HR or admin, not on the keep list |
| Professional services | Recruitment and Selection Audit | Professional services: HR or admin, not on the keep list |
| Professional services | Regional Meeting Action points | Professional services: HR or admin, not on the keep list |
| Professional services | Remote Working Risk Assessment Checklist | Named a company, address or contact (email: safety@montu.com.au) |
| Professional services | Request for Quotation Template | Professional services: HR or admin, not on the keep list |
| Professional services | Retail Security Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Return to Work Form | Named a company, address or contact (company: TT2 Ltd) |
| Professional services | Returning to Work in an Office during COVID-19 | Named a company, address or contact (link: connect.avivab2b.co.uk) |
| Professional services | Reward Nomination Form Template | Professional services: HR or admin, not on the keep list |
| Professional services | Right-To-Know Inventory Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Roof Void Entry Review Report | Named a company, address or contact (email: pc-operation-sg@rentokil-initial.com) |
| Professional services | Safety Culture Interview Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Safety Risk Assessment for UK Offices | Named a company, address or contact (link: www.cs-compliance.co.uk) |
| Professional services | Sales Manager Coaching Assessment | Professional services: HR or admin, not on the keep list |
| Professional services | Sales Opportunity Requirements Definition | Named a company, address or contact (company: Projections, Inc) |
| Professional services | Scope of Work Template | Professional services: HR or admin, not on the keep list |
| Professional services | Security Assignment Instructions and Protocols Guide | Named a company, address or contact (email: jason.brown@proactivesecurity.org.uk) |
| Professional services | Security Services Agreement | Named a company, address or contact (street: (7 King Street; postcode: BL5 3AX) |
| Professional services | Security Staff Audit Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Self Certification Absence Report | Named a company, address or contact (company: ParkingEye Ltd) |
| Professional services | Sellers Information Sheet | Professional services: HR or admin, not on the keep list |
| Professional services | Short Term / Single Supply Assessment Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Short Term Single Supply Assessment - Office | Professional services: HR or admin, not on the keep list |
| Professional services | Signature Register/Signature Log Template | Professional services: HR or admin, not on the keep list |
| Professional services | Site Membership Sales Audit Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Site training audit | Named a company, address or contact (company: Services Ltd) |
| Professional services | Skills Gap Analysis Template | Professional services: HR or admin, not on the keep list |
| Professional services | Social Media Policies and Procedures Template | Professional services: HR or admin, not on the keep list |
| Professional services | SOP Template | Professional services: HR or admin, not on the keep list |
| Professional services | Sourcing Audit Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Sports Club Review Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Staff Audit and Appraisal Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Staff Discussion Form and Scorecard | Professional services: HR or admin, not on the keep list |
| Professional services | Staff Evaluation Form | Professional services: HR or admin, not on the keep list |
| Professional services | Staff Feedback Checklist | Named a company, address or contact (company: Management Ltd) |
| Professional services | Staff Files Audit Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Staff Performance Appraisal | Professional services: HR or admin, not on the keep list |
| Professional services | Staff Performance Appraisal Form | Professional services: HR or admin, not on the keep list |
| Professional services | Standard Operating Procedure Template Simple Guide | Professional services: HR or admin, not on the keep list |
| Professional services | Stockpiles Monthly Inspection Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Supervisor Manager Support and Communication Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Supplier Audit Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Supplier Due Diligence Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Survey Questions To Ask About Diversity, Equity, and Inclusion | Professional services: HR or admin, not on the keep list |
| Professional services | Sustainability Audit Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Task Debrief Checklist 2023 | Professional services: HR or admin, not on the keep list |
| Professional services | Task Debrief Template 2023 | Professional services: HR or admin, not on the keep list |
| Professional services | Team Evaluation Form | Professional services: HR or admin, not on the keep list |
| Professional services | Team Management Safety Audit Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Technical Due Diligence Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Technical Due Diligence Checklist for Commercial Real Estate | Professional services: HR or admin, not on the keep list |
| Professional services | Template with Approvals | Professional services: HR or admin, not on the keep list |
| Professional services | Test Template for Export Profiles | Professional services: HR or admin, not on the keep list |
| Professional services | Time and Attendance Sign-In/Out Sheet | Professional services: HR or admin, not on the keep list |
| Professional services | Top-Down Employee Evaluation | Professional services: HR or admin, not on the keep list |
| Professional services | Traffic Light Casual Reduction | Professional services: HR or admin, not on the keep list |
| Professional services | Traffic Light Medical Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Traffic Light Overtime Control Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Traffic Light Recruitment Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Trainee Evaluation Form | Professional services: HR or admin, not on the keep list |
| Professional services | Training and Competence Audit Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Training Effectiveness Evaluation Form | Professional services: HR or admin, not on the keep list |
| Professional services | Training Feedback Form | Professional services: HR or admin, not on the keep list |
| Professional services | Travelling for Work During COVID-19 Checklist | Named a company, address or contact (link: broker.aviva.co.uk) |
| Professional services | Uniform Issuance Form Template | Professional services: HR or admin, not on the keep list |
| Professional services | Uniform Order Form Template | Professional services: HR or admin, not on the keep list |
| Professional services | Vehicle Bill of Sale Template | Named a company, address or contact (company: Equipment LLC; company: EQUIPMENT LLC) |
| Professional services | Virginia Reopening Checklist for All Business Sectors | Professional services: HR or admin, not on the keep list |
| Professional services | Virginia Reopening Checklist: Personal Care Services | Professional services: HR or admin, not on the keep list |
| Professional services | Wandering at Large Dogs Report 2021 | Professional services: HR or admin, not on the keep list |
| Professional services | Waste Audit Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Weapons Handling Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Website Landing Page Audit Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Weekend Availability | Professional services: HR or admin, not on the keep list |
| Professional services | Weekly Incident Log Template | Named a company, address or contact (email: epo@crawley.gov.uk) |
| Professional services | Weekly One on One Leadership Meeting | Professional services: HR or admin, not on the keep list |
| Professional services | Weekly Timesheet Template | Professional services: HR or admin, not on the keep list |
| Professional services | Weighted Decision Matrix Template | Professional services: HR or admin, not on the keep list |
| Professional services | Wisconsin Reopening Checklist for Hair and Nail Salons | Professional services: HR or admin, not on the keep list |
| Professional services | Work Order Invoice Template | Professional services: HR or admin, not on the keep list |
| Professional services | Workers Compensation Training Audit Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Working Safely in Other People's Homes UK GOV Guide | Named a company, address or contact (phone: 0300 790 6787; link: hsegov.microsoftcrmportals.com) |
| Professional services | Workplace Analysis Checklist | Professional services: HR or admin, not on the keep list |
| Professional services | Workplace Culture Survey | Professional services: HR or admin, not on the keep list |
| Professional services | Workplace Pandemic Preparedness Plan | Professional services: HR or admin, not on the keep list |
| Professional services | Worksite Assessment Report | Professional services: HR or admin, not on the keep list |
| Professional services | Zero Defects Plan Implementation Template | Professional services: HR or admin, not on the keep list |
| Property and facilities | Building and Workplace Reinstatement Checklist | Named a company, address or contact (link: broker.aviva.co.uk) |
| Property and facilities | Complete Home Inspection and Resident Orientation Checklist | Named a company, address or contact (phone: 855-676-1680) |
| Property and facilities | Daily Cleaning & Personal Hygiene Inspection (COVID-19) | Named a company, address or contact (link: www.americanchemistry.com) |
| Property and facilities | Emergency Response Management Plan Annual Audit | Named a company, address or contact (email: occupierstatement@emergency.qld.gov.au) |
| Property and facilities | Fire Alarm Maintenance Certificate Template | Named a company, address or contact (email: service@buildingtechnologyservices.co.uk; phone: 01283 566) |
| Property and facilities | Fire and Emergency Inspection Checklist | Named a company, address or contact (email: occupier.statements@dcs.qld.gov.au) |
| Property and facilities | Fire Compartmentation Checklist | Named a company, address or contact (link: static.aviva.io) |
| Property and facilities | Fire Dept. Inspection Report - Commercial Facilities | Named a company, address or contact (phone: (614) 729-1920) |
| Property and facilities | Fire Extinguisher Weekly Inspection Record | Named a company, address or contact (email: defib@scas.nhs.uk) |
| Property and facilities | Fire Risk Assessment and Review | Named a company, address or contact (company: Solutions Ltd) |
| Property and facilities | Flood Emergency Electrical Testing Checklist | Named a company, address or contact (email: EATONELQ@housing.wa.gov.au) |
| Property and facilities | Head Office Safety and Housekeeping Inspection | Named a company, address or contact (company: Kone Ltd) |
| Property and facilities | Home Inspection Checklist Template | Named a company, address or contact (company: (Pty)Ltd) |
| Property and facilities | Hot Work Operations Permit and Checklist | Named a company, address or contact (link: broker.aviva.co.uk) |
| Property and facilities | Office Health, Safety and Welfare Inspection Checklist | Named a company, address or contact (company: Assessments Inc) |
| Property and facilities | Real Estate Pool Inspection Checklist | Company named in the description (found by hand) |
| Property and facilities | Roof Void Inspection Checklist Without Entry | Named a company, address or contact (email: pc-operation-sg@rentokil-initial.com) |
| Property and facilities | Static Site Competency Assessment Checklist | Named a company, address or contact (link: arcusfs01) |
| Property and facilities | Water Mist Fire Protection Systems Checklist | Named a company, address or contact (link: connect.avivab2b.co.uk) |
| Property and facilities | Wildfire Home Assessment Rapid Checklist | Named a company, address or contact (phone: 509-763-3034; email: cynthia.tonasket@dnr.wa.govFill) |
| Risk and compliance | Comprehensive Fire Risk Assessment and Safety Audit Guide | Named a company, address or contact (email: iauditor@ramislive.com) |
| Transport and logistics | 62 Point Vehicle Condition Report | Named a company, address or contact (street: 1849 Ipswich Rd) |
| Transport and logistics | Approved Inspection Station Audit Checklist | Named a company, address or contact (email: ais@stategrowth.tas.gov.au) |
| Transport and logistics | Approved Provider and Supplier e-Audit | Named a company, address or contact (company: Schenker Ltd; email: QSHE@dbschenker.com) |
| Transport and logistics | Bridge Risks and Diversion Management | Named a company, address or contact (email: fleetdimensions.bridge@firstgroup.com; email: fleetdimensions@firstgroup.com) |
| Transport and logistics | Demolition Comprehensive Site Audit | Company named in the description (found by hand) |
| Transport and logistics | Driver Roadside Safety Observation Report | Named a company, address or contact (email: transport-compass@sgbd.co.uk) |
| Transport and logistics | Electric and Hybrid Vehicles Safety Checklist | Named a company, address or contact (link: broker.aviva.co.uk) |
| Transport and logistics | Forklift Pre-Shift Inspection | Named a company, address or contact (company: Farms Limited) |
| Transport and logistics | Inspection Checklist - General Inspection | Named a company, address or contact (company: Pte Ltd) |
| Transport and logistics | Monthly Fall Protection Harness Inspections | Company named in the description (found by hand) |
| Transport and logistics | Operator Vehicle and Driver Observation Report | Named a company, address or contact (email: FRS.Control@firstgroup.com) |
| Transport and logistics | Service Vehicle Audit Checklist | Named a company, address or contact (company: Solutions Ltd) |
| Transport and logistics | Station Audit Checklist | Named a company, address or contact (email: clafarr@drummac.com) |
| Transport and logistics | SUBCONTRACTED ROAD TRANSPORT REQUIREMENTS AUDITING CHECKLIST. | Named a company, address or contact (company: Tanzania Limited) |
| Transport and logistics | Traffic Control Worksite Audit | Named a company, address or contact (link: aaaatrafficmanagement.com.au; link: tcaudit.net.auhttp) |
| Transport and logistics | Tyre Inspection / Job Card | Named a company, address or contact (link: assetassured.com.auhttp) |
| Transport and logistics | UK Warehouse and Distribution Center Risk Assessment | Named a company, address or contact (link: www.cs-compliance.co.uk) |
| Transport and logistics | Warehouse Safety Standard Operating Procedure | Named a company, address or contact (company: Consulting LLC) |
| Transport and logistics | Work Instructions for Warehouse Logistics | Named a company, address or contact (link: meridansch.opsilive.com) |
| Transport and logistics | Working Safely During COVID-19 in or From a Vehicle | Named a company, address or contact (phone: 0300 790 6787; link: hsegov.microsoftcrmportals.com) |
| Transport and logistics | Working Safely in or from a Vehicle UK GOV Guidance | Named a company, address or contact (phone: 0300 790 6787; email: safer.workplaces@beis.gov.uk) |
| Transport and logistics | Workplace Transport Safety Checklist | Named a company, address or contact (link: static.aviva.io) |
| Transport and logistics | Manual Handling Root Cause Analysis V3 | Named a company, address or contact (email: ifce.ccas@ba.com) |

</details>
