import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BarChart3,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  CircleAlert,
  FileText,
  GitBranch,
  LayoutDashboard,
  Loader2,
  MailCheck,
  RefreshCcw,
  Send,
  Settings2,
  UserRound,
  UsersRound
} from 'lucide-react';
import './styles.css';

const recruitmentBase = 'http://localhost:8082';
const interviewerBase = 'http://localhost:8081';

const emptyCandidate = {
  name: 'Rahul Sharma',
  email: 'rahul@example.com',
  phone: '8888888888',
  currentCompany: 'Acme',
  currentDesignation: 'Software Engineer',
  yearsExperience: 4.5,
  skills: 'Java, Spring Boot, SQL',
  tags: 'referral, priority',
  resumeUrl: 'https://example.com/resume.pdf',
  source: 'LinkedIn'
};

const emptyJob = {
  title: 'Backend Engineer',
  department: 'Engineering',
  location: 'Mumbai',
  employmentType: 'Full-time',
  minExperience: 3,
  maxExperience: 6,
  requiredSkills: 'Java, Spring Boot, SQL',
  description: 'Build backend services for the hiring platform.',
  salaryRange: '12-18 LPA',
  headcount: 1,
  status: 'OPEN',
  hiringManagerId: 1,
  recruiterId: 10
};

const emptyInterviewer = {
  name: 'Alice Johnson',
  email: 'alice@example.com',
  phone: '9999999999',
  technicalSkills: 'Java, Spring Boot',
  yearsExperience: 6,
  designation: 'Senior Engineer',
  department: 'Engineering',
  bio: 'Backend interviewer'
};

const emptySlot = {
  interviewerId: 1,
  interviewerName: 'Alice Johnson',
  technicalSkills: 'Java, Spring Boot',
  minYearsExperience: 3,
  startTime: '2026-05-20T10:00:00',
  endTime: '2026-05-20T11:00:00',
  round: 'L1',
  meetingLink: 'https://meet.example.com/interview-1',
  status: 'AVAILABLE'
};

const emptyOffer = {
  title: 'Backend Engineer',
  salary: 1500000,
  currency: 'INR',
  joiningDate: '2026-06-15',
  expiresAt: '2026-06-01T18:00:00',
  status: 'DRAFT',
  notes: 'Standard offer'
};

function csv(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

async function request(base, path, options = {}) {
  const response = await fetch(`${base}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  const text = await response.text();
  const data = text ? safeJson(text) : null;
  if (!response.ok) {
    throw new Error(typeof data === 'string' ? data : data?.message || text || `HTTP ${response.status}`);
  }
  return data;
}

function safeJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [slots, setSlots] = useState([]);
  const [recruitments, setRecruitments] = useState([]);
  const [offers, setOffers] = useState([]);
  const [events, setEvents] = useState([]);
  const [candidateForm, setCandidateForm] = useState(emptyCandidate);
  const [jobForm, setJobForm] = useState(emptyJob);
  const [interviewerForm, setInterviewerForm] = useState(emptyInterviewer);
  const [slotForm, setSlotForm] = useState(emptySlot);
  const [offerForm, setOfferForm] = useState(emptyOffer);
  const [selected, setSelected] = useState({ candidateId: '', jobId: '', applicationId: '', recruitmentId: '', offerId: '' });

  const stats = useMemo(() => [
    { label: 'Candidates', value: dashboard?.totalCandidates ?? candidates.length, icon: UsersRound },
    { label: 'Open Jobs', value: dashboard?.openJobs ?? jobs.filter((job) => job.status === 'OPEN').length, icon: BriefcaseBusiness },
    { label: 'Applications', value: dashboard?.totalApplications ?? applications.length, icon: FileText },
    { label: 'Interviews', value: dashboard?.scheduledInterviews ?? recruitments.length, icon: CalendarClock },
    { label: 'Pending Offers', value: dashboard?.pendingOffers ?? offers.length, icon: MailCheck }
  ], [applications.length, candidates.length, dashboard, jobs, offers.length, recruitments.length]);

  useEffect(() => {
    refreshAll();
  }, []);

  function pushLog(type, message) {
    setLog((items) => [{ type, message, time: new Date().toLocaleTimeString() }, ...items].slice(0, 8));
  }

  async function run(label, fn) {
    setLoading(true);
    try {
      const result = await fn();
      pushLog('success', label);
      return result;
    } catch (error) {
      pushLog('error', `${label}: ${error.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function refreshAll() {
    await run('Refreshed workspace data', async () => {
      const [dash, ana, cand, job, app, slot, rec, off, event] = await Promise.all([
        request(recruitmentBase, '/api/dashboard/summary').catch(() => null),
        request(recruitmentBase, '/api/analytics/summary').catch(() => null),
        request(recruitmentBase, '/api/candidates').catch(() => []),
        request(recruitmentBase, '/api/jobs').catch(() => []),
        request(recruitmentBase, '/api/applications').catch(() => []),
        request(interviewerBase, '/api/slots').catch(() => []),
        request(recruitmentBase, '/api/recruitments').catch(() => []),
        request(recruitmentBase, '/api/offers').catch(() => []),
        request(recruitmentBase, '/api/webhook-events').catch(() => [])
      ]);
      setDashboard(dash);
      setAnalytics(ana);
      setCandidates(cand);
      setJobs(job);
      setApplications(app);
      setSlots(slot);
      setRecruitments(rec);
      setOffers(off);
      setEvents(event);
      hydrateSelections(cand, job, app, rec, off);
    });
  }

  function hydrateSelections(cand, job, app, rec, off) {
    setSelected((current) => ({
      candidateId: current.candidateId || cand?.[0]?.id || '',
      jobId: current.jobId || job?.[0]?.id || '',
      applicationId: current.applicationId || app?.[0]?.id || '',
      recruitmentId: current.recruitmentId || rec?.[0]?.id || '',
      offerId: current.offerId || off?.[0]?.id || ''
    }));
  }

  async function createInterviewer() {
    await run('Created interviewer', async () => {
      const payload = { ...interviewerForm, technicalSkills: csv(interviewerForm.technicalSkills) };
      await request(interviewerBase, '/api/interviewers', { method: 'POST', body: JSON.stringify(payload) });
    });
  }

  async function createSlot() {
    await run('Created interview slot', async () => {
      const payload = { ...slotForm, technicalSkills: csv(slotForm.technicalSkills), interviewerId: Number(slotForm.interviewerId), minYearsExperience: Number(slotForm.minYearsExperience) };
      await request(interviewerBase, '/api/slots', { method: 'POST', body: JSON.stringify(payload) });
      await refreshAll();
    });
  }

  async function createCandidate() {
    await run('Created candidate', async () => {
      const payload = { ...candidateForm, skills: csv(candidateForm.skills), tags: csv(candidateForm.tags), yearsExperience: Number(candidateForm.yearsExperience) };
      const candidate = await request(recruitmentBase, '/api/candidates', { method: 'POST', body: JSON.stringify(payload) });
      setSelected((state) => ({ ...state, candidateId: candidate.id }));
      await refreshAll();
    });
  }

  async function createJob() {
    await run('Created job', async () => {
      const payload = {
        ...jobForm,
        requiredSkills: csv(jobForm.requiredSkills),
        minExperience: Number(jobForm.minExperience),
        maxExperience: Number(jobForm.maxExperience),
        headcount: Number(jobForm.headcount),
        hiringManagerId: Number(jobForm.hiringManagerId),
        recruiterId: Number(jobForm.recruiterId)
      };
      const job = await request(recruitmentBase, '/api/jobs', { method: 'POST', body: JSON.stringify(payload) });
      setSelected((state) => ({ ...state, jobId: job.id }));
      await refreshAll();
    });
  }

  async function createApplication() {
    await run('Created application', async () => {
      const payload = {
        jobId: Number(selected.jobId),
        candidateId: Number(selected.candidateId),
        source: 'Frontend',
        ownerRecruiterId: 10,
        screeningNotes: 'Created from hiring console'
      };
      const application = await request(recruitmentBase, '/api/applications', { method: 'POST', body: JSON.stringify(payload) });
      setSelected((state) => ({ ...state, applicationId: application.id }));
      await refreshAll();
    });
  }

  async function scheduleInterview() {
    await run('Scheduled interview', async () => {
      const job = jobs.find((item) => item.id === Number(selected.jobId));
      const payload = {
        candidateId: Number(selected.candidateId),
        applicationId: Number(selected.applicationId),
        requiredSkills: job?.requiredSkills?.length ? job.requiredSkills.slice(0, 2) : ['Java', 'Spring Boot'],
        minYearsExperience: job?.minExperience || 3,
        round: 'L1'
      };
      const recruitment = await request(recruitmentBase, '/api/recruitments/schedule', { method: 'POST', body: JSON.stringify(payload) });
      setSelected((state) => ({ ...state, recruitmentId: recruitment.id }));
      await refreshAll();
    });
  }

  async function submitFeedback() {
    await run('Submitted feedback', async () => {
      const recruitment = recruitments.find((item) => item.id === Number(selected.recruitmentId)) || recruitments[0];
      const payload = {
        interviewSlotId: recruitment?.interviewSlotId,
        interviewerId: recruitment?.interviewerId,
        candidateId: recruitment?.candidateId,
        recruitmentId: recruitment?.id,
        technicalRating: 4,
        communicationRating: 4,
        problemSolvingRating: 5,
        overallRating: 4,
        recommendation: 'HIRE',
        strengths: 'Strong backend fundamentals',
        weaknesses: 'Needs deeper architecture examples',
        detailedComments: 'Good fit for backend role.'
      };
      await request(interviewerBase, '/api/feedback', { method: 'POST', body: JSON.stringify(payload) });
      await refreshAll();
    });
  }

  async function createOffer() {
    await run('Created offer', async () => {
      const app = applications.find((item) => item.id === Number(selected.applicationId)) || applications[0];
      const payload = {
        ...offerForm,
        applicationId: Number(selected.applicationId),
        candidateId: app?.candidateId || Number(selected.candidateId),
        jobId: app?.jobId || Number(selected.jobId),
        salary: Number(offerForm.salary)
      };
      const offer = await request(recruitmentBase, '/api/offers', { method: 'POST', body: JSON.stringify(payload) });
      setSelected((state) => ({ ...state, offerId: offer.id }));
      await refreshAll();
    });
  }

  async function updateOffer(status) {
    await run(`Offer ${status.toLowerCase()}`, async () => {
      await request(recruitmentBase, `/api/offers/${selected.offerId}/status?status=${status}`, { method: 'PATCH' });
      await refreshAll();
    });
  }

  async function markNoShow() {
    await run('Marked slot no-show', async () => {
      const recruitment = recruitments.find((item) => item.id === Number(selected.recruitmentId)) || recruitments[0];
      await request(interviewerBase, `/api/slots/${recruitment.interviewSlotId}/no-show`, { method: 'PATCH' });
      await refreshAll();
    });
  }

  const pages = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'setup', label: 'Setup', icon: Settings2 },
    { id: 'pipeline', label: 'Pipeline', icon: GitBranch },
    { id: 'interviews', label: 'Interviews', icon: CalendarClock },
    { id: 'offers', label: 'Offers', icon: MailCheck },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'activity', label: 'Activity', icon: FileText }
  ];

  const pageCopy = {
    dashboard: ['Dashboard', 'Current hiring health across both services.'],
    setup: ['Setup', 'Create the core records needed before running a hiring flow.'],
    pipeline: ['Pipeline', 'Move a candidate from application to scheduled interview and feedback.'],
    interviews: ['Interviews', 'Review interview slots and recruitment records.'],
    offers: ['Offers', 'Create, send, and accept offers tied to applications.'],
    analytics: ['Analytics', 'Inspect funnel, offer acceptance, and platform events.'],
    activity: ['Activity', 'Recent frontend operations and API outcomes.']
  };

  function renderPage() {
    if (activePage === 'dashboard') {
      return (
        <>
          <section className="stats">
            {stats.map(({ label, value, icon: Icon }) => (
              <div className="metric" key={label}>
                <Icon size={18} />
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </section>
          <section className="grid two">
            <DataTable title="Applications" rows={applications} columns={['id', 'candidateId', 'jobId', 'stage']} />
            <DataTable title="Offers" rows={offers} columns={['id', 'candidateId', 'status', 'salary']} />
          </section>
        </>
      );
    }

    if (activePage === 'setup') {
      return (
        <section className="grid two">
          <Panel title="Candidate" icon={UserRound} action="Create" onAction={createCandidate}>
            <Form data={candidateForm} setData={setCandidateForm} fields={[
              ['name', 'Name'], ['email', 'Email'], ['phone', 'Phone'], ['currentCompany', 'Company'],
              ['currentDesignation', 'Designation'], ['yearsExperience', 'Experience'], ['skills', 'Skills'],
              ['tags', 'Tags'], ['resumeUrl', 'Resume URL'], ['source', 'Source']
            ]} />
          </Panel>
          <Panel title="Job Opening" icon={BriefcaseBusiness} action="Create" onAction={createJob}>
            <Form data={jobForm} setData={setJobForm} fields={[
              ['title', 'Title'], ['department', 'Department'], ['location', 'Location'], ['employmentType', 'Type'],
              ['minExperience', 'Min Exp'], ['maxExperience', 'Max Exp'], ['requiredSkills', 'Skills'],
              ['salaryRange', 'Salary'], ['headcount', 'Headcount'], ['status', 'Status']
            ]} />
          </Panel>
          <Panel title="Interviewer" icon={UsersRound} action="Create" onAction={createInterviewer}>
            <Form data={interviewerForm} setData={setInterviewerForm} fields={[
              ['name', 'Name'], ['email', 'Email'], ['phone', 'Phone'], ['technicalSkills', 'Skills'],
              ['yearsExperience', 'Experience'], ['designation', 'Designation'], ['department', 'Department']
            ]} />
          </Panel>
          <Panel title="Interview Slot" icon={CalendarClock} action="Create" onAction={createSlot}>
            <Form data={slotForm} setData={setSlotForm} fields={[
              ['interviewerId', 'Interviewer ID'], ['interviewerName', 'Interviewer'], ['technicalSkills', 'Skills'],
              ['minYearsExperience', 'Min Exp'], ['startTime', 'Start'], ['endTime', 'End'], ['round', 'Round'], ['meetingLink', 'Meeting Link']
            ]} />
          </Panel>
        </section>
      );
    }

    if (activePage === 'pipeline') {
      return (
        <section className="pageStack">
          <Panel title="Pipeline Actions" icon={GitBranch}>
            <div className="selectorRow">
              <Select label="Candidate" value={selected.candidateId} onChange={(candidateId) => setSelected({ ...selected, candidateId })} items={candidates} />
              <Select label="Job" value={selected.jobId} onChange={(jobId) => setSelected({ ...selected, jobId })} items={jobs} labelKey="title" />
              <Select label="Application" value={selected.applicationId} onChange={(applicationId) => setSelected({ ...selected, applicationId })} items={applications} labelKey="stage" />
              <Select label="Recruitment" value={selected.recruitmentId} onChange={(recruitmentId) => setSelected({ ...selected, recruitmentId })} items={recruitments} labelKey="status" />
              <Select label="Offer" value={selected.offerId} onChange={(offerId) => setSelected({ ...selected, offerId })} items={offers} labelKey="status" />
            </div>
            <div className="actions">
              <button onClick={createApplication}><FileText size={16} /> Apply</button>
              <button onClick={scheduleInterview}><CalendarClock size={16} /> Schedule</button>
              <button onClick={submitFeedback}><CheckCircle2 size={16} /> Feedback</button>
              <button onClick={markNoShow}><CircleAlert size={16} /> No-show</button>
            </div>
          </Panel>
          <div className="grid two">
            <DataTable title="Applications" rows={applications} columns={['id', 'candidateId', 'jobId', 'stage']} />
            <DataTable title="Recruitments" rows={recruitments} columns={['id', 'candidateId', 'interviewerId', 'interviewSlotId', 'status']} />
          </div>
        </section>
      );
    }

    if (activePage === 'interviews') {
      return (
        <section className="grid two">
          <DataTable title="Slots" rows={slots} columns={['id', 'interviewerName', 'round', 'status', 'bookedCandidateId']} />
          <DataTable title="Recruitments" rows={recruitments} columns={['id', 'candidateId', 'interviewerId', 'interviewSlotId', 'status']} />
        </section>
      );
    }

    if (activePage === 'offers') {
      return (
        <section className="grid two">
          <Panel title="Offer" icon={MailCheck} action="Create" onAction={createOffer}>
            <Form data={offerForm} setData={setOfferForm} fields={[
              ['title', 'Title'], ['salary', 'Salary'], ['currency', 'Currency'], ['joiningDate', 'Joining Date'],
              ['expiresAt', 'Expires At'], ['status', 'Status'], ['notes', 'Notes']
            ]} />
            <div className="actions tight">
              <button onClick={() => updateOffer('SENT')}><Send size={16} /> Send</button>
              <button onClick={() => updateOffer('ACCEPTED')}><CheckCircle2 size={16} /> Accept</button>
            </div>
          </Panel>
          <DataTable title="Offers" rows={offers} columns={['id', 'applicationId', 'candidateId', 'status', 'salary']} />
        </section>
      );
    }

    if (activePage === 'analytics') {
      return (
        <section className="pageStack">
          <section className="analyticsStrip">
            <div>
              <span>Offer Acceptance</span>
              <strong>{Number(analytics?.offerAcceptanceRate || 0).toFixed(1)}%</strong>
            </div>
            <div>
              <span>Avg Time To Hire</span>
              <strong>{analytics?.averageTimeToHireDays ?? 'N/A'}</strong>
            </div>
            <div>
              <span>Funnel</span>
              <strong>{Object.values(analytics?.funnelByStage || {}).reduce((sum, value) => sum + value, 0)}</strong>
            </div>
          </section>
          <DataTable title="Webhook Events" rows={events} columns={['id', 'eventType', 'aggregateType', 'aggregateId']} />
        </section>
      );
    }

    return (
      <Panel title="Activity" icon={BarChart3}>
        <div className="log">
          {log.map((item, index) => (
            <div className={`logItem ${item.type}`} key={`${item.time}-${index}`}>
              <span>{item.time}</span>
              <p>{item.message}</p>
            </div>
          ))}
          {!log.length && <p className="muted">No activity yet.</p>}
        </div>
      </Panel>
    );
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brandMark">X</div>
          <div>
            <strong>Xplore</strong>
            <span>Hiring Console</span>
          </div>
        </div>
        <nav>
          {pages.map(({ id, label, icon: Icon }) => (
            <button
              className={activePage === id ? 'navItem active' : 'navItem'}
              key={id}
              onClick={() => setActivePage(id)}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>
        <button className="primary full" onClick={refreshAll} disabled={loading}>
          {loading ? <Loader2 className="spin" size={16} /> : <RefreshCcw size={16} />}
          Refresh
        </button>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <h1>{pageCopy[activePage][0]}</h1>
            <p>{pageCopy[activePage][1]}</p>
          </div>
          <div className="serviceState">
            <span><CheckCircle2 size={16} /> Interviewer 8081</span>
            <span><CheckCircle2 size={16} /> Recruitment 8082</span>
          </div>
        </header>

        {renderPage()}
      </main>
    </div>
  );
}

function Panel({ title, icon: Icon, children, action, onAction }) {
  return (
    <section className="panel">
      <div className="panelHeader">
        <h2><Icon size={18} /> {title}</h2>
        {action && <button className="primary" onClick={onAction}>{action}</button>}
      </div>
      {children}
    </section>
  );
}

function Form({ data, setData, fields }) {
  return (
    <div className="formGrid">
      {fields.map(([key, label]) => (
        <label key={key}>
          <span>{label}</span>
          <input value={data[key] ?? ''} onChange={(event) => setData({ ...data, [key]: event.target.value })} />
        </label>
      ))}
    </div>
  );
}

function Select({ label, value, onChange, items, labelKey = 'name' }) {
  return (
    <label className="selectBox">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">Select</option>
        {items.map((item) => (
          <option key={item.id} value={item.id}>
            #{item.id} {item[labelKey] || item.title || item.name || item.status}
          </option>
        ))}
      </select>
    </label>
  );
}

function DataTable({ title, rows, columns }) {
  return (
    <section className="panel tablePanel">
      <div className="panelHeader">
        <h2>{title}</h2>
      </div>
      <div className="tableWrap">
        <table>
          <thead>
            <tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr>
          </thead>
          <tbody>
            {rows.slice(0, 8).map((row) => (
              <tr key={row.id}>
                {columns.map((column) => <td key={column}>{String(row[column] ?? '')}</td>)}
              </tr>
            ))}
            {!rows.length && (
              <tr><td colSpan={columns.length}>No records</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

createRoot(document.getElementById('root')).render(<App />);
