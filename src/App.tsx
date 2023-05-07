import { Routes, Route } from "react-router-dom";
import './App.css'
import { Welcome } from './pages/Welcome/Welcome';
import { Layout } from "./components/Layout/Layouut";

export default function App() {

  return (
     <Routes>
      <Route path="/" element={<Layout />} >
        <Route index element={<Welcome />} />
      </Route>
      
     </Routes>
  )
}
