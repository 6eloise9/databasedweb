import './App.css'
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import { ProvideAuth, useAuth } from './utils/auth'

function App() {

  return (
    <ProvideAuth>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/login" element = {<Login/>} />
            <Route path="/" element={<PrivateRoute><Dashboard/></PrivateRoute>} />
          </Routes>
        </Router>

      </div>
    </ProvideAuth>

  )
}

function PrivateRoute({ children }) {
  const { currentUser } = useAuth()
  return currentUser ? children : <Navigate to='/login'/>
}

export default App
