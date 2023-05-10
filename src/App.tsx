import { Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router';
import './App.css';
import EditorPage from './pages/EditorPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import { useSelector } from 'react-redux';

interface User {
  email: string;
  token: string;
  id: string;
}

interface Store {
  user: User;
}

function App() {
  const user = useSelector((state: Store) => state.user);
  console.log(user.token);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={user.token ? <EditorPage /> : <SignInPage />} />
        <Route path="/login" element={<SignInPage />} />
        <Route path="/registration" element={<SignUpPage />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;
