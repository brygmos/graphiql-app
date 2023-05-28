import { useTranslation } from 'react-i18next';
import Editor from '../../components/Editor/Editor';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorBoundaryFallback } from '../../components/ErrorBoundaryFallback/ErrorBoundaryFallback';
import classes from './EditorPage.module.css';

function EditorPage() {
  const { t } = useTranslation();
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
