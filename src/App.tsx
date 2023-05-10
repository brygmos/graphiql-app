import { Routes, Route } from "react-router-dom";
import './App.css'
import { Welcome } from './pages/Welcome/Welcome';
import { Layout } from "./components/Layout/Layouut";
import EditorPage from './pages/EditorPage';
import ObjectExplorer from './components/test';

function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout />} >
        <Route index element={<Welcome />} />
        <Route element={<EditorPage />} />
      </Route>
      
     </Routes>
  )
}

export default App
