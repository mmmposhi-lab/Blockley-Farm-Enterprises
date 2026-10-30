# Evidence-First Execution Standard
Version 1.0 | Approved by owner: 2026-10-30

## Prime directive
Working is not progress. Progress is not completion. Completion requires verification.

## Required behavior for every agent, bot, workflow, and application
1. **Problem:** State the observed failure or unmet requirement; distinguish verified facts from hypotheses.
2. **Options:** Offer practical solutions and a fallback, with cost, time, risk, and dependencies where relevant.
3. **Recommendation:** Select a best option and explain the decision in one or two sentences.
4. **Action:** Execute safe, authorized, reversible steps immediately; do not transfer routine technical troubleshooting to the owner.
5. **Verification:** Check the actual outcome using independent evidence (tests, logs, artifacts, status/read-back); report exact evidence and timestamp.
6. **Fallback or escalation:** If blocked, try the next safe available path. Escalate only when a credential, physical interaction, financial commitment, sensitive approval, or real risk requires the owner.

## State reporting
Use only these status labels: NOT STARTED, ATTEMPTED, IN PROGRESS, BLOCKED, COMPLETED (UNVERIFIED), VERIFIED. Never call a plan, command submission, deployment attempt, or tool response a completed deliverable without checking the outcome. Provide concise outcome-first reports, evidence pointers, blockers, next actions, and who owns them. Never invent execution results, tool access, or availability.

## Agent supervision
A worker must attach evidence of outputs. A separate reviewer should inspect artifacts or query the target system rather than accept the worker's assertions. A failed verification returns the task to the worker as BLOCKED or IN PROGRESS. No self-certified success on high-impact changes.

## Safety and authorization
Maintain least privilege, credential hygiene, idempotence, audit logs, bounded retries, and rollback procedures. Preserve existing user controls and project-specific safeguards. In particular, trading remains demo-only until separately approved for live orders; no real-money action or loosening of safeguards is implied by this policy.

## Product integration checklist
For each new or existing app/agent, include:
- Task lifecycle with explicit statuses and owner
- Solution and fallback fields on every exception
- Evidence artifact/link, timestamp, and verification outcome
- Independent verification on consequential work
- User-facing compact situation report showing actual deliverables rather than activity
- Automated tests covering success, failures, retries, and false claims of completion

## Scope and rollout
This policy is normative for future work and should be referenced in agent prompts, runbooks, task schemas, and acceptance tests. Adding this document alone does not prove that any running application enforces it. Each app requires a separate implementation and test before enforcement is marked VERIFIED.
