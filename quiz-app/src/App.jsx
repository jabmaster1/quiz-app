import { Routes, Route } from 'react-router-dom';
import HomePage from "./components/HomePage.jsx";
import NextPage from './components/NextPage.jsx';
import QuestionForm from './components/QuestionForm.jsx';

function App() {
  return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/next" element={<NextPage />} />
        <Route path="/quiz" element={<QuestionForm />} />
      </Routes>
  );
}

export default App;