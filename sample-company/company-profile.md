# Beispiel IT-Services GmbH: company profile

> Fictional company for a training exercise. All names, people, addresses, domains and
> figures are invented.

## At a glance

| Item | Value |
|---|---|
| Legal form | GmbH (limited liability company), Germany |
| Business | Managed IT services for small and medium-sized businesses (a managed service provider, MSP) |
| Employees | 80 (on 1 September 2026) |
| Annual turnover | EUR 12 million (2025) |
| Customers | about 140 businesses in Germany, most with 10 to 200 employees |
| Website | www.beispiel-it.example |
| Public IP range | 198.51.100.0/27 |
| Managing director | Anna Keller |
| Head of IT operations, also information security officer (part-time) | Jonas Weber |
| Data protection officer | an external service provider, under contract since 2023 |

## What the company does

- **Managed workplace:** sets up and supports laptops, Microsoft 365 tenants and printers
  for its customers.
- **Managed servers and backup:** monitors, patches and backs up customer servers.
- **Remote monitoring and management (RMM):** a cloud-hosted RMM platform, bought as a
  service from a US vendor, runs as an agent on about 6,000 customer devices. Technicians
  use it to deploy patches, run scripts and connect remotely to customer machines.
- **Helpdesk:** staffed from 7:00 to 19:00 on working days; one technician is on call at
  night and at weekends.

## Organisation

- Managing director: Anna Keller.
- Four team leads: service desk, field service, systems, projects.
- 58 technicians, 16 people in sales and administration, and Jonas Weber, who reports to
  the managing director. About a fifth of his working time goes to information security.
- Three freelance technicians cover the night and weekend on-call shifts in rotation.
  Their contracts date from 2022.

## The company's own IT

- Microsoft 365 for email, Teams and SharePoint.
- A ticketing and contract system bought as a service, hosted in the EU.
- The RMM platform described above. Whoever controls it can reach every managed customer
  device.
- A password manager with a team vault. The vault holds the administrator passwords of
  customer systems.
- Office network: one firewall and separate networks (VLANs) for the office, guests, and
  management. Technicians reach customer systems through a jump host in the management
  network.
- VPN for remote work.
- Backups: the company's servers and the customer servers it manages are backed up every
  night to an appliance in the office and copied to an EU cloud backup provider.
- 74 company laptops with Windows 11.

## How the three freelancers connect

The freelancers log in to the company VPN with a username and password. Their VPN
accounts are not covered by multi-factor authentication, because the VPN appliance's MFA
licence covers employee accounts only.

## Suppliers that matter

| Supplier | What it provides | Contract |
|---|---|---|
| RMM platform vendor (US) | remote management of all customer devices | the vendor's standard online terms, monthly subscription |
| Microsoft | Microsoft 365 | standard terms, through a distributor |
| EU cloud backup provider | offsite copies of all backups | standard terms |
| Ticketing service (EU) | tickets and customer contracts | standard terms |
| Internet provider | two fibre lines | business contract |
| Three freelance technicians | night and weekend on-call | freelance contracts from 2022 |

## Recent events

- **April 2025:** switched to the current RMM platform, mainly because the licence was
  cheaper.
- **14 January 2026:** the managing director approved version 2.0 of the Information
  Security Policy.
- **12 March 2026:** version 1.3 of the Incident Response Procedure was approved.
- **March 2026:** a phishing email led to one employee's Microsoft 365 account being taken
  over. An "impossible travel" alert from Microsoft 365 flagged it after about two hours;
  the password was reset and all sessions revoked. No customer impact was found.
- **4 June 2026:** tabletop exercise with the scenario "ransomware at a customer".
- **30 September 2026:** Jonas Weber filled in the audit questionnaire
  (`questionnaire-answers.md`).

## NIS2 status: the assumption for this exercise

The company provides managed IT services to other businesses ("ICT service management
(business-to-business)" in Annex I of NIS2), has 80 employees and EUR 12 million turnover,
which makes it a medium-sized enterprise. For this exercise, assume that:

- it is an important entity under NIS2 and under the German BSI Act (BSIG);
- Commission Implementing Regulation (EU) 2024/2690 applies to it as a managed service
  provider.

This is an assumption of the scenario, not a legal assessment. The company is not
certified to ISO/IEC 27001; the managing director is considering certification in 2027.
