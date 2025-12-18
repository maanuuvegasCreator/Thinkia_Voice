import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { Dashboard } from './views/Dashboard';
import { ActivityLog } from './views/ActivityLog';
import { CallList } from './views/CallList';
import { AgentBuilder } from './views/AgentBuilder';
import { Clients } from './views/Clients';
import { Tickets } from './views/Tickets';
import { Tasks } from './views/Tasks';
import { Campaigns } from './views/Campaigns';
import { Settings } from './views/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="activity" element={<ActivityLog />} />
          <Route path="calls" element={<CallList />} />
          <Route path="clients" element={<Clients />} />
          <Route path="tickets" element={<Tickets />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="agents" element={<AgentBuilder />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
