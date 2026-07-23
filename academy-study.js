/* MiniBox Academy — the Study layer.
   Written from PulmOne's own 2025 training decks. Every clinical number here traces
   back to a real slide; do not add one that does not. Visuals are either a slide image
   in academy-assets/, a native table, or one of the interactives in academy-visuals.js. */
window.ACADEMY_STUDY = {
 "clinical_overview": {
  "minutes": 9,
  "intro": "Almost every conversation you have in a pulmonology or allergy office comes back to one question: what can this patient's lungs actually do? A pulmonary function test answers that in three pieces, and each piece is a different box the practice either owns or does not. If you know what those pieces measure and what a diseased lung does to them, you stop being the person waiting for the doctor to finish talking and start being the person who can finish the sentence.",
  "sections": [
   {
    "h": "Three tests, one picture",
    "p": "A PFT is not one test. It is a group of noninvasive breathing tests that measure how well the lungs work, and each one answers a different question. Reps get in trouble when they treat all of it as \"spirometry,\" because spirometry is only the first of the three.",
    "visual": {
     "t": "table",
     "head": [
      "Test",
      "What it measures"
     ],
     "rows": [
      [
       "Spirometry",
       "How much air you can exhale, and how fast you can empty your lungs"
      ],
      [
       "Lung volume test",
       "How much air your lungs can hold, and how much is left after you exhale"
      ],
      [
       "Lung diffusion capacity (DLCO)",
       "How easily oxygen gets from the lungs into your bloodstream"
      ]
     ],
     "note": "A complete PFT can take around one and a half hours. Shorter PFTs run about 15 minutes for adults and 15 to 30 minutes for children."
    },
    "key": "Spirometry is one third of a PFT. The other two thirds are volumes and diffusion."
   },
   {
    "h": "Three gates, in order",
    "p": "Every PFT report gets read the same way, and it is always the same three questions in the same order. <b>Gate 1, airflow:</b> is air getting out fast enough? That is the FEV1/FVC ratio. <b>Gate 2, size:</b> are the lungs the right size? That is TLC, total lung capacity, and spirometry cannot give it to you. <b>Gate 3, gas transfer:</b> once air is in there, does it get into the blood? That is DLCO. Walk the gates in order and you almost never get lost.",
    "visual": {
     "t": "svg",
     "id": "gates"
    },
    "list": [
     "Gate 1 fails and gate 2 is fine: air is getting stuck on the way out, which is obstruction",
     "Gate 1 is fine and gate 2 fails: the lungs are small, which is restriction",
     "Gate 3 tells you whether the alveoli themselves and their blood supply are damaged",
     "Normal and abnormal at each gate are set by the limits of normal for that patient, not by a number you memorize"
    ],
    "key": "Airflow, then size, then transfer. Same three gates, every single report."
   },
   {
    "h": "Volumes and capacities",
    "p": "A volume is one slice of a breath. A capacity is two or more volumes added together, which is the only thing that makes the vocabulary hard. Tidal volume is the quiet breath you are taking right now. On top of that you can pull in more (inspiratory reserve) and push out more (expiratory reserve). What is left after the hardest exhale you can manage is residual volume, and it never leaves.",
    "visual": {
     "t": "img",
     "src": "volumes-capacities",
     "cap": "The classic spirogram. Notice that the four capacities on the right are just the volumes on the left stacked up: inspiratory capacity 3000 mL is tidal volume plus inspiratory reserve, functional residual capacity 3000 mL is expiratory reserve plus residual volume, and total lung capacity 6000 mL is all four volumes together."
    },
    "list": [
     "Tidal volume (VT) 500 mL: the air in one relaxed breath",
     "Inspiratory reserve volume (IRV) 2500 mL: the extra you can pull in on top of a normal breath",
     "Expiratory reserve volume (ERV) 1500 mL: the extra you can push out below a normal breath",
     "Residual volume (RV) 1500 mL: what stays behind no matter how hard you blow",
     "Vital capacity (VC) 4500 mL: everything you can move in one big breath, top to bottom",
     "Total lung capacity (TLC) 6000 mL: vital capacity plus the residual volume you cannot exhale"
    ]
   },
   {
    "h": "The air you cannot exhale",
    "p": "Here is the sentence that sells a lung volume box. Residual volume is the air still sitting in the lungs after a maximal exhale, and functional residual capacity is the air still in there after a normal relaxed breath out. Neither one ever comes through the mouthpiece, so a spirometer cannot measure them. If a practice only owns spirometry, TLC is a blank on their report, and TLC is gate 2. Tap through the trace and watch which bands never cross the baseline.",
    "visual": {
     "t": "svg",
     "id": "spirogram"
    },
    "key": "You cannot blow out residual volume, so spirometry alone can never tell you total lung capacity."
   },
   {
    "h": "Obstruction versus restriction",
    "p": "Two diseases, two completely different shapes, same total-lung-capacity yardstick. In an obstructive patient the airways cannot empty properly, so air gets trapped and the residual volume swells: the lungs are big but full of stale air. In a restrictive patient the lungs cannot expand and move air in and out at all, so nearly every compartment shrinks, and just about every parameter on every test tends to land under the lower limit of normal.",
    "visual": {
     "t": "svg",
     "id": "compartbars"
    },
    "list": [
     "Obstructive: air trapping, a growing residual volume, and lungs that stay inflated",
     "Restrictive: a smaller lung across the board, with parameters falling under the lower limit of normal",
     "Emphysema adds alveolar destruction on top of the trapping, which is why its DLCO is usually low"
    ],
    "key": "Obstruction traps air in. Restriction never lets it in. Both feel like breathlessness to the patient."
   },
   {
    "h": "Inside a COPD lung",
    "p": "This is the picture worth having in your head when a physician says COPD. Two separate things are going wrong. The bronchiole, the small airway, is narrowed and clogged with mucus, which is why air cannot get out quickly. Deeper in, the alveolar walls are breaking down, so the surface area available for gas exchange is disappearing. The first problem shows up on spirometry. The second one only shows up on DLCO.",
    "visual": {
     "t": "img",
     "src": "copd-pathology",
     "cap": "Health on one side, COPD on the other. On the left the airway is open and the alveolar sacs are intact. On the right, mucus narrows the bronchiole (that is the airflow problem) and the alveolar walls have broken down into large empty spaces (that is the gas transfer problem)."
    },
    "key": "Emphysema damages the airway and the air sac. Spirometry sees one of those, DLCO sees the other."
   },
   {
    "h": "Restriction comes from two places",
    "p": "Restriction is a reduction in the size of the lung, but the cause is not always the lung. Parenchymal restriction means the lung tissue itself is stiff or scarred. Extra-parenchymal restriction means the lung is fine and something outside it is in the way: the pleura, the chest wall, the abdomen, or breathing muscles that are too weak to pull a full breath in. That distinction matters in the room, because a physician chasing weight or a neuromuscular diagnosis is having a different conversation than one chasing fibrosis.",
    "visual": {
     "t": "img",
     "src": "restrictive-causes",
     "cap": "The two branches of restrictive disease. Everything on the parenchymal side is the lung tissue itself. Everything on the extra-parenchymal side is the pleura, the chest wall, the abdomen, or the muscles, with normal lung tissue caught inside a container that will not open."
    },
    "key": "Small lungs do not always mean sick lungs. Sometimes the box around them is the problem."
   },
   {
    "h": "Patterns in common diseases",
    "p": "Once you have all five measurements, each disease leaves a fingerprint. Read the table down a column, not across a row: one column is one patient's whole story. Notice that muscle weakness gets its own column even though the lung tissue is healthy, and notice that DLCO is the row that separates damage to the air sacs from a plain airflow problem.",
    "visual": {
     "t": "img",
     "src": "pattern-table",
     "cap": "Respiratory patterns in common diseases. Rows are the measurements (FVC, FEV1, FEV1/FVC, TLC, DLCO) and columns are the disease. The DLCO row is the tie breaker: alveolar destruction drags it down, a purely airway problem does not have to."
    },
    "key": "One column equals one fingerprint. You need all five rows to complete it."
   },
   {
    "h": "Normal is a personal number",
    "p": "There is no universal normal lung. Predicted values depend on height, age and sex, and historically they depended on ethnicity too. GLI, the Global Lung Function Initiative, is the current recommended standard because it is built on a large, diverse global population and takes a race-neutral approach, so the equations do not require race or ethnicity to be entered. The American Thoracic Society and the European Respiratory Society both endorse GLI for interpreting PFTs. If a physician asks whose normal you are comparing their patient to, GLI is the answer.",
    "visual": {
     "t": "img",
     "src": "gli-2012",
     "cap": "GLI 2012 and the populations behind it. The point of the map and the sample sizes is credibility: these equations are pooled from a large, geographically spread population rather than one local cohort, which is exactly why the major societies point to them."
    },
    "key": "GLI is the recommended reference standard, endorsed by ATS and ERS, and it is race-neutral."
   }
  ],
  "angle": "This module gives you the one line that reframes a practice's whole setup: spirometry can never measure residual volume or total lung capacity, so a spirometry-only office is answering gate 1 and guessing at gates 2 and 3. Ask what they do today when spirometry comes back abnormal but the ratio looks fine, or when they suspect emphysema and need a DLCO. If the answer is \"we refer it out,\" that is revenue and continuity of care leaving the building, and the MiniBox+ line is built to keep volumes and diffusion in the room. Lead with the three gates, not with the box."
 },
 "respiratory_disease": {
  "minutes": 11,
  "intro": "This is the module that lets you stand next to a tech during a test and next to a physician during a readout. PFTs have been used for decades to diagnose lung disease, explain shortness of breath, and track whether a treatment is working. Everything in here is either a number a doctor will quote at you, or a coaching point that decides whether the test in the next room is usable or garbage. Both are worth money to the practice.",
  "sections": [
   {
    "h": "The four numbers",
    "p": "Nearly every spirometry conversation runs on four values. <b>FVC</b> is the total volume of air exhaled after a maximal inspiration to total lung capacity, in liters. <b>FEV1</b> is the volume exhaled in just the first second, also in liters. <b>FEV1/FVC</b> is that first second expressed as a percent of the whole breath, and it is the ratio everything hinges on. <b>FEF25-75%</b> is the mean expiratory flow during the middle half of the maneuver.",
    "visual": {
     "t": "img",
     "src": "fev1-fvc-vt",
     "cap": "Volume against time. The dashed line at one second cuts the trace at FEV1, and the flat plateau at the top is FVC, the total volume that came out. Both numbers come from the same single blow."
    },
    "list": [
     "FEV1/FVC is the airflow gate: a low ratio means air is getting stuck on the way out",
     "FEF25-75% reflects flow through later emptying airways, not necessarily the small airways",
     "In asthma or obstructive disease, FEF25-75% is measuring flow from the more obstructed airways, which could be small or larger",
     "Treat FEF25-75% as supporting evidence, never as the headline"
    ],
    "key": "One breath, four numbers. The ratio FEV1/FVC is the one that decides obstruction."
   },
   {
    "h": "What good effort looks like",
    "p": "A usable spirometry effort has a shape, and you can spot a bad one from across the room. The volume-time curve should flatten into a plateau, and total expiration should last at least six seconds. If the volume is still climbing when the patient stops, the test never found its true FVC, and that result has to be interpreted with caution. Coaching the patient to keep pushing when they think they are empty is the single highest-value thing an office staffer can learn.",
    "visual": {
     "t": "img",
     "src": "vt-normal-vs-obstructive",
     "cap": "Panel A is what you want: the curve levels off into a clear plateau near 4.4 L. Panel B never plateaus. At eight seconds the volume is still rising and has only reached 2.7 L, so the real FVC is somewhere above what got recorded."
    },
    "list": [
     "Free of artifacts: no cough during the first second, no glottis closure, no early cut-off, no leak, no obstructed mouthpiece, and no effort that trails off",
     "Good start: extrapolated volume under 5% of FVC or 0.15 L, whichever is greater",
     "Satisfactory exhalation: at least 6 seconds (3 seconds for children under 10), or a clear plateau in the volume-time curve",
     "A patient who cannot or should not keep exhaling ends the maneuver, and that is fine"
    ],
    "key": "No plateau, no confidence. A curve still rising at the end has not found the patient's real FVC."
   },
   {
    "h": "Three good blows, then stop",
    "p": "Acceptability is about one maneuver. Repeatability is about the session. The ATS rules give the tech a clear finish line, which matters because staff who do not know when to stop either quit too early or exhaust the patient for nothing.",
    "visual": {
     "t": "steps",
     "items": [
      {
       "h": "Get three acceptable spirograms",
       "p": "Three efforts that pass the within-maneuver checks. Only then do you start comparing them to each other."
      },
      {
       "h": "Compare the two largest FVC values",
       "p": "They must be within 0.150 L of each other. This is the test asking whether the patient did the same thing twice."
      },
      {
       "h": "Compare the two largest FEV1 values",
       "p": "Same rule, within 0.150 L. Both criteria have to be met, not one."
      },
      {
       "h": "If both are met, you are done",
       "p": "The session can be concluded. There is no prize for extra blows and a tired patient gives worse data."
      },
      {
       "h": "If not, keep going with limits",
       "p": "Continue testing until the criteria are met, or a total of eight tests have been performed, or the patient cannot or should not continue."
      },
      {
       "h": "Save at least three",
       "p": "Keep a minimum of the three satisfactory maneuvers with the record."
      }
     ]
    },
    "key": "Three acceptable blows, two largest FVC and FEV1 within 0.150 L, maximum eight attempts."
   },
   {
    "h": "Landmarks on the loop",
    "p": "The flow-volume loop is the same maneuver plotted differently: airflow in liters per second against lung volume instead of against time. Physicians read shape here rather than numbers, which is why a loop tells you things a table cannot. Learn the landmarks so you can follow along when someone points at a screen.",
    "visual": {
     "t": "img",
     "src": "loop-landmarks",
     "cap": "The expiratory half sits above the line, the inspiratory half below it. Peak flow is the sharp spike right after the blow starts, then FEF25, FEF50 and FEF75 mark flow at progressive points through the breath, and FVC is where the loop closes. FIV1 and FIF50 come from the way back in."
    },
    "list": [
     "Expiration: Peak Flow, FEF25, FEF50, FEF75, FEV0.5, FEV1, FEV3.0, FVC",
     "Inspiration: FIV1 and FIF50",
     "A sharp peak flow is a fingerprint of real effort, and a blunt one is a warning sign"
    ]
   },
   {
    "h": "The loop changes shape",
    "p": "This is the fastest pattern recognition in the whole field. A normal loop has a sharp peak and a steady fall. Obstruction sags on the way down, because as lung volume drops the airways narrow and collapse and the patient simply cannot maintain flow. Restriction keeps a fairly normal shape but shrinks, a small loop squeezed into a narrow volume. A fixed upper airway obstruction flattens the top and the bottom, because the blockage limits flow in both directions. Flip between them and watch what actually moves.",
    "visual": {
     "t": "svg",
     "id": "fvloop"
    },
    "key": "Obstruction sags, restriction shrinks, a fixed upper airway blockage flattens both halves."
   },
   {
    "h": "Obstruction versus restriction",
    "p": "Here are the two classic patterns side by side. Look at what the ratio does, because that is where people get it backwards. In obstruction, FEV1 falls faster than FVC, so the ratio drops. In restriction, both fall together, so the ratio stays normal or even rises. Restriction shows up as a small lung, and TLC is what confirms it.",
    "visual": {
     "t": "table",
     "head": [
      "Measurement",
      "Obstructive",
      "Restrictive"
     ],
     "rows": [
      [
       "FVC",
       "Normal or down",
       "Down"
      ],
      [
       "FEV1",
       "Down",
       "Down"
      ],
      [
       "FEF25-75%",
       "Down",
       "Normal to down"
      ],
      [
       "FEV1/FVC",
       "Down",
       "Normal to up"
      ],
      [
       "TLC",
       "Normal or up",
       "Down"
      ]
     ],
     "note": "Obstructive disorders limit expiratory airflow so the airways cannot empty as fast as normal. Restrictive disorders reduce lung volume and lung compliance."
    },
    "list": [
     "Obstructive examples: asthma, emphysema, cystic fibrosis",
     "Restrictive examples: interstitial fibrosis, scoliosis, obesity, lung resection, neuromuscular disease, cystic fibrosis",
     "Cystic fibrosis appears on both lists, which is a good reminder that patients do not read the textbook"
    ],
    "key": "Obstruction pulls the ratio down. Restriction leaves it normal or high and pulls TLC down."
   },
   {
    "h": "Every pattern on one grid",
    "p": "Real reports are messier than two patterns. Five values can be low for reasons that have nothing to do with disease, including a patient who simply did not try hard enough, and the classification below is how that gets sorted out. Notice how often the comments column says the same thing: you need lung volumes to finish the job.",
    "visual": {
     "t": "table",
     "head": [
      "Pattern",
      "FEV1",
      "FVC",
      "FEV1/FVC",
      "What it means"
     ],
     "rows": [
      [
       "Obstructive",
       "Normal or down",
       "Normal",
       "Down",
       "Airflow limitation"
      ],
      [
       "Restrictive",
       "Down",
       "Down",
       "Normal or up",
       "TLC must be reduced to confirm it"
      ],
      [
       "Non-specific",
       "Down",
       "Down",
       "Normal",
       "TLC is normal. Extra testing helps, such as bronchodilator response or airway resistance. When TLC is not available this has been described in population studies as preserved ratio impaired spirometry, or PRISm, in current and former smokers"
      ],
      [
       "Muscle weakness",
       "Down",
       "Down",
       "Normal",
       "Lack of a sharp peak expiratory flow"
      ],
      [
       "Suboptimal effort",
       "Down",
       "Down",
       "Normal",
       "Lack of a sharp peak expiratory flow"
      ],
      [
       "Mixed disorder",
       "Down",
       "Down",
       "Down",
       "Lung volumes are needed to confirm"
      ]
     ],
     "note": "Reduced and elevated results are defined by the lower and upper limits of normal. Muscle weakness and poor effort can look identical on the numbers, which is why the shape of the curve matters."
    },
    "key": "Three of the six patterns end with the same instruction: get lung volumes."
   },
   {
    "h": "GOLD versus ATS",
    "p": "This is a live argument in real clinics and it is worth knowing which side of it your customer sits on. GOLD defines obstruction as FEV1/FVC below 70%, a fixed cut point. ATS defines it as FEV1/FVC below the lower limit of normal for that specific patient. In adults 65 and older with respiratory symptoms who are current or previous smokers, the GOLD criteria proved more sensitive for COPD-related obstruction, agreed better with an expert panel, and did a better job flagging patients who went on to have exacerbations, hospitalization or worse. But GOLD can miss up to 50% of young adults with obstructive lung disease and overdiagnoses healthy nonsmokers, so physicians should use ATS criteria in patients under 65 regardless of smoking status, and in nonsmokers 65 and older.",
    "visual": {
     "t": "img",
     "src": "gold-staging",
     "cap": "The GOLD severity table for COPD. Two things to notice: severity is graded on FEV1 as a percent of predicted, and it is graded after a bronchodilator, not before. A pre-bronchodilator number does not stage anybody."
    },
    "key": "GOLD uses a fixed 70% ratio, ATS uses the patient's own lower limit of normal."
   },
   {
    "h": "Did the inhaler help",
    "p": "After the baseline test, the patient gets a bronchodilator and blows again. A positive bronchodilator response is an improvement of more than 12% <b>and</b> more than 200 mL. Both, not either. That double threshold exists because a 12% jump on a tiny volume is noise, and 200 mL on a huge lung might just be a better effort the second time.",
    "visual": {
     "t": "img",
     "src": "bd-reversibility",
     "cap": "A worked case in a 26-year-old male. Read across a row: predicted, lower limit of normal, the actual value, percent predicted, then percent change after the drug. The two loops are the same story in pictures, with the post-bronchodilator loop opening up over the pre-bronchodilator one."
    },
    "key": "Bronchodilator response is more than 12% AND more than 200 mL. One without the other does not count."
   },
   {
    "h": "How bad is it",
    "p": "Grading severity is where percent predicted is slowly losing ground to z-scores. A z-score expresses how far an observed value sits from the predicted value in standard deviations, after accounting for sex, age, height and ancestral grouping, and it is the recommended method for setting the limit of normality and for stating how impaired a patient is. The reason is simple: a fixed percent cut point is harsher on some patients than others, while a z-score means the same thing for everyone.",
    "visual": {
     "t": "table",
     "head": [
      "z-score",
      "Severity"
     ],
     "rows": [
      [
       "Above -1.645",
       "Normal"
      ],
      [
       "-1.65 to -2.5",
       "Mild"
      ],
      [
       "-2.51 to -4",
       "Moderate"
      ],
      [
       "Below -4.1",
       "Severe"
      ]
     ],
     "note": "A three-level system based on z-scores is the recommended way to state the degree of lung function impairment."
    },
    "list": [
     "The older percent-predicted convention treats above 80% as normal for FEV1, FVC, TLC and DLCO",
     "Restrictive disease by TLC: under 80% predicted is restriction",
     "70% to 80% predicted, mild restrictive disease",
     "60% to 70% predicted, moderate restrictive disease",
     "50% to 60% predicted, moderately severe restrictive disease",
     "Under 50% predicted, severe restrictive disease",
     "Normal values themselves vary with height, age, gender and ethnicity"
    ],
    "key": "z-scores are the recommended method. Normal is above -1.645, severe is below -4.1."
   }
  ],
  "angle": "This is the module that earns you credibility with the tech, not just the physician. You can coach an office through the ATS rules in under a minute, three acceptable blows and the two largest FVC and FEV1 within 0.150 L, and bad data is the number one reason a practice quietly stops testing. With the physician, the opening is the pattern grid: non-specific, mixed and restrictive patterns all end with \"get lung volumes to confirm,\" and if the office cannot run volumes and DLCO in house, every one of those patients becomes a referral instead of a completed workup. Ask what happens today to the patient whose ratio is normal but whose FEV1 and FVC are both down."
 },
 "spirometry": {
  "minutes": 12,
  "intro": "Spirometry is the pulmonary function test performed most often, because it has more indications than any other. It is also the test your accounts will run every single day, so it is the test you will be asked about in the hallway, at the front desk, and by the physician between patients. Learn this module cold. If you can explain what the machine is measuring, coach a good blow, and read whether a test was any good, you are useful in that office instead of just present in it.",
  "sections": [
   {
    "h": "How much, and how fast",
    "p": "Spirometry measures the maximum volume of gas inhaled after a maximum volume of gas exhaled. The patient fills all the way up, empties all the way out, and the device records two things at once: <b>how much</b> air moved and <b>how fast</b> it moved. The maneuver can be done slow or forced, and it can be repeated after a bronchodilator to see if the numbers improve.",
    "list": [
     "FVC, forced vital capacity: the total volume of air that can be forced out. This is the \"how much\".",
     "FEV1, forced expiratory volume in one second: the volume of that FVC forced out in the first second. This is the \"how fast\".",
     "FEV1/FVC: the fraction of the whole breath that leaves in that first second. Normal is 75 to 80%."
    ],
    "visual": {
     "t": "img",
     "src": "fv-loop",
     "cap": "A normal flow volume loop. Flow is on the vertical axis, volume on the horizontal. The blow above the line rockets up to a sharp peak near 7.5 L/s and then falls in a straight, slightly convex line to empty. The curve below the line is the breath back in. Shape first, numbers second: that clean spike and straight ramp down is what a healthy blow looks like."
    },
    "key": "FVC answers how much. FEV1 answers how fast. Normal FEV1/FVC is 75 to 80%."
   },
   {
    "h": "Airways or parenchyma",
    "p": "Two different parts of the lung fail in two different ways, and spirometry is how you tell them apart. The airways are the plumbing, the trachea down to the bronchioles. The parenchyma is the tissue where gas actually crosses over, the alveoli, alveolar ducts and respiratory bronchioles. When the plumbing narrows, air gets stuck on the way out and flow drops. When the tissue stiffens or is lost, the lungs simply hold less and volume drops.",
    "visual": {
     "t": "vs",
     "a": {
      "h": "Airways problem",
      "items": [
       "Trachea down through the bronchioles",
       "Impairment typically correlated with expiratory airflow obstruction",
       "The \"how fast\" side of the test suffers",
       "CBABE: COPD, bronchitis, asthma, bronchiectasis, emphysema"
      ]
     },
     "b": {
      "h": "Parenchyma problem",
      "items": [
       "Alveoli, alveolar ducts, respiratory bronchioles, where gas exchange happens",
       "Impairment typically correlated with restrictive lung disease",
       "The \"how much\" side of the test suffers",
       "Pathologies here are nearly limitless"
      ]
     }
    },
    "key": "Flow problems point at the airways. Volume problems point at the tissue."
   },
   {
    "h": "The loop shows the pattern",
    "p": "The flow volume loop is the picture the physician actually looks at, and its shape changes with the disease before you ever read a number off the table. Drag through the shapes below. A normal blow peaks fast and falls in a near straight line. Obstruction scoops the falling edge inward, because the airways collapse and the air trickles out. Restriction keeps the shape but shrinks the whole loop, because there was less air in there to begin with. A fixed upper airway problem flattens the top and the bottom, since the choke point limits both directions.",
    "visual": {
     "t": "svg",
     "id": "fvloop"
    },
    "key": "Physicians read the shape first. Learn the four shapes and you can follow the conversation."
   },
   {
    "h": "Before they ever blow",
    "p": "A test is only as good as the patient in front of it, and ATS/ERS 2019 lists activities that should be avoided before lung function testing. This is a genuinely useful thing to hand an office, because these are the things that quietly wreck a result and then get blamed on the machine. Front desk staff can screen for all four when they confirm the appointment.",
    "visual": {
     "t": "img",
     "src": "pretest-prep",
     "cap": "The ATS/ERS pre-test list. Notice that every item comes with a physiologic reason, not just a rule: smoking or vaping within 1 hour causes acute bronchoconstriction, intoxicants within 8 hours hurt coordination and comprehension, vigorous exercise within 1 hour can trigger exercise induced bronchoconstriction, and tight clothing physically restricts chest and abdominal expansion."
    },
    "list": [
     "Smoking, vaping or water pipe use within 1 hour before testing",
     "Consuming intoxicants within 8 hours before testing",
     "Performing vigorous exercise within 1 hour before testing",
     "Wearing clothing that substantially restricts full chest and abdominal expansion"
    ],
    "key": "Bad prep looks exactly like bad lungs on the report. Screen for it at scheduling."
   },
   {
    "h": "Set the patient up",
    "p": "Body position changes the answer. Before the first breath, the operator should get the posture, the nose clip and the mouthpiece right, because a leak around the lips or air escaping through the nose costs volume that the patient actually had.",
    "list": [
     "Upright sitting position in a stationary chair",
     "Legs not crossed, feet on the floor",
     "Head straight or slightly extended",
     "Nose clip on the lower half of the nose",
     "Patient slightly bites on the mouthpiece",
     "Lips sealed firmly around the mouthpiece",
     "Tongue below the mouthpiece, not blocking it"
    ],
    "visual": {
     "t": "img",
     "src": "patient-technique",
     "cap": "Seated upright, nose clip on, handheld unit held level, lips sealed. Nothing here is decoration. The nose clip stops air sneaking out the nose, and sitting upright keeps the belly from pushing up on the diaphragm."
    },
    "key": "Upright, nose clipped, tight lip seal, tongue out of the way."
   },
   {
    "h": "The forced maneuver",
    "p": "This is the ATS/ERS 2019 standard approach for FVC. It starts from normal breathing, and then four things have to happen in order. The most common failure is a slow, casual inhale followed by a pause at the top, and that quietly costs peak flow and FEV1 before the patient has even started to blow.",
    "visual": {
     "t": "steps",
     "items": [
      {
       "h": "Inhale completely and rapidly",
       "p": "Fill all the way to TLC, the fullest the lungs can get, with a pause of less than 2 seconds at the top. Reduced PEF and FEV can occur when inspiration is slow or there is a long pause before the blast."
      },
      {
       "h": "Blast, do not blow",
       "p": "Expire with maximal effort until no more air can be expelled, while maintaining an upright posture. The subject should be coached to \"blast\", not just \"blow\"."
      },
      {
       "h": "Keep going",
       "p": "Continue complete expiration for a maximum of 15 seconds. Most patients stop early because it feels finished long before it is."
      },
      {
       "h": "Big breath back in",
       "p": "Then inspiration at maximal flow back to maximum lung volume. This closes the loop and is part of the test, not an afterthought."
      }
     ]
    },
    "key": "Fast in, short pause, blast out, keep going, then fast all the way back in."
   },
   {
    "h": "Coach it, never watch it",
    "p": "According to ATS/ERS 2019, quality results begin with a quality operator. Spirometry is effort dependent, so the person doing the coaching is part of the instrument. This is also where MiniBox+ helps: the wheel on screen turns green when the blow has gone far enough, so the operator has an objective cue instead of a guess.",
    "visual": {
     "t": "img",
     "src": "coaching-front",
     "cap": "The MiniBox+ PFT Coaching sheet. Note the annotated example loop on the right, with \"Blast Out\" on the way up and \"Full Inhalation\" on the way back. This sheet is the single best leave behind in the bag, because it gives the office the exact words to say."
    },
    "list": [
     "Setup: detach the handheld unit from the MiniBox+ and let it calibrate, then hand it to the patient",
     "Teeth over the mouthpiece, tight seal with the lips, nose clip on",
     "Start with 2 to 3 normal relaxed breaths",
     "Deep inhale, then immediate forced fast exhale",
     "Squeeze all the air out until the wheel turns green",
     "Deep breath back in to close the flow volume loop"
    ],
    "key": "Quality results begin with a quality operator, ATS/ERS 2019."
   },
   {
    "h": "Slow tests: SVC and MVV",
    "p": "Not every maneuver is a blast. Slow vital capacity gets the same full breath without the force, which matters when forcing the air out collapses the airways and hides volume the patient really has. It starts from normal tidal breathing, then goes all the way one direction and all the way back the other. Tap the trace below to see how the pieces of a breath stack up.",
    "visual": {
     "t": "svg",
     "id": "spirogram"
    },
    "list": [
     "ERV maneuver, starting with an exhalation: normal breathing, then complete exhalation (ERV), then complete inhalation (VCIN and IC), then back to normal breathing. VCIN and ERV are measured, IC is calculated.",
     "IC maneuver, starting with an inhalation: normal breathing, then complete inhalation (IC), then complete exhalation (VCEX and ERV), then back to normal breathing. VCEX and IC are measured, ERV is calculated.",
     "Example from the training set: VCIN 3.95 L, IC 2.70 L, ERV 1.25 L.",
     "MVV, maximal voluntary ventilation: the maximum volume of air in L/min a subject can breathe over a specified period of time, 12 seconds for normal subjects.",
     "MVV estimates maximum minute ventilation and can be used to estimate predicted max ventilation for CPET. Coach the patient to an ideal rate of 90 to 110 breaths/min."
    ],
    "key": "Slow gets volume honestly. MVV asks how hard the whole system can work."
   },
   {
    "h": "Was that blow acceptable?",
    "p": "A number the patient did not really earn is worse than no number at all, so ATS/ERS defines exactly what makes a maneuver acceptable. Reps do not grade tests, but you should recognize these, because when an office says the device \"gave a bad result\", nine times out of ten one of these seven was missed.",
    "visual": {
     "t": "table",
     "head": [
      "#",
      "Acceptability check"
     ],
     "rows": [
      [
       "1",
       "A good start of exhalation with extrapolated volume, <5% of FVC or 0.150 L, whichever is greater"
      ],
      [
       "2",
       "Free from artifacts"
      ],
      [
       "3",
       "No cough during first second of exhalation (for FEV1)"
      ],
      [
       "4",
       "No glottis closure or abrupt termination (for FVC)"
      ],
      [
       "5",
       "No early termination or cutoff (for FVC)"
      ],
      [
       "6",
       "Maximal effort provided throughout the maneuver"
      ],
      [
       "7",
       "No obstructed mouthpiece"
      ]
     ],
     "note": "Graham, Brian L., et al. \"Standardization of Spirometry 2019 Update. An Official American Thoracic Society and European Respiratory Society Technical Statement.\" Am J Respir Crit Care Med, vol. 200, no. 8, 2019."
    },
    "list": [
     "End of forced expiration, must achieve one of these three indicators: expiratory plateau, 0.025 L or less in the last 1 second of expiration",
     "Expiratory time of 15 seconds or more",
     "FVC is within the repeatability tolerance of, or is greater than, the largest prior observed FVC"
    ],
    "key": "Cough in the first second kills FEV1. Stopping early kills FVC."
   },
   {
    "h": "Repeatable, then graded",
    "p": "One good blow is not a test. The patient has to do it again and land in the same place, which is why properly coached spirometry shows a high degree of repeatability and reliability even in the very sickest patients. It really is like a fingerprint of the lungs. The software then converts \"how many acceptable trials\" and \"how close were they\" into a single letter grade, so anyone in the office can see the quality at a glance without knowing the criteria by heart.",
    "visual": {
     "t": "table",
     "head": [
      "Grade",
      "Number of measurements",
      "Repeatability: age >6 yr",
      "Repeatability: age 6 yr or under"
     ],
     "rows": [
      [
       "A",
       "3 or more acceptable",
       "Within 0.150 L",
       "Within 0.100 L"
      ],
      [
       "B",
       "2 acceptable",
       "Within 0.150 L",
       "Within 0.100 L"
      ],
      [
       "C",
       "2 or more acceptable",
       "Within 0.200 L",
       "Within 0.150 L"
      ],
      [
       "D",
       "2 or more acceptable",
       "Within 0.250 L",
       "Within 0.200 L"
      ],
      [
       "E",
       "2 or more acceptable",
       "Greater than 0.250 L",
       "Greater than 0.200 L"
      ],
      [
       "E",
       "OR 1 acceptable",
       "N/A",
       "N/A"
      ],
      [
       "U",
       "0 acceptable AND 1 or more usable",
       "N/A",
       "N/A"
      ],
      [
       "F",
       "0 acceptable and 0 usable",
       "N/A",
       "N/A"
      ]
     ],
     "note": "ATS/ERS 2019 grading. Repeatability criteria are applied to acceptable FVC and FEV1 values."
    },
    "key": "Over age 6: the two largest FVCs within 0.150 L, and the two largest FEV1s within 0.150 L."
   },
   {
    "h": "What the report keeps",
    "p": "The patient blows several times, but only certain numbers travel forward onto the report. The rule is not \"the last one\" or \"the prettiest one\". The largest FVC and the largest FEV1 are taken, even if they came from two different blows, and the rest of the indices come from the single maneuver with the largest sum of FVC plus FEV1. On MiniBox+ this is already handled. Settings come loaded and the system is ready for testing, and the table is configured to display 8 trials per level, pre and post bronchodilator.",
    "visual": {
     "t": "img",
     "src": "minibox-fvc-screen",
     "cap": "The Forced Vital Capacity Results screen. Look at how much lives on one page: predicted versus best, a quality grade per parameter, percent predicted, the individual trials across the pre column, and both the flow volume loop and the volume time graph. The physician gets shape and numbers in a single look, and the post bronchodilator column sits right beside the pre."
    },
    "list": [
     "Perform the maneuver, then check within maneuver criteria",
     "Aim for three acceptable FEV1 and three acceptable FVC measurements",
     "Check between maneuver criteria, that is repeatability",
     "Determine the largest FVC and the largest FEV1",
     "Determine other indices from the maneuver with the largest sum of FVC plus FEV1, then store the data"
    ],
    "key": "Best FVC and best FEV1 can come from different blows. That is by design."
   }
  ],
  "angle": "Spirometry is the volume driver in every account you sell, so this is the module that turns a demo into a clinical conversation. You can tell a physician that MiniBox+ grades every trial against ATS/ERS 2019 acceptability and repeatability right on screen, displays 8 trials per level pre and post bronchodilator, and shows the flow volume loop and the volume time graph together, so quality is visible before the patient leaves the chair. Then go one better and coach their staff, because ATS/ERS says quality results begin with a quality operator, and the rep who hands over the PFT Coaching sheet and teaches the word \"blast\" instead of \"blow\" is the rep who gets called back."
 },
 "dlco": {
  "minutes": 10,
  "intro": "Spirometry is the test everybody knows. DLCO is the test that separates a serious PFT lab from a box in a closet, and it is where offices get nervous, because the maneuver is fussy, the gas cylinder is sitting right there, and one coaching mistake sinks the result. If you can walk a physician through what DLCO actually measures, and walk a medical assistant through the four moves without reading off a card, you are the rep they call. This module gives you both.",
  "sections": [
   {
    "h": "Air in is not enough",
    "p": "The main job of the respiratory system is gas exchange between the body tissues and the surrounding air. Spirometry only tells you how well air moves in and out of the pipes. It says nothing about whether the oxygen in that air ever reaches the blood. That crossing happens at the alveolar capillary membrane, the paper thin wall between the air sac and the blood vessel wrapped around it. Oxygen moves from the higher pressure side in the alveolus to the lower pressure side in the capillary, and carbon dioxide moves the other way. <b>DLCO is the diffusing capacity of the lungs for carbon monoxide</b>, and it is the test that measures how well that crossing works.",
    "list": [
     "Helps diagnose various lung diseases",
     "Helps manage a lung disease that is already diagnosed",
     "Tracks whether the disease is progressing",
     "Shows whether a whole body disease has reached the lungs"
    ],
    "visual": {
     "t": "img",
     "src": "gas-exchange",
     "cap": "Follow the arrows. Oxygen crosses into the red blood cell and carbon dioxide comes back out, and it has to pass the alveolar epithelium, the surfactant layer, the air space and the capillary wall to do it. Every one of those layers is somewhere diffusion can fail."
    },
    "key": "Spirometry measures moving air. DLCO measures whether that air actually gets into the blood."
   },
   {
    "h": "Why carbon monoxide",
    "p": "You cannot easily measure oxygen crossing, so the test borrows a gas that behaves in a way the machine can track. The patient inhales a known mix: <b>0.3 percent carbon monoxide</b>, an inert tracer gas, <b>0.3 percent methane</b>, <b>21 percent oxygen</b> and a balance of nitrogen. Carbon monoxide crosses the membrane and binds to the haemoglobin in the red blood cells, so however much of it goes missing from the breath is the amount that made the trip. Methane does not cross. Whatever happens to the methane is pure dilution, which tells the machine how much lung the gas actually reached. Two gases, two different questions, one breath.",
    "visual": {
     "t": "img",
     "src": "co-diffusion",
     "cap": "The CO path in three dimensions: out of the alveolar air space, through the thin membrane, and onto the haemoglobin in the red cells streaming past underneath. Notice how short the trip is. Anything that thickens that wall or thins out those red cells changes the answer."
    },
    "key": "CO measures the crossing. Methane never crosses, so it measures the lung the gas reached."
   },
   {
    "h": "The names on the report",
    "p": "A physician will not say DLCO to you. They will say KCO, or ask what the VA looked like. Learn these six and you can stay in the conversation. One extra piece worth knowing: because VA is the alveolar volume at full inspiration, it is treated as a close approximation of total lung capacity in people with normal airway function. That shortcut is called the <b>Punjabi method</b>, and it is fast and cheap because it comes from a single breath instead of a full multi breath lung volume study. Its limit is honest and worth saying out loud: with significant airway obstruction, one breath may not reach the whole lung, so it is not reliable in every patient.",
    "visual": {
     "t": "table",
     "head": [
      "Parameter",
      "What it is"
     ],
     "rows": [
      [
       "DLCO_sb",
       "Diffusing capacity of the lungs for carbon monoxide, measured during a single breath maneuver. This is the headline number."
      ],
      [
       "DLCO_c",
       "The corrected DLCO. It accounts for the person's alveolar volume, so gas exchange can be compared fairly between patients with different lung sizes."
      ],
      [
       "VA",
       "Alveolar volume. The air inside the alveoli that is available for gas exchange, in other words the lung tissue actually taking part. Compare it to TLC from a lung volume test."
      ],
      [
       "BHT",
       "Breath hold time, in seconds."
      ],
      [
       "DL/VA",
       "Diffusing capacity for carbon monoxide per unit of alveolar volume. Same thing as KCO."
      ],
      [
       "KCO_sb",
       "Transfer coefficient. DLCO divided by VA, so the rate of transfer per unit of alveolar volume. The fairer comparison when two patients have very different sized lungs."
      ]
     ],
     "note": "VA comes from tracer gas dilution during the single breath hold."
    },
    "key": "DLCO is the total. KCO is the rate per unit of lung. Small lungs can look bad on one and fine on the other."
   },
   {
    "h": "Set the patient up",
    "p": "Most bad DLCO results are decided before the mouthpiece goes in. Physiology gets disturbed by things patients do on the way to the appointment, so the front desk and the medical assistant matter as much as the machine. Coach the office to hand these instructions out at scheduling, not in the waiting room. The equipment side is the same idea. The ERS and ATS 2017 standard sets a calibration schedule for the system, and the DLCO check is done by pushing a known <b>3 litre syringe</b> volume through it like a patient breath and confirming the result falls inside the accepted limit. If the morning check fails, nobody tests patients on that machine until it is sorted.",
    "list": [
     "No smoking on the day of testing",
     "No alcohol on the day of testing",
     "No exercise immediately before testing",
     "The patient sits for 5 minutes before the DLCO test",
     "A patient on supplemental oxygen is on room air for 10 minutes first"
    ],
    "visual": {
     "t": "img",
     "src": "dlco-room",
     "cap": "A real room, and everything in it earns its spot: the MiniBox+ on a cart, the tablet running the test, a laminated coaching card on the wall so any staff member can run it, and the green DLCO test gas cylinder with its dual regulator gauges. Check the gauges when you walk in. An office that lets the cylinder run low loses testing days."
    },
    "key": "A patient who smoked in the parking lot has already changed the number you are about to print."
   },
   {
    "h": "One breath, four moves",
    "p": "The single breath DLCO is one continuous maneuver with four distinct moves, and it takes well under a minute. Blow all the way out, fill all the way up fast, hold for ten seconds, then let it out smoothly. The whole test lives or dies on the patient doing all four in one uninterrupted go, which is why coaching beats instructions. Watch the trace below run through it once, then take the moves one at a time.",
    "list": [
     "Move one: a relaxed, complete exhale until the lungs are empty",
     "Move two: a fast inhale all the way up to total lung capacity",
     "Move three: hold that breath for 10 seconds",
     "Move four: a smooth, unforced exhale that gives the machine a discard volume and then a sample volume"
    ],
    "visual": {
     "t": "svg",
     "id": "dlcotimeline"
    },
    "key": "Four moves, one breath, no pauses. Stop the trace anywhere and the test is gone."
   },
   {
    "h": "Move one, blow it out",
    "p": "The patient breathes out in a relaxed way until there is nothing left to give, all the way down to ERV, the extra air you can still push out after a normal quiet breath out. It is not a hard blast. It is complete, not forceful. This is the move that new techs get wrong, because judging when a patient is truly empty by eye takes practice. On the MiniBox this setting is <b>fully automatic</b>. The machine watches the volume and stops the patient once they are empty, so the tech is coaching rather than guessing.",
    "visual": {
     "t": "img",
     "src": "dlco-step1",
     "cap": "Step one on a volume versus time trace. The green line walks down to ERV and flattens out, and that flat part is the machine deciding the patient is empty. Nothing about this line is forced or sharp."
    },
    "key": "Empty, not explosive. On the MiniBox the machine calls it, not the tech."
   },
   {
    "h": "Move two, fill up fast",
    "p": "Straight off the bottom, the patient pulls the test gas all the way in to total lung capacity, and does it quickly. Quick matters because the breath hold clock is already running and a slow fill smears the timing. Full matters even more. The rule is that <b>VIN, the volume inhaled, has to be greater than 90 percent of the largest vital capacity</b> on record for that patient. Miss that and you have not just got a smaller breath, you have got a wrong answer, because <b>a submaximal inhalation lowers both DLCO and VA</b>. This is the single most common reason a DLCO gets repeated. Coach it as one word: gulp.",
    "visual": {
     "t": "img",
     "src": "dlco-step2",
     "cap": "Step two, a near vertical climb up to total lung capacity. Steep and tall are both quality criteria here. A lazy diagonal means a slow fill and a shallow top means a failed VIN."
    },
    "key": "VIN must be over 90 percent of the largest VC. A short breath does not just shrink DLCO, it falsifies it."
   },
   {
    "h": "Move three, hold for ten",
    "p": "Now the patient holds that full breath for <b>10 seconds</b> while the chemistry happens. Carbon monoxide is crossing out of the air space and into the blood, so it disappears. Methane stays in the air space and just spreads out into the lung, so it dilutes. The gap between those two behaviours is your result. The timing is not measured with a stopwatch by feel. It is the Jones and Meade method: breath hold time is counted <b>from 30 percent of the inspired time to the halfway point of the sample volume</b>, so the number is consistent from patient to patient and lab to lab. What you coach is simple. Relaxed hold, no straining, no pushing against a closed throat.",
    "visual": {
     "t": "img",
     "src": "dlco-step3",
     "cap": "Two things in one picture. The alveolus cartoon shows the split, CO diffusing away while CH4 only dilutes. The timing graph shows why BHT is not just the flat part of the trace: the count runs from 30 percent of the inspired time to half the sample volume."
    },
    "key": "Ten seconds of hold: CO leaves the air space, methane only spreads out. That difference is the test."
   },
   {
    "h": "Move four, exhale smooth",
    "p": "The last move is the one nobody rehearses, and it is where good tests get thrown away. The exhale has to be <b>smooth, unforced and uninterrupted</b>. No blasting, no stopping, no coughing halfway. The machine throws away the first chunk of that exhale, called the discard volume, and then analyses the next chunk, the sample volume. Those settings shift for small patients, because you cannot ask for a litre of clean sample from a patient who does not have it to give. Knowing this table is a genuine rep move: if an office keeps failing DLCOs on smaller or sicker patients, the settings are usually the reason.",
    "visual": {
     "t": "table",
     "head": [
      "Setting",
      "Standard",
      "Small vital capacity"
     ],
     "rows": [
      [
       "Discard volume (DV)",
       "750 to 1000 mL",
       "500 mL if VC is under 2 L"
      ],
      [
       "Sample volume (SV)",
       "500 to 1000 mL",
       "Under 500 mL if VC is under 1 L"
      ]
     ],
     "note": "Discard first, then sample. Both come out of one continuous, unforced exhale."
    },
    "key": "Smooth and uninterrupted. A cough in the exhale costs you the whole maneuver."
   },
   {
    "h": "Did the test count",
    "p": "ATS and ERS do not just say pass or fail, they grade the effort. The grading system runs as a cascade: the software walks down from <b>grade A</b>, the cleanest result, through <b>B, C and D</b> as more of the criteria slip, and there is a separate red <b>grade F</b> for conditions that disqualify the maneuver outright. That letter travels with the result, so a physician reading a low DLCO can tell the difference between a sick patient and a bad test. Teach the office to look at the letter before they argue with the number, and teach them that a repeated bad grade is almost always coaching, not the machine.",
    "visual": {
     "t": "table",
     "head": [
      "What gets checked",
      "What good looks like"
     ],
     "rows": [
      [
       "VIN, the volume inhaled",
       "Greater than 90 percent of the largest vital capacity recorded for that patient"
      ],
      [
       "Inhalation time",
       "Fast. The patient goes from empty to full without hesitating, because the breath hold clock is already running"
      ],
      [
       "Breath hold window",
       "10 seconds, timed the Jones and Meade way, from 30 percent of the inspired time to half the sample volume"
      ],
      [
       "Sample exhalation",
       "Smooth, unforced and uninterrupted, delivering the set discard volume and then the sample volume"
      ],
      [
       "Repeatability",
       "More than one acceptable maneuver, and the results have to agree with each other"
      ]
     ],
     "note": "ATS and ERS measurement criteria for DLCO. The MiniBox checks these automatically and hands back a grade from A through D, or F if the maneuver is disqualified."
    },
    "key": "Read the grade first, then the number. The letter tells you whether the number deserves belief."
   }
  ],
  "angle": "DLCO is where offices are most afraid of getting it wrong, and fear is what keeps a device sitting in a closet. Your line to a physician is that the MiniBox does not just run the maneuver, it polices it: the exhale to empty is fully automatic so the machine stops the patient rather than the tech guessing, and every result comes back with an ATS and ERS grade, so a low number can be trusted as physiology instead of technique. Add that a single breath also gives VA, which approximates total lung capacity in patients with normal airway function, and you are selling one quick maneuver that answers two questions the practice would otherwise send out of the building."
 },
 "lung_volumes_pleth": {
  "minutes": 12,
  "intro": "Spirometry only sees the air a patient can actually blow out. It never sees the air that stays behind, and in obstruction that leftover air is the whole story. Body plethysmography is how you get the real total. This is the module that lets you stand in front of a pulmonologist and talk about the box like you have run the test yourself, because half the objections you will hear are not about the science, they are about technique and repeatability.",
  "sections": [
   {
    "h": "Spirometry stops short",
    "p": "Body plethysmography (say it \"pleh-thiz-mah-graf-ee\") is a noninvasive lung function test. It answers two questions spirometry cannot: how much air is in the lungs after the biggest breath in, and how much is still sitting there after the biggest breath out. Learn these three letters cold, because every conversation about lung volumes runs through them.",
    "visual": {
     "t": "table",
     "head": [
      "Value",
      "What it actually is"
     ],
     "rows": [
      [
       "TLC, total lung capacity",
       "The volume of air in the lungs after taking the biggest breath you can"
      ],
      [
       "FRC, functional residual capacity",
       "The volume of air that remains in the lungs after breathing out normally"
      ],
      [
       "RV, residual volume",
       "The volume of air that stays in the lungs after breathing out as much as possible"
      ]
     ]
    },
    "key": "Spirometry measures what moves. Plethysmography measures what stays."
   },
   {
    "h": "Boyle's law, plain English",
    "p": "The whole test rests on one gas law. Boyle's law says the pressure of a trapped gas is inversely proportional to the volume it occupies, as long as the temperature and the amount of gas do not change inside a closed system. Squeeze it into half the space and the pressure doubles. Let it expand and the pressure drops. Play with the piston below and watch the two numbers trade places, then picture the same thing happening to a chest inside a sealed box.",
    "visual": {
     "t": "svg",
     "id": "boyle"
    },
    "key": "Pressure times volume stays constant. P1V1 = P2V2. That is the entire test in five characters."
   },
   {
    "h": "The box and its sensors",
    "p": "The patient sits in an enclosed, airtight, see through cabin and breathes through a mouthpiece. One sensor inside the box watches the box pressure change as the chest expands and contracts. A second sensor at the mouthpiece watches airflow and the pressure in the mouth. Two separate signals, one for what the chest is doing and one for what the airway is doing. A shutter valve sits in the mouthpiece and can close the airway on command.",
    "visual": {
     "t": "img",
     "src": "pleth-schematic",
     "cap": "Follow the two wires. Box pressure comes from the chest pushing on the air around it, mouth pressure comes from inside the airway. The red shutter is the switch between the two measurements."
    }
   },
   {
    "h": "Why the shutter closes",
    "p": "When the shutter closes there is no airflow, so the glottis is effectively a dead end and the pressure at the mouth becomes equal to the pressure down in the alveoli. Now when the patient pushes, alveolar air compresses and the box air expands. When the patient pulls, alveolar air decompresses and the box air is squeezed. That swap is called the <b>volume shift</b>, the amount of alveolar air in millilitres compressed on the push and decompressed on the pull. Feed the volume shift and the mouth pressure into Boyle's law and out comes thoracic gas volume, the amount of gas in the lungs at that moment.",
    "visual": {
     "t": "img",
     "src": "boyles-law",
     "cap": "Pull the piston up and volume rises while pressure falls. Push it down and volume falls while pressure rises. The closed shutter turns the chest into exactly this cylinder."
    },
    "key": "Closed shutter, no flow, so mouth pressure equals alveolar pressure. That is what makes the math legal."
   },
   {
    "h": "Coaching the maneuver",
    "p": "This is where tests are won and lost, and it is the part office staff get wrong. The patient sits in the cabin, seals on the mouthpiece and supports both cheeks with their hands. They breathe quietly, the shutter closes, and they keep breathing steadily against it at a breathing frequency of 25 to 30. The shutter opens by itself once the occlusion time is up, or the operator can reopen it after enough loops have been collected. Then the linked vital capacity follows without the patient breaking the seal.",
    "visual": {
     "t": "img",
     "src": "pleth-technique",
     "cap": "Notice the hands pressed against the cheeks. Loose cheeks act like a balloon and blur the mouth pressure signal, which is the one number the calculation cannot afford to lose."
    },
    "list": [
     "Hands on the cheeks the whole time the shutter is closed",
     "Steady panting at a breathing frequency of 25 to 30, not fast and frantic",
     "Do not let the patient come off the mouthpiece before the linked vital capacity",
     "Let the shutter open on its own unless you have a reason to reopen it early"
    ]
   },
   {
    "h": "Reading the slope",
    "p": "With the shutter closed the system plots mouth pressure in kilopascals against volume shift in millilitres. Each pant traces a near straight line, and the <b>slope</b> of that line is what computes FRCpleth. Steeper or flatter is not good or bad on its own. What matters is that the tracings are clean and that they land on top of each other. If a physician asks what the box is actually calculating, this graph is your answer.",
    "visual": {
     "t": "img",
     "src": "frcpleth-slope",
     "cap": "Four colour coded closed shutter tracings, each with its regression line drawn through it. The angle of that line, not its length, is what becomes FRCpleth."
    },
    "key": "The box does not measure volume directly. It measures a slope and converts it."
   },
   {
    "h": "Linked means linked",
    "p": "FRC on its own does not give you TLC or RV. The FRC measurement has to be joined to a vital capacity maneuver in the same run. The ATS and ERS first preferred method is expiratory reserve volume plus a slow inspiratory vital capacity taken right after FRC is acquired, and <b>linked</b> means the FRCpl must be followed by the vital capacity without the patient coming off the mouthpiece. The second recommended method is inspiratory capacity followed by an expiratory vital capacity, still linked to the FRC maneuver, though there the patient may come off the mouthpiece between trials. The 2005 task force found it difficult to reach consensus on only one of these, so labs use both.",
    "visual": {
     "t": "img",
     "src": "linked-maneuver",
     "cap": "One continuous trace: quiet tidal breathing, then a full push down to residual volume, then a full pull all the way up to total lung capacity. Break that seal partway and the trial is scrap."
    },
    "key": "If the patient comes off the mouthpiece mid run on the preferred method, the trial is gone."
   },
   {
    "h": "TLC and RV are arithmetic",
    "p": "Only FRC is measured. Everything else is subtraction and addition off the linked maneuver, which is why one sloppy vital capacity poisons three reported numbers at once. Learn the per trial math and the best column math, because the best column is not simply the best trial.",
    "visual": {
     "t": "table",
     "head": [
      "Value",
      "How the system gets it"
     ],
     "rows": [
      [
       "FRCpl",
       "Measured directly by the box with the shutter closed"
      ],
      [
       "RV for a trial",
       "RV = FRCpl minus ERV"
      ],
      [
       "TLC for a trial",
       "TLC = RV plus IVC"
      ],
      [
       "Reported FRCpl",
       "The mean of the accepted FRCpl trials"
      ],
      [
       "RV best",
       "RV best = mean FRCpl minus mean ERV"
      ],
      [
       "TLC best",
       "TLC best = RV best plus the largest IVC"
      ]
     ],
     "note": "ERV is expiratory reserve volume. IVC is slow inspiratory vital capacity. ATS and ERS Task Force, Wanger et al., Standardisation of the measurement of lung volumes, Eur Respir J 2005;26:511 to 522, page 513."
    },
    "key": "One measured value, four calculated ones. That is why technique matters more here than in spirometry."
   },
   {
    "h": "Proving the number is real",
    "p": "A single FRCpleth value proves nothing. The ATS and ERS Task Force is specific: \"With regards to repeatability, at least three FRCpleth values that agree within 5% should be obtained and the mean value reported.\" That is the standard a lab director will hold any device to, so know it by heart. Repeatability is only half of it. The box itself has a calibration routine the lab is expected to keep up with.",
    "visual": {
     "t": "img",
     "src": "frcpleth-repeat",
     "cap": "This is what you want to see: every closed shutter loop stacked on the same line. A tight bundle like this is a patient who understood the coaching."
    },
    "list": [
     "Box calibration performed daily",
     "A validation of accuracy using a known volume performed periodically",
     "Biological controls performed monthly"
    ],
    "key": "At least three FRCpleth values agreeing within 5 percent, and the mean gets reported. ATS and ERS 2005."
   },
   {
    "h": "When the loops drift",
    "p": "When trials will not agree, it is almost never the patient's lungs. It is one of three things, and you should be able to name all three in front of a tech without looking. Drift shows up as loop bundles sitting on separate parallel lines instead of one line, which is the software telling you the box conditions changed between trials rather than the lung volume changing.",
    "visual": {
     "t": "img",
     "src": "frcpleth-drift",
     "cap": "Two bundles, two parallel lines. Each bundle is internally tidy, so the patient panted fine. The gap between them is thermal drift in the cabin, not a change in the patient."
    },
    "list": [
     "Box leak is too large",
     "Thermal instability, which shows up as drift",
     "Improper panting technique"
    ],
    "key": "Loops tight but offset means the box drifted. Loops wide and scattered means the panting was wrong."
   },
   {
    "h": "Resistance comes free",
    "p": "With the shutter open, the same box gives you airway resistance and its mirror image, conductance. Raw is the pressure difference needed to move a given amount of air through the airways, or pressure divided by flow. Gaw is how easily air flows through them, flow divided by pressure, so it is just the reciprocal. Here is the intuition that sells it: with the shutter open, a healthy chest barely disturbs the box air, because air moves in and out easily. When the airways fight back, the chest has to compress and decompress far more alveolar air to push the same flow, and the volume shift grows.",
    "visual": {
     "t": "img",
     "src": "raw-loop-high",
     "cap": "A wide, shallow loop spanning the full range. Flat and wide means a lot of volume shift for very little flow, which is the signature of high airway resistance."
    },
    "list": [
     "Airway diameter: narrower airways create more resistance",
     "Lung volume: as lung volume increases, airways expand and resistance falls",
     "Mucus secretions: thick mucus obstructs airways and raises resistance",
     "Bronchospasm: airway smooth muscle contracts, airways narrow, resistance rises"
    ],
    "key": "At 2 L/s a healthy chest shifts about 8 ml of box air. High resistance and a big lung push it past 40 ml."
   }
  ],
  "angle": "This is the module that earns you the room. You can tell a pulmonologist that the MiniBox+ is not estimating the leftover air, it is measuring thoracic gas volume from Boyle's law with the shutter closed, and that it holds itself to the ATS and ERS 2005 bar of at least three FRCpleth trials agreeing within 5 percent before it reports a mean. Then you can say the part that closes deals: because the box takes the resistance loop with the shutter open in the same sitting, the practice gets Raw and Gaw out of a test they were already running. And when their tech says the numbers will not repeat, you already know the three suspects, so you become the person they call instead of the person they avoid."
 },
 "lung_volume": {
  "minutes": 8,
  "intro": "Plethysmography is not the only way to find FRC, and the practices you walk into may already own a gas based system or may have been trained on one. Nitrogen washout and helium dilution are clever, cheap and perfectly good in a normal lung. They also have one blind spot, and it happens to be the exact patient a pulmonology practice sees all day. Know how both work and you can explain the difference without ever trashing a competitor.",
  "sections": [
   {
    "h": "Three roads to FRC",
    "p": "Every lung volume method is really a hunt for one number, FRC, the air still in the lungs after a normal relaxed breath out. Once you have FRC, TLC and RV fall out of the linked vital capacity maneuver by arithmetic. What separates the methods is the physics they use to find that first number, and that choice decides which air they can and cannot see.",
    "visual": {
     "t": "table",
     "head": [
      "Method",
      "The physics it uses",
      "What it can see"
     ],
     "rows": [
      [
       "Plethysmography",
       "Boyle's law, pressure and volume of a trapped gas",
       "All compressible gas in the chest"
      ],
      [
       "Nitrogen washout",
       "Counting the nitrogen breathed out until almost none is left",
       "Only gas that communicates with the airway"
      ],
      [
       "Helium dilution",
       "A known gas concentration diluted by an unknown volume",
       "Only gas that communicates with the airway"
      ]
     ]
    },
    "key": "All three chase FRC. They differ in whether trapped air counts."
   },
   {
    "h": "Washing the nitrogen out",
    "p": "Room air is mostly nitrogen, so a resting lung is full of it. Give the patient a nitrogen free gas to breathe and every single breath out carries a little of the lung's nitrogen away with it. The system measures the nitrogen concentration at the end of each breath and keeps a running total of everything expired. Since all the nitrogen that comes out had to have been in the lung to start with, the total tells you how big the lung was. Watch the staircase on the curve: each breath holds a plateau, then steps down.",
    "visual": {
     "t": "img",
     "src": "n2-washout-curve",
     "cap": "End tidal nitrogen falls breath by breath as expired volume accumulates. The early steps are big, the late ones are tiny, which is why the test cannot simply be cut short."
    },
    "key": "End tidal nitrogen falls from about 61 percent down toward under 2 percent. The test ends when the well runs dry."
   },
   {
    "h": "The whole washout run",
    "p": "On the volume time trace the run has a clear shape, and knowing that shape lets you tell a tech what to expect before they ever press start. It opens with quiet tidal breathing to establish the baseline, then a deep expiration, then the long washout itself, roughly forty breaths. It closes with another deep expiration and one tall inspiratory capacity spike, which is the linked maneuver that turns FRC into TLC and RV.",
    "visual": {
     "t": "img",
     "src": "n2-washout-trace",
     "cap": "The forty or so small breaths in the middle are the actual measurement. The tall spike at the end is the inspiratory capacity, and without it you have FRC and nothing else."
    },
    "list": [
     "Quiet tidal breathing to set the baseline",
     "A deep expiration",
     "About forty washout breaths, the measurement itself",
     "A deep expiration and a full inspiratory capacity spike"
    ]
   },
   {
    "h": "Steady breathing comes first",
    "p": "The whole calculation assumes the lung was sitting at a stable resting volume when the washout began. If the patient is sighing, breath stacking or still settling into the mouthpiece, the starting point is wrong and so is every number that follows. The software draws an FRC stability line across the tidal breaths so the operator can see it rather than guess it. Coach the patient into boredom before you start.",
    "visual": {
     "t": "img",
     "src": "frc-stability",
     "cap": "The dashed FRC stability line is the target. The bottom of each tidal breath should land on it. Drifting bottoms mean the patient has not settled yet."
    },
    "key": "A wandering baseline is a wrong FRC. Settle the patient first, start second."
   },
   {
    "h": "Do not rush trials",
    "p": "This is the difference between gas methods and the box that surprises people in the field. You cannot fire off three trials back to back. The lung has to return to its starting condition before another washout means anything, so the software counts down a waiting time before the next trial and will tell you when it is ready. It also grades each measurement on a quality scale from worst to good. Teach the office to read that bar and stop, rather than accepting whatever comes out.",
    "visual": {
     "t": "img",
     "src": "n2-wait-quality",
     "cap": "Two things to point at on this screen: the waiting time before the next trial can start, and the quality of measurement bar. Never let a practice ignore either one."
    }
   },
   {
    "h": "Helium dilution in one line",
    "p": "Different trick, same goal. Start with a bag or spirometer bell of known volume holding helium at a known concentration. Connect the patient and let them breathe on the closed system. The helium has nowhere to go except to spread out into the lungs as well, so its concentration falls. Nothing has been lost, it is just spread over more space, and that is the equation in one line: <b>C1 x V1 = C2 x (V1 + V2)</b>. You know C1, V1 and C2, so V2, the lung volume, is the only unknown left.",
    "visual": {
     "t": "img",
     "src": "he-dilution",
     "cap": "Left, all the helium is packed into a bag of known volume at concentration C1. Right, the same helium now fills the bag plus the lungs at the lower concentration C2. The drop in concentration is the lung volume."
    },
    "key": "C1 x V1 = C2 x (V1 + V2). The same helium, spread thinner, tells you how much extra room it found."
   },
   {
    "h": "Mixing takes time",
    "p": "Helium dilution only works once the gas is genuinely evenly distributed through the bag and the lungs, and that takes several minutes of quiet breathing. Stop early and the helium has not finished spreading, the concentration reads too high, and the lung looks smaller than it is. There is a fast version worth knowing about: the single breath approach, used during a breath hold, mixes a small amount of helium into the inhaled gas and reads its dilution on the way out to get alveolar volume. It is quicker, easier on the patient and cheaper, but it may not be accurate when there is significant airway obstruction, because one breath may not reach the whole lung.",
    "visual": {
     "t": "img",
     "src": "he-equilibration",
     "cap": "At the start the helium molecules are all in the bag. After several minutes they are spread evenly through the bag and the lungs. Everything the test claims depends on the right hand panel actually being true."
    },
    "key": "Cut the equilibration short and the lung reads too small. Time is part of the measurement."
   },
   {
    "h": "Why pleth reads higher",
    "p": "Here is the point that matters most in the field, and it is not a marketing line, it is physics. Gas dilution and washout can only account for air that communicates with the airway, because a gas has to be able to travel in and out to be counted. Plethysmography does not care whether the air moves. Any gas in the chest that can be compressed and decompressed shows up in the volume shift, including air sitting behind a plugged or collapsed airway. In a healthy lung the two agree closely. In emphysema and other obstruction, where air trapping is the whole problem, the gas methods can undercount and read a smaller lung than the patient really has.",
    "visual": {
     "t": "vs",
     "a": {
      "h": "Nitrogen washout and helium dilution",
      "items": [
       "Only measures gas that communicates with the airway",
       "Trapped air behind a blocked airway is never counted",
       "Can underestimate lung volume in obstruction with air trapping",
       "Needs full washout or full equilibration to be valid",
       "Needs a waiting period between trials"
      ]
     },
     "b": {
      "h": "Plethysmography",
      "items": [
       "Measures all compressible gas in the chest",
       "Trapped air still compresses, so it still counts",
       "Holds up in obstruction, where air trapping is the disease",
       "Needs a closed shutter and correct panting technique",
       "Three FRCpleth trials agreeing within 5 percent per ATS and ERS 2005"
      ]
     }
    },
    "key": "Gas methods count air that can travel. The box counts air that can be squeezed. In obstruction that is a real gap."
   }
  ],
  "angle": "You will meet practices running gas based lung volumes, and the wrong move is to call their method bad. It is not bad, it is blind in one specific place. Say it this way: washout and dilution can only measure air that can get out to be counted, so in an emphysema patient with real air trapping they can report a lung that is smaller than it truly is, while plethysmography counts any gas in the chest that compresses. Then land the practical half, that gas methods need a full washout or a full equilibration and a waiting period between trials, while the box gives repeatable FRCpleth trials plus airway resistance in the same sitting."
 },
 "additional_testing": {
  "minutes": 10,
  "intro": "You are going to walk into pulmonology and allergy offices that already run tests you do not sell. Someone will say FeNO, or oscillometry, or ask whether your box does airway resistance. None of these replace spirometry, lung volumes and DLCO, they sit around them. Know what each one is trying to answer and you stay in the conversation instead of nodding and losing the room.",
  "sections": [
   {
    "h": "What else the lab runs",
    "p": "Start with a map. These are the PFT related tests the training deck covers, and each one exists because it answers a question the standard three tests cannot. Learn the question first and the test name sticks by itself.",
    "visual": {
     "t": "table",
     "head": [
      "Test",
      "The question it is trying to answer"
     ],
     "rows": [
      [
       "RAW / GAW",
       "How much pressure does it take to move air through the airways?"
      ],
      [
       "FeNO",
       "Is there allergic or eosinophilic asthma inflammation going on right now?"
      ],
      [
       "FOT",
       "Where along the airway is the narrowing, measured while the patient just breathes?"
      ],
      [
       "MIP / MEP",
       "How strong are the breathing muscles?"
      ],
      [
       "Bronchoprovocation",
       "Can we provoke the asthma that spirometry did not catch?"
      ],
      [
       "CPET",
       "How does the heart and lung system behave under an exercise load?"
      ],
      [
       "6MWT",
       "How far can this patient walk in six minutes, and what does their oxygen do?"
      ]
     ]
    },
    "key": "Every test on this list is an add on around spirometry, lung volumes and DLCO, not a replacement for them."
   },
   {
    "h": "Resistance and conductance",
    "p": "Airway resistance (RAW) is the resistance of the respiratory tract to airflow during inhaling and exhaling. Put plainly, it is the amount of pressure it takes to generate a given flow rate, and it is reported in cm H2O per liter per second. It can be measured directly by plethysmography, or estimated from formulas built on pressure and flow. Physiologists found the flipped version just as useful, so conductance (GAW) is simply the reciprocal, the flow you get for a given driving pressure, reported in L per second per cm H2O.",
    "visual": {
     "t": "img",
     "src": "airway-tree",
     "cap": "When we measure airway resistance we are measuring pressure in the upper airway and the bronchi, the big labelled tubes here, not the tiny acinus blown up in the inset. That inset is DLCO territory."
    },
    "key": "RAW is pressure needed for a given flow. GAW is the same relationship turned upside down."
   },
   {
    "h": "Why RAW is shaky",
    "p": "Ask the question the deck asks: RAW and GAW, is it important, why or why not. The measurement leans on assumptions that quietly fall apart in the exact patient you care about. It assumes inspiratory and expiratory resistance are the same in the range where it is measured, at FRC and plus or minus 0.5 liters per second. That holds for patients without airways disease. It does not hold once significant airway obstruction is present. Panting frequency also moves the number, so the patient has to pant properly for the result to mean anything.",
    "list": [
     "The patient has to pant correctly, and panting frequency is one factor that affects how accurate the measured RAW value is.",
     "Obstructive patients have an open expiratory loop, which makes RAW difficult to calculate properly.",
     "There is more than one way to compute specific airway resistance, including sRawTOT, sRaw0.5, sRawVmax and sRawmid, and each one reads a different part of the loop.",
     "There is no way to verify the accuracy of RAW and GAW. Spirometry, lung volumes and DLCO can all be verified with simulators."
    ],
    "visual": {
     "t": "img",
     "src": "sraw-loops",
     "cap": "Three airway resistance loops, A through C. Notice what happens as resistance rises: the narrow near vertical loop opens up and the expiratory side bulges out. That widening shape is exactly what makes the number hard to pin down in an obstructed patient."
    },
    "key": "The patient RAW is most often ordered for is the patient RAW measures worst."
   },
   {
    "h": "FeNO, inflammation as a number",
    "p": "Nitric oxide is a gas produced by cells involved in the inflammation that comes with allergic or eosinophilic asthma. FeNO stands for the fractional concentration of exhaled nitric oxide, and the test uses a portable device to measure how much of that gas is in the air the patient slowly breathes out, reported in parts per billion (ppb). It is not a mechanics test like spirometry. It is a look at whether the airway is inflamed right now, which is why allergy offices care about it.",
    "visual": {
     "t": "img",
     "src": "feno-device",
     "cap": "A tabletop FeNO analyser with a handpiece and patient breathing tube. The patient exhales through the handpiece and the unit reports one number in parts per billion."
    },
    "key": "In clinical practice a normal FeNO is under 25 ppb in adults and under 20 ppb in children."
   },
   {
    "h": "Coaching the FeNO blow",
    "p": "This is the one that trips up staff who have been coaching spirometry for years. Every instinct they have is blast it out hard and fast. FeNO is the opposite. The exhaled nitric oxide test is different from most lung function tests in that the patient needs to blow <b>slowly and steadily</b> to get an accurate measurement. The device does the coaching for you if the patient watches the screen.",
    "list": [
     "Exhale slowly and steadily, never hard and fast.",
     "The screen shows a flow rate guidance bar with a target zone.",
     "The patient holds that bar inside the target zone for the whole exhalation.",
     "If your office coach is yelling blast, blast, blast, they are coaching the wrong test."
    ],
    "visual": {
     "t": "img",
     "src": "feno-technique",
     "cap": "Correct FeNO technique. Watch the guidance bar on the device screen, not the patient. Steady inside the target zone for the full breath out is the whole game."
    }
   },
   {
    "h": "Oscillometry, the FOT test",
    "p": "Forced oscillation technique is a modern and fairly unique way of looking at airway narrowing. It uses the fact that different sound wave frequencies travel different distances along the airway, and the lowest frequency travels the furthest. The device sends multiple low variable sound wave frequencies down the airways and measures the time they take to travel down and reflect back, which tells you what is happening along the full length of the airway. Two frequencies usually do the work: <b>R5</b> for the full length of the airway and <b>R20</b> for the larger airways. The selling point for a clinic is effort. The patient just breathes.",
    "list": [
     "R5 reads the full length of the airway.",
     "R20 reads the larger airways.",
     "A good test looks like quiet tidal breathing with a nose clip for 30 seconds.",
     "Cheeks supported, so the mouth is not absorbing the oscillations.",
     "A 20 to 30 second recording, and 3 to 5 tests."
    ],
    "visual": {
     "t": "img",
     "src": "fot-principle",
     "cap": "A loudspeaker at the mouth pushes pressure oscillations into the airway. The device measures the airflow those oscillations create and the pressure change at the mouth, and turns the two into impedance."
    },
    "key": "FOT is the test that runs during normal quiet breathing, with no maximal effort from the patient."
   },
   {
    "h": "MIP and MEP",
    "p": "These two measure breathing muscle strength rather than airflow. MIP is the pressure generated during a maximal inspiratory effort against a closed system, and it is usually measured at residual volume (RV, the air left in the lungs after blowing out everything you can) because inspiratory muscle strength is inversely related to lung volume. MEP is measured during a similar maneuver at total lung capacity (TLC, lungs completely full) because expiratory muscle strength is directly related to lung volume. Know the limit as well as the test: the information from these maneuvers is nonspecific and cannot distinguish between insufficient effort, muscle weakness, and a neurologic disorder.",
    "list": [
     "MIP, breathe in as hard as possible against a closed system, measured at RV.",
     "MEP, blow out as hard as possible, measured at TLC.",
     "A poor result does not tell the physician why it is poor.",
     "Some meters also run SNIP through a nasal plug instead of a mouthpiece."
    ],
    "visual": {
     "t": "img",
     "src": "mip-mep-device",
     "cap": "Two respiratory pressure meters. The one with the flanged mouthpiece runs MIP and MEP, the one with the nasal plug runs SNIP. Small handheld devices, not a lab system."
    },
    "key": "MIP and MEP say the muscles are weak. They cannot say whether it is effort, muscle or nerve."
   },
   {
    "h": "The methacholine challenge",
    "p": "Some patients show no sign of airway obstruction on spirometry, but the physician still suspects activity induced or medicine induced asthma. So you provoke it. The test starts with a baseline spirometry to see how the lungs are working, including FEV1. Then progressively larger doses of inhaled methacholine go in through a nebulizer, and spirometry is repeated before and after every single dose to measure how much the airway narrows. There are ATS and ERS recommended dosages, and the nebulizer is a specialized one where the output and particle size are known.",
    "visual": {
     "t": "steps",
     "items": [
      {
       "h": "Baseline spirometry",
       "p": "Establish how the lungs are working today, FEV1 included. Everything after this is measured against it."
      },
      {
       "h": "Dose one",
       "p": "Inhaled methacholine through a specialized nebulizer with known output and particle size."
      },
      {
       "h": "Spirometry again",
       "p": "Spirometry runs before and after every dose. This test is mostly spirometry, over and over."
      },
      {
       "h": "Escalate",
       "p": "5 or 10 increasing dosages, following ATS and ERS recommended dosing."
      },
      {
       "h": "Stop at 20 percent",
       "p": "The objective is a drop in FEV1 of 20 percent or more. The concentration where that happens is the PC20, the dose version is the PD20."
      }
     ]
    },
    "key": "A methacholine test is a spirometer running all afternoon. The quality of the spirometry is the quality of the test."
   },
   {
    "h": "The exercise challenge, EIB",
    "p": "Exercise induced bronchoprovocation asks the same question as methacholine but uses a treadmill instead of a drug. Speed and grade are chosen to produce 4 to 6 minutes of exercise at near maximum targets, with total exercise lasting 6 to 8 minutes. For children under 12 years old it is usually 6 minutes, for older children and adults usually 8 minutes. You start at a low speed and grade and advance both during the first 2 to 3 minutes until heart rate reaches 80 to 90 percent of the predicted maximum, calculated as 220 minus age in years. The threshold that counts as positive is different from methacholine, and mixing the two up in front of a physician is an easy way to lose credibility.",
    "visual": {
     "t": "table",
     "head": [
      "",
      "Methacholine",
      "Exercise (EIB)"
     ],
     "rows": [
      [
       "Driven by",
       "5 or 10 increasing inhaled doses",
       "Treadmill speed and grade"
      ],
      [
       "Duration",
       "Spirometry before and after every dose",
       "6 to 8 minutes of exercise total"
      ],
      [
       "Target",
       "ATS and ERS recommended dosages",
       "Heart rate 80 to 90 percent of 220 minus age"
      ],
      [
       "Positive when FEV1 falls",
       "20 percent or more",
       "15 percent"
      ]
     ]
    },
    "key": "Methacholine is a 20 percent drop. Exercise is a 15 percent drop. Do not swap them."
   },
   {
    "h": "CPET and the 6MWT",
    "p": "These two look at function under load rather than at the airway itself. CPET, the cardiopulmonary exercise test, is a dynamic non invasive assessment of the cardiopulmonary system at rest and during exercise. The normal response to exercise is a characteristic rise in heart rate, stroke volume, tidal volume and ventilatory frequency, and a systematic read of the nine panel plot is used to identify limits in cardiac and respiratory capacity. It helps with risk assessment, spotting comorbidities that can be optimised, and perioperative planning, because deficiencies in anaerobic threshold, peak oxygen consumption and ventilatory efficiency for carbon dioxide are associated with poor postoperative outcomes. The six minute walk test is the humble cousin: the patient walks as far as they can at their own pace along a marked course, usually a corridor, for six minutes, and the distance is compared to normative data for age and gender.",
    "list": [
     "6MWT is used to follow COPD, heart failure and pulmonary fibrosis, and to judge whether pulmonary rehab or oxygen therapy is working.",
     "The key objective during the walk is measuring SpO2 every minute for six minutes.",
     "If oxygen drops below 88 percent, the patient is started on 1 liter of oxygen.",
     "Increase the oxygen until they are holding steady above 90 percent."
    ],
    "visual": {
     "t": "img",
     "src": "cpet",
     "cap": "A full CPET: cycle ergometer, breath by breath gas exchange mask and ECG electrodes. This is a staffed, equipment heavy afternoon, which is why the six minute walk exists as the simpler functional check."
    },
    "key": "CPET needs a lab. The 6MWT needs a hallway, a timer and a pulse oximeter."
   }
  ],
  "angle": "None of these tests replace what the MiniBox+ does, and that is the point. When a physician brings up RAW, oscillometry or FeNO, you can talk about it accurately and then bring the conversation back to the three tests that carry the visit, spirometry, lung volumes and DLCO. You also have one honest technical point worth remembering: RAW and GAW have no way to verify their accuracy, while spirometry, lung volumes and DLCO can all be checked against a simulator. That is a credibility line, not a slam."
 },
 "competitive": {
  "minutes": 9,
  "intro": "You will almost never be the first PFT device in the room. The office either owns a walk-in body box, runs nitrogen washout on a cart, or has a handheld spirometer and sends anything harder down the street. This module is the field guide to who else is in the room and the two one-page sheets PulmOne built to answer the only two questions that ever really come up: how do you compare to the box, and how do you compare to washout.",
  "sections": [
   {
    "h": "Who you are up against",
    "p": "The competitive set splits cleanly in two. On one side are walk-in cabins, a glass booth the patient sits inside with a separate monitor cart parked next to it. On the other side are rolling carts, tabletops and handhelds that do spirometry and sometimes DLCO, but never body box lung volumes. Knowing which side of that line an account is on tells you the whole conversation before you open your mouth.",
    "visual": {
     "t": "vs",
     "a": {
      "h": "Walk-in cabins",
      "items": [
       "Vyaire Vyntus BODY",
       "MGC Diagnostics Platinum Elite",
       "Ganshorn PowerCube Body+",
       "COSMED Q-Box",
       "Geratherm Respiratory body plethysmograph",
       "Pattern: glass cabin plus a separate wheeled cart"
      ]
     },
     "b": {
      "h": "Carts, tabletops and handhelds",
      "items": [
       "Vyaire Vyntus ONE rolling PFT and stress cart",
       "Vyaire Vyntus CPX metabolic cart",
       "MGC Ultima series PFT cart",
       "MGC CPFS/D USB spirometer",
       "ndd Medical EasyOne family",
       "Pattern: portable, but no plethysmography"
      ]
     }
    },
    "key": "Cabin accounts are a workflow conversation. Cart and handheld accounts are a capability conversation."
   },
   {
    "h": "What a walk-in cabin is",
    "p": "Look at the picture before you talk about it. A body box is a room inside a room. The patient is seated inside a sealed cabin while a technician stands outside operating a separate cart, which means the test needs a dedicated floor plan and a person watching from the outside. Vendors sell the cabin on exactly the things you would expect: COSMED markets the Q-Box on gold standard static lung volumes and airway resistance, a large cabin volume and walls that are easy to disinfect. Ganshorn sells the PowerCube Body+ on a puristic design, most PFT parameters at one workstation, and four icon claims of configurability, accuracy, robust hardware and lowest measurement costs. MGC sells the Platinum Elite on comprehensive body plethysmography, compact design and unlimited weight capacity. Those are their words, and they are worth knowing because they are the words your prospect has already read.",
    "visual": {
     "t": "img",
     "src": "cosmed-qbox",
     "cap": "The seated patient is inside the cabin and the technician runs the test from the cart outside. Notice what the picture is actually showing you: dedicated floor space, a sealed enclosure around the patient, and a second person in the workflow."
    },
    "key": "Never argue with the cabin's accuracy. Argue with the floor space, the training and the calendar."
   },
   {
    "h": "Vyaire and the Vyntus line",
    "p": "Vyaire sells a Vyntus family rather than a single device, which matters because you may be quoted against different products in the same building. Vyntus BODY is the walk-in glass plethysmograph booth. Vyntus ONE is a rolling cart that does pulmonary function plus cardiopulmonary stress. Vyntus CPX is a metabolic cart. If a prospect says they are looking at Vyntus, your first question is which one, because BODY and CPX solve completely different problems and only one of them is actually in your lane.",
    "visual": {
     "t": "img",
     "src": "vyntus-lineup",
     "cap": "Three products, one family name. BODY is the walk-in booth, ONE is a rolling PFT and stress cart, CPX is a metabolic cart. Ask which one before you position anything."
    }
   },
   {
    "h": "MGC Diagnostics",
    "p": "MGC covers both ends of the range. At the top is the Platinum Elite walk-in booth, sold on comprehensive body plethysmography, a compact design and unlimited weight capacity. At the bottom is the CPFS/D, a USB spirometer sold as small, portable and USB compatible. Their Ultima series PFT cart tells you something useful about the day to day, because it is photographed with two gas cylinders strapped to its base alongside a monitor, an articulated sensor arm and a keyboard tray. Gas logistics are part of what an office signs up for, and that becomes the whole point of the nitrogen washout comparison later in this module.",
    "visual": {
     "t": "img",
     "src": "mgc-products",
     "cap": "One vendor, two very different answers: a walk-in booth for the full workup and a USB spirometer for the front line. Neither one is a compact device that does lung volumes and DLCO together."
    }
   },
   {
    "h": "ndd EasyOne",
    "p": "ndd Medical is the family you will meet most often in primary care and smaller pulmonology offices, because their units are compact and spirometry is what they do best. Their own capability matrix is the honest map: five products across the top, capabilities down the side, yes or no in every cell. Read it once and you know exactly where an EasyOne stops.",
    "visual": {
     "t": "table",
     "head": [
      "Capability",
      "Which EasyOne units have it"
     ],
     "rows": [
      [
       "Spirometry (FVC, FVL)",
       "Across the family"
      ],
      [
       "MVV and SVC",
       "All of them except EasyOne Sky"
      ],
      [
       "DLCO",
       "Only EasyOne Pro and EasyOne Pro/LAB"
      ],
      [
       "MBW and LCI",
       "Only EasyOne Pro/LAB"
      ],
      [
       "Lung volumes by body plethysmography",
       "No unit in the family"
      ]
     ],
     "note": "Source: ndd Medical EasyOne product family capability matrix (Easy on-PC, EasyOne Air, EasyOne Sky, EasyOne Pro, EasyOne Pro/LAB)."
    },
    "key": "No ndd unit does body box lung volumes. That gap is the entire conversation in an EasyOne account."
   },
   {
    "h": "Versus the body box",
    "p": "This is PulmOne's own one page sheet, and it is built to be handed across a desk. The top of the table is agreement, not attack: both devices do spirometry, lung volumes by plethysmography and DLCO, MiniBox+ lung volumes are equivalent to the Body Box, and they bill the same CPT codes. Once the clinical question is settled, every remaining row is about running the practice.",
    "visual": {
     "t": "table",
     "head": [
      "",
      "MiniBox+",
      "Body Box"
     ],
     "rows": [
      [
       "Tests",
       "Spirometry, lung volumes, DLCO",
       "Spirometry, lung volumes, DLCO"
      ],
      [
       "Lung volumes",
       "Plethysmography, equivalent to the Body Box, same CPT codes",
       "Plethysmography"
      ],
      [
       "Ease of use",
       "Easy, 6 buttons start to finish, fully automatic LVM and DLCO",
       "Requires extensive training, highly technician and effort dependent"
      ],
      [
       "Test time",
       "15 to 20 minutes",
       "30 to 45 minutes"
      ],
      [
       "Patient comfort",
       "Tidal breathing only",
       "Claustrophobic, panting maneuver or shutter occlusion"
      ],
      [
       "Size",
       "Compact and portable",
       "Large footprint, stationary"
      ],
      [
       "Cost",
       "About half the cost of a Body Box",
       "Baseline"
      ],
      [
       "Maintenance",
       "No maintenance fees",
       "Parts contract, annual or semi-annual preventive maintenance, monthly flow sensor cleaning"
      ]
     ],
     "note": "Source: PulmOne comparison sheet, How does the MiniBox+ compare to the Body Box?"
    },
    "key": "Same tests, same CPT codes, equivalent lung volumes. Then half the time, half the cost and no maintenance fees."
   },
   {
    "h": "Versus nitrogen washout",
    "p": "The washout conversation is different because it is not just about workflow, it is about the number itself. Both approaches give you spirometry, lung volumes and DLCO, but MiniBox+ measures TLC by plethysmography while washout measures it by nitrogen washout, and nitrogen washout underestimates lung volumes in obstruction. That is the clinical row. The rest of the sheet is what the office lives with every day, and the gas and disposables lines are the ones a practice manager will actually feel.",
    "visual": {
     "t": "table",
     "head": [
      "",
      "MiniBox+",
      "Nitrogen washout"
     ],
     "rows": [
      [
       "Tests",
       "Spirometry, lung volumes, DLCO",
       "Spirometry, lung volumes, DLCO"
      ],
      [
       "How TLC is measured",
       "Plethysmography",
       "N2 washout, which underestimates lung volumes in obstruction"
      ],
      [
       "Reimbursement",
       "Higher for plethysmography",
       "Lower for N2 washout"
      ],
      [
       "Ease of use",
       "6 buttons start to finish, fully automatic LVM and DLCO",
       "Requires extensive training, technician dependent"
      ],
      [
       "Test time",
       "15 to 20 minutes",
       "30 to 60 minutes"
      ],
      [
       "Patient comfort",
       "Tidal breathing",
       "Dry mouth from lengthy oxygen flow, tests invalidated by leaks"
      ],
      [
       "Gas tanks",
       "1, for DLCO",
       "2, one 100 percent oxygen and one DLCO gas"
      ],
      [
       "Disposables",
       "1 filter per patient",
       "4 per patient"
      ],
      [
       "Maintenance",
       "No maintenance fees",
       "Parts contract, annual or semi-annual preventive maintenance"
      ]
     ],
     "note": "Source: PulmOne comparison sheet, How does the MiniBox+ compare to Nitrogen Washout?"
    },
    "key": "One tank instead of two, one filter instead of four, and plethysmography that does not underestimate in obstruction."
   },
   {
    "h": "How to run the conversation",
    "p": "You do not win this by telling a pulmonologist the box they trained on is junk. The sheet does not do that either, and neither should you. Lead with what you agree on, that the plethysmography lung volumes are equivalent and bill the same CPT codes, and then let the practical rows do the work. Ask questions instead of making claims, and the prospect will read the right conclusion off their own answers. Then hand over the sheet and let them keep it.",
    "list": [
     "How long does a full PFT take in your office today, start to finish?",
     "Who runs it, and what happens to the schedule the week that person is out?",
     "How many of your patients struggle with the cabin or the panting maneuver?",
     "What is on your service contract, and how often does preventive maintenance come around?",
     "How many gas cylinders are you ordering, and how many disposables per patient?",
     "Then stop talking and leave the one page sheet behind."
    ],
    "visual": {
     "t": "img",
     "src": "vs-body-box",
     "cap": "The official one page sheet. Notice the design: the first rows agree with the competitor, and only then does it move to time, comfort, footprint, cost and maintenance. Run your conversation in that same order."
    },
    "key": "Agree first, then compare the practice, never attack the box."
   }
  ],
  "angle": "This module gives the rep the two lines that close: against a body box, same tests and same CPT codes with equivalent lung volumes, in 15 to 20 minutes instead of 30 to 45, on tidal breathing instead of a panting maneuver, at about half the cost and with no maintenance fees. Against nitrogen washout, plethysmography that does not underestimate lung volumes in obstruction, higher reimbursement, one gas tank instead of two and one filter per patient instead of four. And against an ndd EasyOne account, the simplest line of all: no unit in that family does body box lung volumes."
 },
 "system_orientation": {
  "minutes": 9,
  "intro": "In a real office you will spend more time answering questions about consumables and cleaning than about physics. Staff want to know three things: what do we touch, what do we throw away, and what are we allowed to wipe. This module walks the machine from the outside in, so you can point at any part and say what it does, and so you never let a tech destroy a flow sensor with a disinfectant wipe.",
  "sections": [
   {
    "h": "What the MiniBox is",
    "p": "Three pieces and that is it. A white oval cabinet with the PulmOne badge on the front, a tablet mounted on top that runs the software and opens on the Patients List, and a handle on the right with a flow tube and a white mouthpiece cone on the end. Everything else in the room is a cable, a consumable, or the gas.",
    "visual": {
     "t": "img",
     "src": "minibox-front",
     "cap": "Straight on view. Notice the tablet sitting on the Patients List screen and the handle parked on the right with its flow tube and mouthpiece cone already attached."
    },
    "key": "Cabinet, tablet, handle. Name those three and you can walk any room."
   },
   {
    "h": "Everything on the cart",
    "p": "The full system rides on a rolling cart, which is how a practice turns one machine into a pulmonary function service that moves between rooms. In this photo the tablet is sitting on a Summary of Results screen, the handle is stowed, and the gas cylinder travels with the cart instead of living in a closet somewhere.",
    "list": [
     "Tablet on the mount, running the session",
     "Handle stowed in its dock on the cabinet",
     "Pull out armrest so the patient has somewhere to rest",
     "Wire basket of disposable mouthpieces within reach",
     "Printer on a shelf for the report",
     "DLCO gas cylinder in its cradle with a two gauge regulator"
    ],
    "visual": {
     "t": "img",
     "src": "minibox-cart",
     "cap": "The whole service on one cart. The armrest, the mouthpiece basket and the printer are the details that tell a practice this was designed for a real exam room."
    }
   },
   {
    "h": "The handle and flow tube",
    "p": "The handle is a pistol grip. A hand wraps it at the trigger, the flow tube sticks out the front, and a white flared mouthpiece adapter goes on the end. That flare is what the patient's lips seal around. Every curve the software draws comes from what happens inside that tube, so the handle is the part you should hand a physician when you want them to feel the product.",
    "visual": {
     "t": "img",
     "src": "minibox-handle",
     "cap": "Held at the trigger, flow tube forward, white flared mouthpiece adapter on the end. This is the only part of the system the patient actually touches."
    }
   },
   {
    "h": "How it reads a breath",
    "p": "Inside the bore of the flow tube sits a bundle of tiny capillary tubes running across the airway. The breath has to pass through that bundle, and pushing air through it creates a very small pressure drop. A differential pressure transducer is tapped in below and compares the pressure on one side of the bundle to the other. That difference is the flow. The arrows point both ways because it reads air going out and air coming back in, which is how you get a full loop instead of half a story.",
    "visual": {
     "t": "img",
     "src": "pneumotach",
     "cap": "Cross section of the pneumotach. Follow the arrows through the capillary bundle and down to the differential pressure transducer. Pressure difference in, flow out."
    },
    "key": "The measurement is a pressure difference across a mesh. Change the mesh and you change the number."
   },
   {
    "h": "Inside the flow head",
    "p": "Take the flow head apart in your hand and it makes sense from the patient inward. The patient's lips are on the disposable mouthpiece. Behind that sits the blue disposable in line filter. Behind that is the wire mesh inside the cone, the surface the breath is measured across. Plastic pressure tubing carries that pressure back to the transducer box, which is the part that turns air into a number.",
    "list": [
     "Disposable mouthpiece, closest to the patient",
     "Blue disposable in line filter behind it",
     "Wire mesh screen inside the cone",
     "Plastic pressure tubing to the transducer",
     "Transducer box, the electronics end"
    ],
    "visual": {
     "t": "img",
     "src": "consumables-stack",
     "cap": "The flow head labelled part by part. Trace the path from the mouthpiece through the filter and the mesh to the pressure tubing and the transducer box."
    }
   },
   {
    "h": "What is disposable",
    "p": "This is the question every office manager asks, so answer it before they do. The barrier between one patient and the next is a fresh consumable, not a cleaning ritual. Two parts get thrown away and the rest stays with the machine.",
    "visual": {
     "t": "vs",
     "a": {
      "h": "Single use, new for every patient",
      "items": [
       "The disposable mouthpiece the lips seal around",
       "The blue in line bacterial and viral filter behind it"
      ]
     },
     "b": {
      "h": "Reusable, stays with the machine",
      "items": [
       "The flow tube and the mesh screen inside it",
       "The transducer box and its pressure tubing",
       "The handle, the cabinet, the tablet and the cart"
      ]
     }
    }
   },
   {
    "h": "Never wipe inside the tube",
    "p": "Look straight down the barrel of the flow tube and you can see the three spoke mesh screen sitting in the bore. That surface is the front door of the sensor. Somebody with a wipe and good intentions will eventually try to clean it, and that is how sensors get damaged. The scary part is that a damaged sensor does not stop working, it just starts giving numbers that look believable and are wrong. Teach this rule out loud on install day and again at the follow up visit.",
    "visual": {
     "t": "img",
     "src": "flow-tube-mesh",
     "cap": "Down the barrel of the flow tube. That three spoke mesh screen is the measuring surface, and it is the one place a cloth must never go."
    },
    "key": "Never wipe inside the flow tube. Wiping the mesh damages the sensors."
   },
   {
    "h": "Cleaning between patients",
    "p": "The PulmOne recommended Spiroguard filters do the infection control work, which is why they require no high level disinfection. They are in line bacterial and viral filters rated 99.999 percent down to 0.02 microns. If a practice buys a cheaper filter off a catalogue, that performance is not guaranteed, and that is a real conversation to have with a purchasing manager who is trying to save a few cents per test.",
    "list": [
     "New filter and new mouthpiece for every patient",
     "Wipe the exterior between patients with Super Sani-Cloth or Oxivir",
     "No high level disinfection needed when the recommended filters are used",
     "Filters that are not the recommended ones are not guaranteed",
     "Never wipe inside the flow tube"
    ],
    "visual": {
     "t": "img",
     "src": "cleaning-recs",
     "cap": "The manufacturer cleaning recommendations as they appear in the training deck. Two rules carry the whole slide: wipe the outside, never the inside."
    }
   },
   {
    "h": "The DLCO test gas",
    "p": "The diffusion test needs a specific gas mixture, and it arrives in an aluminium cylinder with a brass valve that rides on the cart. Read the label with the customer the first time so nobody guesses later. DLCO stands for the diffusing capacity of the lung for carbon monoxide, which is why there is carbon monoxide in the mix at all. Storage matters too, since the cylinder is meant to be stored and used at room temperature.",
    "visual": {
     "t": "img",
     "src": "dlco-cylinder",
     "cap": "The label is the lesson: 0.3 percent CO, 0.3 percent CH4, 21 percent O2, balance N2, 475 litres at 1833 psig, stored and used at room temperature."
    },
    "key": "0.3 percent CO, 0.3 percent CH4, 21 percent O2, balance N2. Room temperature, always."
   }
  ],
  "angle": "Infection control and cleaning burden kill more device deals than specifications do. You can answer the whole thing in one breath: a new mouthpiece and a new in line filter for every patient, a wipe of the exterior with Super Sani-Cloth or Oxivir, and no high level disinfection because the recommended Spiroguard filter is rated 99.999 percent down to 0.02 microns. Then add the one rule that protects their investment, which is that nothing ever goes inside the flow tube."
 },
 "minibox_setup": {
  "minutes": 11,
  "intro": "Install day is the only day the whole practice watches you work. If the box opens cleanly, the gas seals, the blue ring lights and the first report comes off the printer with their name at the top, you have bought yourself a year of credibility. This module runs the install in order: the physical build, then the software configuration, then a first patient from an empty screen to a printed report.",
  "sections": [
   {
    "h": "Only PulmOne opens the carton",
    "p": "The carton shows up sealed, printed with Hello MiniBox and covered in tamper evident seals, and there is a label on it stating that only a PulmOne representative is authorised to open it. That label is doing real work. It protects a delicate sensor from a receiving clerk with a box cutter, and it guarantees that the first time anyone sees this device working, you are standing next to it. If you arrive and the seals are already broken, say so out loud before you touch anything else.",
    "visual": {
     "t": "img",
     "src": "unbox-carton",
     "cap": "Sealed carton with tamper evident seals and the authorisation label. Check the seals before you cut anything, because that is your record of how it arrived."
    },
    "key": "The seal is part of the install. Nobody but a PulmOne rep breaks it."
   },
   {
    "h": "What ships in the box",
    "p": "The body sits down in a foam insert with the handle in its own side cutout and the accessory kits bagged around it. Lift everything out and lay it in a line on a clean surface before you connect a single thing, so a missing cable turns up now rather than twenty minutes into the build. Keep the foam. It is the only safe way this thing ever moves again.",
    "list": [
     "Tablet in a rugged case",
     "Disposable mouthpiece and filter cones",
     "An adapter",
     "Coiled gas tubing",
     "Power cord",
     "Data cables",
     "The handle with its flow tube"
    ],
    "visual": {
     "t": "img",
     "src": "unbox-contents",
     "cap": "Everything that ships, laid out. Do this on every install so you are counting parts on a table instead of hunting for them behind a cart."
    }
   },
   {
    "h": "The back panel",
    "p": "Everything connects at the rear. There is a power rocker switch and a power inlet, and then a recessed plate that holds the DLCO gas input fitting marked 4 to 5 bar, three USB ports, the CU port, and a cable clamp. The CU port is the one that matters most, because that is where the data cable belongs, and the clamp exists so a cleaner with a mop never pulls it back out again.",
    "list": [
     "Power rocker switch and power inlet",
     "DLCO gas input fitting, marked 4 to 5 bar",
     "Three USB ports",
     "CU port for the data cable",
     "Cable clamp to strain relieve the run"
    ],
    "visual": {
     "t": "img",
     "src": "rear-panel",
     "cap": "The recessed connector plate. Read the marking on the gas fitting, 4 to 5 bar, because that number tells you what to set the regulator to."
    },
    "key": "Data cable in the CU port, gas line on the 4 to 5 bar fitting, then clamp the cable down."
   },
   {
    "h": "Gas from cylinder to machine",
    "p": "The two gauge regulator threads onto the brass valve of the cylinder, and the cylinder mounts horizontally in its bracket under the cart so it is out of the patient's way and cannot be tipped over. The clear supply line runs from the regulator up to the gas input fitting on the back panel and screws on there. Take your time on this part, because a slow leak is invisible and expensive.",
    "list": [
     "Thread the regulator onto the cylinder valve and tighten it",
     "Mount the cylinder horizontally in the bracket under the cart",
     "Run the clear supply tubing from the regulator to the gas input fitting",
     "Screw the line onto the fitting and seat the data cable in the clamp",
     "Set delivery with the adjusting knob to what the inlet is marked for, 4 to 5 bar"
    ],
    "visual": {
     "t": "img",
     "src": "regulator-on-cylinder",
     "cap": "Regulator threaded onto the brass cylinder valve. One gauge reads what is left in the cylinder, the other reads what is being delivered to the machine."
    }
   },
   {
    "h": "Tablet on, handle docked",
    "p": "The cased tablet slides down onto the mounting bracket on top of the cabinet and takes two cables, a right angle USB-C plug for data and a flat magnetic connector for power. Then take the handle and line the nose of the flow tube up with the docking port on the face of the cabinet. The port glows blue. Seat the handle and the LED ring lights, and that lit ring is your confirmation that the handle is home and the machine is alive.",
    "list": [
     "Slide the cased tablet down onto the bracket on top of the cabinet",
     "Right angle USB-C plug for data, flat magnetic connector for power",
     "Align the flow tube nose with the blue illuminated docking port",
     "Seat it and watch for the blue LED ring"
    ],
    "visual": {
     "t": "img",
     "src": "handle-seated",
     "cap": "Handle seated with the blue LED ring lit. Teach the staff this light, because it is the fastest is it on check in the room."
    },
    "key": "Blue ring lit means the handle is home."
   },
   {
    "h": "Prove it measures right",
    "p": "A calibration check is how you show a practice that the number on the screen can be trusted. A 3 litre calibration syringe couples onto the handle through an adapter so the flow axis runs straight through both, and then you push and pull a known volume through the sensor. On screen, the Calibration Check Measurement stacks the flow volume loops against acceptance limit lines, and loops that stay inside those lines pass. Diffusion has its own version, the DLCO Calibration Check, which shows a volume against time trace with the gas concentration traces underneath and reports back that the test completed successfully.",
    "visual": {
     "t": "img",
     "src": "cal-syringe-assembly",
     "cap": "The 3 litre syringe coupled to the handle through the adapter. Note the flow axis running straight through both, which is why the alignment in this diagram matters."
    },
    "key": "A known volume in, the same volume read back. That is the whole idea of a calibration check."
   },
   {
    "h": "Services and Device Data",
    "p": "This screen is the one you will be asked about on the phone six months from now, so open it on install day and walk the office through it. It carries the software and firmware versions, the serial numbers, a sessions counter showing how many tests this device has run, the date of the last calibration check, and the sessions remaining balance. It is also where Update Software Version and Copy to USB Flash Drive live.",
    "list": [
     "Software and firmware versions plus serial numbers",
     "Sessions counter, how many tests this device has run",
     "Last calibration check",
     "Sessions remaining balance",
     "Update Software Version",
     "Copy to USB Flash Drive"
    ],
    "visual": {
     "t": "img",
     "src": "sw-device-data",
     "cap": "Services and Device Data. Point at the sessions balance when you show this, because that is the number that generates the support call."
    }
   },
   {
    "h": "The settings screens",
    "p": "Configuration is not busywork, it is the part of the install that makes the report look like it belongs to this practice. Go through these screens with somebody from the office sitting next to you, because every switch here decides what they see on screen and what reaches the physician on paper.",
    "visual": {
     "t": "table",
     "head": [
      "Screen",
      "What you set there"
     ],
     "rows": [
      [
       "General Settings",
       "Institute name, department, address and phone for the report header, an Add Logo tile, plus units, time format, report export to printer or USB, and single or multi office."
      ],
      [
       "Clinical Settings",
       "Parameters Preset, Trends Preset and Provocation Preset, and which prediction group applies to children 3 to 12, adolescents 13 to 17 and adults 18 to 150."
      ],
      [
       "Prediction Values Settings",
       "A grid of parameters against reference equation authors including GLI, NHANES III, ECSC 1993 and Knudson, with checkmarks showing the active set."
      ],
      [
       "Test Parameters Settings",
       "Which parameters are reportable under FVC, SVC, LVM and Summary, with display checkmarks and arrows to reorder them."
      ],
      [
       "Report Settings",
       "The summary report template, plus show or hide toggles for ethnicity, interpretations, the flow chart interpretation, diagnosis and conclusion, test warnings and calibration data."
      ],
      [
       "Preferences",
       "Which tests appear in a session, DLCO correction options, altitude correction, and a Rename TGV as FRC option."
      ]
     ],
     "note": "Anything you switch off here never reaches their report, so confirm each choice with the practice rather than guessing for them."
    }
   },
   {
    "h": "Patient data drives predictions",
    "p": "Page one of Add Patient asks for date of birth, height, weight, gender and ethnicity, and which set of predicted values to use. Those entries choose the predicted numbers that every result is then compared against, so a height typed in wrong makes a perfectly accurate machine look broken. Page two adds the medical condition field, a smoking calculator that works out pack years, a box for reimbursement codes, and the Start Session button.",
    "visual": {
     "t": "img",
     "src": "sw-add-patient",
     "cap": "Add Patient page one. Every field on this page feeds the predicted values, which is why this screen deserves more care than it usually gets."
    },
    "key": "A wrong height is a wrong percent predicted on every line of the report."
   },
   {
    "h": "Run the first session",
    "p": "Do not leave the office without running a full session end to end, ideally on a willing volunteer from the staff. It turns your install from a delivery into a demo, and it means the first time this practice runs a real patient, they have already watched the whole path once.",
    "visual": {
     "t": "steps",
     "items": [
      {
       "h": "Start at the Patients List",
       "p": "New Patient for somebody new, or New Session on an existing row."
      },
      {
       "h": "Fill both Add Patient pages",
       "p": "Demographics and predicted set on page one, then condition, pack years and reimbursement codes on page two, then Start Session."
      },
      {
       "h": "Name the technician and physician",
       "p": "The Session Begin dialog asks for both before the axes go live on the Forced Vital Capacity Measurement screen."
      },
      {
       "h": "Work down the test rail",
       "p": "The left rail runs the sequence FVC, SVC, MVV, LVM and Summary, so the technician always knows what is next."
      },
      {
       "h": "Read the FVC results",
       "p": "A parameter table of predicted, best and percent predicted sits next to the flow volume loop and the volume time curve, with a post bronchodilator toggle."
      },
      {
       "h": "Land on Summary",
       "p": "FVC, SVC and LVM come together in one pre and post table with percent predicted and percent change, plus an Add Diagnosis button."
      },
      {
       "h": "Print it",
       "p": "The printed report carries the patient and session blocks, the FVC section with the multiple efforts overlaid and a colour legend, and the pre and post bronchodilator table with percent change."
      },
      {
       "h": "Show them the history",
       "p": "Back on the Patients List, expand the patient row and the previous sessions appear, each dated and tagged with the tests it contains."
      }
     ]
    }
   }
  ],
  "angle": "Install day is your best demo, so run it like one. You are not just bolting a machine to a cart, you are putting their institute name and their logo in the report header, choosing the reference equations their physicians already trust, and handing back a printed report with a patient's curves on it before you leave. Reps who finish the install with a printed report in a physician's hand rarely get asked whether the practice made the right call."
 },
 "intro_mbp": {
  "minutes": 8,
  "intro": "The hardware gets the meeting, but the software wins it. Almost everything a physician judges you on happens on that tablet: how fast you find a patient, how a session runs, and what comes out on paper at the end. This module is the tour. Learn the shape of the software, learn how one session flows, and learn the interpretation flowchart well enough to walk a doctor through their own result.",
  "sections": [
   {
    "h": "The software in one screen",
    "p": "Start on General Settings, because the left hand navigation on this screen is the map of the entire product. It lists General and Clinical Settings, Prediction Preset, Parameters Preset, Trends Preset, Report Settings and Preferences. On the screen itself, the report headers sit on the left, which is the information that prints at the top of every report, and the system settings sit on the right, which is how the software behaves day to day.",
    "visual": {
     "t": "img",
     "src": "sw-general-settings",
     "cap": "General Settings. Read the left nav first. Those few names are the whole software, and knowing them is the difference between demoing and hunting."
    },
    "key": "Learn the left nav and you can find anything in the product in one click."
   },
   {
    "h": "Patients List is home base",
    "p": "Every test in this system starts and ends on the Patients List. There is a search bar at the top and a row per patient showing the last visit, the date of birth and a badge counting how many sessions that patient has. The buttons across it are New Patient, Delete Patient, Delete Session and New Session. Expand a row and the previous sessions unfold underneath, each one dated and tagged with the tests it contains, which is how a physician looks back at what changed since last year.",
    "list": [
     "Search bar to find a patient fast",
     "Rows show last visit, date of birth and a session count badge",
     "New Patient and New Session are the two buttons you will use every day",
     "Expanding a row reveals that patient's session history"
    ],
    "visual": {
     "t": "img",
     "src": "sw-patients-list",
     "cap": "The Patients List. The session count badge is the quiet sales point, because it means every visit stacks up into a history rather than a loose sheet of paper."
    }
   },
   {
    "h": "How a session flows",
    "p": "A session is a single visit, and it always runs the same way. If you can narrate these five moves without looking at the screen, you can run a demo in a hallway with a physician who has four minutes.",
    "visual": {
     "t": "steps",
     "items": [
      {
       "h": "Find or add the patient",
       "p": "From the Patients List, either New Patient or New Session on somebody already in the system."
      },
      {
       "h": "Open the session",
       "p": "The software asks who the technician and the physician are before the first test begins."
      },
      {
       "h": "Work the test list",
       "p": "The tests run in order down the left rail, FVC first, then SVC, MVV and LVM, with Summary waiting at the end."
      },
      {
       "h": "Read the results",
       "p": "Each test gives a parameter table of predicted, best and percent predicted alongside its curves, with a post bronchodilator toggle so the before and after can be compared."
      },
      {
       "h": "Summarise and print",
       "p": "Summary pulls FVC, SVC and LVM into one pre and post table with percent change, Add Diagnosis captures the read, and the report prints."
      }
     ]
    }
   },
   {
    "h": "What prints on the report",
    "p": "Report Settings is where a practice decides what the physician actually receives, and it is worth walking through slowly because different practices want very different pages. There is a summary report template to choose, and then a set of show or hide toggles.",
    "visual": {
     "t": "table",
     "head": [
      "Toggle",
      "Why a practice cares"
     ],
     "rows": [
      [
       "Ethnicity",
       "It feeds the predicted values, and some practices want that visible on the page for anyone reading the result later."
      ],
      [
       "Interpretations",
       "Prints the software's read alongside the numbers instead of leaving the page as raw data."
      ],
      [
       "Flow chart interpretation",
       "Prints the interpretation decision tree itself, so the reasoning is on the report next to the result."
      ],
      [
       "Diagnosis and conclusion",
       "Carries the physician's own wording, captured through Add Diagnosis on the Summary screen."
      ],
      [
       "Test warnings",
       "Shows where effort or quality was questionable, which protects the physician from over reading a poor effort."
      ],
      [
       "Calibration data",
       "Documents that the device was checked, which is the line an auditor tends to ask about."
      ]
     ]
    }
   },
   {
    "h": "The interpretation tree",
    "p": "This is the ATS and ERS decision tree, and it is the single most useful thing in the deck for a rep. It starts with one ratio, FEV1 over VC, compared against the lower limit of normal, which is the bottom edge of the normal range for somebody of that age, height, gender and ethnicity. From there it branches through VC and TLC and lands on one of four answers: normal, restriction, obstruction, or a mixed defect. Then every one of those four splits again on DLCO against its own lower limit of normal. That second split is what turns a pattern into a short list of causes, and the chart names things like pulmonary vascular disorders, chest wall and neuromuscular disorders, ILD and pneumonitis, asthma and chronic bronchitis, and emphysema.",
    "visual": {
     "t": "img",
     "src": "interp-tree-ats",
     "cap": "The ATS and ERS tree. Notice that DLCO appears at the bottom of every branch, not just one, which is why a machine that does spirometry alone can only get a physician halfway down this chart."
    },
    "key": "Three questions in order: the ratio, then the volumes, then DLCO."
   },
   {
    "h": "The flowchart on the report",
    "p": "The bigger chart is the same logic in three parts. A spirometry branch, a lung volume branch that works from TLC, which is all the air the lungs hold when completely full, and RV over TLC, which is the share of that full lung made up of air the patient cannot blow out. Then a diffusion branch built on DLCO together with VA, the alveolar volume the test gas actually reached, and KCO, the diffusion result expressed per unit of that volume. The part that matters commercially is that the software can print this flowchart on the report. The physician does not just get a verdict, they get the path that led to it.",
    "visual": {
     "t": "img",
     "src": "interp-flowchart-full",
     "cap": "All three branches on one page: spirometry, lung volumes with TLC and RV over TLC, and diffusion with DLCO, VA and KCO. This is the picture to point at when a physician asks how the software reaches a conclusion."
    },
    "key": "The software can print the interpretation flowchart on the report. Walk a physician down it."
   }
  ],
  "angle": "Any rep can list features. The one who can put a finger on the interpretation flowchart and walk a physician down it, ratio first, then volumes, then DLCO, is having a completely different conversation. Use it two ways: to show that the MiniBox prints the reasoning and not just the numbers, and to make the case that spirometry alone stops halfway down the chart, because on this tree it is DLCO that turns each pattern into a short list of causes."
 }
};
