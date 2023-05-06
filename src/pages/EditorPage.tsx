import Editor from '../components/Editor/Editor';
import { redirect } from 'react-router-dom';

function EditorPage() {
  return (
    <div className="App">
      <h1>EditorPage</h1>
      <Editor />
    </div>
  );
}

export default EditorPage;
