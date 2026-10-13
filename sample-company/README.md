# Sample company for the GRC lab: Beispiel IT-Services GmbH

Everything in this folder is invented for the AI for Cybersecurity course at Cybersteps:
the company, the people, the numbers, the addresses and the answers. The domain uses the
reserved `.example` top-level domain (RFC 2606) and the public IP range comes from a block
reserved for documentation (RFC 5737). Never put a real company's documents here.

## What is in this folder

| File | What it is | Who uses it |
|---|---|---|
| `company-profile.md` | The scenario: what the company does, how it is organised, its IT, its suppliers, recent events | the app and the student, as context |
| `questionnaire.md` | The audit questionnaire, 24 questions on NIS2, the BSI Act (BSIG) and ISO/IEC 27001, with the references behind each question | the app, whose question catalogue starts from it, and the student; the company would fill it in |
| `questionnaire-answers.md` | The same questionnaire, already filled in by the company's head of IT, as if he had spent a few hours on it | the input the app analyses |
| `manifest.json` | Marks this case as made-up (`"madeUp": true`) and lists its files | the app: only cases marked as made-up may go to the cloud model |

The answer key is not in this repository on purpose: the app and the agent that builds it
must not see it before the analysis. The instructor keeps it and hands it out for the
measurement step.

## How the lab uses it

1. The app reads the profile, the questionnaire and the filled-in answers, and opens for
   each question the text of its references from `standards/`: ISO/IEC 27001 and 27002,
   the BSIG, the NIS2 Directive and Regulation 2024/2690.
2. For every requirement a question refers to, the assessment agent proposes a status with
   the rules in `agent/assessor.md`: conformity, minor nonconformity, major nonconformity
   or open. Each result quotes the exact sentence from the answers (or the profile) that
   supports it, with its file, names the reference, gives a short reason and, for open
   points and nonconformities, up to three follow-up questions. ISO and the law get
   separate results.
3. The app checks by itself that every quoted sentence really is in the answers, the
   profile or the auditor's notes (never in the questions or the standards), and that
   every reference exists in `standards/`.
4. The auditor (the student) keeps or changes each status, confirms it, and exports the
   report with open items marked.
5. The results are compared with the answer key: how many statuses match, how many quotes
   or references failed the check, and how often the app said "conformity" where the key
   says minor nonconformity, major nonconformity or open.

If filling in the blank questionnaire live would take too long, the class works directly
with `questionnaire-answers.md`.

## Where the references come from

- NIS2: Directive (EU) 2022/2555, Articles 20, 21 and 23 (EUR-Lex).
- Commission Implementing Regulation (EU) 2024/2690, Annex: the detailed requirements for
  managed service providers (EUR-Lex). The numbers such as "2024/2690 Annex 4.2" point to
  its sections.
- German law: BSI Act (BSIG) sections 30, 32, 33 and 38 (gesetze-im-internet.de).
- ISO/IEC 27001:2022: clause and control numbers from ENISA's mapping table for
  Implementing Regulation 2024/2690 (version 1.2, CC BY 4.0), with the spelling of the
  numbers cleaned up. Their text is in `standards/` (ISO-IEC-27001-2022.md, and the guidance
  for each control in ISO-IEC-27002-2022.md).

Each file in `standards/` names its source and the date it was fetched in its first lines.
