/* EduBridge - Central Data Store & Comprehensive Initial Mock Database */

const INITIAL_STATE = {
  currentUserRole: 'student', // 'student' | 'parent' | 'teacher'
  
  users: {
    student: {
      id: 'STU-1001',
      name: 'Alex Morgan',
      email: 'alex.morgan@edubridge.edu',
      avatar: 'AM',
      class: 'Grade 10-A',
      dob: '2010-04-12',
      parentId: 'PAR-2001',
      teacherIds: ['TCH-3001', 'TCH-3002']
    },
    parent: {
      id: 'PAR-2001',
      name: 'Sarah Morgan',
      email: 'sarah.m@gmail.com',
      avatar: 'SM',
      relationship: 'Mother',
      linkedStudentId: 'STU-1001'
    },
    teacher: {
      id: 'TCH-3001',
      name: 'Dr. Robert Vance',
      email: 'r.vance@edubridge.edu',
      avatar: 'RV',
      subjects: ['Mathematics', 'Physics'],
      assignedClasses: ['Grade 10-A', 'Grade 10-B']
    }
  },

  studentsRoster: [
    { id: 'STU-1001', name: 'Alex Morgan', class: 'Grade 10-A', mathScore: 62, phyScore: 85, attendance: 94, status: 'Needs Practice' },
    { id: 'STU-1002', name: 'David Kim', class: 'Grade 10-A', mathScore: 58, phyScore: 72, attendance: 88, status: 'Needs Practice' },
    { id: 'STU-1003', name: 'Emma Watson', class: 'Grade 10-A', mathScore: 94, phyScore: 96, attendance: 98, status: 'Exceeding' }
  ],

  subjects: [
    { id: 'SUB-101', name: 'Mathematics', code: 'MATH-10', teacher: 'Dr. Robert Vance' },
    { id: 'SUB-102', name: 'Physics', code: 'PHY-10', teacher: 'Dr. Robert Vance' },
    { id: 'SUB-103', name: 'Chemistry', code: 'CHEM-10', teacher: 'Prof. Elena Rostova' },
    { id: 'SUB-104', name: 'English Literature', code: 'ENG-10', teacher: 'Ms. Clara Oswald' },
    { id: 'SUB-105', name: 'Computer Science', code: 'CS-10', teacher: 'Mr. Alan Turing' }
  ],

  marks: [
    { id: 'M-1', studentId: 'STU-1001', subjectId: 'SUB-101', assessment: 'Unit Test 1', obtained: 88, max: 100, date: '2026-08-15' },
    { id: 'M-2', studentId: 'STU-1001', subjectId: 'SUB-101', assessment: 'Unit Test 2', obtained: 74, max: 100, date: '2026-09-02' },
    { id: 'M-3', studentId: 'STU-1001', subjectId: 'SUB-101', assessment: 'Midterm Exam', obtained: 62, max: 100, date: '2026-09-22' },
    { id: 'M-4', studentId: 'STU-1001', subjectId: 'SUB-102', assessment: 'Unit Test 1', obtained: 92, max: 100, date: '2026-08-18' },
    { id: 'M-5', studentId: 'STU-1001', subjectId: 'SUB-102', assessment: 'Midterm Exam', obtained: 85, max: 100, date: '2026-09-24' },
    { id: 'M-6', studentId: 'STU-1001', subjectId: 'SUB-103', assessment: 'Midterm Exam', obtained: 79, max: 100, date: '2026-09-20' },
    { id: 'M-7', studentId: 'STU-1001', subjectId: 'SUB-104', assessment: 'Midterm Exam', obtained: 94, max: 100, date: '2026-09-21' },
    { id: 'M-8', studentId: 'STU-1001', subjectId: 'SUB-105', assessment: 'Midterm Exam', obtained: 96, max: 100, date: '2026-09-25' },
    { id: 'M-9', studentId: 'STU-1002', subjectId: 'SUB-101', assessment: 'Midterm Exam', obtained: 58, max: 100, date: '2026-09-22' },
    { id: 'M-10', studentId: 'STU-1003', subjectId: 'SUB-101', assessment: 'Midterm Exam', obtained: 94, max: 100, date: '2026-09-22' }
  ],

  attendance: [
    { date: '2026-09-22', status: 'Present' },
    { date: '2026-09-23', status: 'Present' },
    { date: '2026-09-24', status: 'Absent', reason: 'Fever' },
    { date: '2026-09-25', status: 'Present' },
    { date: '2026-09-26', status: 'Present' },
    { date: '2026-09-27', status: 'Present' },
    { date: '2026-09-28', status: 'Present' },
    { date: '2026-09-29', status: 'Present' },
    { date: '2026-09-30', status: 'Present' }
  ],

  assignments: [
    { id: 'A-1', subjectId: 'SUB-101', title: 'Quadratic Equations Practice Set', dueDate: '2026-10-02', status: 'Pending', weight: '10%' },
    { id: 'A-2', subjectId: 'SUB-102', title: 'Kinematics Lab Report', dueDate: '2026-10-05', status: 'Pending', weight: '15%' },
    { id: 'A-3', subjectId: 'SUB-103', title: 'Periodic Table Trends Essay', dueDate: '2026-09-26', status: 'Completed', score: '95/100', weight: '10%' },
    { id: 'A-4', subjectId: 'SUB-105', title: 'Python Recursion Program', dueDate: '2026-09-28', status: 'Completed', score: '98/100', weight: '20%' }
  ],

  studySessions: [
    { id: 'S-1', date: '2026-09-26', subjectId: 'SUB-101', duration: 45, topic: 'Quadratic Formula Derivation', completion: '80%' },
    { id: 'S-2', date: '2026-09-27', subjectId: 'SUB-102', duration: 60, topic: 'Newton Laws Numerical Problems', completion: '100%' },
    { id: 'S-3', date: '2026-09-28', subjectId: 'SUB-105', duration: 50, topic: 'Binary Search Implementation', completion: '100%' },
    { id: 'S-4', date: '2026-09-29', subjectId: 'SUB-101', duration: 30, topic: 'Algebra Factoring', completion: '50%' }
  ],

  healthLogs: [
    { date: '2026-09-26', sleepHours: 7.5, waterLiters: 2.2, exerciseMins: 30, energy: 'High', note: 'Morning jog' },
    { date: '2026-09-27', sleepHours: 6.0, waterLiters: 1.8, exerciseMins: 15, energy: 'Medium', note: 'Late night assignment' },
    { date: '2026-09-28', sleepHours: 5.5, waterLiters: 1.5, exerciseMins: 0, energy: 'Low', note: 'Studied late for quiz' },
    { date: '2026-09-29', sleepHours: 5.0, waterLiters: 1.2, exerciseMins: 0, energy: 'Low', note: 'Felt tired in morning' },
    { date: '2026-09-30', sleepHours: 7.0, waterLiters: 2.0, exerciseMins: 20, energy: 'Medium', note: 'Rested early' }
  ],

  moodLogs: [
    { id: 'ML-1', date: '2026-09-27', mood: 4, stress: 2, note: 'Good day overall, finished CS task' },
    { id: 'ML-2', date: '2026-09-28', mood: 2, stress: 4, note: 'Worried about upcoming Math test' },
    { id: 'ML-3', date: '2026-09-29', mood: 2, stress: 5, note: 'Felt overwhelmed by formulas' },
    { id: 'ML-4', date: '2026-09-30', mood: 3, stress: 3, note: 'Felt better after talking to mom' }
  ],

  teacherFeedback: [
    {
      id: 'TF-1',
      teacherId: 'TCH-3001',
      studentId: 'STU-1001',
      subjectId: 'SUB-101',
      category: 'Academic Progress',
      evidenceText: 'Scored 88% in Unit Test 1, but dropped to 62% in Midterm. Missed problem set #3 submission on time.',
      constructiveAdvice: 'Focus on polynomial factoring fundamentals. Recommend 30 mins daily practice before next unit test.',
      date: '2026-09-23'
    },
    {
      id: 'TF-2',
      teacherId: 'TCH-3001',
      studentId: 'STU-1001',
      subjectId: 'SUB-102',
      category: 'Classroom Engagement',
      evidenceText: 'Participated actively in kinematics lab demonstration and assisted peers in data calculation.',
      constructiveAdvice: 'Keep up the curious problem-solving attitude in physics.',
      date: '2026-09-25'
    }
  ],

  parentObservations: [
    {
      id: 'PO-1',
      parentId: 'PAR-2001',
      studentId: 'STU-1001',
      category: 'Home Routine & Discipline',
      observationText: 'Alex studied for 1.5 hours at home on Tuesday. Noticed screen time extending past 11:00 PM on Wednesday.',
      supportActionTaken: 'Discussed setting phone aside at 10:00 PM on school nights.',
      date: '2026-09-29'
    }
  ],

  messages: [
    {
      id: 'MSG-1',
      senderId: 'TCH-3001',
      senderName: 'Dr. Robert Vance (Teacher)',
      receiverId: 'PAR-2001',
      text: 'Hello Mrs. Morgan, I wanted to share that Alex showed great engagement in Physics lab today. However, we should keep an eye on Math practice ahead of the upcoming test.',
      timestamp: '2026-09-25 14:30'
    },
    {
      id: 'MSG-2',
      senderId: 'PAR-2001',
      senderName: 'Sarah Morgan (Parent)',
      receiverId: 'TCH-3001',
      text: 'Thank you Dr. Vance! Alex mentioned struggling with quadratic factoring. We will allocate extra study time at home.',
      timestamp: '2026-09-25 16:15'
    }
  ],

  consentSettings: {
    studentId: 'STU-1001',
    parentId: 'PAR-2001',
    shareHealthLogsWithTeacher: false,
    shareMoodSummaryWithParent: true,
    shareParentObservationsWithTeacher: true,
    aiRecommendationEngineActive: true,
    lastUpdated: '2026-09-01'
  },

  auditLogs: [
    { id: 'LOG-1', user: 'Dr. Robert Vance (Teacher)', action: 'Uploaded Marks for Midterm Exam (Mathematics)', timestamp: '2026-09-22 11:15' },
    { id: 'LOG-2', user: 'Alex Morgan (Student)', action: 'Updated Mood Log (Stress Level: 4)', timestamp: '2026-09-28 21:30' },
    { id: 'LOG-3', user: 'Sarah Morgan (Parent)', action: 'Updated Parental Consent Policy (Health Sharing: Disabled)', timestamp: '2026-09-29 09:10' },
    { id: 'LOG-4', user: 'EduBridge AI Engine', action: 'Generated Early-Support Alert (Mathematics Academic Trajectory)', timestamp: '2026-09-30 08:00' }
  ]
};

class DataStore {
  constructor() {
    const saved = localStorage.getItem('EDUBRIDGE_DATA_V1');
    if (saved) {
      try {
        const loaded = JSON.parse(saved);
        this.data = Object.assign({}, JSON.parse(JSON.stringify(INITIAL_STATE)), loaded);
      } catch (e) {
        this.data = JSON.parse(JSON.stringify(INITIAL_STATE));
      }
    } else {
      this.data = JSON.parse(JSON.stringify(INITIAL_STATE));
      this.save();
    }
  }

  save() {
    localStorage.setItem('EDUBRIDGE_DATA_V1', JSON.stringify(this.data));
  }

  reset() {
    this.data = JSON.parse(JSON.stringify(INITIAL_STATE));
    this.save();
  }

  getRole() {
    return this.data.currentUserRole;
  }

  setRole(role) {
    this.data.currentUserRole = role;
    this.save();
  }

  getCurrentUser() {
    const role = this.data.currentUserRole;
    return this.data.users[role];
  }

  addMark(mark) {
    mark.id = 'M-' + Date.now();
    this.data.marks.push(mark);
    
    // Update student roster math/phy score if relevant
    const rosterStudent = this.data.studentsRoster.find(s => s.id === mark.studentId);
    if (rosterStudent) {
      if (mark.subjectId === 'SUB-101') rosterStudent.mathScore = mark.obtained;
      if (mark.subjectId === 'SUB-102') rosterStudent.phyScore = mark.obtained;
    }

    this.addAuditLog(`Uploaded Marks (${mark.assessment}) for ${mark.studentId}`);
    this.save();

    if (window.EDUBRIDGE_SUPABASE && window.EDUBRIDGE_SUPABASE.isConnected) {
      window.EDUBRIDGE_SUPABASE.pushRecord('marks', {
        id: mark.id,
        student_id: mark.studentId,
        subject_id: mark.subjectId,
        assessment: mark.assessment,
        obtained: mark.obtained,
        max: mark.max || 100,
        assessment_date: mark.date || new Date().toISOString().split('T')[0]
      });
    }
  }

  addAssignment(assignment) {
    assignment.id = 'A-' + Date.now();
    this.data.assignments.push(assignment);
    this.addAuditLog(`Created New Assignment: ${assignment.title}`);
    this.save();

    if (window.EDUBRIDGE_SUPABASE && window.EDUBRIDGE_SUPABASE.isConnected) {
      window.EDUBRIDGE_SUPABASE.pushRecord('assignments', {
        id: assignment.id,
        subject_id: assignment.subjectId,
        title: assignment.title,
        due_date: assignment.dueDate,
        status: assignment.status || 'Pending',
        weight: assignment.weight || '10%'
      });
    }
  }

  addStudySession(session) {
    session.id = 'S-' + Date.now();
    this.data.studySessions.push(session);
    this.addAuditLog(`Logged Study Session (${session.duration} mins)`);
    this.save();

    if (window.EDUBRIDGE_SUPABASE && window.EDUBRIDGE_SUPABASE.isConnected) {
      window.EDUBRIDGE_SUPABASE.pushRecord('study_sessions', {
        id: session.id,
        student_id: 'STU-1001',
        subject_id: session.subjectId,
        session_date: session.date || new Date().toISOString().split('T')[0],
        duration_mins: session.duration,
        topic: session.topic,
        completion: session.completion || '100%'
      });
    }
  }

  addHealthLog(log) {
    const index = this.data.healthLogs.findIndex(h => h.date === log.date);
    if (index >= 0) {
      this.data.healthLogs[index] = log;
    } else {
      this.data.healthLogs.push(log);
    }
    this.addAuditLog(`Logged Health Routine for ${log.date}`);
    this.save();

    if (window.EDUBRIDGE_SUPABASE && window.EDUBRIDGE_SUPABASE.isConnected) {
      window.EDUBRIDGE_SUPABASE.pushRecord('health_logs', {
        student_id: 'STU-1001',
        log_date: log.date,
        sleep_hours: log.sleepHours,
        water_liters: log.waterLiters,
        exercise_mins: log.exerciseMins,
        energy: log.energy,
        note: log.note || ''
      });
    }
  }

  addMoodLog(log) {
    log.id = 'ML-' + Date.now();
    this.data.moodLogs.push(log);
    this.addAuditLog(`Logged Mood/Stress Check-in`);
    this.save();

    if (window.EDUBRIDGE_SUPABASE && window.EDUBRIDGE_SUPABASE.isConnected) {
      window.EDUBRIDGE_SUPABASE.pushRecord('mood_logs', {
        id: log.id,
        student_id: 'STU-1001',
        log_date: log.date || new Date().toISOString().split('T')[0],
        mood_score: log.mood,
        stress_score: log.stress,
        note: log.note || ''
      });
    }
  }

  addTeacherFeedback(feedback) {
    feedback.id = 'TF-' + Date.now();
    feedback.date = new Date().toISOString().split('T')[0];
    this.data.teacherFeedback.push(feedback);
    this.addAuditLog(`Added Teacher Feedback for ${feedback.category}`);
    this.save();

    if (window.EDUBRIDGE_SUPABASE && window.EDUBRIDGE_SUPABASE.isConnected) {
      window.EDUBRIDGE_SUPABASE.pushRecord('teacher_feedback', {
        id: feedback.id,
        teacher_id: feedback.teacherId || 'TCH-3001',
        student_id: feedback.studentId || 'STU-1001',
        subject_id: feedback.subjectId || 'SUB-101',
        category: feedback.category,
        evidence_text: feedback.evidenceText,
        constructive_advice: feedback.constructiveAdvice,
        feedback_date: feedback.date
      });
    }
  }

  addParentObservation(obs) {
    obs.id = 'PO-' + Date.now();
    obs.date = new Date().toISOString().split('T')[0];
    this.data.parentObservations.push(obs);
    this.addAuditLog(`Recorded Parent Home Observation`);
    this.save();

    if (window.EDUBRIDGE_SUPABASE && window.EDUBRIDGE_SUPABASE.isConnected) {
      window.EDUBRIDGE_SUPABASE.pushRecord('parent_observations', {
        id: obs.id,
        parent_id: obs.parentId || 'PAR-2001',
        student_id: obs.studentId || 'STU-1001',
        category: obs.category,
        observation_text: obs.observationText,
        support_action_taken: obs.supportActionTaken,
        observation_date: obs.date
      });
    }
  }

  addMessage(msg) {
    msg.id = 'MSG-' + Date.now();
    msg.timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    this.data.messages.push(msg);
    this.addAuditLog(`Sent Direct Message`);
    this.save();

    if (window.EDUBRIDGE_SUPABASE && window.EDUBRIDGE_SUPABASE.isConnected) {
      window.EDUBRIDGE_SUPABASE.pushRecord('messages', {
        id: msg.id,
        sender_id: msg.senderId,
        sender_name: msg.senderName,
        receiver_id: msg.receiverId,
        text: msg.text
      });
    }
  }

  updateConsent(newConsent) {
    this.data.consentSettings = { ...this.data.consentSettings, ...newConsent, lastUpdated: new Date().toISOString().split('T')[0] };
    this.addAuditLog(`Updated Data Consent Policies`);
    this.save();

    if (window.EDUBRIDGE_SUPABASE && window.EDUBRIDGE_SUPABASE.isConnected) {
      window.EDUBRIDGE_SUPABASE.pushRecord('consent_settings', {
        student_id: 'STU-1001',
        parent_id: 'PAR-2001',
        share_health_logs_with_teacher: this.data.consentSettings.shareHealthLogsWithTeacher,
        share_mood_summary_with_parent: this.data.consentSettings.shareMoodSummaryWithParent,
        share_parent_observations_with_teacher: this.data.consentSettings.shareParentObservationsWithTeacher,
        ai_recommendation_engine_active: this.data.consentSettings.aiRecommendationEngineActive,
        last_updated: this.data.consentSettings.lastUpdated
      });
    }
  }

  addAuditLog(actionText) {
    const user = this.getCurrentUser().name + ` (${this.data.currentUserRole.toUpperCase()})`;
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const logId = 'LOG-' + Date.now();
    this.data.auditLogs.unshift({
      id: logId,
      user,
      action: actionText,
      timestamp
    });
    if (this.data.auditLogs.length > 50) this.data.auditLogs.pop();

    if (window.EDUBRIDGE_SUPABASE && window.EDUBRIDGE_SUPABASE.isConnected) {
      window.EDUBRIDGE_SUPABASE.pushRecord('audit_logs', {
        id: logId,
        user_info: user,
        action: actionText
      });
    }
  }
}

window.edubridgeStore = new DataStore();

