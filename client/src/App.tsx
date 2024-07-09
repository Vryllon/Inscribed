import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

export default function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path='/' element={<LoginPage />} />
        <Route path='/sign-up' element={<SignupPage />} />

      </Routes>

    </BrowserRouter>

  );

}