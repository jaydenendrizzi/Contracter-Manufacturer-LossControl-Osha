# Citation review: industry sections

Checked 197 industry walkthrough items, plus the 10 in the new Glass section against eCFR (29 CFR 1910 and 1926, current through 2026-11-02, pulled from the eCFR API). Every CFR section and paragraph cited was fetched and read against what the item asks for.

**Result:** 10 items changed, the rest verified. Two cites pointed at rules that no longer exist (1910.108 and 1910.94(d), both moved in OSHA's 2016 dip tank rewrite), one pointed at a paragraph that never existed (1926.201(a)(2)), and four cited a real section that doesn't say what the item relies on (1926.250(b), 1926.20(b), 1926.1400, 1926.914).

Item ids are `section-index` (for example `highway-1` is the second item in the Highway section). The ids saved in walkthroughs did not change. Only the reference text changed.

## The ones you flagged

| Cite | Verdict |
|---|---|
| 1926.201(a)(2) flagger hi-vis | **Wrong.** No (a)(2) exists. 1926.201(a) is one paragraph that sends flagger signaling and warning garments to MUTCD Part 6. Now `1926.201(a); MUTCD Part 6`. |
| 1910.179(j) + ASME B30.2, ladle cranes | **Verified.** (j) is crane inspection; hooks in (j)(2), pins and locking parts in (j)(3). B30.2 is the overhead and gantry crane standard. |
| 1926.1400, excavator lifting | **Wrong direction.** 1926.1400(c)(2) *excludes* excavators from the crane rules, even with slings. Kept 1926.251 for rigging and noted the exclusion. |
| 1910.36 / 1910.37, freezer door release | **Right sections, now pinned:** 1910.36(d)(1) open from inside without keys or tools; 1910.37(a)(3) unobstructed. No freezer-specific rule exists. |
| 1926.250(b), falling objects | **Wrong.** That's material storage. Falling object protection is 1926.501(c). |
| 1926.20(b), site security | **Wrong.** It's the general program duty. No OSHA rule covers site security or the public. Now marked as a local code item. |
| 1910.215(b)(9) tongue guard | **Verified.** Exposure adjustment, gap never over 1/4 inch. Work rest 1/8 inch is (a)(4), also verified. |
| 1910.119 thresholds | **Verified.** Anhydrous ammonia 10,000 lb in Appendix A (and 40 CFR 68.130). Chlorine dioxide and HF 1,000 lb. |

## Could not verify online

These are best-practice pointers, not law. osha.gov blocks automated requests and the ANSI, NFPA, ASME and IIAR sites aren't reachable from here, so the document numbers below are from knowledge only:

- 1926 Subpart M
- ANSI B11
- ANSI B11.3
- ANSI B151.1
- ANSI B65.1
- ANSI Z136.1
- ANSI Z245.5
- ANSI Z358.1
- ANSI/ASSE Z50.1
- ANSI/IIAR 6
- ANSI/RIA R15.06
- ASME B30.2
- General Duty Clause 5(a)(1)
- MUTCD Part 6
- NFPA 61
- NFPA 652
- NFPA 664
- NFPA 86
- NIOSH lifting guidance
- OSHA 3123 meatpacking guidelines
- OSHA CPL 02-00-124
- local codes

All look right to me (for example NFPA 652 dust fundamentals, NFPA 664 wood dust, NFPA 61 agricultural and food dust, NFPA 86 ovens and furnaces, ANSI Z358.1 eyewash, ANSI B11.3 press brakes, ANSI/RIA R15.06 robots, ANSI Z245.5 balers, ANSI B65.1 printing, ANSI/ASSE Z50.1 bakery equipment, ANSI Z136.1 lasers, OSHA 3123 meatpacking ergonomics guidelines, CPL 02-00-124 multi-employer policy). Worth a quick human check before a client sees them.

## New section: Glass and glass products

Added 2026-11-10. Every CFR cite below was pulled from eCFR and read against the item.

| Item | Question | Old cite | Cite | Note |
|---|---|---|---|---|
| glass-0 | Hot end PPE worn around furnaces, forehearths and forming | (new) | 1910.132(a); 1910.132(d); 1910.133(a)(5) | 1910.132(d) requires a written hazard assessment and PPE selection. 1910.133(a)(5) requires filter lenses with a shade suited to the work for injurious light radiation; its shade table is written for welding, so for furnace glare follow the PPE maker's infrared rating. |
| glass-1 | Cut protection for handling sheet glass and cullet | (new) | 1910.138(a); 1910.132(a) | 1910.138(a) names severe cuts and lacerations. Verified. |
| glass-2 | Glass racks, A-frames and stillages restrained | (new) | 1910.176(b); General Duty Clause 5(a)(1) | 1910.176(b): storage must not create a hazard and must be secure against sliding or collapse. No glass-specific rack rule exists, so the General Duty Clause carries the rest. |
| glass-3 | Forklift, crane and vacuum lifter handling of glass | (new) | 1910.178(l); 1910.184(d); ASME B30.20 | 1910.178(l) operator training, 1910.184(d) daily sling inspection by a competent person. ASME B30.20 (below-the-hook lifting devices, which covers vacuum lifters) is a pointer, not checked online. |
| glass-4 | Batch house silica controlled | (new) | 1910.1053 | 1910.1053 applies to general industry silica exposure. Verified at section level. |
| glass-5 | Forming machines, lehrs and cutting lines guarded and locked out | (new) | 1910.212(a)(1); 1910.147(c)(4) | 1910.212(a)(1) nip points and rotating parts; 1910.147(c)(4) machine-specific energy control procedures. Verified. |
| glass-6 | Furnace and lehr combustion safeguards tested | (new) | NFPA 86; General Duty Clause 5(a)(1) | No OSHA furnace standard. NFPA 86 (ovens and furnaces) is a pointer, not checked online. |
| glass-7 | Heat illness prevention at the hot end | (new) | General Duty Clause 5(a)(1) | No federal heat standard is in eCFR as of this check; General Duty Clause. |
| glass-8 | Noise on the forming floor managed | (new) | 1910.95(c); 1910.95(i) | 1910.95(c) hearing conservation program at 85 dBA TWA; 1910.95(i) hearing protectors at 85 dBA. Verified. |
| glass-9 | Etching acids and leaded glass controlled | (new) | 1910.1200; 1910.151(c); 1910.1025 | 1910.1200 HazCom; 1910.151(c) quick drench and flush facilities for corrosives; 1910.1025 lead in general industry. Calcium gluconate is first aid practice for HF, not OSHA text. |

## All items

| Item | Question | Old cite | New cite | Note |
|---|---|---|---|---|
| plastics-0 | Molding machine gates and interlocks work | 1910.212(a)(1); ANSI B151.1 | verified | Section exists and covers this item. Checked against eCFR text. |
| plastics-1 | Mold changes and platen work done under lockout | 1910.147(c)(4) | verified | Section exists and covers this item. Checked against eCFR text. |
| plastics-2 | Granulators and grinders interlocked and locked out for cleaning | 1910.212(a)(1); 1910.147 | verified | Section exists and covers this item. Checked against eCFR text. |
| plastics-3 | Hot barrels, nozzles and purge areas controlled | 1910.132(a); General Duty Clause 5(a)(1) | verified | Section exists and covers this item. Checked against eCFR text. |
| plastics-4 | Resin and regrind dust controlled | 1910.22(a); General Duty Clause 5(a)(1); NFPA 652 | verified | Section exists and covers this item. Checked against eCFR text. |
| plastics-5 | Stored hydraulic and pneumatic energy released before service | 1910.147(d)(5) | verified | 1910.147(d)(5): stored energy relieved after lockout devices are applied. Verified. |
| plastics-6 | Robots and part take-out arms guarded | 1910.212(a)(1); ANSI/RIA R15.06 | verified | Section exists and covers this item. Checked against eCFR text. |
| plastics-7 | Leaking cooling lines and hoses fixed | 1910.22(a)(2) | verified | 1910.22(a)(2): floors kept dry where feasible, drainage for wet processes. Verified. |
| plastics-8 | Rubber mills and calenders have working e-stops or trip bars | 1910.212(a)(1); 1910.219 | verified | Section exists and covers this item. Checked against eCFR text. |
| foodproc-0 | Conveyors, mixers, slicers and fillers guarded | 1910.212(a)(1); 1910.219 | verified | Section exists and covers this item. Checked against eCFR text. |
| foodproc-1 | Sanitation crews lock out before washing equipment | 1910.147(c)(4) | verified | Section exists and covers this item. Checked against eCFR text. |
| foodproc-2 | Wet floors, drains and slip hazards controlled | 1910.22(a)(2) | verified | Section exists and covers this item. Checked against eCFR text. |
| foodproc-3 | Cleaning chemicals handled and stored safely | 1910.1200; 1910.151(c) | verified | 1910.151(c): quick drench or flush facilities where corrosives are used. The "within 10 seconds" figure is ANSI Z358.1, not OSHA. |
| foodproc-4 | Tanks, silos, vats and mixers treated as confined spaces | 1910.146 | verified | Section exists and covers this item. Checked against eCFR text. |
| foodproc-5 | Ammonia refrigeration program in place | 1910.119; 40 CFR 68; ANSI/IIAR 6 | verified | Checked Appendix A to 1910.119: anhydrous ammonia TQ is 10,000 lb. 40 CFR 68.130 Table 1 also lists 10,000 lb. Small wording point: RMP applies to *more than* 10,000 lb in a process, PSM to *at or above* 10,000 lb. ANSI/IIAR 6 is the IIAR inspection, testing and maintenance standard; number not checked online. |
| foodproc-6 | Hot surfaces, steam and fryers guarded | 1910.132(a); General Duty Clause 5(a)(1) | verified | Section exists and covers this item. Checked against eCFR text. |
| foodproc-7 | Cut protection used with knives and blades | 1910.138(a); 1910.132(a) | verified | Section exists and covers this item. Checked against eCFR text. |
| foodproc-8 | CO2 and nitrogen monitored where used (beverage and carbonation) | General Duty Clause 5(a)(1); 1910.134 | verified | Section exists and covers this item. Checked against eCFR text. |
| foodproc-9 | Freezer and cooler doors open from inside | 1910.36; 1910.37 | **1910.36(d)(1); 1910.37(a)(3)** | 1910.36(d)(1): employees must be able to open an exit route door from the inside at all times without keys, tools or special knowledge. 1910.37(a)(3): exit routes free and unobstructed. These apply to a walk-in freezer when people work inside it, since the door is their only way out. There is no freezer-specific OSHA rule. |
| dairy-0 | CIP chemical lines locked out before tanks are opened | 1910.147(c)(4); 1910.1200 | verified | Section exists and covers this item. Checked against eCFR text. |
| dairy-1 | Silos and vessels managed as permit spaces | 1910.146 | verified | Section exists and covers this item. Checked against eCFR text. |
| dairy-2 | Tanker unloading and silo top access protected from falls | 1910.28(b); 1910.23 | verified | Section exists and covers this item. Checked against eCFR text. |
| dairy-3 | High-pressure homogenizers, separators and fillers guarded and locked out | 1910.212(a)(1); 1910.147 | verified | Section exists and covers this item. Checked against eCFR text. |
| dairy-4 | Cheese vats, mixers and agitators guarded | 1910.212(a)(1); 1910.147 | verified | Section exists and covers this item. Checked against eCFR text. |
| bakery-0 | Dough mixers, dividers and sheeters interlocked | 1910.212(a)(1); ANSI/ASSE Z50.1 | verified | Section exists and covers this item. Checked against eCFR text. |
| bakery-1 | Flour and sugar dust controlled | 1910.22(a); NFPA 61; General Duty Clause 5(a)(1) | verified | Section exists and covers this item. Checked against eCFR text. |
| bakery-2 | Ovens, proofers and fryers have combustion safeguards | NFPA 86; 1910.132(a) | verified | Section exists and covers this item. Checked against eCFR text. |
| bakery-3 | Heavy lifting of flour bags and pan racks reduced | General Duty Clause 5(a)(1); NIOSH lifting guidance | verified | Section exists and covers this item. Checked against eCFR text. |
| bakery-4 | Grain handling rules checked if grain is stored or milled on site | 1910.272 | verified | 1910.272 Grain handling facilities, covers flour mills and grain storage. Verified at section level. |
| meat-0 | Saws, grinders, tenderizers and slicers guarded | 1910.212(a)(1) | verified | Section exists and covers this item. Checked against eCFR text. |
| meat-1 | Cut-resistant PPE worn and replaced | 1910.132(a); 1910.138(a) | verified | Section exists and covers this item. Checked against eCFR text. |
| meat-2 | Repetitive motion hazards managed | General Duty Clause 5(a)(1); OSHA 3123 meatpacking guidelines | verified | Section exists and covers this item. Checked against eCFR text. |
| meat-3 | Overhead product conveyors, trolleys and hooks guarded | 1910.212(a)(1); 1910.219 | verified | Section exists and covers this item. Checked against eCFR text. |
| meat-4 | Wet, greasy floors controlled | 1910.22(a)(2) | verified | Section exists and covers this item. Checked against eCFR text. |
| meat-5 | Antimicrobial chemicals such as peracetic acid controlled | 1910.1200; 1910.134; 1910.151(c) | verified | Section exists and covers this item. Checked against eCFR text. |
| meat-6 | Hot water and steam hazards controlled | 1910.132(a); General Duty Clause 5(a)(1) | verified | Section exists and covers this item. Checked against eCFR text. |
| machining-0 | Lathes, mills and drill presses guarded, no keys in chucks | 1910.212(a)(1); 1910.212(a)(3) | verified | Section exists and covers this item. Checked against eCFR text. |
| machining-1 | CNC doors interlocked and not bypassed | 1910.212(a)(1); ANSI B11 | verified | Section exists and covers this item. Checked against eCFR text. |
| machining-2 | Chips, coolant and metalworking fluid managed | 1910.1200; General Duty Clause 5(a)(1) | verified | Section exists and covers this item. Checked against eCFR text. |
| machining-3 | Grinders and abrasive wheels adjusted and tested | 1910.215(a)(4); 1910.215(b)(9) | verified | 1910.215(a)(4): work rest max opening one-eighth inch. 1910.215(b)(9): exposure adjustment, the adjustable peripheral member (tongue guard) gap never over one-fourth inch. Both verified. |
| machining-4 | Press brakes and shears protected at the point of operation | 1910.212(a)(3)(ii); ANSI B11.3 | verified | Section exists and covers this item. Checked against eCFR text. |
| machining-5 | Compressed air not used to clean skin, clothes or chips unsafely | 1910.242(b) | verified | 1910.242(b): under 30 psi with chip guarding and PPE. Verified. |
| machining-6 | Welding fume controlled at assembly stations | 1910.252(c); 1910.1000 | verified | Section exists and covers this item. Checked against eCFR text. |
| machining-7 | Hand tools in good shape | 1910.242(a) | verified | Section exists and covers this item. Checked against eCFR text. |
| fabmetal-0 | Mechanical power presses guarded and inspected weekly | 1910.217(c); 1910.217(e) | verified | 1910.217(c) Safeguarding the point of operation; 1910.217(e) Inspection, maintenance and modification, with periodic and weekly checks. Verified. |
| fabmetal-1 | Press brakes protected at the point of operation | 1910.212(a)(3)(ii); ANSI B11.3 | verified | Section exists and covers this item. Checked against eCFR text. |
| fabmetal-2 | Shears, ironworkers and punch presses guarded | 1910.212(a)(3)(ii) | verified | Section exists and covers this item. Checked against eCFR text. |
| fabmetal-3 | Forging hammers and presses blocked and locked out for die changes | 1910.218; 1910.147 | verified | Section exists and covers this item. Checked against eCFR text. |
| fabmetal-4 | Welding and cutting: fire watch, cylinders and ventilation | 1910.252(a); 1910.253(b) | verified | Section exists and covers this item. Checked against eCFR text. |
| fabmetal-5 | Stainless, manganese and coating fume exposure assessed | 1910.1026; 1910.1000; 1910.134 | verified | Section exists and covers this item. Checked against eCFR text. |
| fabmetal-6 | Sheet, plate and bar handling controlled | 1910.176; 1910.138 | verified | Section exists and covers this item. Checked against eCFR text. |
| fabmetal-7 | Dies stored and moved safely | 1910.176(b); 1910.179 | verified | Section exists and covers this item. Checked against eCFR text. |
| foundry-0 | Molten metal PPE worn and in good condition | 1910.132(a); General Duty Clause 5(a)(1) | verified | Section exists and covers this item. Checked against eCFR text. |
| foundry-1 | Moisture control for molten metal contact | General Duty Clause 5(a)(1) | verified | Section exists and covers this item. Checked against eCFR text. |
| foundry-2 | Ladle cranes, hooks and trunnions inspected | 1910.179(j); ASME B30.2 | verified | 1910.179(j) is Inspection: frequent (j)(2) covers hooks daily to monthly, periodic (j)(3) covers pins, shafts and locking parts. Trunnions fall under (j)(3)(iv). ASME B30.2 is Overhead and Gantry Cranes, the right document for ladle cranes; not checked online. |
| foundry-3 | Silica from sand, refractories and shakeout controlled | 1910.1053 | verified | Section exists and covers this item. Checked against eCFR text. |
| foundry-4 | Metal fume, carbon monoxide and lead exposure assessed | 1910.1000; 1910.1025; 1910.134 | verified | Section exists and covers this item. Checked against eCFR text. |
| foundry-5 | Heat illness prevention in hot areas | General Duty Clause 5(a)(1) | verified | Section exists and covers this item. Checked against eCFR text. |
| foundry-6 | Sand systems, shakeout and conveyors guarded and locked out | 1910.212(a)(1); 1910.147; 1910.219 | verified | Section exists and covers this item. Checked against eCFR text. |
| finishing-0 | Spray booths ventilated, filters changed and overspray cleaned | 1910.107; 1910.94(c) | verified | Section exists and covers this item. Checked against eCFR text. |
| finishing-1 | Flammable liquids stored and dispensed safely | 1910.106(d); 1910.106(e)(6) | **1910.106(d); 1910.106(e)(6)(ii)** | 1910.106(e)(6)(ii) is the bonding and grounding rule for dispensing. Narrowed from (e)(6). |
| finishing-2 | Dip and quench tanks protected from fire | 1910.108; NFPA 86 | **1910.125; 1910.126(a); NFPA 86** | 1910.108 is now [Reserved]. Dip tank rules moved to 1910.122 to 1910.126 in 2016. 1910.125 covers covers, bottom drains and automatic extinguishing on flammable dip tanks. 1910.126(a) covers hardening and tempering (quench) tanks, including the alarm within 50 °F of flashpoint. |
| finishing-3 | Plating and acid tank chemicals controlled | 1910.1026; 1910.1200; 1910.94(d) | **1910.1026; 1910.124; 1910.126(e); 1910.1200** | 1910.94(d) (open surface tanks) no longer exists; it was folded into 1910.123 to 1910.126, which list electroplating and pickling as covered. 1910.124 covers ventilation of vapor areas. 1910.126(e) is the cyanide tank dike rule, which backs "separate cyanide from acids". |
| finishing-4 | Furnaces and ovens have combustion safeguards | NFPA 86; General Duty Clause 5(a)(1) | verified | Section exists and covers this item. Checked against eCFR text. |
| finishing-5 | Eyewash and showers tested and unobstructed | 1910.151(c); ANSI Z358.1 | verified | 1910.151(c) verified. The 10-second and weekly activation rules are ANSI Z358.1, not OSHA text. |
| printing-0 | Press nip points and cylinders guarded | 1910.212(a)(1); 1910.219 | verified | Section exists and covers this item. Checked against eCFR text. |
| printing-1 | Web threading and jam clearing done at safe speed or locked out | 1910.147; ANSI B65.1 | verified | Section exists and covers this item. Checked against eCFR text. |
| printing-2 | Guillotine cutters and trimmers protected | 1910.212(a)(3)(ii); ANSI B65.1 | verified | Section exists and covers this item. Checked against eCFR text. |
| printing-3 | Solvents, inks and oily rags managed | 1910.106; 1910.1200 | verified | Section exists and covers this item. Checked against eCFR text. |
| printing-4 | Paper rolls handled and stored safely | 1910.178; 1910.176 | verified | Section exists and covers this item. Checked against eCFR text. |
| printing-5 | Balers and compactors interlocked | 1910.212(a)(1); ANSI Z245.5 | verified | Section exists and covers this item. Checked against eCFR text. |
| papermill-0 | Process chemicals and PSM covered | 1910.119; 1910.1200; 1910.1000 | verified | Appendix A to 1910.119 lists chlorine dioxide at 1,000 lb. Verified. |
| papermill-1 | Digesters, tanks and chests managed as permit spaces | 1910.146 | verified | Section exists and covers this item. Checked against eCFR text. |
| papermill-2 | Paper machine nips, dryers and winders guarded and locked out | 1910.212(a)(1); 1910.219; 1910.147 | verified | Section exists and covers this item. Checked against eCFR text. |
| papermill-3 | Steam, hot surfaces and hot work controlled | 1910.132(a); 1910.252(a) | verified | Section exists and covers this item. Checked against eCFR text. |
| papermill-4 | Chip, bark and fiber handling dust and fire controlled | NFPA 652; NFPA 664; General Duty Clause 5(a)(1) | verified | Section exists and covers this item. Checked against eCFR text. |
| papermill-5 | Roll and reel handling equipment inspected | 1910.179; 1910.178 | verified | Section exists and covers this item. Checked against eCFR text. |
| papermill-6 | Catwalks and elevated platforms guarded | 1910.28(b); 1910.29 | verified | Section exists and covers this item. Checked against eCFR text. |
| wood-0 | Woodworking machines guarded | 1910.213; 1910.212 | verified | Section exists and covers this item. Checked against eCFR text. |
| wood-1 | Combustible wood dust controlled | NFPA 664; 1910.22(a); General Duty Clause 5(a)(1) | verified | Section exists and covers this item. Checked against eCFR text. |
| wood-2 | Sawmill log decks, debarkers and chippers guarded and locked out | 1910.212; 1910.147; 1910.219 | verified | Section exists and covers this item. Checked against eCFR text. |
| wood-3 | Wood dust exposure assessed | 1910.1000; 1910.134 | verified | Section exists and covers this item. Checked against eCFR text. |
| wood-4 | Formaldehyde monitored where composite panels or glue are used | 1910.1048 | verified | Section exists and covers this item. Checked against eCFR text. |
| wood-5 | Finishing rags and spray areas controlled | 1910.107; 1910.106 | verified | Section exists and covers this item. Checked against eCFR text. |
| wood-6 | Wood preservation chemicals controlled | 1910.1200; 1910.1018; 1910.134 | verified | 1910.1018 is inorganic arsenic, which fits CCA. Creosote and pentachlorophenol fall under 1910.1000 and HazCom. |
| wood-7 | Kilns and dryers inspected for fire hazards | General Duty Clause 5(a)(1); NFPA 664 | verified | Section exists and covers this item. Checked against eCFR text. |
| concrete-0 | Respirable silica controlled at batching, cutting and finishing | 1910.1053 | verified | Section exists and covers this item. Checked against eCFR text. |
| concrete-1 | Mixers, conveyors and hoppers guarded and locked out | 1910.147; 1910.212; 1910.219 | verified | Section exists and covers this item. Checked against eCFR text. |
| concrete-2 | Bins, silos and mixers entered under a permit | 1910.146 | verified | Section exists and covers this item. Checked against eCFR text. |
| concrete-3 | Precast cranes, gantries and strand tensioning protected | 1910.179; 1910.184; 1910.212 | verified | Section exists and covers this item. Checked against eCFR text. |
| concrete-4 | Wet cement burns prevented | 1910.132(a); 1910.1200 | verified | Section exists and covers this item. Checked against eCFR text. |
| concrete-5 | Yard traffic separated from pedestrians | 1910.178; General Duty Clause 5(a)(1) | verified | Section exists and covers this item. Checked against eCFR text. |
| hvacequip-0 | Sheet metal brakes, shears and punch presses guarded | 1910.212(a)(3)(ii); 1910.217 | verified | Section exists and covers this item. Checked against eCFR text. |
| hvacequip-1 | Brazing and soldering fume controlled | 1910.252(c); 1910.1027; 1910.1025 | verified | Section exists and covers this item. Checked against eCFR text. |
| hvacequip-2 | Refrigerant and gas cylinders stored and used safely | 1910.101; 1910.253(b) | verified | Section exists and covers this item. Checked against eCFR text. |
| hvacequip-3 | Electrical test and hi-pot stations guarded | 1910.303; 1910.333; 1910.335 | verified | Section exists and covers this item. Checked against eCFR text. |
| hvacequip-4 | Heavy unit handling reduced | General Duty Clause 5(a)(1) | verified | Section exists and covers this item. Checked against eCFR text. |
| hvacequip-5 | Adhesives, foam and solvents managed | 1910.1200; 1910.106 | verified | Section exists and covers this item. Checked against eCFR text. |
| vehicles-0 | Robot cells and automated guided vehicles guarded | 1910.212(a)(1); ANSI/RIA R15.06 | verified | Section exists and covers this item. Checked against eCFR text. |
| vehicles-1 | Welding fume and hexavalent chromium assessed | 1910.1026; 1910.1000; 1910.134 | verified | Section exists and covers this item. Checked against eCFR text. |
| vehicles-2 | Paint booths, isocyanates and respirators controlled | 1910.94(c); 1910.107; 1910.134; 1910.1200 | verified | Section exists and covers this item. Checked against eCFR text. |
| vehicles-3 | Composite, fiberglass and styrene exposure controlled | 1910.1000; 1910.1200; 1910.134 | verified | Section exists and covers this item. Checked against eCFR text. |
| vehicles-4 | Stamping and press lines guarded and locked out | 1910.217; 1910.147 | verified | Section exists and covers this item. Checked against eCFR text. |
| vehicles-5 | Hulls, tanks and wing bays treated as confined spaces | 1910.146 | verified | Section exists and covers this item. Checked against eCFR text. |
| vehicles-6 | Elevated work on hulls, trailers and aircraft has fall protection | 1910.28(b) | verified | Section exists and covers this item. Checked against eCFR text. |
| vehicles-7 | Awkward and overhead assembly tasks reduced | General Duty Clause 5(a)(1) | verified | Section exists and covers this item. Checked against eCFR text. |
| chemical-0 | Process Safety Management applicability confirmed and program current | 1910.119 | verified | Section-level cite is right. Thresholds are in Appendix A to 1910.119. |
| chemical-1 | Management of change and pre-startup reviews done | 1910.119(l); 1910.119(i) | verified | 1910.119(l) is Management of change, 1910.119(i) is Pre-startup safety review. Verified. |
| chemical-2 | Flammable liquid transfers bonded and grounded | 1910.106(e)(6) | **1910.106(e)(6)(ii)** | 1910.106(e)(6)(ii) is the dispensing bonding/grounding rule. Narrowed from (e)(6). |
| chemical-3 | Emergency response plan matches what employees do | 1910.120(q); 1910.38 | verified | Section exists and covers this item. Checked against eCFR text. |
| chemical-4 | Toxic vapors and gases monitored, respirators controlled | 1910.134; 1910.1000 | verified | Section exists and covers this item. Checked against eCFR text. |
| chemical-5 | Relief devices, vessels and piping inspected | 1910.119(j); 1910.106 | verified | 1910.119(j) Mechanical integrity, (j)(1) lists pressure vessels, piping, relief and vent systems. Verified. |
| chemical-6 | Incompatible chemicals segregated with secondary containment | 1910.106; 1910.1200 | verified | Section exists and covers this item. Checked against eCFR text. |
| chemical-7 | Chemicals with their own OSHA standard identified | 1910.1028; 1910.1017; 1910.1051; 1910.1047 | verified | Section exists and covers this item. Checked against eCFR text. |
| chemical-8 | Powder handling dust hazards analyzed | NFPA 652; General Duty Clause 5(a)(1) | verified | Section exists and covers this item. Checked against eCFR text. |
| medelec-0 | Ethylene oxide sterilization controlled | 1910.1047 | verified | Section exists and covers this item. Checked against eCFR text. |
| medelec-1 | Soldering and lead exposure assessed | 1910.1025; 1910.1000 | verified | Section exists and covers this item. Checked against eCFR text. |
| medelec-2 | Process gases, HF and acids controlled | 1910.1200; 1910.119; 1910.134 | verified | Appendix A to 1910.119 lists hydrogen fluoride at 1,000 lb. Verified. |
| medelec-3 | Cleanroom exits unobstructed and emergency alarms work | 1910.36; 1910.37; 1910.38 | verified | Section-level cites are right. If you want paragraphs: 1910.37(a)(3) unobstructed exits; alarm systems are 1910.165, which 1910.38 points to. |
| medelec-4 | Laser and optical radiation controlled | General Duty Clause 5(a)(1); ANSI Z136.1 | verified | Section exists and covers this item. Checked against eCFR text. |
| medelec-5 | Electrical test and burn-in equipment guarded | 1910.303; 1910.333 | verified | Section exists and covers this item. Checked against eCFR text. |
| medelec-6 | Solvents and adhesives stored and ventilated | 1910.106; 1910.1200 | verified | Section exists and covers this item. Checked against eCFR text. |
| medelec-7 | Microscope and bench assembly ergonomics addressed | General Duty Clause 5(a)(1) | verified | Section exists and covers this item. Checked against eCFR text. |
| textile-0 | Carding, looms, spinning and winding nip points guarded | 1910.212(a)(1); 1910.219 | verified | Section exists and covers this item. Checked against eCFR text. |
| textile-1 | Lint and dust cleaned and ignition sources controlled | 1910.22(a); NFPA 652; General Duty Clause 5(a)(1) | verified | Section exists and covers this item. Checked against eCFR text. |
| textile-2 | Cotton dust controlled where cotton is processed | 1910.1043 | verified | Section exists and covers this item. Checked against eCFR text. |
| textile-3 | Dyes and finishing chemicals managed | 1910.1200; 1910.151(c) | verified | Section exists and covers this item. Checked against eCFR text. |
| textile-4 | Noise in weave and spinning rooms managed | 1910.95 | verified | Section exists and covers this item. Checked against eCFR text. |
| textile-5 | Beam and roll handling equipment safe | 1910.179; 1910.178 | verified | Section exists and covers this item. Checked against eCFR text. |
| buildequip-0 | Energized work avoided and circuits locked out and tested dead | 1926.417; 1926.416(a) | verified | Section exists and covers this item. Checked against eCFR text. |
| buildequip-1 | GFCI or assured equipment grounding on temporary power | 1926.404(b)(1) | verified | 1926.404(b)(1): GFCI or assured equipment grounding program. Verified. |
| buildequip-2 | Trenching for service lines protected and located | 1926.651; 1926.652 | verified | Section exists and covers this item. Checked against eCFR text. |
| buildequip-3 | Crawl spaces, vaults and tanks controlled as confined spaces | 1926.1203; 1926.1204 | verified | Section exists and covers this item. Checked against eCFR text. |
| buildequip-4 | Hot work controlled for soldering, brazing and torch work | 1926.352; 1926.351 | verified | Section exists and covers this item. Checked against eCFR text. |
| buildequip-5 | Rooftop unit and roof work has fall protection | 1926.501(b)(10); 1926.501(b)(4) | verified | 1926.501(b)(10) low-slope roofing; 1926.501(b)(4) holes including skylights. Verified. |
| buildequip-6 | Older buildings assumed to contain asbestos or lead until tested | 1926.1101; 1926.62 | verified | Section exists and covers this item. Checked against eCFR text. |
| buildequip-7 | Silica controlled when core drilling, chasing and cutting | 1926.1153 | verified | Section exists and covers this item. Checked against eCFR text. |
| buildequip-8 | Fuel gas and refrigerant cylinders secured | 1926.350 | verified | Section exists and covers this item. Checked against eCFR text. |
| gc-0 | GC oversees every subcontractor and follows up in writing | OSHA CPL 02-00-124; 1926.16 | verified | 1926.16 Rules of construction: prime contractor keeps responsibility for subcontracted work. Verified. CPL 02-00-124 is the multi-employer citation policy as I know it, but osha.gov blocks automated requests so the number was not checked online. |
| gc-1 | Site-specific safety plan and pre-task planning in place | 1926.20(b); 1926.21(b) | verified | 1926.20(b)(1)-(2): employer programs and frequent inspections by competent persons. 1926.21(b)(2): train each employee on hazards. Verified. |
| gc-2 | Struck-by hazards: overhead protection and falling object controls | 1926.100(a); 1926.250(b) | **1926.100(a); 1926.501(c)** | 1926.250(b) is material storage (keep stock back from hoistways and openings). It is not falling object protection. 1926.501(c) is: hard hats plus toeboards, screens, canopies or barricaded areas. Verified. |
| gc-3 | Crane and rigging: lift plans, signals and operator qualification | 1926.1417; 1926.1419; 1926.1428 | verified | Section exists and covers this item. Checked against eCFR text. |
| gc-4 | Site secured and public protected | 1926.20(b); local codes | **Local building code (no OSHA standard covers site security)** | 1926.20(b) is the accident prevention program duty and says nothing about site security or protecting the public. OSHA covers employees, not the public, and has no site security rule. Pedestrian protection is a local building code item. Changed so the app does not claim an OSHA basis. |
| gc-5 | Fire prevention and temporary heaters controlled | 1926.150; 1926.154 | verified | Section exists and covers this item. Checked against eCFR text. |
| gc-6 | Silica written exposure control plan and Table 1 tasks followed | 1926.1153 | verified | Section exists and covers this item. Checked against eCFR text. |
| gc-7 | Housekeeping, material storage and egress maintained | 1926.25; 1926.250; 1926.1051 | verified | Section exists and covers this item. Checked against eCFR text. |
| gc-8 | Emergency plan, first aid and sanitation in place | 1926.35; 1926.50; 1926.51 | verified | Section exists and covers this item. Checked against eCFR text. |
| structure-0 | Roofing work has fall protection suited to the roof | 1926.501(b)(10); 1926.501(b)(11); 1926.502 | verified | 1926.501(b)(10) low-slope, (b)(11) steep roofs. Verified. |
| structure-1 | Steel erection: connectors and decking fall protection | 1926.760; 1926.754 | verified | 1926.760(a)(1): fall protection above 15 ft for steel erection. Verified. |
| structure-2 | Steel erection pre-job planning and column stability | 1926.752; 1926.755 | verified | 1926.755(a)(1): minimum 4 anchor rods. 1926.752: concrete strength notice and site layout. Verified. |
| structure-3 | Rebar caps or guards in place | 1926.701(b) | verified | 1926.701(b): guard protruding rebar against impalement. Verified. |
| structure-4 | Formwork and shoring designed, inspected and stripped properly | 1926.703 | verified | Section exists and covers this item. Checked against eCFR text. |
| structure-5 | Masonry wall bracing and limited access zones | 1926.706 | verified | Section exists and covers this item. Checked against eCFR text. |
| structure-6 | Framing: nail guns, truss bracing and wall raising | General Duty Clause 5(a)(1); 1926.501(b)(13) | verified | Section exists and covers this item. Checked against eCFR text. |
| structure-7 | Concrete pump booms and trucks kept clear of power lines | 1926.416(a)(1); 1926.1408 | verified | 1926.1408 covers equipment near power lines and includes concrete pump booms via 1926.1400. Verified at section level. |
| structure-8 | Silica from concrete cutting, grinding and chipping controlled | 1926.1153 | verified | Section exists and covers this item. Checked against eCFR text. |
| finish-0 | Silica controlled when cutting tile, grinding floors and core drilling | 1926.1153 | verified | Section exists and covers this item. Checked against eCFR text. |
| finish-1 | Lead paint on older buildings tested and lead-safe practices used | 1926.62; 40 CFR 745 | verified | Section exists and covers this item. Checked against eCFR text. |
| finish-2 | Asbestos in flooring, mud and ceilings assumed present until tested | 1926.1101 | verified | Section exists and covers this item. Checked against eCFR text. |
| finish-3 | Ceiling work done from scaffolds or platforms, stilts controlled | 1926.451; 1926.1053 | verified | Section exists and covers this item. Checked against eCFR text. |
| finish-4 | Solvents and adhesives ventilated and ignition controlled | 1926.57; 1926.59; 1926.152 | verified | Section exists and covers this item. Checked against eCFR text. |
| finish-5 | Floor prep equipment on GFCI and dust controlled | 1926.404(b)(1); 1926.1153 | verified | Section exists and covers this item. Checked against eCFR text. |
| finish-6 | Heavy sheet and tile handling reduced | General Duty Clause 5(a)(1) | verified | Section exists and covers this item. Checked against eCFR text. |
| finish-7 | Oily rags and finishes disposed of safely | 1926.151; 1926.152 | verified | Section exists and covers this item. Checked against eCFR text. |
| resid-0 | Fall protection at roof edges, floor edges and openings | 1926.501(b)(13); 1926 Subpart M | verified | Section exists and covers this item. Checked against eCFR text. |
| resid-1 | Ladder setup and roof access safe | 1926.1053(b)(1) | verified | 1926.1053(b)(1): side rails 3 ft above the landing. Verified. |
| resid-2 | Nail gun and power tool safety | General Duty Clause 5(a)(1); 1926.302 | verified | Section exists and covers this item. Checked against eCFR text. |
| resid-3 | Foundation and basement excavations protected | 1926.651(k); 1926.652 | verified | Section exists and covers this item. Checked against eCFR text. |
| resid-4 | Temporary power protected by GFCI | 1926.404(b)(1) | verified | Section exists and covers this item. Checked against eCFR text. |
| resid-5 | Lead and asbestos disturbed during remodels managed | 1926.62; 1926.1101; 40 CFR 745 | verified | Section exists and covers this item. Checked against eCFR text. |
| resid-6 | Truss and wall panel installation braced to plan | General Duty Clause 5(a)(1); 1926.501(b)(13) | verified | Section exists and covers this item. Checked against eCFR text. |
| resid-7 | Training delivered in a language workers understand | 1926.21(b)(2); 1926.503 | verified | 1926.21(b)(2) and 1926.503 require training. The "language workers understand" wording comes from OSHA enforcement policy, not the regulation text. |
| utility-0 | Utility locates completed before every dig | 1926.651(b)(1) | verified | 1926.651(b)(1): estimate utility locations before opening an excavation. Verified. 811 is state one-call law, not OSHA. |
| utility-1 | Trench protection used at 5 ft and deeper | 1926.652(a) | verified | 1926.652(a)(1): protective system required, exception for under 5 ft with no cave-in indication. Verified. |
| utility-2 | Competent person inspects daily and after weather changes | 1926.651(k)(1); 1926.651(c)(2) | verified | 1926.651(k)(1) daily competent person inspection; 1926.651(c)(2) egress within 25 ft at 4 ft deep. Spoil setback of 2 ft is 1926.651(j)(2), not cited but correct. |
| utility-3 | Manholes, vaults and sewers tested before entry | 1926.1203; 1926.1204 | verified | Section exists and covers this item. Checked against eCFR text. |
| utility-4 | Equipment kept clear of overhead power lines | 1926.1408; 1926.416(a)(1) | verified | Section exists and covers this item. Checked against eCFR text. |
| utility-5 | Energized line work limited to qualified workers | 1926.950; 1926.960 | verified | Section exists and covers this item. Checked against eCFR text. |
| utility-6 | Pipe handling and lifting with rated rigging | 1926.251; 1926.1400 | **1926.251; 1926.1400(c)(2) (excavators are outside the crane rules)** | 1926.1400(c)(2) excludes excavators, backhoes and loaders from the crane rules even when lifting with slings. So 1926.1400 does not require load charts for excavator lifts; it exempts them. 1926.251 (rated rigging) still applies. Load charts come from the manufacturer. |
| utility-7 | Work zone traffic control matches the MUTCD | 1926.200(g); MUTCD Part 6 | verified | 1926.200(g) traffic control signs and devices; (g)(2) points to MUTCD Part 6. Verified. |
| highway-0 | Temporary traffic control plan matches the MUTCD | 1926.200(g)(2); MUTCD Part 6 | verified | 1926.200(g)(2): traffic control devices conform to MUTCD Part 6. Verified. |
| highway-1 | High-visibility apparel and flagger practices | 1926.201; 1926.201(a)(2) | **1926.201(a); MUTCD Part 6** | 1926.201(a)(2) does not exist. 1926.201(a) is one paragraph: flagger signaling and flagger warning garments must conform to Part 6 of the MUTCD. The hi-vis requirement lives in the MUTCD, not in a separate OSHA paragraph. |
| highway-2 | Backing and internal traffic controlled | 1926.601(b)(4); 1926.602(a)(9)(ii) | verified | 1926.601(b)(4) and 1926.602(a)(9)(ii): reverse alarms or spotter for obstructed rear view. Verified. |
| highway-3 | Heavy equipment ROPS, seatbelts and inspections | 1926.1000; 1926.602(a)(2) | verified | 1926.1000 is the ROPS scope section; 1926.602(a)(2) seat belts. Verified. |
| highway-4 | Paving crews protected from hot asphalt and heat | General Duty Clause 5(a)(1) | verified | Section exists and covers this item. Checked against eCFR text. |
| highway-5 | Milling and saw cutting: silica and noise controlled | 1926.1153; 1926.52 | verified | Section exists and covers this item. Checked against eCFR text. |
| highway-6 | Bridge work has fall protection and water rescue | 1926.501(b); 1926.106 | verified | Section exists and covers this item. Checked against eCFR text. |
| highway-7 | Overhead lines considered for dump trucks and cranes | 1926.1408; 1926.416(a)(1) | verified | Section exists and covers this item. Checked against eCFR text. |
| specialty-0 | Demolition engineering survey and plan completed first | 1926.850(a); 1926.859 | verified | Section exists and covers this item. Checked against eCFR text. |
| specialty-1 | Asbestos, lead and hazardous materials surveyed before demolition | 1926.1101; 1926.62 | verified | Section exists and covers this item. Checked against eCFR text. |
| specialty-2 | Excavations protected, with spoil and access controlled | 1926.651; 1926.652 | verified | Section exists and covers this item. Checked against eCFR text. |
| specialty-3 | Mobile equipment operators trained and equipment inspected | 1926.600; 1926.601; 1926.602 | verified | Section exists and covers this item. Checked against eCFR text. |
| specialty-4 | Crane operator qualification and inspections documented | 1926.1427; 1926.1412 | verified | Section exists and covers this item. Checked against eCFR text. |
| specialty-5 | Blasting controlled by licensed personnel | 1926.900; 1926.914 | **1926.900(a); 1926.904; 1926.909** | 1926.914 is the definitions section. Replaced with 1926.900(a) (only authorized and qualified persons handle explosives), 1926.904 (storage) and 1926.909 (blast signals and warnings). Verified. |
| specialty-6 | Work over or near water has life-saving gear | 1926.106 | verified | Section exists and covers this item. Checked against eCFR text. |
| specialty-7 | Tunnel, shaft and compressed air work follow Subpart S | 1926.800; 1926.803 | verified | Section exists and covers this item. Checked against eCFR text. |
| specialty-8 | Heavy panel and glass handling controlled | 1926.251; General Duty Clause 5(a)(1) | verified | Section exists and covers this item. Checked against eCFR text. |
