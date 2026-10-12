# NIS2 and ISO/IEC 27001 readiness questionnaire

> Training material. Questions written for the AI for Cybersecurity course; they are not an
> official questionnaire of any authority.

**For the person answering:** answer every question in plain words. Name the document or
record that proves your answer (title, version, date, where it is stored). If something is
planned but not done yet, say so: a plan is not the same as a measure in place.

**References after each question:**
- **NIS2** means Directive (EU) 2022/2555.
- **2024/2690 Annex x.y** means a section of the Annex to Commission Implementing
  Regulation (EU) 2024/2690.
- **BSIG** means the German BSI Act.
- **ISO** lists clause and control numbers of ISO/IEC 27001:2022, taken from ENISA's
  mapping table (version 1.2) for the 2024/2690 sections named. A plain number such as 6.1.2
  is a clause; a number with A, such as A.8.13, is a control from Annex A. "None" means that
  the requirement has no row in that table.

## Governance

### Q01. Management approval
- **Question:** Has management formally approved the information security policy and the
  cybersecurity risk-management measures? When, and by whom?
- **An auditor will ask to see:** the approved policy with its approval date and signature.
- **References:** NIS2 Art. 20(1); 2024/2690 Annex 1.1.1 (k), 1.1.2; BSIG § 38(1);
  ISO 5.2, A.5.1, A.5.36, A.5.4, 9.3.

### Q02. Management oversight
- **Question:** How does management oversee the implementation of these measures? Who
  reports to management on security, how often, and in what form?
- **An auditor will ask to see:** management reports or meeting minutes with security topics.
- **References:** NIS2 Art. 20(1); 2024/2690 Annex 1.2.3; BSIG § 38(1);
  ISO 5.3, A.5.2, A.5.3, A.5.4.

### Q03. Management training
- **Question:** Have the members of management completed cybersecurity training? When,
  and on what?
- **An auditor will ask to see:** training certificates or attendance records.
- **References:** NIS2 Art. 20(2); BSIG § 38(3); ISO: none.

## Policies and risk analysis (NIS2 Art. 21(2)(a))

### Q04. Topic-specific policies
- **Question:** Which topic-specific security policies exist besides the main information
  security policy, and when were they last reviewed?
- **An auditor will ask to see:** the list of policies with versions and review dates.
- **References:** NIS2 Art. 21(2)(a); 2024/2690 Annex 1.1.1 (i);
  ISO 5.2, A.5.1, A.5.36, A.5.4, 9.3.

### Q05. Risk assessment
- **Question:** How do you identify and assess security risks? When was the last risk
  assessment, and does every risk have an owner?
- **An auditor will ask to see:** the risk register and the date of the last update.
- **References:** NIS2 Art. 21(2)(a); 2024/2690 Annex 2.1; ISO 6.1, 6.1.2, 6.1.3, 6.2, 8.2,
  8.3, A.5.7, A.5.19, A.5.20, A.5.21.

## Incident handling (NIS2 Art. 21(2)(b) and Art. 23)

### Q06. Incident handling procedure
- **Question:** Is there a documented procedure for detecting, classifying, handling and
  documenting incidents? Has it been tested?
- **An auditor will ask to see:** the procedure, the on-call rota, an exercise or incident
  report.
- **References:** NIS2 Art. 21(2)(b); 2024/2690 Annex 3.1, 3.4, 3.5, 3.6;
  ISO A.5.24, A.5.25, A.5.26, A.5.27.

### Q07. Reporting to authorities
- **Question:** How and within what deadlines would you report a significant incident to
  the authorities?
- **An auditor will ask to see:** the reporting step in the procedure, with deadlines and
  contacts.
- **References:** NIS2 Art. 23(4); BSIG § 32; ISO: none.

### Q08. Logging and monitoring
- **Question:** Which systems log security events, how long are logs kept, and who reviews
  them and how often?
- **An auditor will ask to see:** log sources, retention settings, review records.
- **References:** 2024/2690 Annex 3.2; ISO A.5.28, A.8.15, A.8.16, A.8.17.

## Business continuity, backup and crisis management (NIS2 Art. 21(2)(c))

### Q09. Backups and restore tests
- **Question:** What is backed up, how often, where, and how are the copies protected?
  When did you last test restoring a complete system?
- **An auditor will ask to see:** backup configuration, restore test records.
- **References:** NIS2 Art. 21(2)(c); 2024/2690 Annex 4.2; ISO A.8.13, A.8.14.

### Q10. Business continuity and disaster recovery plan
- **Question:** Is there a written business continuity and disaster recovery plan? When was
  it last tested?
- **An auditor will ask to see:** the plan and test records.
- **References:** NIS2 Art. 21(2)(c); 2024/2690 Annex 4.1; ISO A.5.29, A.5.30.

### Q11. Crisis management and emergency communication
- **Question:** Who decides in a crisis, and how do you communicate if your normal email
  and chat are down?
- **An auditor will ask to see:** crisis roles, emergency contact channels.
- **References:** NIS2 Art. 21(2)(c) and (j); 2024/2690 Annex 4.3;
  ISO A.5.26, A.5.29, A.5.30.

## Supply chain (NIS2 Art. 21(2)(d))

### Q12. Supplier register
- **Question:** Which suppliers and service providers are critical for your security? Is
  there a register that shows this?
- **An auditor will ask to see:** the supplier register with criticality.
- **References:** NIS2 Art. 21(2)(d); 2024/2690 Annex 5.2; ISO A.5.22.

### Q13. Supplier security
- **Question:** How do you assess and contractually require the security of key suppliers,
  for example the vendor of your remote management platform?
- **An auditor will ask to see:** supplier assessments, security clauses in contracts.
- **References:** NIS2 Art. 21(2)(d) and 21(3); 2024/2690 Annex 5.1;
  ISO A.5.19, A.5.20, A.5.21, A.8.30.

## Acquisition, development and maintenance (NIS2 Art. 21(2)(e))

### Q14. Patch management
- **Question:** Within what time are security updates installed, on your own systems and on
  the customer devices you manage? How do you know it happened?
- **An auditor will ask to see:** the patch policy and recent patch reports.
- **References:** NIS2 Art. 21(2)(e); 2024/2690 Annex 6.6, 6.10; ISO A.8.31, A.8.32, A.8.8.

### Q15. Vulnerability disclosure
- **Question:** How can someone outside the company report a vulnerability to you, and what
  happens with such a report?
- **An auditor will ask to see:** a published reporting channel and the handling procedure.
- **References:** NIS2 Art. 21(2)(e); 2024/2690 Annex 6.10; ISO A.8.8.

### Q16. Network security and segmentation
- **Question:** How is your network protected and divided, especially the systems used to
  administer customer environments?
- **An auditor will ask to see:** the network plan and firewall rules.
- **References:** NIS2 Art. 21(2)(e); 2024/2690 Annex 6.7, 6.8; ISO A.8.16, A.8.20, A.8.22.

## Effectiveness of the measures (NIS2 Art. 21(2)(f))

### Q17. Checking that the measures work
- **Question:** How do you check that your security measures are effective? When was the
  last internal audit or independent review?
- **An auditor will ask to see:** audit reports, measurements, management review records.
- **References:** NIS2 Art. 21(2)(f); 2024/2690 Annex 7, 2.2, 2.3; ISO 6.2, 9.1, 9.2, 9.3,
  10.1, A.5.31, A.5.35, A.5.36, A.8.34.

## Cyber hygiene and training (NIS2 Art. 21(2)(g))

### Q18. Security awareness and training
- **Question:** How are employees trained on security, how often, and what share of them
  completed the training this year?
- **An auditor will ask to see:** the training plan and completion records.
- **References:** NIS2 Art. 21(2)(g); 2024/2690 Annex 8.1, 8.2; ISO 7.2, 7.3, A.6.3, A.8.7.

## Cryptography (NIS2 Art. 21(2)(h))

### Q19. Encryption
- **Question:** Which data is encrypted at rest and in transit, for example on laptops? Is
  there a cryptography policy and a procedure for managing keys?
- **An auditor will ask to see:** the policy and the encryption status of devices.
- **References:** NIS2 Art. 21(2)(h); 2024/2690 Annex 9; ISO A.5.31, A.8.24.

## People, access and assets (NIS2 Art. 21(2)(i))

### Q20. Joiners and leavers
- **Question:** What checks happen before someone starts, and how is access removed when
  someone leaves?
- **An auditor will ask to see:** the joiner and leaver process and its records.
- **References:** NIS2 Art. 21(2)(i); 2024/2690 Annex 10.1, 10.2, 10.3;
  ISO 7.1, 7.2, A.6.1, A.6.2, A.6.3, A.6.5.

### Q21. Privileged accounts
- **Question:** How are administrator accounts managed, including accounts with access to
  customer environments? When were administrator rights last reviewed?
- **An auditor will ask to see:** the list of privileged accounts and the last review.
- **References:** NIS2 Art. 21(2)(i); 2024/2690 Annex 11.2, 11.3;
  ISO A.5.3, A.5.18, A.8.2, A.8.18.

### Q22. Asset inventory
- **Question:** Is there a complete and current inventory of hardware, software and other
  assets, including the credentials you hold for customers?
- **An auditor will ask to see:** the inventory and how it is kept up to date.
- **References:** NIS2 Art. 21(2)(i); 2024/2690 Annex 12.4; ISO A.5.9.

## Authentication (NIS2 Art. 21(2)(j))

### Q23. Multi-factor authentication
- **Question:** Where is multi-factor authentication enforced? Are there accounts or access
  paths without it?
- **An auditor will ask to see:** MFA policies in the systems, a list of exceptions.
- **References:** NIS2 Art. 21(2)(j); 2024/2690 Annex 11.7; ISO A.8.5.

## Germany

### Q24. Registration with the BSI
- **Question:** Has the company registered with the BSI under the BSI Act?
- **An auditor will ask to see:** the registration confirmation.
- **References:** BSIG § 33; ISO: none.
