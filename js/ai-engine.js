/* EduBridge - Explainable AI Recommendation & Decision Support Engine */

class EduBridgeAIEngine {
  constructor(store) {
    this.store = store;
  }

  // 1. Analyze Academic Trajectory & Generate Explainable Recommendations
  getAcademicRecommendations(studentId = 'STU-1001') {
    const data = this.store.data;
    const recommendations = [];

    // Group marks by subject
    const subjectMarksMap = {};
    data.marks.filter(m => m.studentId === studentId).forEach(m => {
      if (!subjectMarksMap[m.subjectId]) subjectMarksMap[m.subjectId] = [];
      subjectMarksMap[m.subjectId].push(m);
    });

    // Check for declining trend in any subject
    for (const [subjectId, marksList] of Object.entries(subjectMarksMap)) {
      if (marksList.length >= 2) {
        // Sort by date
        marksList.sort((a, b) => new Date(a.date) - new Date(b.date));
        const latest = marksList[marksList.length - 1];
        const previous = marksList[marksList.length - 2];
        
        const drop = previous.obtained - latest.obtained;
        const subject = data.subjects.find(s => s.id === subjectId);
        const subjectName = subject ? subject.name : subjectId;

        if (drop >= 15) {
          recommendations.push({
            id: 'REC-ACAD-' + subjectId,
            type: 'academic',
            category: 'Subject Performance Focus',
            title: `Targeted Practice Recommended for ${subjectName}`,
            recommendation: `Schedule two focused 30-minute practice sessions on core topics in ${subjectName}. Consider discussing recent test feedback with your teacher.`,
            evidence: `Performance dropped by ${drop}% (from ${previous.obtained}% in ${previous.assessment} to ${latest.obtained}% in ${latest.assessment}).`,
            confidence: 'High (89% Rule Match)',
            disclaimer: 'Decision-support suggestion under teacher & parent supervision.'
          });
        }
      }
    }

    // Check pending assignments with upcoming deadlines
    const pendingAssignments = data.assignments.filter(a => a.status === 'Pending');
    if (pendingAssignments.length > 0) {
      const nearest = pendingAssignments[0];
      const subject = data.subjects.find(s => s.id === nearest.subjectId);
      recommendations.push({
        id: 'REC-ASSIGN-' + nearest.id,
        type: 'academic',
        category: 'Upcoming Assignment Priority',
        title: `Prioritize Task: ${nearest.title}`,
        recommendation: `Allocate time today to outline and complete '${nearest.title}' for ${subject ? subject.name : ''}.`,
        evidence: `Due date is ${nearest.dueDate} (Weight: ${nearest.weight}). Current status is Pending.`,
        confidence: 'High (100% Rule Match)',
        disclaimer: 'Automated deadline prioritization alert.'
      });
    }

    return recommendations;
  }

  // 2. Analyze Lifestyle & Health Patterns
  getLifestyleRecommendations(studentId = 'STU-1001') {
    const data = this.store.data;
    const recommendations = [];

    // Analyze sleep patterns over past 5 days
    const recentHealth = [...data.healthLogs].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
    const lowSleepDays = recentHealth.filter(h => h.sleepHours < 6.5);

    if (lowSleepDays.length >= 2) {
      const avgSleep = (recentHealth.reduce((acc, curr) => acc + curr.sleepHours, 0) / recentHealth.length).toFixed(1);
      recommendations.push({
        id: 'REC-SLEEP-1',
        type: 'habit',
        category: 'Rest & Routine Optimization',
        title: 'Regular Bedtime Schedule Suggested',
        recommendation: `Consider establishing a quiet wind-down routine 45 minutes before sleep to aim for 7.5 - 8 hours of rest. Adequate sleep significantly enhances memory retention and problem-solving focus.`,
        evidence: `Recorded average sleep of ${avgSleep} hours across recent school nights (${lowSleepDays.length} nights below 6.5 hrs).`,
        confidence: 'Medium-High (Rule Match)',
        disclaimer: 'Non-medical lifestyle habit guidance.'
      });
    }

    // Water intake check
    const lowWaterDays = recentHealth.filter(h => h.waterLiters < 1.5);
    if (lowWaterDays.length >= 2) {
      recommendations.push({
        id: 'REC-WATER-1',
        type: 'habit',
        category: 'Hydration & Daily Energy',
        title: 'Increase Daily Water Intake',
        recommendation: 'Keep a water bottle near your study desk to maintain steady hydration during problem-solving sessions.',
        evidence: `Water intake recorded below 1.5L on ${lowWaterDays.length} recent days.`,
        confidence: 'High',
        disclaimer: 'General health habit suggestion.'
      });
    }

    return recommendations;
  }

  // 3. Early Support Alerts Engine (Multi-Factor Pattern Scanner)
  getEarlySupportAlerts(studentId = 'STU-1001') {
    const data = this.store.data;
    const alerts = [];

    // Factor 1: Stress & Mood check
    const recentMood = [...data.moodLogs].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
    const highStressCount = recentMood.filter(m => m.stress >= 4).length;

    // Factor 2: Academic decline or missing tasks
    const pendingCount = data.assignments.filter(a => a.status === 'Pending').length;

    // Combined pattern check
    if (highStressCount >= 2 && pendingCount >= 2) {
      alerts.push({
        id: 'ALERT-EARLY-1',
        type: 'alert',
        severity: 'Moderate Support Needed',
        title: 'Early Support Flag: Academic & Workload Balance',
        summary: `Student has reported heightened stress levels on ${highStressCount} recent check-ins alongside ${pendingCount} pending academic assignments.`,
        evidenceText: `Stress score logged as 4-5/5 on ${highStressCount} days. Pending tasks in Math & Physics.`,
        suggestedAction: `Parent and Teacher are advised to hold a brief supportive discussion with Alex to adjust task breakdown and provide extra practice guidance.`,
        disclaimer: 'This alert does NOT indicate a clinical or medical condition. It is a decision-support notification for proactive adult guidance.'
      });
    }

    return alerts;
  }

  // 4. AI Smart Schedule Planner
  generateDailyPlan(availableHours = 2.5, focusSubject = 'Mathematics') {
    const totalMinutes = Math.round(availableHours * 60);
    const schedule = [];
    let currentMin = 0;

    // Time block allocations
    // 1. High Priority Focus Subject (40%)
    const focusDuration = Math.min(45, Math.round(totalMinutes * 0.4));
    schedule.push({
      timeSlot: '05:00 PM - 05:45 PM',
      task: `Focus Study: ${focusSubject} Concepts & Problem Sets`,
      type: 'study',
      duration: `${focusDuration} mins`,
      tip: 'Turn off notification alerts during this block.'
    });
    currentMin += focusDuration;

    // 2. Active Rest Break
    schedule.push({
      timeSlot: '05:45 PM - 06:00 PM',
      task: 'Hydration & Stretch Break',
      type: 'break',
      duration: '15 mins',
      tip: 'Step away from screens and drink a glass of water.'
    });
    currentMin += 15;

    // 3. Assignment / Secondary Practice (35%)
    const secondaryDuration = Math.min(40, Math.round(totalMinutes * 0.35));
    schedule.push({
      timeSlot: '06:00 PM - 06:40 PM',
      task: 'Pending Assignment Execution (Physics/CS)',
      type: 'assignment',
      duration: `${secondaryDuration} mins`,
      tip: 'Work through questions step-by-step.'
    });
    currentMin += secondaryDuration;

    // 4. Quick Review & Goal Setup (15%)
    schedule.push({
      timeSlot: '06:40 PM - 07:00 PM',
      task: 'Daily Reflection & Tomorrow Task Checklist',
      type: 'review',
      duration: '20 mins',
      tip: 'Log completed study minutes in EduBridge.'
    });

    return {
      availableHours,
      focusSubject,
      totalDuration: totalMinutes,
      schedule
    };
  }

  // 5. Interactive AI Assistant Response Generator
  processChatQuery(queryText, role = 'student') {
    const q = queryText.toLowerCase();
    
    if (q.includes('math') || q.includes('mathematics') || q.includes('formula')) {
      return {
        reply: `Here is a structured strategy for Mathematics:
1. **Break down factoring**: Review quadratic equations step-by-step using the quadratic formula: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$.
2. **Short daily sprints**: Practice 3 problems every day rather than cramming before exams.
3. **Ask your teacher**: Dr. Vance noted in feedback that reviewing polynomial factoring will quickly rebuild test confidence.`,
        source: 'Academic Decision-Support Rules'
      };
    }

    if (q.includes('stress') || q.includes('anxious') || q.includes('tired') || q.includes('overwhelmed')) {
      return {
        reply: `I hear you, and it is completely normal to feel pressure before midterms. Here are three immediate supportive steps:
1. **Take 5 deep breaths**: Pause study for just 5 minutes.
2. **Break tasks into micro-steps**: Don't look at the whole chapter at once—focus on just 1 problem.
3. **Connect with your parent or teacher**: Let Sarah (Mom) or Dr. Vance know so they can support your study schedule.`,
        source: 'Well-being Support Protocol (Non-Clinical)'
      };
    }

    if (q.includes('schedule') || q.includes('plan') || q.includes('time management')) {
      return {
        reply: `To create an effective daily plan:
- Use the **AI Daily Planner** tab to generate a balanced routine with built-in breaks.
- Avoid studying for more than 45 minutes continuously without a 10-15 minute rest period.
- Ensure you get at least 7.5 hours of sleep to consolidate what you learned!`,
        source: 'Time Management Engine'
      };
    }

    return {
      reply: `Hello! I am EduBridge AI Assistant. I can help you:
- Organize your daily study schedule.
- Provide subject practice strategies based on your test feedback.
- Offer stress-management tips and routine recommendations.

What area would you like help with today?`,
      source: 'EduBridge Assistant'
    };
  }
}

window.edubridgeAI = new EduBridgeAIEngine(window.edubridgeStore);
