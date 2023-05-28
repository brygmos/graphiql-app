import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { Welcome } from './pages/Welcome/Welcome';
import { Layout } from './components/Layout/Layouut';
import EditorPage from './pages/Editor/EditorPage';
import SignInPage from './pages/SignIn/SignInPage';
import SignUpPage from './pages/SignUp/SignUpPage';
import { useSelector } from 'react-redux';
import { Notfound } from './pages/Notfound/Notfound';

export interface User {
  email: string;
  token: string;
  id: string;
}

export interface Store {
  user: User;
}

function App() {
  const user = useSelector((state: Store) => state.user);
  console.log(user.token);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Welcome />} />
          <Route path="/editor" element={user.token ? <EditorPage /> : <SignInPage />} />
          <Route path="/login" element={user.token ? null : <SignInPage />} />
          <Route path="/registration" element={user.token ? <EditorPage /> : <SignUpPage />} />
          <Route path="*" element={<Notfound />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
