/* EduBridge — Supabase Integration & Database Sync Layer */

(function() {
  // Default configuration (can be updated via UI or window.ENV)
  const SUPABASE_CONFIG_KEY = 'EDUBRIDGE_SUPABASE_CONFIG';

  const storedConfig = JSON.parse(localStorage.getItem(SUPABASE_CONFIG_KEY) || '{}');

  const DEFAULT_SUPABASE_URL = 'https://vgxkcfvfwznyflnjflcp.supabase.co';
  const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZneGtjZnZmd3pueWZsbmpmbGNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4MTU3ODksImV4cCI6MjEwNjM5MTc4OX0.p7XncBXxR8jLvsgtKD76kFl8IRwDv4XkZ2UGjn24aP8';

  window.EDUBRIDGE_SUPABASE = {
    url: window.ENV_SUPABASE_URL || storedConfig.url || DEFAULT_SUPABASE_URL,
    anonKey: window.ENV_SUPABASE_ANON_KEY || storedConfig.anonKey || DEFAULT_SUPABASE_ANON_KEY,
    client: null,
    isConnected: false,

    init() {
      if (this.url && this.anonKey && window.supabase) {
        try {
          this.client = window.supabase.createClient(this.url, this.anonKey);
          this.isConnected = true;
          console.log('[EduBridge Supabase] Connected successfully to:', this.url);
        } catch (e) {
          console.error('[EduBridge Supabase] Connection error:', e);
          this.isConnected = false;
        }
      } else {
        console.log('[EduBridge Supabase] No Supabase credentials configured. Running in LocalStorage / Standalone mode.');
        this.isConnected = false;
      }
      this.updateUIStatus();
    },

    saveCredentials(url, anonKey) {
      this.url = url.trim();
      this.anonKey = anonKey.trim();
      localStorage.setItem(SUPABASE_CONFIG_KEY, JSON.stringify({ url: this.url, anonKey: this.anonKey }));
      this.init();
      if (this.isConnected) {
        alert('Supabase credentials saved & connected successfully!');
        window.location.reload();
      } else {
        alert('Failed to connect to Supabase. Please verify URL and Anon Key.');
      }
    },

    clearCredentials() {
      localStorage.removeItem(SUPABASE_CONFIG_KEY);
      this.url = '';
      this.anonKey = '';
      this.client = null;
      this.isConnected = false;
      alert('Supabase credentials cleared. Switched to LocalStorage mode.');
      window.location.reload();
    },

    updateUIStatus() {
      const badge = document.getElementById('supabaseStatusBadge');
      if (badge) {
        if (this.isConnected) {
          badge.className = 'badge badge-success';
          badge.innerHTML = '<i class="fas fa-database"></i> Supabase: Connected';
        } else {
          badge.className = 'badge badge-warning';
          badge.innerHTML = '<i class="fas fa-hard-drive"></i> Mode: LocalStorage';
        }
      }
    },

    // Fetch full database snapshot from Supabase if connected
    async fetchSnapshot() {
      if (!this.isConnected || !this.client) return null;

      try {
        const [
          { data: users },
          { data: roster },
          { data: subjects },
          { data: marks },
          { data: assignments },
          { data: studySessions },
          { data: healthLogs },
          { data: moodLogs },
          { data: teacherFeedback },
          { data: parentObs },
          { data: messages },
          { data: consent }
        ] = await Promise.all([
          this.client.from('users').select('*'),
          this.client.from('students_roster').select('*'),
          this.client.from('subjects').select('*'),
          this.client.from('marks').select('*'),
          this.client.from('assignments').select('*'),
          this.client.from('study_sessions').select('*'),
          this.client.from('health_logs').select('*'),
          this.client.from('mood_logs').select('*'),
          this.client.from('teacher_feedback').select('*'),
          this.client.from('parent_observations').select('*'),
          this.client.from('messages').select('*'),
          this.client.from('consent_settings').select('*').single()
        ]);

        return {
          users,
          roster,
          subjects,
          marks,
          assignments,
          studySessions,
          healthLogs,
          moodLogs,
          teacherFeedback,
          parentObs,
          messages,
          consent
        };
      } catch (err) {
        console.error('[EduBridge Supabase] Snapshot fetch failed:', err);
        return null;
      }
    },

    // Sync individual mutation to Supabase table asynchronously
    async pushRecord(table, record) {
      if (!this.isConnected || !this.client) return;

      try {
        const { error } = await this.client.from(table).upsert(record);
        if (error) console.error(`[EduBridge Supabase] Upsert error in ${table}:`, error);
        else console.log(`[EduBridge Supabase] Synced to ${table}:`, record);
      } catch (err) {
        console.error(`[EduBridge Supabase] Failed pushing to ${table}:`, err);
      }
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    window.EDUBRIDGE_SUPABASE.init();
  });
})();
