import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import { ProvideAuth } from './utils/auth'

function App() {
  return (
    <ProvideAuth>
      <div className="App">
        <Router>
          <Routes>
            <Route exact path="/" element = {<Dashboard/>} />
            <Route path="/login" element={<Login/>} />
          </Routes>
        </Router>

      </div>
    </ProvideAuth>

  )
}



export default App
