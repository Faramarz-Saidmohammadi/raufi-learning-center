# Security Policy

## Supported version

Security fixes are applied to the current `main` branch. Production deployments should track reviewed commits from that branch.

## Reporting a vulnerability

Do not open a public issue for suspected vulnerabilities, leaked credentials, authentication bypasses, data exposure, or other security-sensitive findings.

Report security concerns privately to the project maintainer with:

- the affected route, component, or workflow;
- reproducible steps;
- expected and observed behaviour;
- impact assessment;
- any relevant logs or screenshots with secrets removed.

Do not include passwords, API keys, database connection strings, session cookies, personal applicant data, or other confidential material in reports.

## Security expectations

Contributors must:

- keep secrets outside the repository;
- use `.env.example` only for non-secret placeholders;
- validate untrusted input on the server;
- preserve authentication and administrator-allowlist checks on protected writes;
- avoid logging credentials, session material, or private admissions notes;
- review dependency changes and generated migration files before merge;
- avoid weakening file-type, file-size, slug-collision, or destructive-action safeguards.

If a credential is accidentally committed, revoke and rotate it immediately. Removing it from the latest commit is not sufficient because it may remain in Git history.
