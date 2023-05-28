import { useTranslation } from 'react-i18next';
import Editor from '../../components/Editor/Editor';
import { removeUser } from '../../store/slices/userSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorBoundaryFallback } from '../../components/ErrorBoundaryFallback/ErrorBoundaryFallback';

interface User {
  email: string;
  token: string;
  id: string;
}

interface Store {
  user: User;
}

function EditorPage() {
  const { t } = useTranslation();
  return (
    <div className="App">
      <h1>{t('editor.title')}</h1>
      <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
        <Editor />
      </ErrorBoundary>
    </div>
  );
}

export default EditorPage;
