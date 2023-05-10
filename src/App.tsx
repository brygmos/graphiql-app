import { Routes, Route } from 'react-router-dom';
import './App.css';
import { Welcome } from './pages/Welcome/Welcome';
import { Layout } from './components/Layout/Layouut';
import EditorPage from './pages/EditorPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Welcome />} />
        <Route path="/editor" element={<EditorPage />} />
      </Route>
    </Routes>
  );
}

export default App;
