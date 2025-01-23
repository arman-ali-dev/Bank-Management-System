import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { CaptchaProvider } from './context/CaptchaContext.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { StatmentProvider } from './context/StatementContext.jsx';
import { UserProvider } from './context/UserContext.jsx';


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <CaptchaProvider>
      <UserProvider>
        <StatmentProvider>
          <App />
        </StatmentProvider>
      </UserProvider>
    </CaptchaProvider>
    <ToastContainer/>
  </BrowserRouter>
)
