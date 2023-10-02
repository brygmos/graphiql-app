import { useTranslation } from 'react-i18next';
import Editor from '../../components/Editor/Editor';
import { removeUser } from '../../store/slices/userSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import classes from './EditorPage.module.css';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorBoundaryFallback } from '../../components/ErrorBoundaryFallback/ErrorBoundaryFallback';

interface User {
  email?: string | null;
  token?: string | null;
  id?: string | null;
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
    const user = {
      email: '',
      id: '',
      token: '',
    };
    localStorage.setItem('user', JSON.stringify(user));
    navigate('/');
  };
  return (
    <div className={classes.app}>
      <h1>{t('editor.title')}</h1>
      <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
        <Editor />
      </ErrorBoundary>
    </div>
  );
}

export default EditorPage;
