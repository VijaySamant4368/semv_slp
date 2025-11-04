// src/components/Contact.js
import React from "react";
import "./Contact.css";

const Contact = () => (
  <div className="contact-container">
    <h1>Contact Us</h1>
    <p>
      Thank you for your interest in the Book in Hand Campaign (BHC). We are passionate about spreading the joy of reading and are here to help you get involved or answer any questions.
    </p>

    <h2>How to Reach Us</h2>
    <p>
      You can visit us at any of our centers or get in touch through the contact details below. Our friendly team is available at the following places and times:
    </p>

    <h3>Visit Our Centers</h3>
    <ul>
      <li>
        <b>Gandhi Vihar</b><br /> Every Sunday - 2:00 PM to 6:00 PM
      </li>
      <li>
        <b>Vijay Nagar</b><br /> Every Saturday - 12:00 PM to 5:00 PM
      </li>
      <li>
        <b>DUWA (DU)</b><br /> Saturdays - 11:00 AM to 5:00 PM
      </li>
      <li>
        <b>Faculty Of Arts(DU)</b><br /> Every Monday - 12:00 PM to 5:00 PM
      </li>
    </ul>

    <h3>Contact Info</h3>
    <ul>
      <li><b>Email:</b> <a href="mailto:info@bookinhand.org">info@bookinhand.org</a></li>
      <li><b>Phone:</b> +91 98765 43210</li>
      <li><b>WhatsApp:</b> <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">Chat with us</a></li>
      <li><b>Instagram:</b> <a href="https://instagram.com/bookinhand" target="_blank" rel="noopener noreferrer">@bookinhand</a></li>
      <li><b>Twitter:</b> <a href="https://twitter.com/bookinhand" target="_blank" rel="noopener noreferrer">@bookinhand</a></li>
    </ul>
  </div>
);

export default Contact;
