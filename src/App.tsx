import { Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router';
import './App.css';
import EditorPage from './pages/EditorPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';

function App() {
  const user = false;
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={user ? <EditorPage /> : <SignInPage />} />
        <Route path="/login" element={<SignInPage />} />
        <Route path="/register" element={<SignUpPage />} />
        <Route path="*" element={<Navigate to="/pagenotfound" replace />} />
      </Routes>
    </div>
  );
}

export default App;
