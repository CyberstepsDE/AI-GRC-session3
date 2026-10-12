# Sample company for the GRC lab: Beispiel IT-Services GmbH

Everything in this folder is invented for the AI for Cybersecurity course at Cybersteps:
the company, the people, the numbers, the addresses and the answers. The domain uses the
reserved `.example` top-level domain (RFC 2606) and the public IP range comes from a block
reserved for documentation (RFC 5737). Never put a real company's documents here.

## What is in this folder

| File | What it is | Who uses it |
|---|---|---|
| `company-profile.md` | The scenario: what the company does, how it is organised, its IT, its suppliers, recent events | the app and the student, as context |
| `questionnaire.md` | The audit questionnaire, 24 questions on NIS2 and ISO/IEC 27001, with the references behind each question | the student; the company would fill it in |
| `questionnaire-answers.md` | The same questionnaire, already filled in by the company's head of IT, as if he had spent a few hours on it | the input the app analyses |

The answer key is not in this folder on purpose: the app and the agent that builds it must
not see it before the analysis. The instructor keeps it in `s5/lab/answer-key/` and hands
it out for the measurement step.

## How the lab uses it

1. The app reads the profile, the questionnaire and the filled-in answers, and shows for
   each question the text of its ISO clauses from `standards/`.
2. For each question it drafts an assessment: met, partly met or gap, with the exact
   sentence from the answers (or the profile) that supports it, the clause it relies on,
   and what to improve.
3. The app checks by itself that every quoted sentence really is in the answers or the
   profile (never in the questions or the standards), and that every clause number exists
   in `standards/`.
4. The auditor (the student) keeps or changes each verdict, confirms it, and downloads the
   report.
5. The drafts are compared with the answer key: how many verdicts match, how many quotes
   failed the check, and how often the app said "met" where the key says "partly met" or
   "gap".

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

Sources with dates: `s5/sources.md`.
