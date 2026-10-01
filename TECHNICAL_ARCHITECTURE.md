# EDU BRIDGE — MASTER ARCHITECTURAL & DESIGN DOCUMENTATION
### AI-Powered Student Academic & Well-Being Platform

---

## 1. EXECUTIVE OVERVIEW & SYSTEM VISION

**EduBridge** is a secure, role-based web application engineered to unite academic performance tracking, daily study planning, routine health habits, and mental well-being check-ins into one integrated decision-support platform.

### What We Are Building
We are building a unified ecosystem designed around **three core user roles**:
1. **Student (Alex Morgan)** — Primary beneficiary who tracks marks, records study hours, sets daily goals, logs lifestyle metrics (sleep, hydration, activity), completes mood check-ins, and receives AI study schedules.
2. **Parent (Sarah Morgan)** — Monitor and caregiver who views child academic trends, records home routine observations (study discipline, screen habits), manages privacy/consent settings, and communicates directly with teachers.
3. **Teacher (Dr. Robert Vance)** — Academic evaluator and classroom observer who enters official marks, tracks attendance, records evidence-based classroom observations, provides subject practice feedback, and reviews AI academic summaries.

> **CRITICAL ARCHITECTURAL DIRECTIVE:**  
> The system operates strictly across these **three user roles** (Student ↔ Parent ↔ Teacher). There is **NO Administrator role, login, dashboard, or endpoint** in the core application logic.

---

## 2. ARCHITECTURAL & TECHNOLOGY DECISIONS

### System Architecture Diagram
```mermaid
graph TD
    subgraph Client Layer [Frontend Presentation - Responsive SPA]
        S_UI["Student Portal (Alex)"]
        P_UI["Parent Portal (Sarah)"]
        T_UI["Teacher Portal (Dr. Vance)"]
    end

    subgraph Security & Access Control [RBAC & Privacy Boundary]
        AUTH["Role Switcher & RBAC Controller"]
        CONSENT["DPDP 2023 Consent Manager"]
        AUDIT["Audit & Compliance Logger"]
    end

    subgraph Application & AI Engine [Business & Analytics Layer]
        ACAD_SRV["Academic & Marks Engine"]
        STUDY_SRV["Study & Planner Generator"]
        HEALTH_SRV["Health & Routine Tracker"]
        WELL_SRV["Well-Being & Mood Engine"]
        AI_ENGINE["Explainable AI Decision Engine"]
    end

    subgraph Data Store [Centralized Persistence]
        DB[("EduBridge Data Store / LocalStorage")]
    end

    S_UI <--> AUTH
    P_UI <--> AUTH
    T_UI <--> AUTH

    AUTH --> CONSENT
    AUTH --> AUDIT

    CONSENT --> ACAD_SRV
    CONSENT --> STUDY_SRV
    CONSENT --> HEALTH_SRV
    CONSENT --> WELL_SRV

    ACAD_SRV <--> DB
    STUDY_SRV <--> DB
    HEALTH_SRV <--> DB
    WELL_SRV <--> DB

    AI_ENGINE <--> DB
    AI_ENGINE --> S_UI
    AI_ENGINE --> P_UI
    AI_ENGINE --> T_UI
```

### Why This Architecture Was Selected
1. **Role-Based Decoupling**: Each portal view renders only the permitted components and data fields assigned to that active role.
2. **Explainable AI (XAI)**: Rather than opaque "black-box" machine learning predictions, the AI module utilizes deterministic rule engines with explicit **evidence traces** (e.g., *"Math score dropped by 26% over 2 tests while study hours were 0 for 3 days"*).
3. **Data Minimization & Privacy by Design**: Sensitive health and mood data are protected by explicit parental consent switches.

---

## 3. DATABASE SCHEMAS & ENTITY RELATIONSHIPS

```mermaid
erDiagram
    USERS ||--o{ STUDENTS : "is-a"
    USERS ||--o{ PARENTS : "is-a"
    USERS ||--o{ TEACHERS : "is-a"

    STUDENTS ||--o{ MARKS : "evaluated-in"
    STUDENTS ||--o{ ATTENDANCE : "recorded-for"
    STUDENTS ||--o{ ASSIGNMENTS : "assigned-to"
    STUDENTS ||--o{ STUDY_SESSIONS : "logs"
    STUDENTS ||--o{ HEALTH_LOGS : "records"
    STUDENTS ||--o{ MOOD_LOGS : "check-in"
    STUDENTS ||--o{ TEACHER_FEEDBACK : "receives"
    STUDENTS ||--o{ PARENT_OBSERVATIONS : "observed-at-home"

    PARENTS ||--|| STUDENTS : "linked-to"
    TEACHERS ||--o{ STUDENTS : "teaches"
    SUBJECTS ||--o{ MARKS : "categorizes"

    USERS {
        string user_id PK
        string name
        string email
        string role "STUDENT | PARENT | TEACHER"
    }

    MARKS {
        string mark_id PK
        string student_id FK
        string subject_id FK
        string assessment
        int obtained
        int max
        date date
    }

    STUDY_SESSIONS {
        string session_id PK
        string student_id FK
        string subject_id FK
        int duration_mins
        string topic
        date date
    }

    HEALTH_LOGS {
        date date PK
        string student_id FK
        float sleep_hours
        float water_liters
        int exercise_mins
        string note
    }

    MOOD_LOGS {
        string mood_id PK
        string student_id FK
        int mood_score "1 to 5"
        int stress_score "1 to 5"
        string note
        date date
    }
```

---

## 4. DATA FLOW & AI DECISION MECHANICS

### Data Flow for AI Early Support Alerts

```mermaid
sequenceDiagram
    autonumber
    participant T as Teacher / System
    participant DB as Data Store
    participant AI as AI Decision Engine
    participant P as Parent Portal (Sarah)
    participant S as Student Portal (Alex)

    T->>DB: Uploads Midterm Exam Score (Math: 62%)
    S->>DB: Logs Mood & Stress Check-in (Stress: Level 4)
    DB->>AI: Trigger Pattern Analysis Scanner
    AI->>AI: Scan Academic Trend (Math -26%) + Stress Level (4/5)
    AI->>AI: Match Early Support Rule Threshold (Multi-factor)
    AI->>DB: Store Explainable Alert with Evidence Base
    AI->>P: Render Proactive Support Notification
    AI->>S: Suggest 30-min Factoring Practice & AI Daily Schedule
```

### Explainable AI Recommendation Rules

The AI Decision Engine evaluates data according to four transparent rules:

1. **Academic Drop Rule**:
   $$\Delta M = M_{\text{previous}} - M_{\text{latest}}$$
   If $\Delta M \ge 15\%$, generate targeted practice recommendation for that subject with evidence trace showing test names and scores.

2. **Sleep Routine Rule**:
   If sleep duration $< 6.5 \text{ hours}$ for $\ge 2$ consecutive nights, generate a bedtime rest recommendation emphasizing memory retention.

3. **Multi-Factor Support Alert Rule**:
   If $(\text{Stress Score} \ge 4) \land (\text{Pending Tasks} \ge 2) \land (\text{Academic Drop} \ge 15\%)$, generate a **Proactive Early-Support Flag** for Parent and Teacher review.

4. **Daily Timetable Generator Algorithm**:
   Allocates study time blocks into 40% focus subject, 15% active hydration rest break, 35% pending assignment execution, and 10% daily reflection.

---

## 5. PRIVACY, ETHICS & COMPLIANCE

1. **Digital Personal Data Protection (DPDP) Act 2023 Alignment**:
   - Parent consent switches control whether health data and home observations are visible to teachers.
   - All sensitive entries (mood, health) have restricted access rights.
2. **Non-Clinical & Non-Diagnostic Guarantee**:
   - The platform strictly avoids clinical medical or psychological diagnosis.
   - All AI output uses supportive, non-labeling terminology (*"proactive support suggested"*, never *"bad student"* or *"lazy"*).
3. **Evidence-Based Observations**:
   - Teachers are guided to enter observable evidence (*"Submitted 2 assignments late"*) rather than subjective labels.
4. **Auditability**:
   - Every score upload, consent policy update, and recommendation generation is logged in a non-repudiable audit ledger.

---

## 6. SYSTEM IMPLEMENTATION STATUS

The EduBridge platform has been completely implemented and deployed locally at `http://localhost:8000`:
- `index.html` — Full responsive single-page web app layout.
- `css/styles.css` — High-end cyber/dark glassmorphic UI design system.
- `js/data.js` — Reactive data store with LocalStorage persistence and initial seed database.
- `js/ai-engine.js` — Explainable AI recommendation engine and smart daily scheduler.
- `js/app.js` — Role controller, tab navigation, Chart.js visualizations, and interactive modals.
