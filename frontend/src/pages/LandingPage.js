import React from "react";
import "./LandingPage.css";

const cardData = [
  {
    title: "Delhi Book Fair",
    img: "/landingpage/img1.webp",
    text: "Highlights from the latest Delhi Book Fair. Inspiring events and more."
  },
  {
    title: "Library Outreach",
    img: "/landingpage/img2.jpg",
    text: "Volunteers in action connecting communities with books and joy."
  },
  {
    title: "Campus Drives",
    img: "/landingpage/img3.jpeg",
    text: "Our successful campus book drives helping students nationwide."
  }
];

const LandingPage = () => {
  return (
    <div className="main-landing">
      <section className="hero-section">
        <div className="hero-left">
          <h1 className="campaign-title">BOOK IN HAND CAMPAIGN</h1>
          <div className="campaign-info">
            <div className="info-block">
              <h3> Empowering education by placing books directly in the hands of those who need them most.</h3>
            </div>
          </div>
        </div>
        <div className="hero-right">
          {cardData.map((card, idx) => (
            <div className={`photo-card card${idx}`} key={card.title}>
              <img src={card.img} alt={card.title} />
              <div className="card-title">{card.title}</div>
              <div className="card-text">{card.text}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-cards">
        <div className="section-card green">
          <h2>What We Do</h2>
          <p>
            Connecting volunteers, donors, and students to make knowledge accessible.
            Our team manages collections, distributions, and learning support.
          </p>
        </div>
        <div className="section-card purple">
          <h2>Our Impact</h2>
          <p><ul>
           <li>6 Libraries operating in different corners of Delhi</li>
           <li>More than 5,000 readers have become part of the libraries</li>
           <li>Over 3000 books in active circulation</li>
           <li>Weekly footfall of 300+ readers</li>
           <li>20+ volunteers involved</li>
           <li>Readers include children, students, senior citizens, migrants, and women from diverse backgrounds.</li>
           <li>Promotion of grassroots authors and regional literature</li>
           </ul>
          </p>
        </div>
        <div className="section-card blue">
          <h2>Join Us</h2>
          <p>
            Become a volunteer, donate books, or help us spread educational resources.
            Together, we build a brighter future!
          </p>
        </div>
      </section>
      {/* Additional Information Section */}
<section className="library-info-section">
  <h2 className="library-info-heading">Where You Can Find Us</h2>
  <p className="library-info-text">
    Our community libraries are currently set up at the following locations:
  </p>
  <ul className="library-info-list">
    <li>📍 Central Library – Near Model Town</li>
    <li>📍 Community Reading Room – Rohini Sector 5</li>
    <li>📍 Learning Hub – Lajpat Nagar</li>
    <li>📍 Children’s Library – Patel Nagar</li>
  </ul>

  <h2 className="library-info-heading">Alternate Book Submission Points</h2>
  <p className="library-info-text">
    If the main library is closed, members can safely return books at the following
    designated drop-off points:
  </p>
  <ul className="library-info-list">
    <li>
      📍 Book Drop Box – Civil Lines  
      <br />
      <a href="https://maps.google.com" className="location-link">
        View Location
      </a>
    </li>
    <li>
      📍 Community Center Gate – Ashok Vihar  
      <br />
      <a href="https://maps.google.com" className="location-link">
        View Location
      </a>
    </li>
    <li>
      📍 Reading Corner – Karol Bagh  
      <br />
      <a href="https://maps.google.com" className="location-link">
        View Location
      </a>
    </li>
  </ul>
</section>

    </div>
  );
};

export default LandingPage;
