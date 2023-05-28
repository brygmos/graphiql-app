import { Routes, Route } from 'react-router-dom';
import './App.css';
import { Welcome } from './pages/Welcome/Welcome';
import { Layout } from './components/Layout/Layouut';
import EditorPage from './pages/Editor/EditorPage';
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

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Welcome />} />
          {/* <Route path="/editor" element={<EditorPage />} /> */}
          {/*disabled for development*/}
          <Route path="/editor" element={user.token ? <EditorPage /> : <SignInPage />} />
          <Route path="/login" element={user.token ? <Welcome /> : <SignInPage />} />
          <Route path="/registration" element={user.token ? <Welcome /> : <SignUpPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
