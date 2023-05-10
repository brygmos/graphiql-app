import { Routes, Route } from 'react-router-dom';
import './App.css';
import { Welcome } from './pages/Welcome/Welcome';
import { Layout } from './components/Layout/Layouut';
import EditorPage from './pages/EditorPage';
import SignInPage from './pages/SignIn/SignInPage';
import SignUpPage from './pages/SignUp/SignUpPage';
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
        <Route path="/" element={<Layout />}>
          <Route index element={<Welcome />} />
          <Route path="/editor" element={user.token ? <EditorPage /> : <SignInPage />} />
          <Route path="/login" element={<SignInPage />} />
          <Route path="/registration" element={<SignUpPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
