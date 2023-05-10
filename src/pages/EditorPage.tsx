import Editor from '../components/Editor/Editor';
import { removeUser } from '../store/slices/userSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

interface User {
  email: string;
  token: string;
  id: string;
}

interface Store {
  user: User;
}

function EditorPage() {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const user = useSelector((state: Store) => state.user);

  const handleClick = () => {
    dispatch(removeUser());
    navigate('/');
  };
  return (
    <div className="App">
      <h1>EditorPage</h1>
      <button onClick={handleClick}>Log out from {user.email}</button>
      <Editor />
    </div>
  );
}

export default EditorPage;
