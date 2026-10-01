/* EduBridge - Master Application Controller (Unified Landing + 3-Role Portals) */

document.addEventListener('DOMContentLoaded', () => {
  const store = window.edubridgeStore;
  const ai = window.edubridgeAI;

  let currentTab = 'dashboard';
  let charts = {};

  // DOM Cache
  const roleButtons = document.querySelectorAll('.role-btn');
  const userAvatar = document.getElementById('userAvatar');
  const userName = document.getElementById('userName');
  const userRoleTag = document.getElementById('userRoleTag');
  const sidebarNav = document.getElementById('sidebarNav');
  const mainContent = document.getElementById('mainContent');
  const profileBadge = document.getElementById('profileBadge');
  const brandHomeBtn = document.getElementById('brandHomeBtn');

  // AI Drawer Cache
  const aiDrawer = document.getElementById('aiDrawer');
  const toggleAiBtn = document.getElementById('toggleAiBtn');
  const closeAiDrawer = document.getElementById('closeAiDrawer');
  const aiInput = document.getElementById('aiInput');
  const sendAiMsgBtn = document.getElementById('sendAiMsgBtn');
  const aiMessages = document.getElementById('aiMessages');

  // Modals Cache
  const modalOverlay = document.getElementById('modalOverlay');
  const modalContainer = document.getElementById('modalContainer');

  // Initial Setup
  init();

  function init() {
    setupRoleSwitcher();
    setupAiDrawer();

    brandHomeBtn?.addEventListener('click', () => {
      store.setRole('landing');
      updateRoleButtons('landing');
      renderApp();
    });

    renderApp();
  }

  // Role Switcher Setup
  function setupRoleSwitcher() {
    roleButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const role = btn.dataset.role;
        store.setRole(role);
        updateRoleButtons(role);
        currentTab = 'dashboard';
        renderApp();
        showToast(role === 'landing' ? 'Welcome to EduBridge Platform Home' : `Switched portal view to ${role.toUpperCase()} mode`);
      });
    });
  }

  function updateRoleButtons(activeRole) {
    roleButtons.forEach(b => {
      b.classList.remove('active', 'landing', 'student', 'parent', 'teacher');
      if (b.dataset.role === activeRole) {
        b.classList.add('active', activeRole);
      }
    });
  }

  // Render Full Application View based on Current Role / Mode
  function renderApp() {
    const role = store.getRole();
    const user = store.getCurrentUser();

    if (role === 'landing') {
      sidebarNav.style.display = 'none';
      profileBadge.style.display = 'none';
      mainContent.style.padding = '0';
      renderLandingView();
      return;
    }

    // Portal Mode
    sidebarNav.style.display = 'flex';
    profileBadge.style.display = 'flex';
    mainContent.style.padding = '32px';

    // Update Header Profile Badge
    userAvatar.textContent = user.avatar;
    userName.textContent = user.name;
    userRoleTag.textContent = role.toUpperCase() + ' PORTAL';

    // Render Sidebar Navigation Items based on Role
    renderSidebar(role);

    // Render Main Content View
    renderMainView(role, currentTab);
  }

  function renderSidebar(role) {
    let navItems = [];

    if (role === 'student') {
      navItems = [
        { id: 'dashboard', label: 'Overview Dashboard', icon: 'fa-chart-pie' },
        { id: 'academic', label: 'Academic & Marks', icon: 'fa-graduation-cap' },
        { id: 'study', label: 'Study Hours & Goals', icon: 'fa-book-open' },
        { id: 'planner', label: 'AI Daily Planner', icon: 'fa-calendar-alt' },
        { id: 'health', label: 'Health & Mood Routine', icon: 'fa-heartbeat' },
        { id: 'messages', label: 'Messages', icon: 'fa-comments', badge: store.data.messages.length },
        { id: 'ai-insights', label: 'AI Recommendations', icon: 'fa-brain' }
      ];
    } else if (role === 'parent') {
      navItems = [
        { id: 'dashboard', label: 'Child Overview', icon: 'fa-chart-pie' },
        { id: 'academic', label: 'Academic & Attendance', icon: 'fa-graduation-cap' },
        { id: 'home-routine', label: 'Home Routine & Observations', icon: 'fa-home' },
        { id: 'messages', label: 'Teacher Messaging', icon: 'fa-comments', badge: store.data.messages.length },
        { id: 'consent', label: 'Privacy & Consent', icon: 'fa-user-shield' },
        { id: 'ai-insights', label: 'AI Support Guidance', icon: 'fa-brain' }
      ];
    } else if (role === 'teacher') {
      navItems = [
        { id: 'dashboard', label: 'Class Overview', icon: 'fa-chalkboard-teacher' },
        { id: 'marks-entry', label: 'Marks & Attendance Entry', icon: 'fa-edit' },
        { id: 'assignments-mgt', label: 'Assignment Management', icon: 'fa-tasks' },
        { id: 'observations', label: 'Classroom Observations', icon: 'fa-clipboard-list' },
        { id: 'messages', label: 'Parent Communication', icon: 'fa-comments', badge: store.data.messages.length },
        { id: 'ai-insights', label: 'AI Academic Summaries', icon: 'fa-brain' },
        { id: 'audit', label: 'Audit & Compliance Logs', icon: 'fa-history' }
      ];
    }

    let html = `<div class="nav-section-title">${role.toUpperCase()} NAVIGATION</div>`;
    navItems.forEach(item => {
      const activeClass = item.id === currentTab ? 'active' : '';
      const badgeHtml = item.badge ? `<span class="nav-badge">${item.badge}</span>` : '';
      html += `
        <a class="nav-item ${activeClass}" data-tab="${item.id}">
          <i class="fas ${item.icon} nav-icon"></i>
          <span>${item.label}</span>
          ${badgeHtml}
        </a>
      `;
    });

    sidebarNav.innerHTML = html;

    sidebarNav.querySelectorAll('.nav-item').forEach(el => {
      el.addEventListener('click', (e) => {
        currentTab = e.currentTarget.dataset.tab;
        renderApp();
      });
    });
  }

  // --- UNIFIED LANDING PAGE RENDERER ---
  function renderLandingView() {
    let html = `
      <div class="landing-body fade-in">
        <!-- Hero Section -->
        <section class="hero-section">
          <div class="saas-container">
            <div class="hero-pill-badge">
              <i class="fas fa-sparkles"></i> Next-Gen AI Decision Support for Education
            </div>

            <h1 class="hero-title">
              A smarter bridge between <br>
              <span class="hero-title-gradient">students, parents & teachers.</span>
            </h1>

            <p class="hero-subtitle">
              EduBridge combines academic performance, study habits, lifestyle routines, and mental well-being into one unified, privacy-first decision-support platform.
            </p>

            <div class="hero-cta-group">
              <button class="btn-saas-primary switch-portal-btn" data-targetrole="student" style="padding: 14px 32px; font-size: 16px;">
                <i class="fas fa-rocket"></i> Get Started (Student View)
              </button>
              <button class="btn-saas-secondary switch-portal-btn" data-targetrole="teacher" style="padding: 14px 28px; font-size: 16px;">
                <i class="fas fa-chalkboard-teacher"></i> Teacher Portal
              </button>
            </div>

            <!-- Hero Product UI Frame Mockup -->
            <div class="hero-product-frame">
              <div class="floating-card-badge left">
                <div style="background: rgba(79, 70, 229, 0.15); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #4f46e5;">
                  <i class="fas fa-brain"></i>
                </div>
                <div>
                  <div style="font-weight: 700; font-size: 13px; color: #0f172a;">AI Practice Plan</div>
                  <div style="font-size: 11px; color: #64748b;">30-min Math Factoring Sprint</div>
                </div>
              </div>

              <div class="floating-card-badge right">
                <div style="background: rgba(16, 185, 129, 0.15); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #10b981;">
                  <i class="fas fa-bed"></i>
                </div>
                <div>
                  <div style="font-weight: 700; font-size: 13px; color: #0f172a;">Sleep & Retention</div>
                  <div style="font-size: 11px; color: #64748b;">7.5 Hours Optimal Rest</div>
                </div>
              </div>

              <div class="browser-header">
                <div class="browser-dot red"></div>
                <div class="browser-dot yellow"></div>
                <div class="browser-dot green"></div>
                <span class="browser-url">https://app.edubridge.edu/student/dashboard</span>
              </div>

              <div class="product-preview-body">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                  <div>
                    <h3 style="font-size: 18px; font-weight: 800; color: #0f172a;">Student Overview — Alex Morgan</h3>
                    <p style="font-size: 13px; color: #64748b;">Grade 10-A | Integrated Academic & Well-Being View</p>
                  </div>
                  <span class="badge badge-success">Live Status: Synced</span>
                </div>

                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 20px;">
                  <div style="background: #ffffff; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0;">
                    <span style="font-size: 11px; color: #64748b; font-weight: 600;">ACADEMIC AVERAGE</span>
                    <div style="font-size: 22px; font-weight: 800; color: #4f46e5; margin-top: 4px;">82.4%</div>
                  </div>
                  <div style="background: #ffffff; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0;">
                    <span style="font-size: 11px; color: #64748b; font-weight: 600;">WEEKLY STUDY TIME</span>
                    <div style="font-size: 22px; font-weight: 800; color: #06b6d4; margin-top: 4px;">4.2 Hours</div>
                  </div>
                  <div style="background: #ffffff; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0;">
                    <span style="font-size: 11px; color: #64748b; font-weight: 600;">ATTENDANCE RATE</span>
                    <div style="font-size: 22px; font-weight: 800; color: #10b981; margin-top: 4px;">94%</div>
                  </div>
                  <div style="background: #ffffff; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0;">
                    <span style="font-size: 11px; color: #64748b; font-weight: 600;">WELL-BEING INDEX</span>
                    <div style="font-size: 22px; font-weight: 800; color: #8b5cf6; margin-top: 4px;">Level 4/5</div>
                  </div>
                </div>

                <div style="background: #ffffff; padding: 16px; border-radius: 12px; border-left: 4px solid #4f46e5; border: 1px solid #e2e8f0;">
                  <div style="font-size: 13px; font-weight: 700; color: #4f46e5;">EXPLAINABLE AI RECOMMENDATION</div>
                  <p style="font-size: 13px; color: #334155; margin-top: 4px;">
                    Mathematics score dropped from 88% to 62% in Midterm Exam. Recommended: Allocate two 30-minute practice blocks this week on quadratic equations factoring.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Trust Strip -->
        <section class="trust-strip-section">
          <div class="saas-container">
            <div class="trust-title">Designed to connect the complete student journey</div>
            <div class="pillars-grid">
              <div class="pillar-card">
                <div class="pillar-icon"><i class="fas fa-user-graduate"></i></div>
                <div>
                  <h4 style="font-size: 16px; font-weight: 800; margin-bottom: 4px;">Students</h4>
                  <p style="font-size: 13px; color: var(--text-muted);">Learn, plan time effectively, track goals, and receive personalized study guidance.</p>
                </div>
              </div>

              <div class="pillar-card">
                <div class="pillar-icon"><i class="fas fa-users-between-lines"></i></div>
                <div>
                  <h4 style="font-size: 16px; font-weight: 800; margin-bottom: 4px;">Parents</h4>
                  <p style="font-size: 13px; color: var(--text-muted);">Understand school progress, log home routines, manage consent, and connect with teachers.</p>
                </div>
              </div>

              <div class="pillar-card">
                <div class="pillar-icon"><i class="fas fa-chalkboard-teacher"></i></div>
                <div>
                  <h4 style="font-size: 16px; font-weight: 800; margin-bottom: 4px;">Teachers</h4>
                  <p style="font-size: 13px; color: var(--text-muted);">Record official evaluation marks, log evidence-based classroom observations, and guide improvement.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Problem Section -->
        <section class="section-padding">
          <div class="saas-container">
            <div class="section-header">
              <span class="section-eyebrow">The Core Problem</span>
              <h2 class="section-title">Student progress shouldn't live in disconnected places.</h2>
              <p class="section-description">
                When academic marks, home habits, and classroom observations exist in separate silos, parents and teachers miss the full picture.
              </p>
            </div>

            <div class="problem-bridge-grid">
              <div class="problem-card">
                <div class="feature-icon-wrapper" style="background: rgba(6, 182, 212, 0.1); color: #06b6d4;">
                  <i class="fas fa-user"></i>
                </div>
                <h3 style="font-size: 18px; font-weight: 800; margin-bottom: 8px;">Student View</h3>
                <p style="font-size: 14px; color: var(--text-muted);">Knows their own study hours, daily stress levels, and goal struggles, but lacks structured time management.</p>
              </div>

              <div class="problem-card">
                <div class="feature-icon-wrapper" style="background: rgba(16, 185, 129, 0.1); color: #10b981;">
                  <i class="fas fa-home"></i>
                </div>
                <h3 style="font-size: 18px; font-weight: 800; margin-bottom: 8px;">Parent View</h3>
                <p style="font-size: 14px; color: var(--text-muted);">Sees home sleep duration, screen-time habits, and food routines, but lacks classroom academic context.</p>
              </div>

              <div class="problem-card">
                <div class="feature-icon-wrapper" style="background: rgba(139, 92, 246, 0.1); color: #8b5cf6;">
                  <i class="fas fa-school"></i>
                </div>
                <h3 style="font-size: 18px; font-weight: 800; margin-bottom: 8px;">Teacher View</h3>
                <p style="font-size: 14px; color: var(--text-muted);">Tracks test evaluation scores, attendance, and classroom participation, but doesn't see home routine challenges.</p>
              </div>
            </div>

            <div class="bridge-connector-banner">
              <div style="font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9;">The EduBridge Solution</div>
              <h3 style="font-size: 24px; font-weight: 800; margin-top: 6px;">Uniting All 3 Stakeholders into One Decision-Support Platform</h3>
            </div>
          </div>
        </section>

        <!-- Features Section -->
        <section class="section-padding" style="background: #ffffff; border-top: 1px solid var(--border-light);">
          <div class="saas-container">
            <div class="section-header">
              <span class="section-eyebrow">Platform Capabilities</span>
              <h2 class="section-title">Everything needed for complete student development.</h2>
            </div>

            <div class="feature-grid">
              <div class="feature-card">
                <div class="feature-icon-wrapper"><i class="fas fa-chart-line"></i></div>
                <h3 style="font-size: 18px; font-weight: 800; margin-bottom: 8px;">Academic Performance</h3>
                <p style="font-size: 14px; color: var(--text-muted);">Track test scores, examination marks, subject trends, and assignment completion over time.</p>
              </div>

              <div class="feature-card">
                <div class="feature-icon-wrapper"><i class="fas fa-calendar-alt"></i></div>
                <h3 style="font-size: 18px; font-weight: 800; margin-bottom: 8px;">AI Study Planner</h3>
                <p style="font-size: 14px; color: var(--text-muted);">Automatically generate balanced daily timetables with study focus blocks and built-in rest periods.</p>
              </div>

              <div class="feature-card">
                <div class="feature-icon-wrapper"><i class="fas fa-book-reader"></i></div>
                <h3 style="font-size: 18px; font-weight: 800; margin-bottom: 8px;">Study Session Logging</h3>
                <p style="font-size: 14px; color: var(--text-muted);">Record self-directed study hours, topics revised, task goals, and pre-examination preparation.</p>
              </div>

              <div class="feature-card">
                <div class="feature-icon-wrapper"><i class="fas fa-heartbeat"></i></div>
                <h3 style="font-size: 18px; font-weight: 800; margin-bottom: 8px;">Health & Mood Routine</h3>
                <p style="font-size: 14px; color: var(--text-muted);">Log sleep duration, water intake, exercise, and non-clinical emotional mood check-ins.</p>
              </div>

              <div class="feature-card">
                <div class="feature-icon-wrapper"><i class="fas fa-comments"></i></div>
                <h3 style="font-size: 18px; font-weight: 800; margin-bottom: 8px;">Parent-Teacher Direct Line</h3>
                <p style="font-size: 14px; color: var(--text-muted);">Secure messaging between authorized parents and assigned subject teachers in one place.</p>
              </div>

              <div class="feature-card">
                <div class="feature-icon-wrapper"><i class="fas fa-lightbulb"></i></div>
                <h3 style="font-size: 18px; font-weight: 800; margin-bottom: 8px;">Explainable AI Guidance</h3>
                <p style="font-size: 14px; color: var(--text-muted);">Receive transparent recommendations with clear evidence data explaining why each plan was created.</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Role Deep Dive Section -->
        <section class="section-padding">
          <div class="saas-container">
            <div class="section-header">
              <span class="section-eyebrow">Tailored Role Portals</span>
              <h2 class="section-title">Built for Students, Parents, and Teachers.</h2>
            </div>

            <div class="role-cards-grid">
              <div class="role-card-item student-theme">
                <span style="font-size: 12px; font-weight: 800; color: var(--secondary); text-transform: uppercase;">STUDENT PORTAL</span>
                <h3 style="font-size: 22px; font-weight: 800; margin: 8px 0;">Plan. Learn. Improve.</h3>
                <p style="font-size: 14px; color: var(--text-muted); margin-bottom: 20px;">
                  Students take ownership of their learning journey with personal goals, study session logs, mood check-ins, and AI timetables.
                </p>
                <button class="btn-saas-secondary switch-portal-btn" data-targetrole="student" style="margin-top: auto;">Open Student Portal &rarr;</button>
              </div>

              <div class="role-card-item parent-theme">
                <span style="font-size: 12px; font-weight: 800; color: var(--accent-emerald); text-transform: uppercase;">PARENT PORTAL</span>
                <h3 style="font-size: 22px; font-weight: 800; margin: 8px 0;">Understand. Support. Connect.</h3>
                <p style="font-size: 14px; color: var(--text-muted); margin-bottom: 20px;">
                  Parents gain clear visibility into academic marks, record home routines, manage data privacy consent, and message teachers.
                </p>
                <button class="btn-saas-secondary switch-portal-btn" data-targetrole="parent" style="margin-top: auto;">Open Parent Portal &rarr;</button>
              </div>

              <div class="role-card-item teacher-theme">
                <span style="font-size: 12px; font-weight: 800; color: var(--primary); text-transform: uppercase;">TEACHER PORTAL</span>
                <h3 style="font-size: 22px; font-weight: 800; margin: 8px 0;">Observe. Guide. Support.</h3>
                <p style="font-size: 14px; color: var(--text-muted); margin-bottom: 20px;">
                  Teachers enter evaluation scores, record observable classroom feedback, track attendance, and review AI class trends.
                </p>
                <button class="btn-saas-secondary switch-portal-btn" data-targetrole="teacher" style="margin-top: auto;">Open Teacher Portal &rarr;</button>
              </div>
            </div>
          </div>
        </section>

        <!-- Final CTA -->
        <section class="section-padding">
          <div class="saas-container">
            <div style="background: linear-gradient(135deg, #1e1b4b, #312e81); border-radius: 32px; padding: 60px 40px; text-align: center; color: white; box-shadow: 0 25px 50px rgba(49, 46, 129, 0.3);">
              <h2 style="font-size: 40px; font-weight: 800; letter-spacing: -1px; margin-bottom: 14px;">Build a better learning journey with EduBridge.</h2>
              <p style="font-size: 18px; color: #c7d2fe; max-width: 600px; margin: 0 auto 32px auto;">
                Connect academic progress, daily study planning, and meaningful support in one platform.
              </p>

              <button class="btn-saas-primary switch-portal-btn" data-targetrole="student" style="padding: 16px 36px; font-size: 16px; background: white; color: #4f46e5;">
                <i class="fas fa-rocket"></i> Launch EduBridge Portal
              </button>
            </div>
          </div>
        </section>
      </div>
    `;

    mainContent.innerHTML = html;

    // Attach switch portal handlers
    document.querySelectorAll('.switch-portal-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetRole = e.currentTarget.dataset.targetrole || 'student';
        store.setRole(targetRole);
        updateRoleButtons(targetRole);
        currentTab = 'dashboard';
        renderApp();
      });
    });
  }

  function renderMainView(role, tab) {
    if (tab === 'dashboard') {
      if (role === 'student') renderStudentDashboard();
      else if (role === 'parent') renderParentDashboard();
      else if (role === 'teacher') renderTeacherDashboard();
    } else if (tab === 'academic') {
      renderAcademicView();
    } else if (tab === 'study') {
      renderStudyTrackingView();
    } else if (tab === 'planner') {
      renderDailyPlannerView();
    } else if (tab === 'health') {
      renderHealthMoodView();
    } else if (tab === 'home-routine') {
      renderHomeRoutineView();
    } else if (tab === 'consent') {
      renderConsentView();
    } else if (tab === 'marks-entry') {
      renderTeacherMarksEntryView();
    } else if (tab === 'assignments-mgt') {
      renderTeacherAssignmentsView();
    } else if (tab === 'observations') {
      renderTeacherObservationsView();
    } else if (tab === 'messages') {
      renderMessagesView();
    } else if (tab === 'ai-insights') {
      renderAiInsightsView();
    } else if (tab === 'audit') {
      renderAuditLogsView();
    }
  }

  // --- 1. STUDENT DASHBOARD VIEW ---
  function renderStudentDashboard() {
    const data = store.data;

    const avgMark = calculateAverageMark(data.marks);
    const recentStudyHours = (data.studySessions.reduce((sum, s) => sum + s.duration, 0) / 60).toFixed(1);
    const pendingTasks = data.assignments.filter(a => a.status === 'Pending').length;
    const latestMood = data.moodLogs[data.moodLogs.length - 1] || { mood: 3, stress: 3 };

    let html = `
      <div class="fade-in theme-student">
        <!-- Top Greeting Header -->
        <div class="page-header" style="margin-bottom: 24px;">
          <div>
            <h1 class="page-title" style="font-size: 26px; font-weight: 800;">Good Morning, Alex! 👋</h1>
            <p class="page-description">Your personalized visual companion for learning, routine, and health.</p>
          </div>
          <button class="btn btn-primary" id="openLogStudyBtn" style="border-radius: var(--radius-full); padding: 10px 22px;">
            <i class="fas fa-plus"></i> Log Study Session
          </button>
        </div>

        <!-- Row 1: Compact Summary Cards -->
        <div class="metrics-grid" style="grid-template-columns: repeat(4, 1fr); gap: 16px;">
          <div class="v-card student-card" style="padding: 18px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
              <span class="chip-badge chip-orange">📚 Study Time</span>
              <span class="badge badge-success">+15m today</span>
            </div>
            <div style="font-size: 26px; font-weight: 800; color: var(--navy-dark);">${recentStudyHours}h 35m</div>
            <div class="v-progress-wrap" style="margin-top: 8px;">
              <div class="v-progress-fill amber" style="width: 75%;"></div>
            </div>
          </div>

          <div class="v-card student-card" style="padding: 18px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
              <span class="chip-badge chip-blue">📝 Tasks</span>
              <span class="badge badge-warning">2 Pending</span>
            </div>
            <div style="font-size: 26px; font-weight: 800; color: var(--navy-dark);">6 / 8 Completed</div>
            <div class="v-progress-wrap" style="margin-top: 8px;">
              <div class="v-progress-fill blue" style="width: 75%;"></div>
            </div>
          </div>

          <div class="v-card student-card" style="padding: 18px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
              <span class="chip-badge chip-green">🎯 Goal Progress</span>
              <span class="badge badge-success">On Track</span>
            </div>
            <div style="font-size: 26px; font-weight: 800; color: var(--navy-dark);">${avgMark}%</div>
            <div class="v-progress-wrap" style="margin-top: 8px;">
              <div class="v-progress-fill green" style="width: ${avgMark}%;"></div>
            </div>
          </div>

          <div class="v-card student-card" style="padding: 18px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
              <span class="chip-badge chip-pink">🔥 Study Streak</span>
              <span class="badge badge-purple">Active</span>
            </div>
            <div style="font-size: 26px; font-weight: 800; color: var(--navy-dark);">7 Days Streak</div>
            <div class="v-progress-wrap" style="margin-top: 8px;">
              <div class="v-progress-fill purple" style="width: 100%;"></div>
            </div>
          </div>
        </div>

        <!-- Row 2: Academic Performance Overview & Subject Cards -->
        <div class="v-card" style="margin-top: 24px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <div>
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 22px;">🎓</span>
                <h3 style="font-size: 18px; font-weight: 800; color: var(--navy-dark);">Academic Performance Overview</h3>
              </div>
              <p style="font-size: 13px; color: var(--text-muted); margin-top: 2px;">Subject mastery breakdown & midterm evaluation trends</p>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="text-align: right;">
                <span style="font-size: 24px; font-weight: 800; color: var(--student-brand);">${avgMark}%</span>
                <span class="chip-badge chip-orange" style="margin-left: 6px;">↑ 8.4%</span>
              </div>
            </div>
          </div>

          <!-- Subject Cards Grid -->
          <div class="subject-card-grid">
            <div class="subject-mini-card">
              <div class="subject-header-row">
                <div class="subject-icon-box math">📐</div>
                <span class="chip-badge chip-blue">Math</span>
              </div>
              <div style="display: flex; align-items: baseline; justify-content: space-between;">
                <span class="subject-score-val">78%</span>
                <span class="badge badge-success">↑ 6%</span>
              </div>
              <div class="v-progress-wrap">
                <div class="v-progress-fill blue" style="width: 78%;"></div>
              </div>
            </div>

            <div class="subject-mini-card">
              <div class="subject-header-row">
                <div class="subject-icon-box phy">🔭</div>
                <span class="chip-badge chip-green">Physics</span>
              </div>
              <div style="display: flex; align-items: baseline; justify-content: space-between;">
                <span class="subject-score-val">68%</span>
                <span class="badge badge-warning">↑ 4%</span>
              </div>
              <div class="v-progress-wrap">
                <div class="v-progress-fill green" style="width: 68%;"></div>
              </div>
            </div>

            <div class="subject-mini-card">
              <div class="subject-header-row">
                <div class="subject-icon-box chem">🧪</div>
                <span class="chip-badge chip-amber">Chemistry</span>
              </div>
              <div style="display: flex; align-items: baseline; justify-content: space-between;">
                <span class="subject-score-val">79%</span>
                <span class="badge badge-success">↑ 2%</span>
              </div>
              <div class="v-progress-wrap">
                <div class="v-progress-fill amber" style="width: 79%;"></div>
              </div>
            </div>

            <div class="subject-mini-card">
              <div class="subject-header-row">
                <div class="subject-icon-box eng">📚</div>
                <span class="chip-badge chip-pink">English</span>
              </div>
              <div style="display: flex; align-items: baseline; justify-content: space-between;">
                <span class="subject-score-val">86%</span>
                <span class="badge badge-success">↑ 5%</span>
              </div>
              <div class="v-progress-wrap">
                <div class="v-progress-fill purple" style="width: 86%;"></div>
              </div>
            </div>

            <div class="subject-mini-card">
              <div class="subject-header-row">
                <div class="subject-icon-box cs">💻</div>
                <span class="chip-badge chip-purple">CS</span>
              </div>
              <div style="display: flex; align-items: baseline; justify-content: space-between;">
                <span class="subject-score-val">96%</span>
                <span class="badge badge-success">↑ 8%</span>
              </div>
              <div class="v-progress-wrap">
                <div class="v-progress-fill blue" style="width: 96%;"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Row 3: AI Recommendation Card (Radiant Purple Gradient) -->
        <div class="v-card ai-card" style="margin-top: 24px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div>
              <div style="display: inline-flex; align-items: center; gap: 6px; background: rgba(255, 255, 255, 0.2); padding: 4px 14px; border-radius: var(--radius-full); font-size: 11px; font-weight: 800; margin-bottom: 8px;">
                ✨ EDU BRIDGE AI — YOUR NEXT BEST STEP
              </div>
              <h3 style="font-size: 18px; font-weight: 800; margin-bottom: 4px;">Mathematics has been your weakest subject this week</h3>
              <p style="font-size: 13px;">Suggested Action: <strong>📐 30 min Mathematics Quadratic Equations Practice</strong></p>
            </div>
            <div style="display: flex; gap: 10px;">
              <button class="btn" id="openAiPlannerBtn" style="background: white; color: var(--ai-purple); font-weight: 800; border-radius: var(--radius-full); padding: 10px 20px;">
                <i class="fas fa-calendar-check"></i> Generate AI Plan
              </button>
            </div>
          </div>
        </div>

        <!-- Row 4: Visual Study Planner Timeline & Charts -->
        <div class="grid-equal-2col" style="margin-top: 24px;">
          <div class="v-card">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 20px;">📅</span>
                <h3 style="font-size: 16px; font-weight: 800; color: var(--navy-dark);">Today's Study Plan Timeline</h3>
              </div>
              <span class="chip-badge chip-orange">Active Schedule</span>
            </div>

            <div class="planner-timeline">
              <div class="planner-time-item">
                <span class="planner-time-slot">⏰ 08:00 AM</span>
                <div style="flex: 1;">
                  <div style="font-weight: 700; font-size: 13px; color: var(--navy-dark);">📐 Mathematics</div>
                  <div style="font-size: 12px; color: var(--text-muted);">Quadratic Formula Practice</div>
                </div>
                <div class="planner-status-icon done">✓</div>
              </div>

              <div class="planner-time-item">
                <span class="planner-time-slot">⏰ 09:00 AM</span>
                <div style="flex: 1;">
                  <div style="font-weight: 700; font-size: 13px; color: var(--navy-dark);">☕ Break & Rest</div>
                  <div style="font-size: 12px; color: var(--text-muted);">Hydration & Stretch</div>
                </div>
                <div class="planner-status-icon done">✓</div>
              </div>

              <div class="planner-time-item">
                <span class="planner-time-slot">⏰ 10:00 AM</span>
                <div style="flex: 1;">
                  <div style="font-weight: 700; font-size: 13px; color: var(--navy-dark);">🔭 Physics Lab Report</div>
                  <div style="font-size: 12px; color: var(--text-muted);">Kinematics Data Analysis</div>
                </div>
                <div class="planner-status-icon active">◐</div>
              </div>

              <div class="planner-time-item">
                <span class="planner-time-slot">⏰ 11:00 AM</span>
                <div style="flex: 1;">
                  <div style="font-weight: 700; font-size: 13px; color: var(--navy-dark);">💻 Computer Science</div>
                  <div style="font-size: 12px; color: var(--text-muted);">Python Recursion Exercise</div>
                </div>
                <div class="planner-status-icon pending">○</div>
              </div>
            </div>
          </div>

          <div class="v-card">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 20px;">📊</span>
                <h3 style="font-size: 16px; font-weight: 800; color: var(--navy-dark);">Routine & Marks Correlation</h3>
              </div>
              <span class="chip-badge chip-blue">5-Day Trend</span>
            </div>
            <div style="height: 240px; position: relative;">
              <canvas id="marksChart"></canvas>
            </div>
          </div>
        </div>

        <!-- Row 5: Health & Nutrition Dashboard -->
        <div class="grid-equal-2col" style="margin-top: 24px;">
          <!-- Health Tracker Card -->
          <div class="v-card" style="border-top: 4px solid var(--health-mint);">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 20px;">🏃</span>
                <h3 style="font-size: 16px; font-weight: 800; color: var(--navy-dark);">Health & Fitness Companion</h3>
              </div>
              <span class="chip-badge chip-green">Daily Metrics</span>
            </div>

            <div class="health-metrics-grid">
              <div class="health-metric-box">
                <div class="health-icon-row">
                  <span style="font-size: 22px;">😴</span>
                  <span class="badge badge-success">Good</span>
                </div>
                <div style="font-size: 18px; font-weight: 800; color: var(--navy-dark);">7h 20m</div>
                <div style="font-size: 11px; color: var(--text-muted);">Restful Sleep</div>
              </div>

              <div class="health-metric-box">
                <div class="health-icon-row">
                  <span style="font-size: 22px;">💧</span>
                  <span class="badge badge-info">62%</span>
                </div>
                <div style="font-size: 18px; font-weight: 800; color: var(--navy-dark);">5 / 8 Glasses</div>
                <div style="font-size: 11px; color: var(--text-muted);">2.0 L Hydration</div>
              </div>

              <div class="health-metric-box">
                <div class="health-icon-row">
                  <span style="font-size: 22px;">🏃</span>
                  <span class="badge badge-success">Today</span>
                </div>
                <div style="font-size: 18px; font-weight: 800; color: var(--navy-dark);">42 min</div>
                <div style="font-size: 11px; color: var(--text-muted);">Physical Activity</div>
              </div>

              <div class="health-metric-box">
                <div class="health-icon-row">
                  <span style="font-size: 22px;">🚶</span>
                  <span class="badge badge-purple">Active</span>
                </div>
                <div style="font-size: 18px; font-weight: 800; color: var(--navy-dark);">6,240</div>
                <div style="font-size: 11px; color: var(--text-muted);">Daily Steps</div>
              </div>
            </div>
          </div>

          <!-- Food & Nutrition Card -->
          <div class="v-card" style="border-top: 4px solid var(--food-amber);">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 20px;">🥗</span>
                <h3 style="font-size: 16px; font-weight: 800; color: var(--navy-dark);">Food & Nutrition Log</h3>
              </div>
              <span class="chip-badge chip-amber">Balanced Meal</span>
            </div>

            <div class="food-timeline-grid">
              <div class="food-meal-card">
                <span class="meal-tag">🥣 Breakfast</span>
                <div class="meal-title">Idli + Banana</div>
                <div class="meal-items-text">8:00 AM • Energy Boost</div>
              </div>

              <div class="food-meal-card">
                <span class="meal-tag">🍱 Lunch</span>
                <div class="meal-title">Rice + Veggies + Chicken</div>
                <div class="meal-items-text">1:00 PM • Balanced Proteins</div>
              </div>

              <div class="food-meal-card">
                <span class="meal-tag">🍎 Snack</span>
                <div class="meal-title">Fresh Fruit & Almonds</div>
                <div class="meal-items-text">4:30 PM • Focus Boost</div>
              </div>

              <div class="food-meal-card">
                <span class="meal-tag">🥗 Dinner</span>
                <div class="meal-title">Chapati + Steamed Veggies</div>
                <div class="meal-items-text">8:00 PM • Light Dinner</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Row 6: Mood & Well-Being Selector -->
        <div class="v-card" style="margin-top: 24px; border-top: 4px solid var(--mood-pink);">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 20px;">💖</span>
                <h3 style="font-size: 16px; font-weight: 800; color: var(--navy-dark);">How are you feeling today?</h3>
              </div>
              <p style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">Daily check-in helps EduBridge AI balance your study plan workload</p>
            </div>
            <span class="chip-badge chip-pink">Emotional Well-Being</span>
          </div>

          <div class="mood-selector-grid">
            <div class="mood-select-btn active">
              <span class="mood-emoji-large">😊</span>
              <span class="mood-title-txt">Good</span>
            </div>
            <div class="mood-select-btn">
              <span class="mood-emoji-large">😐</span>
              <span class="mood-title-txt">Okay</span>
            </div>
            <div class="mood-select-btn">
              <span class="mood-emoji-large">😟</span>
              <span class="mood-title-txt">Stressed</span>
            </div>
            <div class="mood-select-btn">
              <span class="mood-emoji-large">😴</span>
              <span class="mood-title-txt">Tired</span>
            </div>
          </div>
        </div>
      </div>
    `;

    mainContent.innerHTML = html;

    // Attach Event Listeners
    document.getElementById('openLogStudyBtn')?.addEventListener('click', openLogStudyModal);
    document.getElementById('openAiPlannerBtn')?.addEventListener('click', () => {
      currentTab = 'planner';
      renderApp();
    });

    document.querySelectorAll('.mood-select-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.mood-select-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        showToast('Mood check-in saved! AI study workload calibrated.');
      });
    });

    // Render Charts defensively
    setTimeout(() => {
      renderMarksChart();
    }, 50);
  }

  // --- 2. PARENT DASHBOARD VIEW ---
  function renderParentDashboard() {
    const data = store.data;
    const student = data.users.student;
    const alerts = ai.getEarlySupportAlerts();
    const avgMark = calculateAverageMark(data.marks);

    let alertCardsHtml = '';
    alerts.forEach(a => {
      alertCardsHtml += `
        <div class="recommendation-card alert">
          <div class="rec-header">
            <span class="rec-type">${a.severity}</span>
            <span class="badge badge-danger">PROACTIVE NOTICE</span>
          </div>
          <div style="font-weight: 700; margin-bottom: 6px; font-size: 15px;">${a.title}</div>
          <div class="rec-text">${a.summary}</div>
          <div class="rec-evidence">
            <span class="rec-evidence-label">Evidence Base:</span> ${a.evidenceText}
          </div>
          <div style="margin-top: 10px; font-size: 12px; color: #4f46e5;">
            <strong>Suggested Action:</strong> ${a.suggestedAction}
          </div>
          <div style="font-size: 11px; color: var(--text-muted); margin-top: 8px; font-style: italic;">
            ${a.disclaimer}
          </div>
        </div>
      `;
    });

    let html = `
      <div class="fade-in">
        <div class="page-header">
          <div>
            <h1 class="page-title">Parent Portal: ${student.name}</h1>
            <p class="page-description">Linked Student: Grade 10-A | Centralized School & Home Development View</p>
          </div>
          <button class="btn btn-emerald" id="openLogHomeObsBtn">
            <i class="fas fa-plus-circle"></i> Record Home Observation
          </button>
        </div>

        <div class="metrics-grid" style="margin-top: 20px;">
          <div class="metric-card">
            <div class="metric-icon indigo"><i class="fas fa-chart-line"></i></div>
            <div class="metric-data">
              <span class="metric-value">${avgMark}%</span>
              <span class="metric-label">Overall Marks Avg</span>
              <span class="metric-trend up">Midterm Evaluated</span>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon emerald"><i class="fas fa-calendar-check"></i></div>
            <div class="metric-data">
              <span class="metric-value">94%</span>
              <span class="metric-label">Attendance Rate</span>
              <span class="metric-trend neutral">1 Absence (Sick)</span>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon purple"><i class="fas fa-heart"></i></div>
            <div class="metric-data">
              <span class="metric-value">3.0 / 5</span>
              <span class="metric-label">Well-being Score</span>
              <span class="metric-trend neutral">Normal Range</span>
            </div>
          </div>
        </div>

        <div style="margin-top: 28px;">
          <h2 style="font-size: 18px; font-weight: 800; margin-bottom: 14px;">Proactive Support & AI Notifications</h2>
          ${alertCardsHtml || '<p style="color: var(--text-muted);">No critical support alerts detected. Student is progressing smoothly.</p>'}
        </div>

        <div class="grid-equal-2col" style="margin-top: 28px;">
          <div class="glass-card">
            <div class="glass-card-header">
              <div class="card-title-group">
                <div class="card-title-icon"><i class="fas fa-comment-alt"></i></div>
                <div>
                  <div class="card-title">Recent Teacher Feedback</div>
                  <div class="card-subtitle">Observable Evidence from Classroom</div>
                </div>
              </div>
            </div>
            ${renderTeacherFeedbackList()}
          </div>

          <div class="glass-card">
            <div class="glass-card-header">
              <div class="card-title-group">
                <div class="card-title-icon"><i class="fas fa-home"></i></div>
                <div>
                  <div class="card-title">Home Environment Logs</div>
                  <div class="card-subtitle">Parent-Submitted Daily Routine</div>
                </div>
              </div>
            </div>
            ${renderParentObservationsList()}
          </div>
        </div>
      </div>
    `;

    mainContent.innerHTML = html;
    document.getElementById('openLogHomeObsBtn')?.addEventListener('click', openLogParentObservationModal);
  }

  // --- 3. TEACHER DASHBOARD VIEW ---
  function renderTeacherDashboard() {
    const data = store.data;
    const teacher = data.users.teacher;
    const roster = data.studentsRoster || [];

    let rosterRowsHtml = '';
    roster.forEach(st => {
      rosterRowsHtml += `
        <tr>
          <td>${st.id}</td>
          <td><strong>${st.name}</strong></td>
          <td><span class="badge ${st.mathScore >= 80 ? 'badge-success' : st.mathScore >= 70 ? 'badge-warning' : 'badge-danger'}">${st.mathScore}%</span></td>
          <td><span class="badge ${st.phyScore >= 80 ? 'badge-success' : st.phyScore >= 70 ? 'badge-warning' : 'badge-danger'}">${st.phyScore}%</span></td>
          <td>${st.attendance}%</td>
          <td><span class="badge ${st.status === 'Exceeding' ? 'badge-success' : 'badge-danger'}">${st.status}</span></td>
          <td>
            <button class="btn btn-secondary btn-sm roster-details-btn" data-studentid="${st.id}">View Profile</button>
          </td>
        </tr>
      `;
    });

    let html = `
      <div class="fade-in">
        <div class="page-header">
          <div>
            <h1 class="page-title">Teacher Portal: ${teacher.name}</h1>
            <p class="page-description">Assigned Classes: Grade 10-A, 10-B | Subjects: Mathematics & Physics</p>
          </div>
          <button class="btn btn-purple" id="openAddScoreBtn">
            <i class="fas fa-plus"></i> Enter Marks / Score
          </button>
        </div>

        <div class="metrics-grid" style="margin-top: 20px;">
          <div class="metric-card">
            <div class="metric-icon purple"><i class="fas fa-user-graduate"></i></div>
            <div class="metric-data">
              <span class="metric-value">28</span>
              <span class="metric-label">Assigned Students</span>
              <span class="metric-trend neutral">Grade 10-A</span>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon indigo"><i class="fas fa-clipboard-check"></i></div>
            <div class="metric-data">
              <span class="metric-value">79.2%</span>
              <span class="metric-label">Class Math Average</span>
              <span class="metric-trend down">-4.1% vs UT-1</span>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon cyan"><i class="fas fa-exclamation-triangle"></i></div>
            <div class="metric-data">
              <span class="metric-value">2 Students</span>
              <span class="metric-label">Support Suggested</span>
              <span class="metric-trend down">Alex M., David K.</span>
            </div>
          </div>
        </div>

        <div class="glass-card" style="margin-top: 28px;">
          <div class="glass-card-header">
            <div class="card-title-group">
              <div class="card-title-icon"><i class="fas fa-list"></i></div>
              <div>
                <div class="card-title">Student Academic Roster — Grade 10-A</div>
                <div class="card-subtitle">Official Marks & Attendance Tracking</div>
              </div>
            </div>
          </div>

          <div class="table-container">
            <table class="custom-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Student Name</th>
                  <th>Mathematics Score</th>
                  <th>Physics Score</th>
                  <th>Attendance</th>
                  <th>Support Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${rosterRowsHtml}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    mainContent.innerHTML = html;
    document.getElementById('openAddScoreBtn')?.addEventListener('click', openAddScoreModal);

    document.querySelectorAll('.roster-details-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const studentId = e.currentTarget.dataset.studentid;
        openStudentDetailsModal(studentId);
      });
    });
  }

  // --- ACADEMIC & MARKS DETAILED VIEW ---
  function renderAcademicView() {
    const data = store.data;
    const marks = data.marks;

    let rowsHtml = '';
    marks.forEach(m => {
      const subject = data.subjects.find(s => s.id === m.subjectId);
      rowsHtml += `
        <tr>
          <td><strong>${subject ? subject.name : m.subjectId}</strong></td>
          <td>${m.assessment}</td>
          <td>${m.obtained} / ${m.max}</td>
          <td>
            <span class="badge ${m.obtained >= 80 ? 'badge-success' : m.obtained >= 70 ? 'badge-warning' : 'badge-danger'}">
              ${((m.obtained / m.max) * 100).toFixed(0)}%
            </span>
          </td>
          <td>${m.date}</td>
          <td>${subject ? subject.teacher : ''}</td>
        </tr>
      `;
    });

    let html = `
      <div class="fade-in">
        <div class="page-header">
          <div>
            <h1 class="page-title">Academic Marks & Transcripts</h1>
            <p class="page-description">Detailed record of evaluations, subject breakdowns, and test scores.</p>
          </div>
        </div>

        <div class="glass-card" style="margin-top: 20px;">
          <div class="table-container">
            <table class="custom-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Assessment Name</th>
                  <th>Score Obtained</th>
                  <th>Percentage</th>
                  <th>Date Evaluated</th>
                  <th>Teacher</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHtml}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    mainContent.innerHTML = html;
  }

  // --- STUDY TRACKING VIEW ---
  function renderStudyTrackingView() {
    const sessions = store.data.studySessions;
    let rowsHtml = '';
    sessions.forEach(s => {
      const subject = store.data.subjects.find(sub => sub.id === s.subjectId);
      rowsHtml += `
        <tr>
          <td>${s.date}</td>
          <td><strong>${subject ? subject.name : s.subjectId}</strong></td>
          <td>${s.duration} mins</td>
          <td>${s.topic}</td>
          <td><span class="badge badge-success">${s.completion}</span></td>
        </tr>
      `;
    });

    let html = `
      <div class="fade-in">
        <div class="page-header">
          <div>
            <h1 class="page-title">Study Sessions & Learning Goals</h1>
            <p class="page-description">Track self-directed study hours and subject topics completed at home.</p>
          </div>
          <button class="btn btn-primary" id="openLogStudyBtn2">
            <i class="fas fa-plus"></i> Log Study Session
          </button>
        </div>

        <div class="glass-card" style="margin-top: 20px;">
          <div class="table-container">
            <table class="custom-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Subject</th>
                  <th>Duration</th>
                  <th>Topic Covered</th>
                  <th>Task Completion</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHtml}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    mainContent.innerHTML = html;
    document.getElementById('openLogStudyBtn2')?.addEventListener('click', openLogStudyModal);
  }

  // --- DAILY PLANNER VIEW ---
  function renderDailyPlannerView() {
    const plan = ai.generateDailyPlan(2.5, 'Mathematics');
    let scheduleRowsHtml = '';

    plan.schedule.forEach(slot => {
      scheduleRowsHtml += `
        <div class="recommendation-card ${slot.type === 'study' ? 'academic' : slot.type === 'break' ? 'habit' : ''}">
          <div class="rec-header">
            <span class="rec-type">${slot.timeSlot} (${slot.duration})</span>
            <span class="badge badge-purple">${slot.type.toUpperCase()}</span>
          </div>
          <div style="font-weight: 700; font-size: 15px; margin-bottom: 4px;">${slot.task}</div>
          <div style="font-size: 12px; color: var(--text-muted);">Tip: ${slot.tip}</div>
        </div>
      `;
    });

    let html = `
      <div class="fade-in">
        <div class="page-header">
          <div>
            <h1 class="page-title">AI Smart Daily Schedule Planner</h1>
            <p class="page-description">Automated time-blocking balancing study focus, breaks, and rest periods.</p>
          </div>
          <button class="btn btn-purple" id="regenPlanBtn">
            <i class="fas fa-sync-alt"></i> Regenerate Schedule
          </button>
        </div>

        <div class="glass-card" style="margin-top: 20px;">
          <div style="margin-bottom: 20px; display: flex; gap: 20px; align-items: center; background: #f8fafc; padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border-light);">
            <div><strong>Available Study Time:</strong> 2.5 Hours</div>
            <div><strong>Target Focus Subject:</strong> Mathematics</div>
            <div><strong>Break Ratio:</strong> 15 mins per 45 min block</div>
          </div>
          ${scheduleRowsHtml}
        </div>
      </div>
    `;

    mainContent.innerHTML = html;
    document.getElementById('regenPlanBtn')?.addEventListener('click', () => {
      showToast('Regenerated personalized schedule based on deadlines!');
      renderDailyPlannerView();
    });
  }

  // --- HEALTH & MOOD ROUTINE VIEW ---
  function renderHealthMoodView() {
    const data = store.data;
    const latestHealth = data.healthLogs[data.healthLogs.length - 1] || {};

    let html = `
      <div class="fade-in">
        <div class="page-header">
          <div>
            <h1 class="page-title">Health Routine & Well-Being Tracker</h1>
            <p class="page-description">Record sleep, hydration, exercise, and emotional mood check-ins.</p>
          </div>
          <div style="display: flex; gap: 10px;">
            <button class="btn btn-emerald" id="openLogHealthBtn">
              <i class="fas fa-heartbeat"></i> Log Health Routine
            </button>
            <button class="btn btn-cyan" id="openLogMoodBtn">
              <i class="fas fa-smile"></i> Mood Check-In
            </button>
          </div>
        </div>

        <div class="metrics-grid" style="margin-top: 20px;">
          <div class="metric-card">
            <div class="metric-icon cyan"><i class="fas fa-bed"></i></div>
            <div class="metric-data">
              <span class="metric-value">${latestHealth.sleepHours || 7} hrs</span>
              <span class="metric-label">Last Sleep Duration</span>
              <span class="metric-trend neutral">${latestHealth.note || 'Normal sleep'}</span>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon indigo"><i class="fas fa-tint"></i></div>
            <div class="metric-data">
              <span class="metric-value">${latestHealth.waterLiters || 2.0} L</span>
              <span class="metric-label">Water Intake Today</span>
              <span class="metric-trend up">Hydrated</span>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon emerald"><i class="fas fa-running"></i></div>
            <div class="metric-data">
              <span class="metric-value">${latestHealth.exerciseMins || 20} mins</span>
              <span class="metric-label">Physical Activity</span>
              <span class="metric-trend up">Active</span>
            </div>
          </div>
        </div>

        <div class="glass-card" style="margin-top: 28px;">
          <div class="glass-card-header">
            <div class="card-title-group">
              <div class="card-title-icon"><i class="fas fa-history"></i></div>
              <div>
                <div class="card-title">Recent Mood & Stress Check-in History</div>
                <div class="card-subtitle">Non-clinical supportive emotional monitoring</div>
              </div>
            </div>
          </div>
          ${renderMoodHistoryList()}
        </div>
      </div>
    `;

    mainContent.innerHTML = html;
    document.getElementById('openLogHealthBtn')?.addEventListener('click', openLogHealthModal);
    document.getElementById('openLogMoodBtn')?.addEventListener('click', openLogMoodModal);
  }

  // --- HOME ROUTINE VIEW (Parent) ---
  function renderHomeRoutineView() {
    let html = `
      <div class="fade-in">
        <div class="page-header">
          <div>
            <h1 class="page-title">Home Routine & Parental Observations</h1>
            <p class="page-description">Record home study discipline, sleep habits, and positive routine observations.</p>
          </div>
          <button class="btn btn-emerald" id="openLogParentObsBtn2">
            <i class="fas fa-plus"></i> Add Home Observation
          </button>
        </div>

        <div class="glass-card" style="margin-top: 20px;">
          ${renderParentObservationsList()}
        </div>
      </div>
    `;

    mainContent.innerHTML = html;
    document.getElementById('openLogParentObsBtn2')?.addEventListener('click', openLogParentObservationModal);
  }

  // --- PRIVACY & CONSENT VIEW (Parent) ---
  function renderConsentView() {
    const consent = store.data.consentSettings;

    let html = `
      <div class="fade-in">
        <div class="page-header">
          <div>
            <h1 class="page-title">Privacy & Consent Controls</h1>
            <p class="page-description">Manage parental consent policies and data-sharing scopes in accordance with DPDP regulations.</p>
          </div>
        </div>

        <div class="glass-card" style="margin-top: 20px;">
          <div class="form-group">
            <label style="display: flex; align-items: center; justify-content: space-between; font-weight: 700; cursor: pointer;">
              <span>Share Health & Routine Data with Teachers</span>
              <input type="checkbox" id="consentHealth" ${consent.shareHealthLogsWithTeacher ? 'checked' : ''} style="width: 20px; height: 20px;">
            </label>
            <p style="font-size: 12px; color: var(--text-muted);">If disabled, sleep and food logs are kept private to parent and student views only.</p>
          </div>

          <div class="form-group" style="margin-top: 18px;">
            <label style="display: flex; align-items: center; justify-content: space-between; font-weight: 700; cursor: pointer;">
              <span>Share Aggregated Mood Summaries with Parent</span>
              <input type="checkbox" id="consentMood" ${consent.shareMoodSummaryWithParent ? 'checked' : ''} style="width: 20px; height: 20px;">
            </label>
            <p style="font-size: 12px; color: var(--text-muted);">Allows parent to view weekly mood trends while keeping specific text notes private if desired.</p>
          </div>

          <div class="form-group" style="margin-top: 18px;">
            <label style="display: flex; align-items: center; justify-content: space-between; font-weight: 700; cursor: pointer;">
              <span>AI Decision-Support Recommendation Engine</span>
              <input type="checkbox" id="consentAi" ${consent.aiRecommendationEngineActive ? 'checked' : ''} style="width: 20px; height: 20px;">
            </label>
            <p style="font-size: 12px; color: var(--text-muted);">Enable rule-based decision support for personalized study plans and early support alerts.</p>
          </div>

          <button class="btn btn-primary" id="saveConsentBtn" style="margin-top: 16px;">
            <i class="fas fa-save"></i> Save Consent Policy Settings
          </button>
        </div>
      </div>
    `;

    mainContent.innerHTML = html;
    document.getElementById('saveConsentBtn')?.addEventListener('click', () => {
      store.updateConsent({
        shareHealthLogsWithTeacher: document.getElementById('consentHealth').checked,
        shareMoodSummaryWithParent: document.getElementById('consentMood').checked,
        aiRecommendationEngineActive: document.getElementById('consentAi').checked
      });
      showToast('Consent policies updated successfully!');
    });
  }

  // --- TEACHER MARKS & ATTENDANCE ENTRY VIEW ---
  function renderTeacherMarksEntryView() {
    let html = `
      <div class="fade-in">
        <div class="page-header">
          <div>
            <h1 class="page-title">Marks & Attendance Management</h1>
            <p class="page-description">Record official academic assessment marks and daily attendance for Grade 10-A.</p>
          </div>
          <button class="btn btn-purple" id="openAddScoreBtn2">
            <i class="fas fa-plus"></i> Enter Marks
          </button>
        </div>

        <div class="glass-card" style="margin-top: 20px;">
          ${renderAcademicViewTable()}
        </div>
      </div>
    `;

    mainContent.innerHTML = html;
    document.getElementById('openAddScoreBtn2')?.addEventListener('click', openAddScoreModal);
  }

  // --- TEACHER ASSIGNMENTS MANAGEMENT VIEW ---
  function renderTeacherAssignmentsView() {
    const assignments = store.data.assignments;
    let rowsHtml = '';

    assignments.forEach(a => {
      const subject = store.data.subjects.find(s => s.id === a.subjectId);
      rowsHtml += `
        <tr>
          <td><strong>${a.title}</strong></td>
          <td>${subject ? subject.name : a.subjectId}</td>
          <td>${a.dueDate}</td>
          <td>${a.weight}</td>
          <td><span class="badge ${a.status === 'Completed' ? 'badge-success' : 'badge-warning'}">${a.status}</span></td>
        </tr>
      `;
    });

    let html = `
      <div class="fade-in">
        <div class="page-header">
          <div>
            <h1 class="page-title">Assignment Management</h1>
            <p class="page-description">Create, assign, and track subject deadlines for Grade 10-A.</p>
          </div>
          <button class="btn btn-purple" id="openCreateAssignmentBtn">
            <i class="fas fa-plus"></i> Create Assignment
          </button>
        </div>

        <div class="glass-card" style="margin-top: 20px;">
          <div class="table-container">
            <table class="custom-table">
              <thead>
                <tr>
                  <th>Assignment Title</th>
                  <th>Subject</th>
                  <th>Due Date</th>
                  <th>Grade Weight</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHtml}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    mainContent.innerHTML = html;
    document.getElementById('openCreateAssignmentBtn')?.addEventListener('click', openCreateAssignmentModal);
  }

  // --- TEACHER OBSERVATIONS VIEW ---
  function renderTeacherObservationsView() {
    let html = `
      <div class="fade-in">
        <div class="page-header">
          <div>
            <h1 class="page-title">Classroom Observations & Constructive Feedback</h1>
            <p class="page-description">Record evidence-based learning observations and constructive practice advice.</p>
          </div>
          <button class="btn btn-purple" id="openAddTeacherFeedbackBtn">
            <i class="fas fa-plus"></i> Add Classroom Feedback
          </button>
        </div>

        <div class="glass-card" style="margin-top: 20px;">
          ${renderTeacherFeedbackList()}
        </div>
      </div>
    `;

    mainContent.innerHTML = html;
    document.getElementById('openAddTeacherFeedbackBtn')?.addEventListener('click', openAddTeacherFeedbackModal);
  }

  // --- MESSAGES VIEW ---
  function renderMessagesView() {
    const messages = store.data.messages;
    const currentUser = store.getCurrentUser();

    let msgsHtml = '';
    messages.forEach(m => {
      const isMe = m.senderId === currentUser.id;
      msgsHtml += `
        <div class="recommendation-card ${isMe ? 'academic' : ''}" style="margin-bottom: 12px;">
          <div class="rec-header">
            <span class="rec-type">${m.senderName}</span>
            <span style="font-size: 11px; color: var(--text-dim);">${m.timestamp}</span>
          </div>
          <div class="rec-text">${m.text}</div>
        </div>
      `;
    });

    let html = `
      <div class="fade-in">
        <div class="page-header">
          <div>
            <h1 class="page-title">Direct Messages & Communication</h1>
            <p class="page-description">Role-filtered messaging between Parent, Teacher, and Student.</p>
          </div>
        </div>

        <div class="glass-card" style="margin-top: 20px;">
          <div style="max-height: 400px; overflow-y: auto; margin-bottom: 20px;">
            ${msgsHtml || '<p style="color: var(--text-muted);">No messages found.</p>'}
          </div>

          <div style="display: flex; gap: 10px;">
            <input type="text" id="msgTextInput" class="form-control" placeholder="Type a message to connected portal user...">
            <button class="btn btn-primary" id="sendMsgBtn"><i class="fas fa-paper-plane"></i> Send</button>
          </div>
        </div>
      </div>
    `;

    mainContent.innerHTML = html;
    document.getElementById('sendMsgBtn')?.addEventListener('click', () => {
      const text = document.getElementById('msgTextInput').value.trim();
      if (!text) return;

      store.addMessage({
        senderId: currentUser.id,
        senderName: `${currentUser.name} (${store.getRole()})`,
        receiverId: store.getRole() === 'parent' ? 'TCH-3001' : 'PAR-2001',
        text
      });

      showToast('Message sent!');
      renderMessagesView();
    });
  }

  // --- AI INSIGHTS VIEW ---
  function renderAiInsightsView() {
    const acadRecs = ai.getAcademicRecommendations();
    const habitRecs = ai.getLifestyleRecommendations();
    const alerts = ai.getEarlySupportAlerts();

    let allHtml = '';

    alerts.forEach(a => {
      allHtml += `
        <div class="recommendation-card alert">
          <div class="rec-header">
            <span class="rec-type">${a.severity}</span>
            <span class="badge badge-danger">EARLY SUPPORT ALERT</span>
          </div>
          <div style="font-weight: 700; font-size: 15px; margin-bottom: 6px;">${a.title}</div>
          <div class="rec-text">${a.summary}</div>
          <div class="rec-evidence"><span class="rec-evidence-label">Evidence Base:</span> ${a.evidenceText}</div>
          <div style="margin-top: 8px; font-size: 12px; color: #4f46e5;"><strong>Action Item:</strong> ${a.suggestedAction}</div>
        </div>
      `;
    });

    acadRecs.forEach(r => {
      allHtml += `
        <div class="recommendation-card academic">
          <div class="rec-header">
            <span class="rec-type">${r.category}</span>
            <span class="badge badge-info">ACADEMIC RULE</span>
          </div>
          <div style="font-weight: 700; font-size: 15px; margin-bottom: 6px;">${r.title}</div>
          <div class="rec-text">${r.recommendation}</div>
          <div class="rec-evidence"><span class="rec-evidence-label">Evidence Base:</span> ${r.evidence}</div>
        </div>
      `;
    });

    habitRecs.forEach(r => {
      allHtml += `
        <div class="recommendation-card habit">
          <div class="rec-header">
            <span class="rec-type">${r.category}</span>
            <span class="badge badge-success">HABIT RULE</span>
          </div>
          <div style="font-weight: 700; font-size: 15px; margin-bottom: 6px;">${r.title}</div>
          <div class="rec-text">${r.recommendation}</div>
          <div class="rec-evidence"><span class="rec-evidence-label">Evidence Base:</span> ${r.evidence}</div>
        </div>
      `;
    });

    let html = `
      <div class="fade-in">
        <div class="page-header">
          <div>
            <h1 class="page-title">Explainable AI Recommendations & Support Alerts</h1>
            <p class="page-description">Automated data pattern analysis with transparent evidence and action items.</p>
          </div>
        </div>

        <div class="glass-card" style="margin-top: 20px;">
          ${allHtml}
        </div>
      </div>
    `;

    mainContent.innerHTML = html;
  }

  // --- AUDIT LOGS VIEW ---
  function renderAuditLogsView() {
    const logs = store.data.auditLogs;
    let rowsHtml = '';
    logs.forEach(l => {
      rowsHtml += `
        <tr>
          <td>${l.timestamp}</td>
          <td><strong>${l.user}</strong></td>
          <td>${l.action}</td>
        </tr>
      `;
    });

    let html = `
      <div class="fade-in">
        <div class="page-header">
          <div>
            <h1 class="page-title">Audit & System Compliance Logs</h1>
            <p class="page-description">Traceable log of sensitive data uploads, mark edits, and consent modifications.</p>
          </div>
        </div>

        <div class="glass-card" style="margin-top: 20px;">
          <div class="table-container">
            <table class="custom-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>User & Role</th>
                  <th>Action Executed</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHtml}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    mainContent.innerHTML = html;
  }

  // --- HELPER RENDERING FUNCTIONS ---
  function calculateAverageMark(marks) {
    if (!marks || marks.length === 0) return 0;
    const total = marks.reduce((sum, m) => sum + m.obtained, 0);
    return (total / marks.length).toFixed(1);
  }

  function renderTeacherFeedbackList() {
    const feedback = store.data.teacherFeedback;
    let html = '';
    feedback.forEach(f => {
      html += `
        <div style="background: #f8fafc; padding: 14px; border-radius: var(--radius-md); margin-bottom: 12px; border: 1px solid var(--border-light);">
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-weight: 700; color: var(--secondary);">${f.category}</span>
            <span style="font-size: 11px; color: var(--text-dim);">${f.date}</span>
          </div>
          <div style="font-size: 13px; margin-bottom: 6px;"><strong>Observable Evidence:</strong> "${f.evidenceText}"</div>
          <div style="font-size: 13px; color: var(--primary);"><strong>Constructive Practice:</strong> ${f.constructiveAdvice}</div>
        </div>
      `;
    });
    return html || '<p style="color: var(--text-muted);">No teacher feedback recorded yet.</p>';
  }

  function renderParentObservationsList() {
    const obs = store.data.parentObservations;
    let html = '';
    obs.forEach(o => {
      html += `
        <div style="background: #f8fafc; padding: 14px; border-radius: var(--radius-md); margin-bottom: 12px; border: 1px solid var(--border-light);">
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-weight: 700; color: var(--accent-emerald);">${o.category}</span>
            <span style="font-size: 11px; color: var(--text-dim);">${o.date}</span>
          </div>
          <div style="font-size: 13px; margin-bottom: 6px;"><strong>Home Observation:</strong> "${o.observationText}"</div>
          <div style="font-size: 13px; color: #047857;"><strong>Support Action Taken:</strong> ${o.supportActionTaken}</div>
        </div>
      `;
    });
    return html || '<p style="color: var(--text-muted);">No home routine observations logged yet.</p>';
  }

  function renderMoodHistoryList() {
    const logs = store.data.moodLogs;
    let html = '';
    logs.forEach(m => {
      html += `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; border-bottom: 1px solid var(--border-light);">
          <div>
            <span style="font-weight: 700; font-size: 14px;">Mood: Level ${m.mood}/5 | Stress: Level ${m.stress}/5</span>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">"${m.note || 'No note'}"</div>
          </div>
          <span style="font-size: 12px; color: var(--text-dim);">${m.date}</span>
        </div>
      `;
    });
    return html;
  }

  function renderAcademicViewTable() {
    const marks = store.data.marks;
    let rowsHtml = '';
    marks.forEach(m => {
      const subject = store.data.subjects.find(s => s.id === m.subjectId);
      const student = store.data.studentsRoster.find(st => st.id === m.studentId) || { name: 'Alex Morgan' };
      rowsHtml += `
        <tr>
          <td>${student.name}</td>
          <td>${subject ? subject.name : m.subjectId}</td>
          <td>${m.assessment}</td>
          <td>${m.obtained} / ${m.max}</td>
          <td>${m.date}</td>
        </tr>
      `;
    });

    return `
      <div class="table-container">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Subject</th>
              <th>Assessment</th>
              <th>Score</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    `;
  }

  // --- CHART RENDERING ENGINE (Chart.js) ---
  function renderMarksChart() {
    const ctx = document.getElementById('marksChart');
    if (!ctx || typeof Chart === 'undefined') return;

    if (charts.marks) charts.marks.destroy();

    const marks = store.data.marks.filter(m => m.studentId === 'STU-1001' && m.assessment === 'Midterm Exam');
    const labels = marks.map(m => {
      const s = store.data.subjects.find(sub => sub.id === m.subjectId);
      return s ? s.name : m.subjectId;
    });
    const dataValues = marks.map(m => m.obtained);

    charts.marks = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Midterm Score (%)',
          data: dataValues,
          backgroundColor: [
            'rgba(79, 70, 229, 0.8)',
            'rgba(6, 182, 212, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(139, 92, 246, 0.8)'
          ],
          borderColor: [
            '#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6'
          ],
          borderWidth: 1.5,
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { color: '#64748b' }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#64748b' }
          }
        }
      }
    });
  }

  function renderRoutineChart() {
    const ctx = document.getElementById('routineChart');
    if (!ctx || typeof Chart === 'undefined') return;

    if (charts.routine) charts.routine.destroy();

    const logs = store.data.healthLogs;
    const labels = logs.map(l => l.date.substring(5));
    const sleepData = logs.map(l => l.sleepHours);
    const waterData = logs.map(l => l.waterLiters * 2);

    charts.routine = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Sleep Duration (Hours)',
            data: sleepData,
            borderColor: '#06b6d4',
            backgroundColor: 'rgba(6, 182, 212, 0.1)',
            tension: 0.3,
            fill: true
          },
          {
            label: 'Water Intake (x2 Liters)',
            data: waterData,
            borderColor: '#10b981',
            backgroundColor: 'transparent',
            tension: 0.3,
            borderDash: [5, 5]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#64748b' } }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 10,
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { color: '#64748b' }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#64748b' }
          }
        }
      }
    });
  }

  // --- MODAL CONTROLLERS ---
  function openModal(title, bodyHtml) {
    modalContainer.innerHTML = `
      <div class="modal-header">
        <div class="modal-title">${title}</div>
        <button class="modal-close" id="modalCloseBtn">&times;</button>
      </div>
      <div>${bodyHtml}</div>
    `;
    modalOverlay.classList.add('active');
    document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // Student Details Modal for Teacher View
  function openStudentDetailsModal(studentId) {
    const student = store.data.studentsRoster.find(s => s.id === studentId) || { name: 'Alex Morgan', mathScore: 62, phyScore: 85, attendance: 94, status: 'Needs Practice' };
    const html = `
      <div>
        <div style="display: flex; gap: 16px; align-items: center; margin-bottom: 16px;">
          <div class="user-avatar" style="width: 48px; height: 48px; font-size: 18px;">${student.name.split(' ').map(n=>n[0]).join('')}</div>
          <div>
            <h3 style="font-size: 16px; font-weight: 800; color: var(--text-dark);">${student.name} (${studentId})</h3>
            <span style="font-size: 12px; color: var(--text-muted);">${student.class} | Assigned Teacher: Dr. Robert Vance</span>
          </div>
        </div>

        <div style="background: #f8fafc; padding: 14px; border-radius: var(--radius-md); margin-bottom: 14px; border: 1px solid var(--border-light);">
          <div style="font-size: 12px; font-weight: 700; color: var(--primary); margin-bottom: 6px;">SUBJECT MARKS BREAKDOWN</div>
          <div style="display: flex; justify-content: space-between; font-size: 13px;"><span>Mathematics:</span> <strong>${student.mathScore}%</strong></div>
          <div style="display: flex; justify-content: space-between; font-size: 13px; margin-top: 4px;"><span>Physics:</span> <strong>${student.phyScore}%</strong></div>
          <div style="display: flex; justify-content: space-between; font-size: 13px; margin-top: 4px;"><span>Attendance Rate:</span> <strong>${student.attendance}%</strong></div>
        </div>

        <div style="background: #f8fafc; padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border-light);">
          <div style="font-size: 12px; font-weight: 700; color: #047857; margin-bottom: 6px;">EXPLAINABLE AI ACADEMIC SUMMARY</div>
          <p style="font-size: 13px; color: var(--text-dark); margin: 0;">
            ${student.status === 'Needs Practice' 
              ? 'Mathematics performance indicates recent score drops. Recommend 30-min targeted practice sessions.' 
              : 'Student shows consistently high academic retention and active lab engagement.'}
          </p>
        </div>
      </div>
    `;
    openModal(`Student Academic Profile: ${student.name}`, html);
  }

  // Create Assignment Modal (Teacher)
  function openCreateAssignmentModal() {
    let subjectOptions = '';
    store.data.subjects.forEach(s => {
      subjectOptions += `<option value="${s.id}">${s.name}</option>`;
    });

    const html = `
      <form id="createAssignmentForm">
        <div class="form-group">
          <label class="form-label">Subject</label>
          <select id="asgnSubject" class="form-control">
            ${subjectOptions}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Assignment Title</label>
          <input type="text" id="asgnTitle" class="form-control" placeholder="e.g. Kinematics Numerical Worksheet" required>
        </div>

        <div class="form-group">
          <label class="form-label">Due Date</label>
          <input type="date" id="asgnDueDate" class="form-control" value="2026-10-10" required>
        </div>

        <div class="form-group">
          <label class="form-label">Grade Weight</label>
          <input type="text" id="asgnWeight" class="form-control" value="15%" required>
        </div>

        <button type="submit" class="btn btn-purple" style="width: 100%; margin-top: 10px;">
          <i class="fas fa-plus"></i> Publish Assignment
        </button>
      </form>
    `;

    openModal('Create New Class Assignment', html);

    document.getElementById('createAssignmentForm').addEventListener('submit', (e) => {
      e.preventDefault();
      store.addAssignment({
        subjectId: document.getElementById('asgnSubject').value,
        title: document.getElementById('asgnTitle').value,
        dueDate: document.getElementById('asgnDueDate').value,
        status: 'Pending',
        weight: document.getElementById('asgnWeight').value
      });

      closeModal();
      showToast('Assignment created and published to students!');
      renderApp();
    });
  }

  // Log Study Session Modal
  function openLogStudyModal() {
    let subjectOptions = '';
    store.data.subjects.forEach(s => {
      subjectOptions += `<option value="${s.id}">${s.name}</option>`;
    });

    const html = `
      <form id="studyForm">
        <div class="form-group">
          <label class="form-label">Subject</label>
          <select id="studySubject" class="form-control">
            ${subjectOptions}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Duration (Minutes)</label>
          <input type="number" id="studyDuration" class="form-control" value="45" min="10" max="180" required>
        </div>

        <div class="form-group">
          <label class="form-label">Topic Covered</label>
          <input type="text" id="studyTopic" class="form-control" placeholder="e.g. Factoring Polynomials" required>
        </div>

        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 10px;">
          <i class="fas fa-check"></i> Save Study Log
        </button>
      </form>
    `;

    openModal('Log Self-Directed Study Session', html);

    document.getElementById('studyForm').addEventListener('submit', (e) => {
      e.preventDefault();
      store.addStudySession({
        date: new Date().toISOString().split('T')[0],
        subjectId: document.getElementById('studySubject').value,
        duration: parseInt(document.getElementById('studyDuration').value),
        topic: document.getElementById('studyTopic').value || 'Subject Revision',
        completion: '100%'
      });

      closeModal();
      showToast('Study session recorded successfully!');
      renderApp();
    });
  }

  // Record Parent Observation Modal
  function openLogParentObservationModal() {
    const html = `
      <form id="parentObsForm">
        <div class="form-group">
          <label class="form-label">Category</label>
          <select id="obsCategory" class="form-control">
            <option value="Home Study Discipline">Home Study Discipline</option>
            <option value="Sleep & Routine">Sleep & Routine</option>
            <option value="Screen Time Habits">Screen Time Habits</option>
            <option value="General Well-being">General Well-being</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Home Observation</label>
          <textarea id="obsText" class="form-control" rows="3" placeholder="Describe home study routine or habit observed..." required></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Support Action Taken</label>
          <input type="text" id="obsAction" class="form-control" placeholder="e.g. Set bedtime reminder at 10:00 PM" required>
        </div>

        <button type="submit" class="btn btn-emerald" style="width: 100%; margin-top: 10px;">
          <i class="fas fa-save"></i> Submit Home Observation
        </button>
      </form>
    `;

    openModal('Record Home Routine Observation', html);

    document.getElementById('parentObsForm').addEventListener('submit', (e) => {
      e.preventDefault();
      store.addParentObservation({
        parentId: 'PAR-2001',
        studentId: 'STU-1001',
        category: document.getElementById('obsCategory').value,
        observationText: document.getElementById('obsText').value,
        supportActionTaken: document.getElementById('obsAction').value
      });

      closeModal();
      showToast('Parent observation recorded!');
      renderApp();
    });
  }

  // Teacher Enter Marks Modal
  function openAddScoreModal() {
    let subjectOptions = '';
    store.data.subjects.forEach(s => {
      subjectOptions += `<option value="${s.id}">${s.name}</option>`;
    });

    let studentOptions = '';
    store.data.studentsRoster.forEach(st => {
      studentOptions += `<option value="${st.id}">${st.name} (${st.class})</option>`;
    });

    const html = `
      <form id="marksForm">
        <div class="form-group">
          <label class="form-label">Student</label>
          <select id="markStudentId" class="form-control">
            ${studentOptions}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Subject</label>
          <select id="markSubject" class="form-control">
            ${subjectOptions}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Assessment Title</label>
          <input type="text" id="assessmentTitle" class="form-control" value="Unit Test 3" required>
        </div>

        <div class="form-group">
          <label class="form-label">Score Obtained (out of 100)</label>
          <input type="number" id="scoreVal" class="form-control" value="82" min="0" max="100" required>
        </div>

        <button type="submit" class="btn btn-purple" style="width: 100%; margin-top: 10px;">
          <i class="fas fa-check-circle"></i> Submit Marks Record
        </button>
      </form>
    `;

    openModal('Enter Marks / Evaluation Record', html);

    document.getElementById('marksForm').addEventListener('submit', (e) => {
      e.preventDefault();
      store.addMark({
        studentId: document.getElementById('markStudentId').value,
        subjectId: document.getElementById('markSubject').value,
        assessment: document.getElementById('assessmentTitle').value,
        obtained: parseInt(document.getElementById('scoreVal').value),
        max: 100,
        date: new Date().toISOString().split('T')[0]
      });

      closeModal();
      showToast('Marks record uploaded securely!');
      renderApp();
    });
  }

  // Teacher Feedback Modal
  function openAddTeacherFeedbackModal() {
    let subjectOptions = '';
    store.data.subjects.forEach(s => {
      subjectOptions += `<option value="${s.id}">${s.name}</option>`;
    });

    const html = `
      <form id="tfForm">
        <div class="form-group">
          <label class="form-label">Subject</label>
          <select id="tfSubject" class="form-control">
            ${subjectOptions}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Category</label>
          <select id="tfCategory" class="form-control">
            <option value="Academic Progress">Academic Progress</option>
            <option value="Classroom Engagement">Classroom Engagement</option>
            <option value="Group Collaboration">Group Collaboration</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Observable Evidence</label>
          <textarea id="tfEvidence" class="form-control" rows="3" placeholder="State concrete evidence e.g. 'Submitted assignment 2 days early and led peer discussion'" required></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Constructive Practice Advice</label>
          <input type="text" id="tfAdvice" class="form-control" placeholder="e.g. Practice 2 numerical problems daily" required>
        </div>

        <button type="submit" class="btn btn-purple" style="width: 100%; margin-top: 10px;">
          <i class="fas fa-check"></i> Submit Feedback
        </button>
      </form>
    `;

    openModal('Record Classroom Observation Feedback', html);

    document.getElementById('tfForm').addEventListener('submit', (e) => {
      e.preventDefault();
      store.addTeacherFeedback({
        teacherId: 'TCH-3001',
        studentId: 'STU-1001',
        subjectId: document.getElementById('tfSubject').value,
        category: document.getElementById('tfCategory').value,
        evidenceText: document.getElementById('tfEvidence').value,
        constructiveAdvice: document.getElementById('tfAdvice').value
      });

      closeModal();
      showToast('Classroom observation feedback saved!');
      renderApp();
    });
  }

  // Health Routine Log Modal
  function openLogHealthModal() {
    const html = `
      <form id="healthForm">
        <div class="form-group">
          <label class="form-label">Sleep Duration (Hours)</label>
          <input type="number" step="0.5" id="hSleep" class="form-control" value="7.5" min="1" max="14" required>
        </div>

        <div class="form-group">
          <label class="form-label">Water Intake (Liters)</label>
          <input type="number" step="0.1" id="hWater" class="form-control" value="2.0" min="0.5" max="6.0" required>
        </div>

        <div class="form-group">
          <label class="form-label">Physical Activity (Minutes)</label>
          <input type="number" id="hExercise" class="form-control" value="30" min="0" max="300" required>
        </div>

        <div class="form-group">
          <label class="form-label">Routine Note</label>
          <input type="text" id="hNote" class="form-control" placeholder="e.g. Felt energized after morning walk">
        </div>

        <button type="submit" class="btn btn-emerald" style="width: 100%; margin-top: 10px;">
          <i class="fas fa-save"></i> Save Health Log
        </button>
      </form>
    `;

    openModal('Log Daily Health & Routine', html);

    document.getElementById('healthForm').addEventListener('submit', (e) => {
      e.preventDefault();
      store.addHealthLog({
        date: new Date().toISOString().split('T')[0],
        sleepHours: parseFloat(document.getElementById('hSleep').value),
        waterLiters: parseFloat(document.getElementById('hWater').value),
        exerciseMins: parseInt(document.getElementById('hExercise').value),
        energy: 'High',
        note: document.getElementById('hNote').value
      });

      closeModal();
      showToast('Health routine logged!');
      renderApp();
    });
  }

  // Mood Check-in Modal
  function openLogMoodModal() {
    let selectedMood = 4;

    const html = `
      <div>
        <label class="form-label">Select Mood Rating</label>
        <div class="mood-picker">
          <div class="mood-option" data-mood="1">
            <span class="mood-emoji">😫</span>
            <span class="mood-label">Low</span>
          </div>
          <div class="mood-option" data-mood="2">
            <span class="mood-emoji">😕</span>
            <span class="mood-label">Stressed</span>
          </div>
          <div class="mood-option" data-mood="3">
            <span class="mood-emoji">😐</span>
            <span class="mood-label">Okay</span>
          </div>
          <div class="mood-option selected" data-mood="4">
            <span class="mood-emoji">😊</span>
            <span class="mood-label">Good</span>
          </div>
          <div class="mood-option" data-mood="5">
            <span class="mood-emoji">🚀</span>
            <span class="mood-label">Great</span>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Perceived Academic Stress Level (1 = None, 5 = High)</label>
          <input type="range" id="mStress" min="1" max="5" value="2" class="form-control">
        </div>

        <div class="form-group">
          <label class="form-label">Optional Personal Reflection</label>
          <input type="text" id="mNote" class="form-control" placeholder="What is on your mind today?">
        </div>

        <button class="btn btn-cyan" id="saveMoodBtn" style="width: 100%; margin-top: 10px;">
          <i class="fas fa-check"></i> Submit Mood Check-In
        </button>
      </div>
    `;

    openModal('Daily Mood & Well-Being Check-In', html);

    document.querySelectorAll('.mood-option').forEach(opt => {
      opt.addEventListener('click', () => {
        document.querySelectorAll('.mood-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        selectedMood = parseInt(opt.dataset.mood);
      });
    });

    document.getElementById('saveMoodBtn').addEventListener('click', () => {
      store.addMoodLog({
        date: new Date().toISOString().split('T')[0],
        mood: selectedMood,
        stress: parseInt(document.getElementById('mStress').value),
        note: document.getElementById('mNote').value
      });

      closeModal();
      showToast('Mood check-in submitted!');
      renderApp();
    });
  }

  // --- AI DRAWER SETUP ---
  function setupAiDrawer() {
    toggleAiBtn?.addEventListener('click', () => {
      aiDrawer.classList.toggle('active');
    });

    closeAiDrawer?.addEventListener('click', () => {
      aiDrawer.classList.remove('active');
    });

    sendAiMsgBtn?.addEventListener('click', handleAiSend);
    aiInput?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleAiSend();
    });
  }

  function handleAiSend() {
    const text = aiInput.value.trim();
    if (!text) return;

    appendChatBubble(text, 'user');
    aiInput.value = '';

    setTimeout(() => {
      const res = ai.processChatQuery(text, store.getRole());
      appendChatBubble(res.reply, 'bot', res.source);
    }, 400);
  }

  function appendChatBubble(msg, type, sourceInfo = '') {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${type}`;
    
    let html = msg.replace(/\n/g, '<br>');
    if (sourceInfo) {
      html += `<div style="font-size: 10px; color: #4f46e5; margin-top: 6px; font-weight: 700;">Source: ${sourceInfo}</div>`;
    }

    bubble.innerHTML = html;
    aiMessages.appendChild(bubble);
    aiMessages.scrollTop = aiMessages.scrollHeight;
  }

  // Toast Helper
  function showToast(msg) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas fa-check-circle" style="color: #047857; margin-right: 8px;"></i> ${msg}`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3500);
  }

  // --- ROLE-SPECIFIC LOGIN MODAL SYSTEM ---
  function openRoleLoginModal(targetRole = 'student') {
    let currentModalRole = targetRole === 'landing' ? 'student' : targetRole;

    function renderModalHtml(role) {
      let title = '';
      let subtitle = '';
      let decorBadges = '';

      if (role === 'student') {
        title = 'Welcome back, learner! 📚';
        subtitle = 'Ready to continue your journey?';
        decorBadges = '<span>📚 Books</span> <span>📓 Notes</span> <span>🎓 Cap</span>';
      } else if (role === 'teacher') {
        title = 'Welcome back, Teacher! 🍎';
        subtitle = "Let's help students move forward.";
        decorBadges = '<span>📋 Roster</span> <span>🏫 Class</span> <span>🖊️ Pen</span>';
      } else if (role === 'parent') {
        title = 'Welcome back! 🏡';
        subtitle = "Stay connected with your child's journey.";
        decorBadges = '<span>🏠 Home</span> <span>❤️ Care</span> <span>🌿 Growth</span>';
      }

      return `
        <div class="role-login-modal-wrap">
          <div class="role-tabs-header">
            <button type="button" class="role-tab-btn ${role === 'student' ? 'active student' : ''}" data-target="student">
              <i class="fas fa-user-graduate"></i> Student
            </button>
            <button type="button" class="role-tab-btn ${role === 'parent' ? 'active parent' : ''}" data-target="parent">
              <i class="fas fa-users-between-lines"></i> Parent
            </button>
            <button type="button" class="role-tab-btn ${role === 'teacher' ? 'active teacher' : ''}" data-target="teacher">
              <i class="fas fa-chalkboard-teacher"></i> Teacher
            </button>
          </div>

          <div class="role-login-banner ${role}">
            <div>
              <h2>${title}</h2>
              <p>${subtitle}</p>
            </div>
            <div class="role-decor-badge">
              ${decorBadges}
            </div>
          </div>

          <form id="roleLoginForm">
            <div class="form-group">
              <label class="form-label">Active User Account</label>
              <input type="text" class="form-control" value="${role.toUpperCase()} — ${store.data.users[role]?.name}" disabled readonly style="background: #f8fafc; font-weight: 700;">
            </div>

            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input type="email" class="form-control" value="${store.data.users[role]?.email || 'user@edubridge.edu'}" required>
            </div>

            <div class="form-group">
              <label class="form-label">Password</label>
              <input type="password" class="form-control" value="••••••••••••" required>
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; border-radius: var(--radius-full); padding: 12px; font-size: 15px; margin-top: 10px;">
              <i class="fas fa-sign-in-alt"></i> Sign In to ${role.toUpperCase()} Portal
            </button>
          </form>
        </div>
      `;
    }

    openModal('EduBridge Role-Based Login', renderModalHtml(currentModalRole));

    function bindTabListeners() {
      modalContainer.querySelectorAll('.role-tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const nextRole = e.currentTarget.dataset.target;
          currentModalRole = nextRole;
          const modalBody = modalContainer.querySelector('.modal-body');
          if (modalBody) modalBody.innerHTML = renderModalHtml(nextRole);
          bindTabListeners();
          bindSubmitForm();
        });
      });
    }

    function bindSubmitForm() {
      const form = document.getElementById('roleLoginForm');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          store.setRole(currentModalRole);
          updateRoleButtons(currentModalRole);
          currentTab = 'dashboard';
          closeModal();
          showToast(`Logged in successfully to ${currentModalRole.toUpperCase()} Portal!`);
          renderApp();
        });
      }
    }

    bindTabListeners();
    bindSubmitForm();
  }

  profileBadge?.addEventListener('click', () => {
    openRoleLoginModal(store.getRole());
  });
});
