# Site Performance Scoring — Current Scope

For now we score each site on **3 pillars**, combined into a single score out of 100.

| Pillar | What we measure | How we calculate |
|---|---|---|
| **Recruitment** | Is the site enrolling enough patients? | `enrolled / target` (capped at 100%) |
| **Compliance** | Are visits done on time, per protocol? | `visitsInWindow / totalVisits` |
| **Retention** | Are patients staying in the trial? | `1 − (withdrawn + dropouts) / enrolled` |

**Final score** = weighted average of the three pillars → shown as a 0–100 site score.

---

## What each pillar considers (in detail)

### 1. Recruitment
How well the site brings patients into the trial.
- **Enrollment vs target** — how many enrolled out of the goal
- **Enrollment speed** — patients per month vs the planned rate
- **Screen-fail rate** — how many screened patients fail to qualify (high = poor screening)

### 2. Compliance
How closely the site follows the protocol.
- **Visit-window compliance** — visits done within the allowed time window
- **Overdue visits** — visits missed or past their due date
- **Protocol deviations** — any steps not done as per protocol

### 3. Retention
How well the site keeps patients till the end.
- **Withdrawals** — patients who choose to quit
- **Dropouts / lost to follow-up** — patients who stop showing up
- **Completion** — patients who stay through to trial end

---

## How scoring works
1. Each factor is converted to a **0–100 score** against an agreed best/worst target.
2. Factors are combined into a **pillar score**.
3. Pillars are combined by weight into the **final site score (0–100)**.
4. If a site has too few patients, it shows **"Insufficient data"** instead of a misleading score.

> Note: Data Quality, Safety, and Infrastructure are planned for later — not scored yet.
