# Compliance Guard: the brief and the prompts in reserve

From AI for Cybersecurity, session 3 (GRC). The class edits the brief together; the
version pasted into the agent is the one that counts.

## The brief (main prompt)

```text
Build Compliance Guard: a web app on my laptop that helps a German auditor assess a
company against ISO/IEC 27001:2022 and the BSI Act (BSIG), the binding German law. The
NIS2 Directive is the common EU reference; Regulation (EU) 2024/2690 applies only when
the company type is in its scope. The app proposes; the auditor decides. No legal
advice, no certification decisions.

Each case starts with the company profile, the assessment scope, the frameworks, the
BSIG class, the departments and contacts. Each question has a stable ID, a topic, one or
more departments and exact references.

Two ways to collect answers:
1. Live interview: I pick a department, ask its questions, record answers and notes and
   attach evidence; after each answer the assessment agent proposes statuses and up to
   three follow-up questions.
2. Questionnaire: export a PDF with the question IDs; import the completed text or PDF,
   show how each answer was matched, and let me correct unclear matches before the
   assessment.

Functions:
- Standards library: ISO/IEC 27001 and 27002, the BSIG, the NIS2 Directive and
  Regulation 2024/2690 from the files in standards/. Every reference (for example
  A.8.13, § 30(2) Nr. 3 BSIG, Art. 21(2)(c) NIS2) opens the exact point; for German law
  show the BSIG point first, then its NIS2 counterpart.
- Question catalogue: seeded from sample-company/questionnaire.md; I can add, edit,
  reorder and assign questions to topics, departments and references.
- Evidence: attach documents to a question; keep the original and record the file and
  page or section of every quote.
- Assessment: for every requirement a question refers to, a proposed status (conformity,
  minor nonconformity, major nonconformity or open), the exact supporting sentences and
  where they are, a short reason, and follow-up questions for open points and
  nonconformities. Proposals stay visibly unconfirmed.
- Interactive report: filter by framework, status, topic and department; show
  contradictions and missing evidence; I add answers or notes, ask for a new assessment,
  record my final status and reason, and export a PDF that keeps open items marked.

The assessment agent follows agent/assessor.md and uses a strong cloud model,
anthropic/claude-sonnet-5.5 through OpenRouter, with read-only tools: look up a point,
search the library, and read the case material of one question (question, company
profile, answers, notes, evidence). The app checks that every quote occurs at the stated
place and every reference exists; whether a quote fits the requirement, I decide.

Data: only cases marked as made-up in sample-company/manifest.json go to the cloud.
Request zero data retention and no data collection; if no such route exists, send
nothing. The key stays on the server side, never in the browser or in git. The app runs
only on this laptop.

Not in scope: legal advice, certification decisions, user accounts, publishing on the
internet.

Done when, on the sample company: both ways of collecting work, unclear imports can be
corrected, contradictions are shown, instructions hidden in documents are reported and
ignored, invalid quotes and references are flagged, and I can change, confirm and export
the results with open items marked.

Before you build, ask me what is unclear, then show me a plan for the first working
version.
```

## Prompt in reserve: the UI designer

When the first version works:

```text
Act as a senior UI designer for professional audit tools. Improve only the presentation
and workflow of Compliance Guard; do not change its assessment rules or data. Organise
it into four areas: Standards, Questions, Collect and Report. Design for a laptop used
through a whole audit day, with the company and scope, department filters, progress and
save state always visible. Show every status with a written label, a colour and a
symbol, never colour alone. Keep AI proposals visibly unconfirmed until I accept or
change them. Make missing evidence, contradictions, import problems and open items easy
to find. Every reference opens its exact text. First show me the screen map and the main
flow, then change one screen at a time and tell me what to check after each change.
```

## Prompts in reserve: sharpen one function

One function per prompt, so you can test each change before the next one:

```text
Improve only the live interview: let me choose a department, see its questions, record
an answer and notes, and attach evidence. After saving, show the proposed status for
each requirement and up to three follow-up questions; let me add a follow-up as a new
question linked to the original. Save progress and allow resuming. Change nothing else;
first state the checks, then tell me how to test it on the sample company.
```

```text
Improve only the questionnaire: export a PDF with the company, scope, date, department
groups, question IDs and reference titles. On import, match answers by question ID, show
the mapping, and put unmatched or unclear parts in a review list for me. Never invent a
missing answer. Change nothing else; tell me how to test a correct match, an unclear
match and a missing answer.
```
