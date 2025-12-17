import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { Dashboard } from './views/Dashboard';
import { CallList } from './views/CallList';
import { AgentBuilder } from './views/AgentBuilder';
import { Operations } from './views/Operations';
import { Campaigns } from './views/Campaigns';
import { Settings } from './views/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="calls" element={<CallList />} />
          <Route path="agents" element={<AgentBuilder />} />
          <Route path="operations" element={<Operations />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
