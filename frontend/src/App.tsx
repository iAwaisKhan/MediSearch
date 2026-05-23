import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar        from "./components/layout/Navbar";
import Footer        from "./components/layout/Footer";
import ProtectedRoute from "./components/ui/ProtectedRoute";

import Home      from "./pages/Home";
import Search    from "./pages/Search";
import Compare   from "./pages/Compare";
import History   from "./pages/History";
import Login     from "./pages/Login";
import Register  from "./pages/Register";
import Profile   from "./pages/Profile";
import NotFound  from "./pages/NotFound";

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="h-screen w-full flex flex-col overflow-hidden relative">
      <ScrollToTop />
      <Navbar />

      <main className="flex-1 overflow-y-auto pb-16">
        <Routes>
          <Route path="/"        element={<Home />} />
          <Route path="/search"  element={<Search />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/login"   element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route path="/history" element={
            <ProtectedRoute><History /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
