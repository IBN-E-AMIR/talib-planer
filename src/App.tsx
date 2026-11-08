import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Timetable from './pages/Timetable';
import Dars from './pages/Dars';
import Embedded from './pages/Embedded';
import Notes from './pages/Notes';
import Progress from './pages/Progress';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="timetable" element={<Timetable />} />
          <Route path="dars" element={<Dars />} />
          <Route path="embedded" element={<Embedded />} />
          <Route path="notes" element={<Notes />} />
          <Route path="progress" element={<Progress />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
