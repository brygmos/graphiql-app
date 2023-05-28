import { Routes, Route } from 'react-router-dom';
import './App.css';
import { Welcome } from './pages/Welcome/Welcome';
import { Layout } from './components/Layout/Layouut';
import EditorPage from './pages/Editor/EditorPage';
import SignInPage from './pages/SignIn/SignInPage';
import SignUpPage from './pages/SignUp/SignUpPage';
import { useSelector, useDispatch } from 'react-redux';
import { Notfound } from './pages/Notfound/Notfound';
import { setUser } from './store/slices/userSlice';

interface User {
  email: string;
  token: string;
  id: string;
}

export interface Store {
  user: User;
}

function App() {
  const dispatch = useDispatch();
  const userStorage = JSON.parse(localStorage.getItem('user')!);
  if (userStorage !== null) {
    dispatch(
      setUser({
        email: userStorage!.email,
        id: userStorage!.uid,
        token: userStorage!.refreshToken,
      })
    );
  }

  const user = useSelector((state: Store) => state.user);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Welcome />} />
          <Route path="/editor" element={user.id ? <EditorPage /> : <SignInPage />} />
          <Route path="/login" element={user.id ? <EditorPage /> : <SignInPage />} />
          <Route path="/registration" element={user.id ? <EditorPage /> : <SignUpPage />} />
          <Route path="*" element={<Notfound />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
