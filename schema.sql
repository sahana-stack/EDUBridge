-- ====================================================================
-- EDU BRIDGE — SUPABASE DATABASE SCHEMA & SEED MIGRATION SCRIPT
-- AI-Powered Student Academic & Well-Being Platform
-- ====================================================================

-- 1. EXTENSIONS & SCHEMAS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUM TYPES
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('student', 'parent', 'teacher');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role user_role NOT NULL,
    avatar TEXT,
    class_name TEXT,
    dob DATE,
    relationship TEXT,
    linked_student_id TEXT,
    subjects JSONB,
    assigned_classes JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. STUDENTS ROSTER TABLE
CREATE TABLE IF NOT EXISTS students_roster (
    id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    class_name TEXT NOT NULL,
    math_score INT DEFAULT 0,
    phy_score INT DEFAULT 0,
    attendance INT DEFAULT 100,
    status TEXT DEFAULT 'Good Progress',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. SUBJECTS TABLE
CREATE TABLE IF NOT EXISTS subjects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    teacher_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. MARKS TABLE
CREATE TABLE IF NOT EXISTS marks (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    assessment TEXT NOT NULL,
    obtained INT NOT NULL,
    max INT NOT NULL DEFAULT 100,
    assessment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. ATTENDANCE TABLE
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Present', 'Absent', 'Late', 'Excused')),
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, attendance_date)
);

-- 8. ASSIGNMENTS TABLE
CREATE TABLE IF NOT EXISTS assignments (
    id TEXT PRIMARY KEY,
    subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    due_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Completed', 'Overdue')),
    weight TEXT DEFAULT '10%',
    score TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. STUDY SESSIONS TABLE
CREATE TABLE IF NOT EXISTS study_sessions (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    session_date DATE NOT NULL,
    duration_mins INT NOT NULL,
    topic TEXT NOT NULL,
    completion TEXT DEFAULT '100%',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. HEALTH LOGS TABLE
CREATE TABLE IF NOT EXISTS health_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    sleep_hours NUMERIC(4, 1) NOT NULL,
    water_liters NUMERIC(3, 1) NOT NULL,
    exercise_mins INT NOT NULL,
    energy TEXT NOT NULL,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, log_date)
);

-- 11. MOOD LOGS TABLE
CREATE TABLE IF NOT EXISTS mood_logs (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    mood_score INT NOT NULL CHECK (mood_score BETWEEN 1 AND 5),
    stress_score INT NOT NULL CHECK (stress_score BETWEEN 1 AND 5),
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. TEACHER FEEDBACK TABLE
CREATE TABLE IF NOT EXISTS teacher_feedback (
    id TEXT PRIMARY KEY,
    teacher_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    student_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    evidence_text TEXT NOT NULL,
    constructive_advice TEXT NOT NULL,
    feedback_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. PARENT OBSERVATIONS TABLE
CREATE TABLE IF NOT EXISTS parent_observations (
    id TEXT PRIMARY KEY,
    parent_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    student_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    observation_text TEXT NOT NULL,
    support_action_taken TEXT NOT NULL,
    observation_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. MESSAGES TABLE
CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    sender_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sender_name TEXT NOT NULL,
    receiver_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. CONSENT SETTINGS TABLE
CREATE TABLE IF NOT EXISTS consent_settings (
    student_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    parent_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    share_health_logs_with_teacher BOOLEAN DEFAULT FALSE,
    share_mood_summary_with_parent BOOLEAN DEFAULT TRUE,
    share_parent_observations_with_teacher BOOLEAN DEFAULT TRUE,
    ai_recommendation_engine_active BOOLEAN DEFAULT TRUE,
    last_updated DATE DEFAULT CURRENT_DATE
);

-- 16. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    user_info TEXT NOT NULL,
    action TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students_roster ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow anonymous access for EduBridge client app state sync (Demo/Prototype mode)
DROP POLICY IF EXISTS "Allow public read access on users" ON users;
DROP POLICY IF EXISTS "Allow public all access on users" ON users;
CREATE POLICY "Allow public all access on users" ON users FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow public read access on students_roster" ON students_roster;
DROP POLICY IF EXISTS "Allow public all access on students_roster" ON students_roster;
CREATE POLICY "Allow public all access on students_roster" ON students_roster FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow public read access on subjects" ON subjects;
DROP POLICY IF EXISTS "Allow public all access on subjects" ON subjects;
CREATE POLICY "Allow public all access on subjects" ON subjects FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow public all access on marks" ON marks;
CREATE POLICY "Allow public all access on marks" ON marks FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow public all access on attendance" ON attendance;
CREATE POLICY "Allow public all access on attendance" ON attendance FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow public all access on assignments" ON assignments;
CREATE POLICY "Allow public all access on assignments" ON assignments FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow public all access on study_sessions" ON study_sessions;
CREATE POLICY "Allow public all access on study_sessions" ON study_sessions FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow public all access on health_logs" ON health_logs;
CREATE POLICY "Allow public all access on health_logs" ON health_logs FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow public all access on mood_logs" ON mood_logs;
CREATE POLICY "Allow public all access on mood_logs" ON mood_logs FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow public all access on teacher_feedback" ON teacher_feedback;
CREATE POLICY "Allow public all access on teacher_feedback" ON teacher_feedback FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow public all access on parent_observations" ON parent_observations;
CREATE POLICY "Allow public all access on parent_observations" ON parent_observations FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow public all access on messages" ON messages;
CREATE POLICY "Allow public all access on messages" ON messages FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow public all access on consent_settings" ON consent_settings;
CREATE POLICY "Allow public all access on consent_settings" ON consent_settings FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow public all access on audit_logs" ON audit_logs;
CREATE POLICY "Allow public all access on audit_logs" ON audit_logs FOR ALL USING (true);

-- Enable Realtime for live updates across Student, Parent, and Teacher sessions (Safe block)
DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE marks, mood_logs, messages, teacher_feedback, parent_observations;
EXCEPTION
    WHEN duplicate_object THEN null;
    WHEN undefined_object THEN null;
    WHEN OTHERS THEN null;
END $$;

-- ====================================================================
-- INITIAL MOCK SEED DATA INSERTIONS
-- ====================================================================

INSERT INTO users (id, name, email, role, avatar, class_name, dob, relationship, linked_student_id, subjects, assigned_classes)
VALUES 
  ('STU-1001', 'Alex Morgan', 'alex.morgan@edubridge.edu', 'student', 'AM', 'Grade 10-A', '2010-04-12', NULL, NULL, NULL, NULL),
  ('PAR-2001', 'Sarah Morgan', 'sarah.m@gmail.com', 'parent', 'SM', NULL, NULL, 'Mother', 'STU-1001', NULL, NULL),
  ('TCH-3001', 'Dr. Robert Vance', 'r.vance@edubridge.edu', 'teacher', 'RV', NULL, NULL, NULL, NULL, '["Mathematics", "Physics"]'::jsonb, '["Grade 10-A", "Grade 10-B"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO students_roster (id, name, class_name, math_score, phy_score, attendance, status)
VALUES
  ('STU-1001', 'Alex Morgan', 'Grade 10-A', 62, 85, 94, 'Needs Practice')
ON CONFLICT (id) DO NOTHING;

INSERT INTO subjects (id, name, code, teacher_name)
VALUES
  ('SUB-101', 'Mathematics', 'MATH-10', 'Dr. Robert Vance'),
  ('SUB-102', 'Physics', 'PHY-10', 'Dr. Robert Vance'),
  ('SUB-103', 'Chemistry', 'CHEM-10', 'Prof. Elena Rostova'),
  ('SUB-104', 'English Literature', 'ENG-10', 'Ms. Clara Oswald'),
  ('SUB-105', 'Computer Science', 'CS-10', 'Mr. Alan Turing')
ON CONFLICT (id) DO NOTHING;

INSERT INTO marks (id, student_id, subject_id, assessment, obtained, max, assessment_date)
VALUES
  ('M-1', 'STU-1001', 'SUB-101', 'Unit Test 1', 88, 100, '2026-08-15'),
  ('M-2', 'STU-1001', 'SUB-101', 'Unit Test 2', 74, 100, '2026-09-02'),
  ('M-3', 'STU-1001', 'SUB-101', 'Midterm Exam', 62, 100, '2026-09-22'),
  ('M-4', 'STU-1001', 'SUB-102', 'Unit Test 1', 92, 100, '2026-08-18'),
  ('M-5', 'STU-1001', 'SUB-102', 'Midterm Exam', 85, 100, '2026-09-24'),
  ('M-6', 'STU-1001', 'SUB-103', 'Midterm Exam', 79, 100, '2026-09-20'),
  ('M-7', 'STU-1001', 'SUB-104', 'Midterm Exam', 94, 100, '2026-09-21'),
  ('M-8', 'STU-1001', 'SUB-105', 'Midterm Exam', 96, 100, '2026-09-25')
ON CONFLICT (id) DO NOTHING;

INSERT INTO assignments (id, subject_id, title, due_date, status, weight, score)
VALUES
  ('A-1', 'SUB-101', 'Quadratic Equations Practice Set', '2026-10-02', 'Pending', '10%', NULL),
  ('A-2', 'SUB-102', 'Kinematics Lab Report', '2026-10-05', 'Pending', '15%', NULL),
  ('A-3', 'SUB-103', 'Periodic Table Trends Essay', '2026-09-26', 'Completed', '10%', '95/100'),
  ('A-4', 'SUB-105', 'Python Recursion Program', '2026-09-28', 'Completed', '20%', '98/100')
ON CONFLICT (id) DO NOTHING;

INSERT INTO study_sessions (id, student_id, subject_id, session_date, duration_mins, topic, completion)
VALUES
  ('S-1', 'STU-1001', 'SUB-101', '2026-09-26', 45, 'Quadratic Formula Derivation', '80%'),
  ('S-2', 'STU-1001', 'SUB-102', '2026-09-27', 60, 'Newton Laws Numerical Problems', '100%'),
  ('S-3', 'STU-1001', 'SUB-105', '2026-09-28', 50, 'Binary Search Implementation', '100%'),
  ('S-4', 'STU-1001', 'SUB-101', '2026-09-29', 30, 'Algebra Factoring', '50%')
ON CONFLICT (id) DO NOTHING;

INSERT INTO mood_logs (id, student_id, log_date, mood_score, stress_score, note)
VALUES
  ('ML-1', 'STU-1001', '2026-09-27', 4, 2, 'Good day overall, finished CS task'),
  ('ML-2', 'STU-1001', '2026-09-28', 2, 4, 'Worried about upcoming Math test'),
  ('ML-3', 'STU-1001', '2026-09-29', 2, 5, 'Felt overwhelmed by formulas'),
  ('ML-4', 'STU-1001', '2026-09-30', 3, 3, 'Felt better after talking to mom')
ON CONFLICT (id) DO NOTHING;

INSERT INTO teacher_feedback (id, teacher_id, student_id, subject_id, category, evidence_text, constructive_advice, feedback_date)
VALUES
  ('TF-1', 'TCH-3001', 'STU-1001', 'SUB-101', 'Academic Progress', 'Scored 88% in Unit Test 1, but dropped to 62% in Midterm.', 'Focus on polynomial factoring fundamentals. Recommend 30 mins daily practice.', '2026-09-23')
ON CONFLICT (id) DO NOTHING;

INSERT INTO parent_observations (id, parent_id, student_id, category, observation_text, support_action_taken, observation_date)
VALUES
  ('PO-1', 'PAR-2001', 'STU-1001', 'Home Routine & Discipline', 'Alex studied for 1.5 hours at home on Tuesday. Screen time past 11:00 PM on Wednesday.', 'Discussed setting phone aside at 10:00 PM on school nights.', '2026-09-29')
ON CONFLICT (id) DO NOTHING;

INSERT INTO consent_settings (student_id, parent_id, share_health_logs_with_teacher, share_mood_summary_with_parent, share_parent_observations_with_teacher, ai_recommendation_engine_active, last_updated)
VALUES
  ('STU-1001', 'PAR-2001', false, true, true, true, '2026-09-01')
ON CONFLICT (student_id) DO NOTHING;
