import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./components/Login"
import Register from "./components/Register"
import Boards from "./components/Boards"
import Board from "./components/Board"
import Navbar from "./components/Navbar"
import { useState, useEffect } from "react"


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem("token"))

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(!!localStorage.getItem("token"))
    };

    window.addEventListener("storage", checkAuth)
    return () => window.removeEventListener("storage", checkAuth)
  }, [])


  return (
    <>
      <BrowserRouter>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/boards" element={isAuthenticated ? <Boards /> : <Navigate to="/login" />} />
            <Route path="/" element={<Navigate to={isAuthenticated ? "/boards" : "/login"} />} />
            <Route path="/boards/:boardId" element={isAuthenticated ? <Board /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  )
}

export default App
