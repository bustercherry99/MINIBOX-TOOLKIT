/* MiniBox Academy — flashcards, test questions and module config.
   Carried over unchanged from v2.0; every question traces to a PulmOne quiz template. */
window.ACADEMY = {
 "intro_mbp": {
  "title": "Intro to MiniBox",
  "specialty": "universal",
  "learn": [
   {
    "q": "What changed in MiniBox software Ver. 3.3.0.0 regarding startup speed?",
    "a": "A user can now launch the MiniBox software quickly even if they have a large patient database — database size no longer slows down software startup."
   },
   {
    "q": "What can a user customize in Report Settings (Ver. 3.3.0.0)?",
    "a": "A user can fully customize the PDF report, selecting/deselecting the options that appear on it; ATS 2022 diagnosis flowcharts are now also available."
   },
   {
    "q": "What changed in Provocation Settings?",
    "a": "A user can now edit the PD/PC threshold value from 20%."
   },
   {
    "q": "What is required to enter the Admin Zone?",
    "a": "The logged-in user must have Admin privileges. By default all existing users are set to General privileges, so a PulmOne technician must assign admin privileges the first time this functionality is used."
   },
   {
    "q": "How does Remote Support access work?",
    "a": "A user can give a PulmOne technician remote access to the software by entering a unique code provided by the technician."
   },
   {
    "q": "What does the DLCO calibration check verify (Cubic gas analyzers only)?",
    "a": "It ensures the DLCO gas analyzer is accurately measuring %CH4 and %CO compared to the tank values; if measured values are off by greater than 10%, the DLCO calibration check will fail."
   },
   {
    "q": "What new FVC quality requirement gates progression to LVM or DLCO measurements?",
    "a": "A patient must now get a passing grade for FVC and FEV1 (grade E or better) before the user can proceed to LVM or DLCO measurements."
   },
   {
    "q": "What new LVM quality check was added?",
    "a": "A patient's SVC during LVM must be at least 90% of their best FVC value in order for the LVM measurement to pass."
   },
   {
    "q": "What is the Flow-volume loop overlay feature?",
    "a": "A user can display a patient's previous best flow-volume loop to more easily compare it to the current visit, by checking the checkbox on the F-V loop graph in the FVC tab or Summary tab."
   },
   {
    "q": "What does the new Trends feature show?",
    "a": "A visual graph of a patient's PFT trends over time; the user selects which PFT parameter to display via a dropdown menu."
   },
   {
    "q": "What are pre-filled clinical interpretations?",
    "a": "A user can add pre-filled diagnoses when pressing the Add Diagnosis button in the Summary tab. The software is preloaded with generic diagnoses, and a user can also save their own unique diagnoses for regular use."
   }
  ],
  "test": []
 },
 "clinical_overview": {
  "title": "Clinical PFT Overview",
  "specialty": "universal",
  "learn": [
   {
    "q": "What are the three core pulmonary function tests, and what does each measure?",
    "a": "Spirometry measures how much air you can exhale and how fast you can empty your lungs. Lung volume testing measures how much air your lungs can hold and how much is left after you exhale. Lung diffusion capacity testing measures how easily oxygen enters your bloodstream."
   },
   {
    "q": "Why does Emphysema typically cause a low DLCO?",
    "a": "With Emphysema there is air trapping and alveolar destruction, which causes a low DLCO most of the time."
   },
   {
    "q": "What is the typical test pattern seen in a restrictive patient?",
    "a": "Restrictive patients' lungs are not able to expand properly and move air in and out; this usually causes all parameters for every test to be under LLN."
   },
   {
    "q": "What should a patient avoid before a PFT?",
    "a": "Avoid bronchodilator medication and smoking for four hours before the test, don't eat a heavy meal, and avoid wearing tight clothing."
   },
   {
    "q": "How long does a complete PFT take?",
    "a": "A complete PFT can take around one and a half hours. Other PFTs can take less time, such as 15 minutes for adults and 15 to 30 minutes for children."
   },
   {
    "q": "What barometric pressure standard applies to PFT reporting?",
    "a": "Barometric pressure should be measured and reported, corrected to a standard pressure of 760 mm Hg."
   },
   {
    "q": "What qualifications should a PFT laboratory supervisor have?",
    "a": "A bachelor's degree or higher in a related field, and at least four years of experience in pulmonary function testing."
   },
   {
    "q": "What pre-test instructions should be given to patients?",
    "a": "Avoid smoking for at least one hour before, avoid a large meal within two hours, avoid heavy exercise within 30 minutes, wear loose comfortable clothing, arrive at least 15 minutes early to register, and postpone the test if sick (fever, flu, diarrhea, or severe headache)."
   },
   {
    "q": "Why is GLI now the recommended standard for interpreting PFTs?",
    "a": "GLI (Global Lung Function Initiative) provides race-neutral reference equations based on a large, diverse global population, allowing more accurate and unbiased analysis of lung function across ethnicities, without requiring race or ethnicity input."
   },
   {
    "q": "Which professional societies endorse the use of GLI equations for PFT interpretation?",
    "a": "The American Thoracic Society (ATS) and European Respiratory Society (ERS) endorse the use of GLI equations for PFT interpretation."
   }
  ],
  "test": []
 },
 "system_orientation": {
  "title": "System Orientation & Cleaning",
  "specialty": "universal",
  "learn": [
   {
    "q": "What three main tests does the MiniBox+ perform?",
    "a": "Complete PFT (via a pressure differential pneumotach), Lung Volumes – Plethysmography, and Single Breath DLCO — controlled from an 11\" Dell/MS Windows tablet."
   },
   {
    "q": "What gas composition is used for DLCO on the MiniBox+, and where else is it used?",
    "a": "21% O2, 0.3% CO, 0.3% CH4, balance N2. The same gas is also used for weekly gas calibration."
   },
   {
    "q": "What weight capacity does the MiniBox software support?",
    "a": "Software supports weight up to 650 lbs."
   },
   {
    "q": "What is the size of the MiniBox device and its built-in cylinder volume?",
    "a": "The device measures 21\" with a built-in cylinder that measures 16.3 L."
   },
   {
    "q": "What parts make up the MiniBox breathing sensor that the patient breathes through?",
    "a": "The SpiroGuard Filter and nose clip (external), the Pressure Differential Flow Sensor, the Shutter mechanism (internal), and the Demand Valve (internal)."
   },
   {
    "q": "What is the filtration efficacy of the SpiroGuard Filter, and what's its part number?",
    "a": "99.999% efficacy — high viral and bacterial filtration with low resistance. PulmOne-recommended part number PUO-VBF00005 (Filter kit: SpiroGuard + nose clip)."
   }
  ],
  "test": [
   {
    "q": "What is the primary function of the pneumotachometer in the Minibox system?",
    "choices": [
     "a) Measure blood pressure",
     "b) Convert air flow into proportional differential pressure",
     "c) Monitor heart rate",
     "d) Measure body temperature"
    ],
    "correct": 1
   },
   {
    "q": "What is the viral and bacterial filtration efficacy of the SpiroGuard Filter?",
    "choices": [
     "a) 90%",
     "b) 95%",
     "c) 99.9%",
     "d) 99.999%"
    ],
    "correct": 3
   },
   {
    "q": "What should be used to wipe down the exterior surfaces of the Minibox system between patients?",
    "choices": [
     "a) Water and soap",
     "b) Alcohol wipes",
     "c) PulmOne recommended surface disinfectant (Super Sani-Cloth, Oxivir)",
     "d) Bleach solution"
    ],
    "correct": 2
   },
   {
    "q": "What gas composition is used for the DLCO test in the Minibox system?",
    "choices": [
     "a) 21% O2, 0.3% CO, 0.3% CH4, Balance N2",
     "b) 20% O2, 0.5% CO, 0.5% CH4, Balance N2",
     "c) 22% O2, 0.2% CO, 0.2% CH4, Balance N2",
     "d) 19% O2, 0.4% CO, 0.4% CH4, Balance N2"
    ],
    "correct": 0
   },
   {
    "q": "What is the maximum weight supported by the Minibox system's software?",
    "choices": [
     "a) 500 lbs",
     "b) 550 lbs",
     "c) 600 lbs",
     "d) 650 lbs"
    ],
    "correct": 3
   }
  ]
 },
 "minibox_setup": {
  "title": "MiniBox Setup & Installation",
  "specialty": "universal",
  "learn": [
   {
    "q": "What comes with a new MiniBox for the customer's records?",
    "a": "A Certificate of Compliance and a User Manual."
   },
   {
    "q": "What must be removed first when unpacking the MB+?",
    "a": "Remove the 5 mouthpieces first — this makes it easier to remove the MB+ from the box."
   },
   {
    "q": "Which port must the communication cable use, and what happens if it isn't?",
    "a": "The 6-foot USB to USB cable (USB to USB-B for MS Tablet) is the only port that can be used for communication. If not connected on this port, you will receive communication error EC111M and the Minibox will not work."
   },
   {
    "q": "What is the optimal regulator pressure output to the MB+?",
    "a": "Turn the black regulator knob (Concoa or Tech air) clockwise until the left gauge reads 60-80 psi or 4-6 bar; optimal pressure for the MB+ is 5 bar (70 psi)."
   },
   {
    "q": "How do you attach or detach the HHU (Handheld Unit)?",
    "a": "Align the plastic fittings on the handle with the inserts on the MB+, insert, then turn clockwise to lock into place (counterclockwise to unlock and remove)."
   },
   {
    "q": "How do you know the MB+ is powered on?",
    "a": "A blue light ring display lets you know the MB+ is on."
   },
   {
    "q": "How do you power on the tablet?",
    "a": "Press and hold the power button (top right of the tablet) for approximately 3 seconds; it will display a Dell logo and then launch into the home screen."
   },
   {
    "q": "What does the Services tab let you do?",
    "a": "Update the session credits for filters and software updates, and allow remote access to a PulmOne technician."
   },
   {
    "q": "What information appears on the Services screen?",
    "a": "Current Software Version, Sessions Counter (number of tests done on this device), Last Calibration Check (last time the device was calibrated), and Sessions Balance (filter-credits/sessions left)."
   },
   {
    "q": "What prediction preset does PulmOne use by default, and why?",
    "a": "GLI (Global Lung Initiative), because it is recognized as the most current prediction preset. Presets can be customized to clinic specifications, but doing so may cause certain presets to not display on the report."
   },
   {
    "q": "In the Parameters Preset screen, what do the blue and green boxes represent?",
    "a": "BLUE is what the technician will view on the screen during testing; GREEN is the parameters that will be displayed on the report."
   },
   {
    "q": "What patient data is used to determine predicted values, and why does accuracy matter?",
    "a": "Patient's age, gender, height, weight, and ethnicity are used to determine their predicted values, so accurate data entry is essential (fields with red asterisks are required)."
   },
   {
    "q": "What connectors are used to attach the regulator to small vs. large gas tanks?",
    "a": "CGA-973 for E-small tanks (inserts on the regulator match the tank fittings) and CGA-500 for H/K-large tanks (insert the regulator nipple into the tank fitting and tighten the nut firmly with a wrench). There should be no leak when gas is turned on in either case."
   }
  ],
  "test": [
   {
    "q": "What is the primary purpose of performing a Nitrogen Washout test?",
    "choices": [
     "A) To measure blood oxygen levels",
     "B) To obtain Total Lung Capacity (TLC)",
     "C) To diagnose heart conditions",
     "D) To measure blood pressure"
    ],
    "correct": 1
   },
   {
    "q": "During the Nitrogen Washout test, what gas does the patient breathe in?",
    "choices": [
     "A) Helium",
     "B) Carbon Dioxide",
     "C) 100% Oxygen",
     "D) Nitrogen"
    ],
    "correct": 2
   },
   {
    "q": "Which of the following should be avoided before performing a Nitrogen Washout test according to ATS/ERS Guidelines?",
    "choices": [
     "A) Eating a large meal within 2 hours of testing",
     "B) Drinking water within 1 hour of testing",
     "C) Sleeping within 30 minutes of testing",
     "D) Wearing loose clothing"
    ],
    "correct": 0
   },
   {
    "q": "What is the acceptable nitrogen concentration level to consider the washout complete?",
    "choices": [
     "A) < 2.0% after three consecutive breaths",
     "B) < 1.5% after three consecutive breaths",
     "C) < 1.0% after three consecutive breaths",
     "D) < 0.5% after three consecutive breaths"
    ],
    "correct": 1
   },
   {
    "q": "Which of the following is a key quality feature to ensure during the Nitrogen Washout test?",
    "choices": [
     "A) Patient should be lying down",
     "B) Patient should hold their breath",
     "C) Patient should keep a tight seal at the mouthpiece",
     "D) Patient should breathe rapidly"
    ],
    "correct": 2
   }
  ]
 },
 "spirometry": {
  "title": "Spirometry",
  "specialty": "pulmonary_allergy",
  "learn": [
   {
    "q": "What does spirometry measure?",
    "a": "The maximum volume of gas inhaled after a maximum volume of gas exhaled. The maneuver can be done slow or forced, and can be performed after delivery of a bronchodilator."
   },
   {
    "q": "Define FVC and FEV1 in one line each.",
    "a": "FVC (\"How Much\") is the total volume of air that can be forced out. FEV1 (\"How Fast\") is the volume of FVC forced out in the first second."
   },
   {
    "q": "What FEV1/FVC ratio range is cited as normal?",
    "a": "75-80% is cited as Normal."
   },
   {
    "q": "What four systems, if impaired, often result in shortness of breath?",
    "a": "Lungs, Heart, Systemic Vasculature, and Control of Respiratory Centers — if 1 or more of these are impaired or fail, it often results in shortness of breath."
   },
   {
    "q": "Which lung structures correlate with restrictive vs. obstructive impairment?",
    "a": "Parenchyma (alveoli, alveolar ducts, respiratory bronchioles) impairment typically correlates with restrictive lung disease. Airway (trachea-bronchioles) impairment typically correlates with expiratory airflow obstruction (CBABE: COPD, bronchitis, asthma, bronchiectasis, emphysema)."
   },
   {
    "q": "What are the clinical reasons to perform spirometry testing?",
    "a": "To diagnose presence/absence of lung disease, quantify the extent of known lung disease, measure effects of occupational exposure, determine the effects of therapy, assess risk of surgical procedures, and evaluate disability or impairment."
   },
   {
    "q": "Describe proper patient positioning for spirometry.",
    "a": "Upright sitting position in a stationary chair, legs not crossed, feet on floor, head straight or slightly extended, nose clip on the lower half of the nose, patient slightly bites the mouthpiece, seals lips firmly around it, tongue below the mouthpiece."
   },
   {
    "q": "What are the 4 steps of the Standard Approach for FVC per ATS/ERS 2019?",
    "a": "1) Inhale completely and rapidly with a pause of less than 2 sec at TLC. 2) Expire with maximal effort until no more air can be expelled while maintaining upright posture (coach to \"blast\" not just \"blow\"). 3) Continue complete expiration for a maximum of 15 seconds. 4) Inspire at maximal flow back to maximum lung volume."
   },
   {
    "q": "What can cause reduced PEF and FEV during the FVC maneuver?",
    "a": "Reduced PEF & FEV can occur when inspiration is slow and/or there is a long pause before the blast."
   },
   {
    "q": "What is MVV and what breathing rate should the patient be coached to hit?",
    "a": "MVV (Maximal Voluntary Ventilation) is the maximum volume of air (L/min) a subject can breathe over a specified period (12 sec for normal subjects), used to estimate maximum minute ventilation and predicted max ventilation for CPET. Coach the patient to achieve an ideal rate of 90-110 breaths/min."
   },
   {
    "q": "In the SVC ERV maneuver, which values are measured vs. calculated?",
    "a": "VCIN and ERV are measured; IC is calculated (example values: VCIN 3.95 L, IC 2.70 L, ERV 1.25 L)."
   },
   {
    "q": "In the SVC IC maneuver, which values are measured vs. calculated?",
    "a": "VCEX and IC are measured; ERV is calculated."
   }
  ],
  "test": []
 },
 "dlco": {
  "title": "DLCO",
  "specialty": "pulmonary",
  "learn": [
   {
    "q": "What does DLCO stand for?",
    "a": "DLCO = Diffusing capacity of the Lungs for carbon monoxide (CO)."
   },
   {
    "q": "How is diffusion measured in a DLCO test?",
    "a": "By measuring the transfer of CO across the alveolar/capillary membrane after the patient inspires a known concentration of CO (0.3%), an inert tracer gas CH4 (0.3%), O2 (21%), and a balance % of N2."
   },
   {
    "q": "Why is DLCO clinically important?",
    "a": "To facilitate diagnosis of various lung diseases, facilitate proper management of diagnosed lung disease, evaluate disease progression, and evaluate pulmonary involvement of other systemic disease states."
   },
   {
    "q": "What is DLCO_sb?",
    "a": "Diffusing capacity for the lungs measured during a single breath maneuver using carbon monoxide."
   },
   {
    "q": "What is DLCO_c (\"corrected DLCO\")?",
    "a": "It accounts for the individual's alveolar volume when interpreting DLCO, normalizing the value based on lung capacity so results can be more accurately compared between patients with different lung sizes."
   },
   {
    "q": "What is VA (alveolar volume) and how is it typically measured?",
    "a": "The volume of air within the alveoli accessible for gas exchange; typically measured using a single-breath helium dilution technique during a breath hold. (Compare this to TLC in LVM.)"
   },
   {
    "q": "What is KCO_sb (transfer coefficient)?",
    "a": "Dividing DLCO by VA gives the transfer coefficient (KCO), representing the rate of gas transfer per unit alveolar volume — useful for comparing intrinsic gas exchange function between patients with different lung sizes."
   },
   {
    "q": "What pre-testing considerations apply to DLCO?",
    "a": "Refrain from smoking and drinking alcohol on the day of testing, do not exercise immediately prior to testing, patient should sit for 5 minutes prior to testing, and patients on supplemental O2 should be on room air for 10 minutes prior to testing."
   },
   {
    "q": "What is the Punjabi method?",
    "a": "A single-breath technique for estimating Total Lung Capacity (TLC) during a DLCO test, based on the assumption that alveolar volume at full inspiration is a good approximation of TLC — especially in individuals with normal airway function."
   },
   {
    "q": "What are the benefits of the Punjabi method?",
    "a": "Faster procedure than traditional multi-breath methods (quicker and easier for the patient), and cost-effective (may require less equipment and time)."
   },
   {
    "q": "What are the limitations of the Punjabi method?",
    "a": "May not be accurate in individuals with significant airway obstruction, since the single-breath measurement might not fully represent the entire lung volume, and may not be reliable in patients with certain lung diseases where lung volumes are significantly altered."
   }
  ],
  "test": [
   {
    "q": "What is the primary function of the respiratory system?",
    "choices": [
     "A) Blood circulation",
     "B) Gas exchange between body tissues and the surrounding air",
     "C) Digestion of food",
     "D) Regulation of body temperature"
    ],
    "correct": 1
   },
   {
    "q": "What does DLCO stand for?",
    "choices": [
     "A) Diffusing capacity of the Lungs for carbon monoxide",
     "B) Diffusing capacity of the Lungs for oxygen",
     "C) Diffusing capacity of the Lungs for nitrogen",
     "D) Diffusing capacity of the Lungs for methane"
    ],
    "correct": 0
   },
   {
    "q": "Which gas is used as an inert tracer in the DLCO test?",
    "choices": [
     "A) Helium",
     "B) Methane (CH4)",
     "C) Oxygen",
     "D) Nitrogen"
    ],
    "correct": 1
   },
   {
    "q": "What is the recommended breath-hold time during the DLCO test?",
    "choices": [
     "A) 5 ± 2 seconds",
     "B) 8 ± 2 seconds",
     "C) 10 ± 2 seconds",
     "D) 12 ± 2 seconds"
    ],
    "correct": 2
   },
   {
    "q": "Which of the following is NOT a pre-testing consideration for DLCO?",
    "choices": [
     "A) Refrain from smoking on the day of testing",
     "B) Refrain from drinking alcohol on the day of testing",
     "C) Exercise immediately prior to testing",
     "D) Patient should sit for 5 minutes prior to DLCO testing"
    ],
    "correct": 2
   },
   {
    "q": "What is the purpose of the \"corrected DLCO\" (DLCO_c) parameter?",
    "choices": [
     "A) To measure the total lung capacity",
     "B) To account for the individual's alveolar volume when interpreting a DLCO test",
     "C) To measure the breath-hold time",
     "D) To measure the volume of air exhaled"
    ],
    "correct": 1
   }
  ]
 },
 "lung_volume": {
  "title": "Lung Volumes (N2 & He)",
  "specialty": "pulmonary",
  "learn": [
   {
    "q": "What does a Nitrogen Washout test measure, and how is it performed?",
    "a": "It's a volume test performed to obtain Total Lung Capacity (TLC). The patient breathes 100% oxygen over a period of a few minutes, washing out the N2 in the lungs; oxygen is started when the patient is at the end of a normal tidal breath (Functional Residual Capacity)."
   },
   {
    "q": "Why is a N2 Washout performed?",
    "a": "To determine the degree of severity of obstructive or restrictive lung disease (or confirm normal lung function), determine what line of treatment the patient will receive, and trend the patient's disease."
   },
   {
    "q": "What does N2 Washout directly measure, and how are TLC and RV derived from it?",
    "a": "N2 Washout measures FRC. Once FRC is known: RV = FRC - ERV, and TLC = FRC + IC (or VC + RV)."
   },
   {
    "q": "What activities should be avoided before N2 washout testing per ATS/ERS guidelines?",
    "a": "Smoking within at least 1 hour, alcohol within at least 1 hour, vigorous exercise within 30 minutes, restrictive clothing, and eating a large meal within 2 hours of testing."
   },
   {
    "q": "What is the most common problem encountered during N2 washout testing?",
    "a": "Air leak at the patient's mouth or nose."
   },
   {
    "q": "When is a N2 washout considered complete?",
    "a": "When the N2 concentration is less than 1.5% after three consecutive breaths."
   },
   {
    "q": "What suggests a leak during N2 washout, and what's the protocol if one is suspected?",
    "a": "A change in inspired O2 greater than 1% or sudden large increases in expired O2 may indicate a leak. The test should be stopped and repeated after a 15 minute wait time."
   },
   {
    "q": "What is the required wait time between N2 washout trials for patients with severe COPD?",
    "a": "At least 1 hour."
   },
   {
    "q": "If multiple N2 washout measurements are performed, what value should be reported?",
    "a": "The mean of technically acceptable results within 10% of each other. If only one FRC N2 is performed, proceed with caution in the interpretation."
   },
   {
    "q": "How does the Helium Gas Dilution technique work?",
    "a": "The patient breathes in a known amount of helium gas; a spirometer measures the new concentration of helium after the patient's lungs and the spirometer reach equilibrium, and lung volume is calculated using the law of conservation of matter."
   },
   {
    "q": "What clinical purposes is the helium dilution technique used for?",
    "a": "Diagnosing restrictive disease patterns, differentiating between obstructive and restrictive patterns, diagnosing hyperinflation and gas trapping, evaluating/monitoring diseases affecting the lung parenchyma, preoperative assessment of compromised lung function, and assessing response to therapy."
   },
   {
    "q": "What are the ATS repeatability specs for the helium dilution test?",
    "a": "Add enough 100% helium to achieve a helium reading of 0.10%; mix within 8 seconds after the patient exhales; use a thermal-conductivity helium analyzer (0-10% range, 0.01% resolution, 95% response time of 0.15 sec); use a breathing circuit flow of 0.50 L/min; wait at least 15 minutes between trials (at least 1 hour 27 minutes for patients with severe obstructive or bullous disease)."
   }
  ],
  "test": [
   {
    "q": "What is the primary purpose of performing a Nitrogen Washout test?",
    "choices": [
     "A) To measure blood oxygen levels",
     "B) To obtain Total Lung Capacity (TLC)",
     "C) To diagnose heart conditions",
     "D) To measure blood pressure"
    ],
    "correct": 1
   },
   {
    "q": "During the Nitrogen Washout test, what gas does the patient breathe in?",
    "choices": [
     "A) Helium",
     "B) Carbon Dioxide",
     "C) 100% Oxygen",
     "D) Nitrogen"
    ],
    "correct": 2
   },
   {
    "q": "Which of the following should be avoided before performing a Nitrogen Washout test according to ATS/ERS Guidelines?",
    "choices": [
     "A) Eating a large meal within 2 hours of testing",
     "B) Drinking water within 1 hour of testing",
     "C) Sleeping within 30 minutes of testing",
     "D) Wearing loose clothing"
    ],
    "correct": 0
   },
   {
    "q": "What is the acceptable nitrogen concentration level to consider the washout complete?",
    "choices": [
     "A) < 2.0% after three consecutive breaths",
     "B) < 1.5% after three consecutive breaths",
     "C) < 1.0% after three consecutive breaths",
     "D) < 0.5% after three consecutive breaths"
    ],
    "correct": 1
   },
   {
    "q": "Which of the following is a key quality feature to ensure during the Nitrogen Washout test?",
    "choices": [
     "A) Patient should be lying down",
     "B) Patient should hold their breath",
     "C) Patient should keep a tight seal at the mouthpiece",
     "D) Patient should breathe rapidly"
    ],
    "correct": 2
   }
  ]
 },
 "lung_volumes_pleth": {
  "title": "Lung Volumes - Plethysmography",
  "specialty": "pulmonary",
  "learn": [
   {
    "q": "What three volumes does body plethysmography measure?",
    "a": "Total Lung Capacity (TLC) - volume of air after the biggest breath in; Functional Residual Capacity (FRC) - volume remaining after breathing out normally; Residual Volume (RV) - volume remaining after breathing out as much as possible."
   },
   {
    "q": "How does body plethysmography physically work?",
    "a": "The patient sits in an enclosed, airtight, see-through plastic box and breathes into a mouthpiece. A sensor inside the box measures changes in air pressure as the chest expands/contracts, while a sensor in the mouthpiece measures airflow and mouth pressure."
   },
   {
    "q": "What physical law underlies the TGV measurement in plethysmography?",
    "a": "Boyle's Law: the absolute pressure exerted by a given mass of an ideal gas is inversely proportional to the volume it occupies, if temperature and amount of gas remain unchanged in a closed system."
   },
   {
    "q": "How is TGV (Thoracic Gas Volume) measured?",
    "a": "The subject breathes inside a sealed chamber while their airway is briefly occluded (shutter closed); the resulting pressure changes in the chamber are detected and used to calculate thoracic gas volume based on Boyle's Law."
   },
   {
    "q": "In the First Preferred Method (ERV+IVC after FRC acquisition), how are TLC and RV calculated per trial?",
    "a": "TLC trial = RV + IVC; RV trial = FRCpl – ERV."
   },
   {
    "q": "What does \"linked\" mean when performing FRCpl followed by VC?",
    "a": "FRCpl must be followed by VC without the patient coming off the mouthpiece."
   },
   {
    "q": "What is the ATS/ERS repeatability requirement for FRCpleth?",
    "a": "At least three FRCpleth values that agree within 5% should be obtained and the mean value reported."
   },
   {
    "q": "What plethysmography calibration schedule is required?",
    "a": "Box calibration performed daily; a validation of accuracy using a known volume performed periodically; and biological controls performed monthly."
   },
   {
    "q": "What are sRaw and Gaw?",
    "a": "sRaw (Specific Airways Resistance, measured with shutter open) is the pressure difference needed to move a given amount of air through the airways. Gaw (airway conductance) is the ease with which air flows through the airways — the reciprocal of resistance."
   },
   {
    "q": "What factors affect airway resistance?",
    "a": "Airway diameter (narrower airways create more resistance), lung volume (as lung volume increases, airways expand and resistance decreases), mucus secretions (thick mucus increases resistance), and bronchospasm (narrows airways, increasing resistance)."
   },
   {
    "q": "What causes VTG measurement problems in plethysmography (troubleshooting)?",
    "a": "Box leak too large, thermal instability (drift), and improper panting technique."
   },
   {
    "q": "At what breathing frequency does the subject pant during the Vtg (TLCPL) measurement, and how does the shutter open?",
    "a": "The subject continues to breathe steadily at BF = 25-30. The shutter opens automatically after the occlusion time, or the operator can press F1 again to open it after the desired number of TGV loops are collected."
   }
  ],
  "test": [
   {
    "q": "What does body plethysmography measure?",
    "choices": [
     "A) Blood pressure",
     "B) Heart rate",
     "C) Total lung capacity (TLC)",
     "D) Blood sugar levels"
    ],
    "correct": 2
   },
   {
    "q": "Which law is used to calculate Thoracic Gas Volume (TGV) in body plethysmography?",
    "choices": [
     "A) Newton's Law",
     "B) Boyle's Law",
     "C) Charles's Law",
     "D) Avogadro's Law"
    ],
    "correct": 1
   },
   {
    "q": "What is the volume of air that remains in your lungs after breathing out normally called?",
    "choices": [
     "A) Total lung capacity (TLC)",
     "B) Residual volume (RV)",
     "C) Functional residual capacity (FRC)",
     "D) Inspiratory vital capacity (IVC)"
    ],
    "correct": 2
   },
   {
    "q": "How often should box calibration be performed for plethysmography?",
    "choices": [
     "A) Weekly",
     "B) Monthly",
     "C) Daily",
     "D) Annually"
    ],
    "correct": 2
   },
   {
    "q": "What factor does NOT affect airway resistance?",
    "choices": [
     "A) Airway diameter",
     "B) Lung volume",
     "C) Blood pressure",
     "D) Mucus secretions"
    ],
    "correct": 2
   }
  ]
 },
 "additional_testing": {
  "title": "Additional Testing",
  "specialty": "pulmonary_allergy",
  "learn": [
   {
    "q": "What is Airway Resistance (Raw) and in what units is it reported?",
    "a": "Raw is the amount of pressure required to generate a given flow rate, reported in cm H2O/L/Sec. It can be measured directly by plethysmography or estimated by formulas based on pressure and flow."
   },
   {
    "q": "What is Airway Conductance (Gaw)?",
    "a": "The reciprocal of Raw, expressed as the flow rate for a given driving pressure (L/sec/cm H2O) — a useful way to describe the pressure-flow relationship of the airways."
   },
   {
    "q": "What factor affects the accuracy of measured RAW values, and why can't RAW be independently verified?",
    "a": "Panting frequency affects accuracy. There is no way to verify the accuracy of RAW/GAW — unlike Spiro, Lung volumes, and DLCO, which can be verified using simulators."
   },
   {
    "q": "What is FeNO and how is it measured?",
    "a": "The Fractional Exhaled Nitric Oxide test measures nitric oxide (a gas produced by cells involved in inflammation from allergic or eosinophilic asthma) in parts per billion (PPB) using a portable device; the patient must blow slowly and steadily, not hard and fast."
   },
   {
    "q": "What FeNO values are considered normal?",
    "a": "Less than 25 ppb is normal in adults; less than 20 ppb is normal in children."
   },
   {
    "q": "What is Frequency Oscillation Testing (FOT) and what two frequencies are typically used?",
    "a": "FOT sends multiple low, variable sound wave frequencies down the airways and measures the time for them to travel down and reflect back, showing what's happening along the full airway length. Usually 2 frequencies are used: R5 for the full length of the airway and R20 for the larger airways."
   },
   {
    "q": "What are MIP and MEP, and at what lung volumes are they measured?",
    "a": "MIP (Maximum Inspiratory Pressure) is generated during maximal inspiratory effort against a closed system, usually measured at Residual Volume (RV). MEP (Maximum Expiratory Pressure) is measured during a similar maneuver at Total Lung Capacity (TLC)."
   },
   {
    "q": "What is the objective of methacholine bronchoprovocation testing?",
    "a": "Administer 5 or 10 increasing dosages of methacholine (via a specialized nebulizer with known output/particle size) until the patient has a drop in FEV1 of 20% or more — reported as PC20 or PD20."
   },
   {
    "q": "What FEV1 drop defines a positive EIB test, and how does that differ from methacholine testing?",
    "a": "For EIB (exercise-induced bronchoprovocation) we look for a drop of 15% in FEV1, whereas for methacholine testing we look for a drop of 20% or more."
   },
   {
    "q": "What is the EIB treadmill protocol target?",
    "a": "Speed and grade are chosen to produce 4-6 min of exercise at near-maximum targets, with total exercise duration of 6-8 min (6 min for children under 12, 8 min for older children/adults); heart rate should reach 80-90% of predicted maximum (220 minus age in years)."
   },
   {
    "q": "What is CPET and what outcomes is it associated with?",
    "a": "Cardiopulmonary Exercise Testing is a dynamic, non-invasive assessment of the cardiopulmonary system at rest and during exercise. Deficiencies in anaerobic threshold, peak oxygen consumption, and ventilatory efficiency for CO2 are associated with poor postoperative outcomes."
   },
   {
    "q": "What is the key objective regarding oxygen during a 6-Minute Walk Test?",
    "a": "Measure the patient's SpO2 every minute for 6 minutes. If O2 drops below 88%, start the patient on 1L O2 and increase until they are steady over 90%."
   },
   {
    "q": "What does the 6-Minute Walk Test measure, and in what patients is it used?",
    "a": "The total distance walked in six minutes, used to evaluate functional exercise capacity, particularly in patients with cardiopulmonary conditions like COPD or heart failure, and to monitor conditions like pulmonary fibrosis or the effectiveness of pulmonary rehab/oxygen therapy."
   }
  ],
  "test": [
   {
    "q": "What is the primary purpose of measuring airway resistance (RAW)?",
    "choices": [
     "A) To determine the volume of air in the lungs",
     "B) To measure the resistance of the respiratory tract to airflow during inhalation and exhalation",
     "C) To assess the strength of respiratory muscles",
     "D) To evaluate the level of nitric oxide in exhaled air"
    ],
    "correct": 1
   },
   {
    "q": "What is considered a normal FeNO test result for adults?",
    "choices": [
     "A) Less than 10 parts per billion (ppb)",
     "B) Less than 15 parts per billion (ppb)",
     "C) Less than 25 parts per billion (ppb)",
     "D) Less than 30 parts per billion (ppb)"
    ],
    "correct": 2
   },
   {
    "q": "Which frequencies are typically used in Frequency Oscillation Testing (FOT) to assess airway narrowing?",
    "choices": [
     "A) R5 and R10",
     "B) R10 and R15",
     "C) R5 and R20",
     "D) R15 and R20"
    ],
    "correct": 2
   },
   {
    "q": "During a Bronchoprovocation test with methacholine, what is the objective in terms of FEV1 reduction?",
    "choices": [
     "A) A drop in FEV1 of 10% or more",
     "B) A drop in FEV1 of 15% or more",
     "C) A drop in FEV1 of 20% or more",
     "D) A drop in FEV1 of 25% or more"
    ],
    "correct": 2
   },
   {
    "q": "What is the primary measurement outcome of the 6-minute walk test (6MWT)?",
    "choices": [
     "A) The patient's heart rate",
     "B) The patient's oxygen saturation",
     "C) The total distance walked in six minutes",
     "D) The patient's perceived exertion"
    ],
    "correct": 2
   },
   {
    "q": "What is the main purpose of the Cardiopulmonary Exercise Test (CPET)?",
    "choices": [
     "A) To measure airway resistance",
     "B) To assess the functional capacity of the heart and lungs during exercise",
     "C) To evaluate the level of nitric oxide in exhaled air",
     "D) To measure the strength of respiratory muscles"
    ],
    "correct": 1
   }
  ]
 },
 "respiratory_disease": {
  "title": "Respiratory Disease Care",
  "specialty": "clinical",
  "learn": [
   {
    "q": "Define FVC, FEV1, FEF25-75%, and FEV1/FVC.",
    "a": "FVC = volume of air exhaled after a maximal inspiration to TLC (Liters). FEV1 = volume of air exhaled in the first second of expiration (Liters). FEF25-75% = mean expiratory flow during the middle half of the FVC maneuver, reflecting flow through later-emptying airways (not necessarily the small airways). FEV1/FVC = volume expired in the first second, expressed as a percent of FVC."
   },
   {
    "q": "What ATS acceptability criteria apply within a spirometry maneuver?",
    "a": "Free from artifacts (cough in first second, glottis closure, early termination, non-maximal effort, leak, obstructed mouthpiece); good starts (extrapolated volume < 5% of FVC or 0.15 L, whichever is greater); satisfactory exhalation (duration ≥ 6 s, 3 s for children under 10, or a plateau in the volume-time curve, or the subject cannot continue)."
   },
   {
    "q": "What repeatability criteria apply between spirometry maneuvers?",
    "a": "After three acceptable spirograms, the two largest FVC values must be within 0.150 L of each other, and the two largest FEV1 values must be within 0.150 L of each other. If not met, continue testing until met or until 8 tests total have been performed, or until the patient cannot continue. Save at least the three satisfactory maneuvers."
   },
   {
    "q": "What factors determine normal predicted values, and what is the general normal cutoff?",
    "a": "Height, age, gender, and ethnicity. Normal is generally cited as > 80% for FEV1, FVC, TLC, and DLCO."
   },
   {
    "q": "How do obstructive vs. restrictive ventilatory impairments differ physiologically?",
    "a": "Obstructive impairments involve narrowing of the airways (physical obstruction or dynamic collapse); this impairs lung emptying and is often accompanied by air trapping/hyperinflation, reducing FVC but more directly assessed by RV. Restrictive impairments involve a reduction in the size of the lung (parenchymal, or extrapulmonary factors like weakness, chest wall abnormalities, obesity); this reduces FEV1, FVC, and TLC but not the FEV1/FVC ratio."
   },
   {
    "q": "Give examples of obstructive vs. restrictive disorders from the deck.",
    "a": "Obstructive: Asthma, Emphysema, Cystic Fibrosis. Restrictive: Interstitial Fibrosis, Scoliosis, Obesity, Lung Resection, Neuromuscular diseases, Cystic Fibrosis."
   },
   {
    "q": "What is the classic spirometric pattern for obstructive disorders?",
    "a": "FVC normal or decreased, FEV1 decreased, FEF25-75% decreased, FEV1/FVC decreased, TLC normal or increased."
   },
   {
    "q": "What is the classic spirometric pattern for restrictive disorders?",
    "a": "FVC decreased, FEV1 decreased, FEF25-75% normal to decreased, FEV1/FVC normal to increased, TLC decreased."
   },
   {
    "q": "How do GOLD and ATS criteria define COPD, and when should each be used?",
    "a": "GOLD criteria = FEV1/FVC less than 70%; ATS criteria = FEV1/FVC less than the LLN. GOLD is recommended for patients 65 and older (more sensitive, better identifies clinically relevant events); ATS is recommended for patients younger than 65, since GOLD can miss up to 50% of young adults with obstructive disease and overdiagnoses healthy non-smokers."
   },
   {
    "q": "What defines a positive bronchodilator response?",
    "a": "An improvement of greater than 12% and 200 mL."
   },
   {
    "q": "How is restrictive disease severity classified by TLC % predicted?",
    "a": "TLC < 80% predicted = restrictive disease; 70-80% = mild; 60-70% = moderate; 50-60% = moderately severe; < 50% = severe."
   },
   {
    "q": "How are z-scores used to classify severity of lung function impairment?",
    "a": "z-scores > -1.645 are normal; between -1.65 and -2.5 are mild; between -2.51 and -4 are moderate; < -4.1 are severe. z-scores express how far an observed value is from predicted after accounting for sex, age, height, and ancestral grouping."
   },
   {
    "q": "What lung function indices differentiate fixed extrathoracic, variable extrathoracic, and intrathoracic obstruction?",
    "a": "PEF: decreased in fixed extrathoracic and intrathoracic obstruction, normal or decreased in variable extrathoracic. FIF50%: decreased in both fixed and variable extrathoracic, normal or decreased in intrathoracic. FIF50%/FEF50% ratio: ~1 for fixed extrathoracic, <1 for variable extrathoracic, >1 for intrathoracic obstruction."
   },
   {
    "q": "What is the \"non-specific pattern\" (PRISm) on spirometry?",
    "a": "Reduced FEV1 and FVC with a normal FEV1/FVC ratio and normal TLC; when TLC isn't available, this pattern has been described in population-based studies as preserved ratio impaired spirometry (PRISm) in current and former smokers."
   }
  ],
  "test": []
 },
 "pft_overview": {
  "title": "PFT Overview",
  "specialty": "universal",
  "learn": [],
  "test": [
   {
    "q": "Which part of the MiniBox breathing circuit is responsible for measuring the pressure difference?",
    "choices": [
     "A) SpiroGuard Filter",
     "B) Pressure Differential Sensor (PDS)",
     "C) Shutter Mechanism",
     "D) Demand Valve"
    ],
    "correct": 1
   },
   {
    "q": "What gases are used for the DLCO test in the MiniBox Plus system?",
    "choices": [
     "A) 21% O2, .3% CO, .3% CH4, Bal N2",
     "B) 100% O2",
     "C) 50% O2, 50% CO2",
     "D) 78% N2, 21% O2, 1% Argon"
    ],
    "correct": 0
   },
   {
    "q": "What should be used to wipe down the exterior surfaces of the MiniBox between patients?",
    "choices": [
     "A) Alcohol wipes",
     "B) Water and soap",
     "C) PulmOne recommended surface disinfectant (Super Sani-Cloth, Oxivir)",
     "D) Bleach solution"
    ],
    "correct": 2
   },
   {
    "q": "What is the purpose of the SpiroGuard Filter in the MiniBox system?",
    "choices": [
     "A) To measure lung volumes",
     "B) To provide high viral and bacterial filtration efficacy",
     "C) To convert air flow into proportional differential pressure",
     "D) To support weight up to 650 lbs"
    ],
    "correct": 1
   },
   {
    "q": "Which feature is NOT part of the MiniBox Plus system?",
    "choices": [
     "A) Lung Volumes – Plethysmography",
     "B) Single Breath DLCO",
     "C) Blood Oxygen Level Monitoring",
     "D) Pressure Differential Pneumotach"
    ],
    "correct": 2
   }
  ]
 },
 "final_exam": {
  "title": "Final Certification Exam",
  "specialty": "universal",
  "learn": [],
  "test": [
   {
    "q": "What is the primary purpose of spirometry?",
    "choices": [
     "A) To measure the volume of air in the lungs",
     "B) To measure the flow of air in and out of the lungs",
     "C) To assess the strength of respiratory muscles",
     "D) To evaluate the level of carbon dioxide in exhaled air"
    ],
    "correct": null
   },
   {
    "q": "What is considered a normal FEV1/FVC ratio for adults?",
    "choices": [
     "A) Greater than 50%",
     "B) Greater than 60%",
     "C) Greater than 70%",
     "D) Greater than 80%"
    ],
    "correct": null
   },
   {
    "q": "Which parameter is typically used to assess small airway function in spirometry?",
    "choices": [
     "A) FEV1",
     "B) FVC",
     "C) FEF25-75%",
     "D) PEF"
    ],
    "correct": null
   },
   {
    "q": "During a Bronchodilator Reversibility Test, what is the minimum improvement in FEV1 that indicates a positive response?",
    "choices": [
     "A) 5% increase",
     "B) 10% increase",
     "C) 12% increase",
     "D) 15% increase"
    ],
    "correct": null
   },
   {
    "q": "What is the primary function of the alveoli in the respiratory system?",
    "choices": [
     "A) Blood circulation",
     "B) Gas exchange between the air and blood",
     "C) Digestion of food",
     "D) Regulation of body temperature\\"
    ],
    "correct": null
   },
   {
    "q": "What does TLC stand for in pulmonary function testing?",
    "choices": [
     "A) Total Lung Capacity",
     "B) Tidal Lung Capacity",
     "C) Total Laryngeal",
     "D) Tidal Laryngeal Capacity"
    ],
    "correct": null
   },
   {
    "q": "Which gas is commonly used in the Helium Dilution test to measure lung volumes?",
    "choices": [
     "A) Helium",
     "B) Methane",
     "C) Oxygen",
     "D) Nitrogen"
    ],
    "correct": null
   },
   {
    "q": "What is the recommended duration for the breath-hold during a single-breath DLCO test?",
    "choices": [
     "A) 5 ± 1 seconds",
     "B) 8 ± 1 seconds",
     "C) 10 ± 1 seconds",
     "D) 12 ± 1 seconds"
    ],
    "correct": null
   },
   {
    "q": "Which of the following is NOT a pre-testing consideration for spirometry?",
    "choices": [
     "A) Refrain from smoking on the day of testing",
     "B) Refrain from drinking alcohol on the day of testing",
     "C) Avoid using bronchodilators before the test",
     "D) Exercise immediately prior to testing"
    ],
    "correct": null
   },
   {
    "q": "What is the primary purpose of performing a Body Plethysmography test?",
    "choices": [
     "A) To measure blood oxygen levels",
     "B) To obtain Total Lung Capacity (TLC)",
     "C) To diagnose heart conditions",
     "D) To measure blood pressure"
    ],
    "correct": null
   },
   {
    "q": "During the Body Plethysmography test, what does the patient breathe in?",
    "choices": [
     "A) Helium",
     "B) Carbon Dioxide",
     "C) 100% Oxygen",
     "D) Room air"
    ],
    "correct": null
   },
   {
    "q": "Which of the following should be avoided before performing a Body Plethysmography test according to ATS/ERS Guidelines?",
    "choices": [
     "A) Eating a large meal within 2 hours of testing",
     "B) Drinking water within 1 hour of testing",
     "C) Sleeping within 30 minutes of testing",
     "D) Wearing loose clothing"
    ],
    "correct": null
   },
   {
    "q": "What is the acceptable helium concentration level to consider the Helium Dilution test complete?",
    "choices": [
     "A) < 2.0% after three consecutive breaths",
     "B) < 1.5% after three consecutive breaths",
     "C) < 1.0% after three consecutive breaths",
     "D) < 0.5% after three consecutive breaths"
    ],
    "correct": null
   },
   {
    "q": "Which of the following is a key quality feature to ensure during the Helium Dilution test?",
    "choices": [
     "A) Patient should be lying down",
     "B) Patient should hold their breath",
     "C) Patient should keep a tight seal at the mouthpiece",
     "D) Patient should breathe rapidly"
    ],
    "correct": null
   },
   {
    "q": "What is the primary purpose of Pulmonary Function Tests (PFTs)?",
    "choices": [
     "A) To measure blood pressure",
     "B) To assess lung function",
     "C) To diagnose heart disease",
     "D) To evaluate kidney function"
    ],
    "correct": null
   },
   {
    "q": "Which of the following tests measures the diffusion capacity of the lungs?",
    "choices": [
     "A) Lung volume test",
     "B) Spirometry",
     "C) DLCO test",
     "D) Arterial blood gas test"
    ],
    "correct": null
   },
   {
    "q": "Which respiratory pattern is typically observed in patients with Chronic Obstructive Pulmonary Disease (COPD)?",
    "choices": [
     "A) Normal FVC, decreased FEV1, and decreased DLCO",
     "B) Increased FVC, normal FEV1, and normal DLCO",
     "C) Decreased FVC, increased FEV1, and increased DLCO",
     "D) Decreased FVC, decreased FEV1, and decreased DLCO"
    ],
    "correct": null
   },
   {
    "q": "What is the recommended standard for interpreting Pulmonary Function Tests (PFTs) according to the document?",
    "choices": [
     "A) American Lung Association (ALA) equations",
     "B) Global Lung Function Initiative (GLI) equations",
     "C) National Heart, Lung, and Blood Institute (NHLBI) equations",
     "D) World Health Organization (WHO) equation"
    ],
    "correct": null
   },
   {
    "q": "What is the primary purpose of performing a Nitrogen Washout test?",
    "choices": [
     "A) To measure blood oxygen levels",
     "B) To obtain Total Lung Capacity (TLC)",
     "C) To diagnose heart conditions",
     "D) To measure blood pressure"
    ],
    "correct": 1
   },
   {
    "q": "During the Nitrogen Washout test, what gas does the patient breathe in?",
    "choices": [
     "A) Helium",
     "B) Carbon Dioxide",
     "C) 100% Oxygen",
     "D) Nitrogen"
    ],
    "correct": 2
   }
  ]
 }
};

window.ACADEMY_CFG = {
  certPct: 80,
  testable: 8,
  icons: {
    intro_mbp:'🚀', clinical_overview:'🩺', system_orientation:'🧭', minibox_setup:'🔧',
    pft_overview:'📋', spirometry:'🌬️', dlco:'🫁', lung_volume:'🎈',
    lung_volumes_pleth:'📦', additional_testing:'🧪', respiratory_disease:'🔬', final_exam:'🏆'
  },
  tags: {
    spirometry:[{label:'Pulm',bg:'var(--pulm-w)',c:'var(--pulm)'},{label:'Allergy',bg:'var(--allergy-w)',c:'var(--allergy)'}],
    additional_testing:[{label:'Allergy',bg:'var(--allergy-w)',c:'var(--allergy)'},{label:'Pulm',bg:'var(--pulm-w)',c:'var(--pulm)'}]
  },
  pending: {
    final_exam:'The source Final Exam file shipped with NO answer key marked — 18 of its 20 answers could not be verified from the document. Rather than guess an answer in front of a physician, the graded test is locked until the key is confirmed. The Learn side is open; the 20 questions just need answers signed off.'
  },
  sections: [
    { title:'Device Essentials', color:'var(--univ)',
      note:'Every rep starts here. The box, the setup, and the software.',
      modules:['intro_mbp','system_orientation','minibox_setup'] },
    { title:'PFT Foundations', color:'var(--rht)',
      note:'What a pulmonary function test actually is, how to prep the patient, and how to read the basics. Universal ground for every specialty.',
      modules:['clinical_overview','pft_overview'] },
    { title:'Pulmonology', color:'var(--pulm)',
      note:'The full-PFT story. Spirometry, diffusion, and lung volumes — the core you sell into pulmonology accounts. (Spirometry is shared with Allergy.)',
      modules:['spirometry','dlco','lung_volume','lung_volumes_pleth'] },
    { title:'Allergy / Immunology', color:'var(--allergy)',
      note:'FeNO, methacholine challenge and bronchoprovocation are the asthma workup allergy reps lead with. This module also carries pulmonary add-ons (CPET, 6MWT, oscillometry), so pulmonology reps should take it too.',
      modules:['additional_testing'] },
    { title:'Clinical Mastery', color:'var(--clinical)',
      note:'The deeper clinical layer — ATS/ERS acceptability, GOLD criteria, obstructive vs restrictive patterns, severity grading. This is what makes a rep sound credible in front of a physician.',
      modules:['respiratory_disease'] },
    { title:'Capstone', color:'var(--cap)',
      note:'The full certification exam. Learn everything above, then prove it here.',
      modules:['final_exam'] }
  ]
};
