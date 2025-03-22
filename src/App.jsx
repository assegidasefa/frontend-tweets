import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import Callback from "./pages/Callback"
import { AuthProvider } from "./context/AuthContext"
import { Toaster } from "./components/ui/toaster"
import VerificationPage from "./pages/VerificationPage"


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/verify" element={<VerificationPage />} />
          <Route path="/auth/callback" element={<Callback />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toaster />
    </AuthProvider>
  )
}

export default App

