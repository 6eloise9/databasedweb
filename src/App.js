import "./App.css"
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Login from "./pages/Login"

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element = {<h1>HomePage</h1>} />
          <Route path="/login" element={<Login/>} />
        </Routes>
      </Router>

    </div>

  )
}



export default App
