import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity,
  BarChart3,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  CalendarCheck,
  Check,
  ChevronRight,
  FileCheck2,
  FileText,
  Fingerprint,
  Gauge,
  Globe2,
  GraduationCap,
  Grid3X3,
  Layers3,
  Lock,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Sun,
  UserCog,
  UserRound,
  UsersRound,
  X
} from 'lucide-react';
import './styles.css';

const ENTITLEMENTS = {
  VIEW_JOBS: 'VIEW_JOBS',
  APPLY_JOBS: 'APPLY_JOBS',
  VIEW_LEARNING: 'VIEW_LEARNING',
  CREATE_JOB: 'CREATE_JOB',
  MANAGE_USERS: 'MANAGE_USERS',
  VIEW_ANALYTICS: 'VIEW_ANALYTICS',
  ADMIN_ACCESS: 'ADMIN_ACCESS',
  SUPER_ADMIN_ACCESS: 'SUPER_ADMIN_ACCESS',
  MANAGE_SECURITY: 'MANAGE_SECURITY',
  MANAGE_ORG: 'MANAGE_ORG',
  REVIEW_CANDIDATES: 'REVIEW_CANDIDATES',
  SCHEDULE_INTERVIEWS: 'SCHEDULE_INTERVIEWS',
  MANAGE_OFFERS: 'MANAGE_OFFERS',
  BUILD_RESUME: 'BUILD_RESUME',
  VIEW_PROFILE: 'VIEW_PROFILE',
  VIEW_NOTIFICATIONS: 'VIEW_NOTIFICATIONS',
  VIEW_BLUEPRINT: 'VIEW_BLUEPRINT'
};

const roleProfiles = {
  superAdmin: {
    label: 'Super Admin',
    title: 'Global platform owner',
    entitlements: Object.values(ENTITLEMENTS)
  },
  admin: {
    label: 'Admin',
    title: 'Organization administrator',
    entitlements: [
      ENTITLEMENTS.MANAGE_USERS,
      ENTITLEMENTS.ADMIN_ACCESS,
      ENTITLEMENTS.VIEW_ANALYTICS,
      ENTITLEMENTS.MANAGE_SECURITY,
      ENTITLEMENTS.MANAGE_ORG,
      ENTITLEMENTS.VIEW_NOTIFICATIONS,
      ENTITLEMENTS.VIEW_BLUEPRINT
    ]
  },
  recruiter: {
    label: 'Recruiter',
    title: 'Hiring operations lead',
    entitlements: [
      ENTITLEMENTS.VIEW_JOBS,
      ENTITLEMENTS.CREATE_JOB,
      ENTITLEMENTS.REVIEW_CANDIDATES,
      ENTITLEMENTS.SCHEDULE_INTERVIEWS,
      ENTITLEMENTS.MANAGE_OFFERS,
      ENTITLEMENTS.VIEW_ANALYTICS,
      ENTITLEMENTS.VIEW_NOTIFICATIONS
    ]
  },
  hiringManager: {
    label: 'Hiring Manager',
    title: 'Candidate decision owner',
    entitlements: [
      ENTITLEMENTS.VIEW_JOBS,
      ENTITLEMENTS.REVIEW_CANDIDATES,
      ENTITLEMENTS.SCHEDULE_INTERVIEWS,
      ENTITLEMENTS.VIEW_ANALYTICS,
      ENTITLEMENTS.VIEW_NOTIFICATIONS
    ]
  },
  employee: {
    label: 'Employee/User',
    title: 'Career growth explorer',
    entitlements: [
      ENTITLEMENTS.VIEW_JOBS,
      ENTITLEMENTS.APPLY_JOBS,
      ENTITLEMENTS.VIEW_LEARNING,
      ENTITLEMENTS.BUILD_RESUME,
      ENTITLEMENTS.VIEW_PROFILE,
      ENTITLEMENTS.VIEW_NOTIFICATIONS
    ]
  }
};

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Gauge },
  { id: 'opportunities', label: 'Opportunities', icon: BriefcaseBusiness, entitlement: ENTITLEMENTS.VIEW_JOBS },
  { id: 'learning', label: 'Learning Hub', icon: GraduationCap, entitlement: ENTITLEMENTS.VIEW_LEARNING },
  { id: 'resume', label: 'Resume Builder', icon: FileText, entitlement: ENTITLEMENTS.BUILD_RESUME },
  { id: 'profile', label: 'Profile', icon: UserRound, entitlement: ENTITLEMENTS.VIEW_PROFILE },
  { id: 'notifications', label: 'Notifications', icon: Bell, entitlement: ENTITLEMENTS.VIEW_NOTIFICATIONS },
  { id: 'admin', label: 'Administration', icon: UserCog, entitlement: ENTITLEMENTS.ADMIN_ACCESS },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, entitlement: ENTITLEMENTS.VIEW_ANALYTICS },
  { id: 'security', label: 'Security Center', icon: ShieldCheck, entitlement: ENTITLEMENTS.MANAGE_SECURITY },
  { id: 'components', label: 'Components', icon: Grid3X3, entitlement: ENTITLEMENTS.VIEW_BLUEPRINT },
  { id: 'blueprint', label: 'Blueprint', icon: Layers3, entitlement: ENTITLEMENTS.VIEW_BLUEPRINT },
  { id: 'settings', label: 'Settings', icon: Settings }
];

const opportunities = [
  {
    company: 'Microsoft',
    logo: 'M',
    title: 'Principal Product Engineer',
    salary: '$160k - $220k',
    location: 'Redmond / Remote',
    type: 'Hybrid',
    skills: ['React', 'Azure', 'Design Systems'],
    match: 94
  },
  {
    company: 'Stripe',
    logo: 'S',
    title: 'Platform Experience Lead',
    salary: '$170k - $245k',
    location: 'San Francisco',
    type: 'Onsite',
    skills: ['Payments', 'Node', 'Analytics'],
    match: 89
  },
  {
    company: 'Airbnb',
    logo: 'A',
    title: 'Career Marketplace Architect',
    salary: '$150k - $210k',
    location: 'Remote',
    type: 'Remote',
    skills: ['GraphQL', 'UX', 'Search'],
    match: 86
  }
];

const courses = [
  { title: 'Enterprise AI Product Strategy', level: 'Advanced', progress: 72, badge: 'AI Builder' },
  { title: 'Cloud Architecture Path', level: 'Intermediate', progress: 48, badge: 'Cloud Ready' },
  { title: 'Leadership for Hiring Managers', level: 'Foundational', progress: 91, badge: 'People Lead' }
];

const notifications = [
  { type: 'Interview Invitation', text: 'L2 architecture panel scheduled for tomorrow.', tone: 'info' },
  { type: 'Learning Recommendation', text: 'New certification path unlocked: Enterprise AI.', tone: 'success' },
  { type: 'System Announcement', text: 'Security policy review pending for administrators.', tone: 'warning' }
];

const componentInventory = [
  'Buttons', 'Inputs', 'Dropdowns', 'Date Pickers', 'Modals', 'Sidebars', 'Navigation Menus',
  'Tables', 'Cards', 'Charts', 'Accordions', 'Tabs', 'Breadcrumbs', 'Empty States',
  'Loading Skeletons', 'Error Components'
];

const recruitmentBase = import.meta.env.VITE_RECRUITMENT_API_URL || 'http://localhost:8082';
const interviewerBase = import.meta.env.VITE_INTERVIEWER_API_URL || 'http://localhost:8081';

async function api(base, path, options = {}) {
  const response = await fetch(`${base}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  const text = await response.text();
  const payload = text ? safeJson(text) : null;
  if (!response.ok) {
    throw new Error(typeof payload === 'string' ? payload : payload?.message || `HTTP ${response.status}`);
  }
  return payload;
}

function safeJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

const emptyData = {
  dashboard: null,
  analytics: null,
  candidates: [],
  jobs: [],
  applications: [],
  recruitments: [],
  offers: [],
  events: [],
  slots: []
};

function App() {
  const [theme, setTheme] = useState('dark');
  const [authScreen, setAuthScreen] = useState('splash');
  const [authenticated, setAuthenticated] = useState(false);
  const [roleKey, setRoleKey] = useState('employee');
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [data, setData] = useState(emptyData);
  const [backendStatus, setBackendStatus] = useState({ recruitment: 'checking', interviewer: 'checking' });
  const [toast, setToast] = useState('');
  const profile = roleProfiles[roleKey];

  const can = (entitlement) => !entitlement || profile.entitlements.includes(entitlement);
  const visibleNav = navItems.filter((item) => can(item.entitlement));

  function enterApp(nextRole = roleKey) {
    setRoleKey(nextRole);
    setAuthenticated(true);
    setAuthScreen('app');
    setActivePage('dashboard');
  }

  async function refreshBackend() {
    const nextStatus = { recruitment: 'offline', interviewer: 'offline' };
    const [dashboard, analytics, candidates, jobs, applications, recruitments, offers, events, slots] = await Promise.all([
      api(recruitmentBase, '/api/dashboard/summary').then((value) => {
        nextStatus.recruitment = 'online';
        return value;
      }).catch(() => null),
      api(recruitmentBase, '/api/analytics/summary').catch(() => null),
      api(recruitmentBase, '/api/candidates').catch(() => []),
      api(recruitmentBase, '/api/jobs').catch(() => []),
      api(recruitmentBase, '/api/applications').catch(() => []),
      api(recruitmentBase, '/api/recruitments').catch(() => []),
      api(recruitmentBase, '/api/offers').catch(() => []),
      api(recruitmentBase, '/api/webhook-events').catch(() => []),
      api(interviewerBase, '/api/slots').then((value) => {
        nextStatus.interviewer = 'online';
        return value;
      }).catch(() => [])
    ]);
    setData({ dashboard, analytics, candidates, jobs, applications, recruitments, offers, events, slots });
    setBackendStatus(nextStatus);
  }

  useEffect(() => {
    refreshBackend();
  }, []);

  async function runBackendAction(label, fn) {
    try {
      await fn();
      setToast(label);
      await refreshBackend();
    } catch (error) {
      setToast(`${label} failed: ${error.message}`);
    }
  }

  return (
    <div className={`app ${theme}`}>
      {!authenticated ? (
        <AuthExperience
          authScreen={authScreen}
          setAuthScreen={setAuthScreen}
          roleKey={roleKey}
          setRoleKey={setRoleKey}
          enterApp={enterApp}
          theme={theme}
          setTheme={setTheme}
        />
      ) : (
        <AppShell
          profile={profile}
          roleKey={roleKey}
          setRoleKey={setRoleKey}
          activePage={activePage}
          setActivePage={setActivePage}
          visibleNav={visibleNav}
          can={can}
          data={data}
          backendStatus={backendStatus}
          refreshBackend={refreshBackend}
          runBackendAction={runBackendAction}
          toast={toast}
          theme={theme}
          setTheme={setTheme}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          logout={() => {
            setAuthenticated(false);
            setAuthScreen('welcome');
          }}
        />
      )}
    </div>
  );
}

function AuthExperience({ authScreen, setAuthScreen, roleKey, setRoleKey, enterApp, theme, setTheme }) {
  if (authScreen === 'splash') {
    return (
      <main className="authSurface splash">
        <ThemeButton theme={theme} setTheme={setTheme} />
        <div className="logoOrb" aria-label="Xplore logo">X</div>
        <div className="loadingRail"><span /></div>
        <h1>Xplore</h1>
        <p>Explore opportunities, learning paths, services, and career growth through one secure enterprise platform.</p>
        <button className="primaryButton" onClick={() => setAuthScreen('welcome')}>Continue</button>
      </main>
    );
  }

  if (authScreen === 'welcome') {
    return (
      <main className="authSurface welcome">
        <ThemeButton theme={theme} setTheme={setTheme} />
        <section className="welcomeCopy">
          <p className="eyebrow">Fortune 500 ready digital workspace</p>
          <h1>Discover roles, build skills, and grow inside Xplore.</h1>
          <p>Premium career mobility, learning, resume intelligence, hiring workflows, and entitlement-driven access in one adaptive experience.</p>
          <div className="authActions">
            <button className="primaryButton" onClick={() => setAuthScreen('login')}>Login</button>
            <button className="secondaryButton" onClick={() => setAuthScreen('signup')}>Sign Up</button>
          </div>
          <div className="socialRow" aria-label="Social login options">
            <button>Google</button>
            <button>Microsoft</button>
            <button>LinkedIn</button>
          </div>
        </section>
        <HeroIllustration />
      </main>
    );
  }

  const titles = {
    login: 'Welcome back',
    signup: 'Create your Xplore account',
    otp: 'Verify your identity',
    forgot: 'Recover your account',
    reset: 'Create a new password',
    recovery: 'Account recovery'
  };

  return (
    <main className="authSurface formSurface">
      <ThemeButton theme={theme} setTheme={setTheme} />
      <section className="authCard">
        <button className="textButton" onClick={() => setAuthScreen('welcome')}>Back</button>
        <h1>{titles[authScreen]}</h1>
        <p>Validation, loading, error, and success states are represented for production handoff.</p>
        {authScreen === 'login' && (
          <AuthForm
            fields={['Email or username', 'Password']}
            footer={
              <>
                <label className="checkLine"><input type="checkbox" /> Remember me</label>
                <button className="textButton" onClick={() => setAuthScreen('forgot')}>Forgot password?</button>
              </>
            }
            actionLabel="Login securely"
            onAction={() => setAuthScreen('otp')}
          />
        )}
        {authScreen === 'signup' && (
          <AuthForm
            fields={['Full name', 'Work email', 'Mobile number', 'Create password']}
            footer={<label className="checkLine"><input type="checkbox" /> I accept the Terms and Conditions</label>}
            actionLabel="Create account"
            onAction={() => setAuthScreen('otp')}
          />
        )}
        {authScreen === 'otp' && (
          <AuthForm
            fields={['One-time password']}
            actionLabel="Verify and continue"
            onAction={() => enterApp(roleKey)}
          />
        )}
        {authScreen === 'forgot' && (
          <AuthForm fields={['Registered email']} actionLabel="Send recovery code" onAction={() => setAuthScreen('recovery')} />
        )}
        {authScreen === 'reset' && (
          <AuthForm fields={['New password', 'Confirm password']} actionLabel="Reset password" onAction={() => setAuthScreen('login')} />
        )}
        {authScreen === 'recovery' && (
          <AuthForm fields={['Recovery code', 'Verified email']} actionLabel="Continue recovery" onAction={() => setAuthScreen('reset')} />
        )}
        <RolePicker roleKey={roleKey} setRoleKey={setRoleKey} />
      </section>
    </main>
  );
}

function AuthForm({ fields, footer, actionLabel, onAction }) {
  return (
    <div className="authForm">
      {fields.map((field) => (
        <label key={field}>
          <span>{field}</span>
          <input type={field.toLowerCase().includes('password') ? 'password' : 'text'} placeholder={`Enter ${field.toLowerCase()}`} />
        </label>
      ))}
      <div className="stateGrid">
        <span className="state success">Valid</span>
        <span className="state loading">Loading</span>
        <span className="state error">Error</span>
      </div>
      <div className="authFooter">{footer}</div>
      <button className="primaryButton" onClick={onAction}>{actionLabel}</button>
    </div>
  );
}

function RolePicker({ roleKey, setRoleKey }) {
  return (
    <label className="rolePicker">
      <span>Preview role</span>
      <select value={roleKey} onChange={(event) => setRoleKey(event.target.value)}>
        {Object.entries(roleProfiles).map(([key, role]) => (
          <option value={key} key={key}>{role.label}</option>
        ))}
      </select>
    </label>
  );
}

function AppShell({
  profile,
  roleKey,
  setRoleKey,
  activePage,
  setActivePage,
  visibleNav,
  can,
  data,
  backendStatus,
  refreshBackend,
  runBackendAction,
  toast,
  theme,
  setTheme,
  sidebarOpen,
  setSidebarOpen,
  logout
}) {
  const activeMeta = navItems.find((item) => item.id === activePage) || navItems[0];

  function navigate(id) {
    setActivePage(id);
    setSidebarOpen(false);
  }

  return (
    <div className="productShell">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="brand">
          <div className="brandMark">X</div>
          <div>
            <strong>Xplore</strong>
            <span>{profile.label}</span>
          </div>
        </div>
        <nav aria-label="Primary navigation">
          {visibleNav.map(({ id, label, icon: Icon }) => (
            <button className={activePage === id ? 'navItem active' : 'navItem'} onClick={() => navigate(id)} key={id}>
              <Icon size={17} />
              {label}
            </button>
          ))}
        </nav>
        <div className="entitlementPanel">
          <span>Entitlements</span>
          <strong>{profile.entitlements.length}</strong>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <button className="iconButton mobileOnly" onClick={() => setSidebarOpen(true)} aria-label="Open navigation"><Menu size={18} /></button>
          <div>
            <p className="eyebrow">Role-based experience</p>
            <h1>{activeMeta.label}</h1>
          </div>
          <div className="topActions">
            <BackendPill label="Recruitment" status={backendStatus.recruitment} />
            <BackendPill label="Interviewer" status={backendStatus.interviewer} />
            <div className="searchBox"><Search size={16} /><input aria-label="Search" placeholder="Search opportunities, people, learning" /></div>
            <RolePicker roleKey={roleKey} setRoleKey={setRoleKey} />
            <button className="iconButton" onClick={refreshBackend} aria-label="Refresh backend data"><Activity size={18} /></button>
            <ThemeButton theme={theme} setTheme={setTheme} />
            <button className="iconButton" onClick={logout} aria-label="Logout"><LogOut size={18} /></button>
          </div>
        </header>
        <main className="pageCanvas">
          {toast && <div className="toast">{toast}</div>}
          <PageRouter activePage={activePage} can={can} profile={profile} data={data} runBackendAction={runBackendAction} />
        </main>
      </section>
      {sidebarOpen && <button className="scrim" onClick={() => setSidebarOpen(false)} aria-label="Close navigation" />}
    </div>
  );
}

function BackendPill({ label, status }) {
  return <span className={`backendPill ${status}`}>{label}: {status}</span>;
}

function PageRouter({ activePage, can, profile, data, runBackendAction }) {
  const access = {
    opportunities: ENTITLEMENTS.VIEW_JOBS,
    learning: ENTITLEMENTS.VIEW_LEARNING,
    resume: ENTITLEMENTS.BUILD_RESUME,
    profile: ENTITLEMENTS.VIEW_PROFILE,
    notifications: ENTITLEMENTS.VIEW_NOTIFICATIONS,
    admin: ENTITLEMENTS.ADMIN_ACCESS,
    analytics: ENTITLEMENTS.VIEW_ANALYTICS,
    security: ENTITLEMENTS.MANAGE_SECURITY,
    components: ENTITLEMENTS.VIEW_BLUEPRINT,
    blueprint: ENTITLEMENTS.VIEW_BLUEPRINT
  };

  if (!can(access[activePage])) {
    return <AccessDenied entitlement={access[activePage]} />;
  }

  const pages = {
    dashboard: <Dashboard profile={profile} data={data} />,
    opportunities: <OpportunityExplorer can={can} data={data} runBackendAction={runBackendAction} />,
    learning: <LearningHub />,
    resume: <ResumeBuilder />,
    profile: <ProfileManagement />,
    notifications: <NotificationCenter data={data} />,
    admin: <AdminSuite data={data} runBackendAction={runBackendAction} />,
    analytics: <AnalyticsPage data={data} />,
    security: <SecurityCenter />,
    components: <ComponentLibrary />,
    blueprint: <Blueprint />,
    settings: <SettingsPage />
  };

  return pages[activePage] || pages.dashboard;
}

function Dashboard({ profile, data }) {
  const kpis = [
    ['Applications Submitted', data.dashboard?.totalApplications ?? data.applications.length ?? '128', 'live', FileCheck2],
    ['Active Opportunities', data.dashboard?.openJobs ?? data.jobs.filter((job) => job.status === 'OPEN').length ?? '42', 'live', BriefcaseBusiness],
    ['Learning Progress', '76%', '+12%', BookOpen],
    ['Profile Completion', data.candidates.length ? '94%' : '92%', data.candidates.length ? 'synced' : '+4%', UserRound]
  ];

  return (
    <div className="pageStack">
      <section className="heroBand">
        <div>
          <p className="eyebrow">Good afternoon</p>
          <h2>{profile.title}</h2>
          <p>Personalized actions, analytics, and recommendations are dynamically composed from your entitlements.</p>
        </div>
        <div className="heroStats">
          <span>Match score</span>
          <strong>94%</strong>
        </div>
      </section>
      <section className="kpiGrid">
        {kpis.map(([label, value, delta, Icon]) => (
          <article className="kpiCard" key={label}>
            <Icon size={19} />
            <span>{label}</span>
            <strong>{value}</strong>
            <small>{delta}</small>
          </article>
        ))}
      </section>
      <section className="dashboardGrid">
        <Panel title="Analytics" icon={BarChart3}><Charts /></Panel>
        <Panel title="Activity Feed" icon={Activity}><ActivityFeed /></Panel>
        <Panel title="Quick Actions" icon={Sparkles}><QuickActions /></Panel>
      </section>
      <section className="dashboardGrid">
        <DataTable title="Live Applications" rows={data.applications} columns={['id', 'candidateId', 'jobId', 'stage']} />
        <DataTable title="Live Offers" rows={data.offers} columns={['id', 'candidateId', 'status', 'salary']} />
        <DataTable title="Live Slots" rows={data.slots} columns={['id', 'interviewerName', 'round', 'status']} />
      </section>
    </div>
  );
}

function OpportunityExplorer({ can, data, runBackendAction }) {
  const liveOpportunities = data.jobs.length ? data.jobs.map((job) => ({
    company: job.department || 'Xplore',
    logo: (job.title || 'X').slice(0, 1),
    title: job.title,
    salary: job.salaryRange || 'Not disclosed',
    location: job.location || 'Flexible',
    type: job.employmentType || 'Hybrid',
    skills: job.requiredSkills || [],
    match: 91,
    id: job.id
  })) : opportunities;

  async function applyToJob(job) {
    const existingCandidate = data.candidates[0];
    const candidate = existingCandidate || await api(recruitmentBase, '/api/candidates', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Xplore Demo User',
        email: `demo.user.${Date.now()}@xplore.local`,
        phone: `90000${String(Date.now()).slice(-5)}`,
        currentDesignation: 'Product Engineer',
        yearsExperience: 4,
        skills: job.skills || ['Java', 'Spring Boot'],
        tags: ['frontend-apply'],
        source: 'Xplore Frontend'
      })
    });
    await api(recruitmentBase, '/api/applications', {
      method: 'POST',
      body: JSON.stringify({
        jobId: job.id,
        candidateId: candidate.id,
        source: 'Xplore Frontend',
        ownerRecruiterId: 10,
        screeningNotes: 'Applied from enterprise frontend'
      })
    });
  }

  return (
    <div className="pageStack">
      <section className="filterBar">
        {['Location', 'Experience', 'Industry', 'Skills', 'Salary', 'Work Type'].map((filter) => <button key={filter}>{filter}</button>)}
      </section>
      <section className="opportunityGrid">
        {liveOpportunities.map((job) => (
          <article className="opportunityCard" key={job.title}>
            <div className="companyLogo">{job.logo}</div>
            <div>
              <span>{job.company}</span>
              <h3>{job.title}</h3>
              <p>{job.salary} · {job.location} · {job.type}</p>
            </div>
            <div className="skillRow">{job.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
            <div className="matchRail"><span style={{ width: `${job.match}%` }} /></div>
            <div className="cardFooter">
              <strong>{job.match}% match</strong>
              <div>
                <button>Save</button>
                {can(ENTITLEMENTS.APPLY_JOBS) && job.id
                  ? <button className="primaryButton small" onClick={() => runBackendAction('Application submitted', () => applyToJob(job))}>Apply Now</button>
                  : <button disabled>{job.id ? 'Restricted' : 'Demo'}</button>}
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

function LearningHub() {
  return (
    <div className="pageStack">
      <section className="learningHero">
        <div>
          <p className="eyebrow">AI recommendations</p>
          <h2>Build the skills that unlock your next opportunity.</h2>
        </div>
        <Sparkles size={44} />
      </section>
      <section className="courseGrid">
        {courses.map((course) => (
          <article className="courseCard" key={course.title}>
            <div className="badge">{course.badge}</div>
            <h3>{course.title}</h3>
            <p>{course.level}</p>
            <Progress value={course.progress} />
          </article>
        ))}
      </section>
      <Panel title="Learning Paths" icon={BookOpen}>
        <div className="timeline">
          {['Skill assessment', 'Curated courses', 'Certification', 'Internal mobility match'].map((step) => <span key={step}>{step}</span>)}
        </div>
      </Panel>
    </div>
  );
}

function ResumeBuilder() {
  return (
    <div className="resumeLayout">
      <Panel title="Resume Builder" icon={FileText}>
        <div className="templateGrid">
          {['Executive', 'Modern ATS', 'Technical', 'Consulting'].map((template) => <button key={template}>{template}</button>)}
        </div>
        <div className="dragList">
          {['Summary', 'Experience', 'Projects', 'Skills', 'Certifications'].map((section) => <div key={section}>{section}<span>Drag</span></div>)}
        </div>
      </Panel>
      <Panel title="ATS Scoring" icon={Gauge}>
        <div className="scoreCircle">88</div>
        <p>AI suggestions recommend adding measurable outcomes, cloud keywords, and recent certifications.</p>
        <button className="primaryButton">Export PDF</button>
      </Panel>
    </div>
  );
}

function ProfileManagement() {
  return (
    <div className="profileGrid">
      {['Personal Information', 'Education', 'Experience', 'Skills', 'Certifications', 'Documents', 'Preferences', 'Privacy Settings'].map((section) => (
        <article className="profileTile" key={section}>
          <Check size={17} />
          <span>{section}</span>
        </article>
      ))}
    </div>
  );
}

function NotificationCenter({ data }) {
  const liveNotifications = data.events.length
    ? data.events.map((event) => ({
      type: event.eventType,
      text: `${event.aggregateType} #${event.aggregateId} ${event.payload || ''}`,
      tone: 'info'
    }))
    : notifications;

  return (
    <Panel title="Notification Center" icon={Bell}>
      <div className="notificationList">
        {liveNotifications.map((item, index) => (
          <article className={`notification ${item.tone}`} key={`${item.type}-${index}`}>
            <strong>{item.type}</strong>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </Panel>
  );
}

function AdminSuite({ data, runBackendAction }) {
  async function createDemoJob() {
    await api(recruitmentBase, '/api/jobs', {
      method: 'POST',
      body: JSON.stringify({
        title: `Enterprise Platform Engineer ${data.jobs.length + 1}`,
        department: 'Engineering',
        location: 'Hybrid',
        employmentType: 'Full-time',
        minExperience: 3,
        maxExperience: 8,
        requiredSkills: ['Java', 'Spring Boot', 'React'],
        description: 'Created from Xplore enterprise frontend.',
        salaryRange: '18-28 LPA',
        headcount: 2,
        status: 'OPEN',
        hiringManagerId: 1,
        recruiterId: 10
      })
    });
  }

  async function createDemoSlot() {
    await api(interviewerBase, '/api/slots', {
      method: 'POST',
      body: JSON.stringify({
        interviewerId: 1,
        interviewerName: 'Alice Johnson',
        technicalSkills: ['Java', 'Spring Boot', 'React'],
        minYearsExperience: 3,
        startTime: '2026-06-05T10:00:00',
        endTime: '2026-06-05T11:00:00',
        round: 'L1',
        meetingLink: 'https://meet.example.com/xplore',
        status: 'AVAILABLE'
      })
    });
  }

  return (
    <div className="pageStack">
      <div className="adminGrid">
        {['Global Dashboard', 'User Management', 'Entitlement Management', 'Organization Management', 'Platform Configuration', 'Audit Logs'].map((item) => (
          <article className="adminCard" key={item}>
            <Building2 size={20} />
            <h3>{item}</h3>
            <p>Govern roles, policies, workflows, and operational controls.</p>
          </article>
        ))}
      </div>
      <Panel title="Backend Operations" icon={Sparkles}>
        <div className="quickActions">
          <button className="primaryButton" onClick={() => runBackendAction('Demo job created', createDemoJob)}>Create Live Job</button>
          <button className="primaryButton" onClick={() => runBackendAction('Demo slot created', createDemoSlot)}>Create Live Slot</button>
        </div>
      </Panel>
      <section className="dashboardGrid">
        <DataTable title="Candidates" rows={data.candidates} columns={['id', 'name', 'email', 'source']} />
        <DataTable title="Jobs" rows={data.jobs} columns={['id', 'title', 'status', 'headcount']} />
        <DataTable title="Events" rows={data.events} columns={['id', 'eventType', 'aggregateId']} />
      </section>
    </div>
  );
}

function AnalyticsPage({ data }) {
  const funnel = data.analytics?.funnelByStage || {};
  const funnelLabels = Object.keys(funnel).length ? Object.keys(funnel) : ['Applied', 'Screened', 'Interview', 'Offer', 'Hired'];

  return (
    <div className="pageStack">
      <section className="analyticsStrip">
        <div>
          <span>Offer Acceptance</span>
          <strong>{Number(data.analytics?.offerAcceptanceRate || 0).toFixed(1)}%</strong>
        </div>
        <div>
          <span>Avg Time To Hire</span>
          <strong>{data.analytics?.averageTimeToHireDays ?? 'N/A'}</strong>
        </div>
        <div>
          <span>Webhook Events</span>
          <strong>{data.events.length}</strong>
        </div>
      </section>
      <section className="dashboardGrid">
        <Panel title="Bar Chart" icon={BarChart3}><BarChart /></Panel>
        <Panel title="Line Chart" icon={Activity}><LineChart /></Panel>
        <Panel title="Funnel" icon={Gauge}><Funnel labels={funnelLabels} values={funnel} /></Panel>
      </section>
      <Panel title="Activity Heatmap" icon={Grid3X3}><Heatmap /></Panel>
    </div>
  );
}

function SecurityCenter() {
  return (
    <div className="securityGrid">
      {['MFA enforcement', 'Risk signals', 'Device trust', 'Audit monitoring', 'Access reviews', 'Recovery policy'].map((item) => (
        <article className="securityCard" key={item}>
          <ShieldCheck size={18} />
          <span>{item}</span>
          <strong>Healthy</strong>
        </article>
      ))}
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="settingsGrid">
      {['Profile Settings', 'Security Settings', 'Theme Configuration', 'Language Selection', 'Notification Preferences', 'Privacy Controls'].map((item) => (
        <Panel title={item} icon={Settings} key={item}>
          <p>Enterprise-ready controls with accessible forms, toggles, and save states.</p>
        </Panel>
      ))}
    </div>
  );
}

function ComponentLibrary() {
  return (
    <div className="pageStack">
      <Panel title="Reusable Component Library" icon={Grid3X3}>
        <div className="componentGrid">
          {componentInventory.map((item) => <span key={item}>{item}</span>)}
        </div>
      </Panel>
      <Panel title="States" icon={Sparkles}>
        <div className="stateGrid">
          <span className="state success">Success</span>
          <span className="state loading">Loading</span>
          <span className="state error">Error</span>
          <span className="state">Empty</span>
        </div>
      </Panel>
    </div>
  );
}

function Blueprint() {
  const deliverables = [
    ['Information Architecture', 'Auth, Workspace, Opportunities, Learning, Resume, Profile, Admin, Analytics, Settings'],
    ['User Journey Flows', 'Discover opportunity, learn skills, build resume, apply, interview, track progress'],
    ['Navigation Structure', 'Role-filtered sidebar, global search, contextual quick actions'],
    ['Frontend Folder Structure', 'src/components, src/features, src/layouts, src/routes, src/data, src/styles'],
    ['Component Hierarchy', 'AppShell > Sidebar/Topbar > EntitlementRoute > Feature Pages > Reusable Components'],
    ['Mobile Screens', 'Bottom-safe navigation, stacked cards, compact filters, collapsible modules'],
    ['Tablet Screens', 'Two-column workspace, persistent toolbar, adaptive cards'],
    ['Desktop Screens', 'Full sidebar, rich analytics grid, split detail panels'],
    ['Design System', 'Tokens for color, radius, spacing, elevation, typography, motion'],
    ['Role-Based Navigation', 'Every item checks entitlement before rendering'],
    ['Entitlement Framework', 'Show, hide, restrict action, or render access denied'],
    ['Responsive Layouts', 'Mobile-first CSS grid with progressive enhancement'],
    ['Wireframes', 'Auth flow, dashboard, explorer, learning, resume, admin, settings'],
    ['High-Fidelity UI Mockups', 'Current screens are styled as production-quality interactive mockups']
  ];

  return (
    <div className="blueprintGrid">
      {deliverables.map(([title, body]) => (
        <article className="blueprintCard" key={title}>
          <h3>{title}</h3>
          <p>{body}</p>
        </article>
      ))}
    </div>
  );
}

function Panel({ title, icon: Icon, children }) {
  return (
    <section className="panel">
      <div className="panelHeader">
        <h2><Icon size={18} /> {title}</h2>
        <ChevronRight size={17} />
      </div>
      {children}
    </section>
  );
}

function Charts() {
  return (
    <div className="chartBars">
      {[64, 82, 45, 76, 58, 91].map((height, index) => <span style={{ height: `${height}%` }} key={index} />)}
    </div>
  );
}

function BarChart() {
  return <div className="chartBars tall">{[42, 71, 54, 88, 66, 92, 73].map((height, index) => <span style={{ height: `${height}%` }} key={index} />)}</div>;
}

function LineChart() {
  return <div className="lineChart"><span /><span /><span /><span /></div>;
}

function Funnel({ labels = ['Applied', 'Screened', 'Interview', 'Offer', 'Hired'], values = {} }) {
  return (
    <div className="funnel">
      {labels.map((item, index) => (
        <span style={{ width: `${Math.max(42, 100 - index * 13)}%` }} key={item}>
          {item} {values[item] != null ? `· ${values[item]}` : ''}
        </span>
      ))}
    </div>
  );
}

function Heatmap() {
  return <div className="heatmap">{Array.from({ length: 56 }, (_, index) => <span className={`level${index % 4}`} key={index} />)}</div>;
}

function ActivityFeed() {
  return (
    <div className="feed">
      {['Applied to Principal Product Engineer', 'Completed AI Product Strategy', 'Resume ATS score improved to 88', 'Interview invitation received'].map((item) => <p key={item}>{item}</p>)}
    </div>
  );
}

function QuickActions() {
  return (
    <div className="quickActions">
      {['Apply Now', 'Explore Opportunities', 'Continue Learning', 'Update Resume'].map((item) => <button key={item}>{item}</button>)}
    </div>
  );
}

function Progress({ value }) {
  return <div className="progress"><span style={{ width: `${value}%` }} /></div>;
}

function AccessDenied({ entitlement }) {
  return (
    <section className="accessDenied">
      <Lock size={34} />
      <h2>Access denied</h2>
      <p>This page requires the entitlement <strong>{entitlement}</strong>. Switch roles or request access from an administrator.</p>
    </section>
  );
}

function DataTable({ title, rows, columns }) {
  return (
    <Panel title={title} icon={FileText}>
      <div className="tableWrap">
        <table>
          <thead>
            <tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr>
          </thead>
          <tbody>
            {rows.slice(0, 7).map((row) => (
              <tr key={row.id}>
                {columns.map((column) => <td key={column}>{String(row[column] ?? '')}</td>)}
              </tr>
            ))}
            {!rows.length && (
              <tr><td colSpan={columns.length}>No live records yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function ThemeButton({ theme, setTheme }) {
  return (
    <button className="iconButton themeButton" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme">
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

function HeroIllustration() {
  return (
    <section className="heroIllustration" aria-label="Career growth illustration">
      <div className="orbit one"><Globe2 size={24} /></div>
      <div className="orbit two"><BookOpen size={24} /></div>
      <div className="orbit three"><Fingerprint size={24} /></div>
      <div className="glassDevice">
        <span />
        <h3>Career mobility graph</h3>
        <div className="miniChart"><i /><i /><i /><i /></div>
      </div>
    </section>
  );
}

createRoot(document.getElementById('root')).render(<App />);
