import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Books from "./pages/Books";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import LandingPage from "./pages/LandingPage";
import TermsAndConditions from "./components/TermsAndConditions";
import PrivacyPolicy from "./components/PrivacyPolicy";
import Contact from "./components/Contact";
import About from "./components/About";
import Register from "./pages/Register";
import { Toast } from "./components/Toast";
import Logout from "./pages/Logout";
import AddBook from "./pages/AddBook";
import BookDetails from "./pages/BookDetails";
import Profile from "./pages/Profile";
        
import MembershipForm from "./pages/MembershipForm";
import VolunteerForm from "./pages/VolunteerForm";
import AdminDashboard from "./pages/AdminDashboard";
function App() {


  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <BrowserRouter>
      <Header />
      <Routes>




        <Route path="/membership" element={<MembershipForm />} />
        <Route path="/volunteer" element={<VolunteerForm />} />

        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/register" element={<Register setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/logout" element={<Logout setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/add-book" element={<AddBook />} />
        <Route path="/books/:bookId" element={<BookDetails />} />
        <Route path="/profile" element={<Profile />} />
        
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route
          path="/books"
          element={
            <ProtectedRoute>
              <Books />
            </ProtectedRoute>
          }
        />
        

        

        {/* <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        /> */}
      </Routes>
      <Footer />
      <Toast />
    </BrowserRouter>
  );
}

export default App;
