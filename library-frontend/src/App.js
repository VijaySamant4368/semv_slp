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
import AdminDashboard from "./pages/AdminDashboard";
import BorrowRequests from "./pages/BorrowRequests";
import DonationRequests from "./pages/DonationRequests";
import BorrowedBooks from "./pages/BorrowedBooks";
import AdminProfile from "./pages/AdminProfile";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/register" element={<Register setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/admin-profile" element={<AdminProfile />} />
        {/* Protected Pages */}
        <Route
          path="/books"
          element={
            <ProtectedRoute>
              <Books />
            </ProtectedRoute>
          }
        />
        <Route path="/books/:bookId" element={<BookDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/add-book" element={<AddBook />} />
        <Route path="/logout" element={<Logout setIsLoggedIn={setIsLoggedIn} />} />

        {/* Admin Dashboard */}
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/borrow-requests" element={<BorrowRequests />} />
        <Route path="/donation-requests" element={<DonationRequests />} />
        <Route path="/borrowed-books" element={<BorrowedBooks />} />
      </Routes>
      <Footer />
      <Toast />
    </BrowserRouter>
  );
}

export default App;
