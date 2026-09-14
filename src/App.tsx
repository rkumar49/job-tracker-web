import { useEffect, useState } from 'react';

// TypeScript type matching our Prisma model
type Application = {
  id: string;
  company: string;
  role: string;
  status: string;
  url: string | null;
  notes: string | null;
  appliedAt: string;
};


//const API_URL = 'http://localhost:4000/api/applications';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/applications';

function App() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');

  // Fetch all applications when the page loads
  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    const res = await fetch(API_URL);
    const data = await res.json();
    setApplications(data);
  }

  // Handle form submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!company || !role) return;

    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ company, role }),
    });

    setCompany('');
    setRole('');
    fetchApplications(); // Refresh the list
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Job Tracker</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          style={{ padding: '0.5rem', flex: 1 }}
        />
        <input
          type="text"
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ padding: '0.5rem', flex: 1 }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>
          Add
        </button>
      </form>

      <h2>Applications ({applications.length})</h2>

      {applications.length === 0 ? (
        <p>No applications yet. Add one above!</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {applications.map((app) => (
            <li
              key={app.id}
              style={{
                padding: '1rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                marginBottom: '0.5rem',
              }}
            >
              <strong>{app.company}</strong> — {app.role}
              <span
                style={{
                  marginLeft: '1rem',
                  fontSize: '0.85rem',
                  color: '#666',
                  background: '#f0f0f0',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}
              >
                {app.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;