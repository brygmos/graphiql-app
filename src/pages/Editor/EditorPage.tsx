import { useTranslation } from 'react-i18next';
import Editor from '../../components/Editor/Editor';
import { removeUser } from '../../store/slices/userSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import classes from './EditorPage.module.css';

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
  const { t } = useTranslation();
  const user = useSelector((state: Store) => state.user);

  const handleClick = () => {
    dispatch(removeUser());
    navigate('/');
  };
  return (
    <div className={classes.app}>
      <h1>{t('editor.title')}</h1>
      <button onClick={handleClick}>
        {t('editor.log')} {user.email}
      </button>
      <Editor />
    </div>
  );
}

export default EditorPage;
