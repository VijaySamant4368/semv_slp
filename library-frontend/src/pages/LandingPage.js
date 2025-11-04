import React from "react";
import "./LandingPage.css";

const cardData = [
  {
    title: "Delhi Book Fair",
    img: "https://images.unsplash.com/photo-1512820790803-83ca734da794",
    text: "Highlights from the latest Delhi Book Fair. Inspiring events and more."
  },
  {
    title: "Library Outreach",
    img: "https://images.unsplash.com/photo-1465101162946-4377e57745c3",
    text: "Volunteers in action connecting communities with books and joy."
  },
  {
    title: "Campus Drives",
    img: "https://images.unsplash.com/photo-1470163386268-7c4613b71b1b",
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
          <p>
            Hundreds of students have benefitted from free and affordable books. 
            Community and volunteer efforts are driving real change.
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
    </div>
  );
};

export default LandingPage;
