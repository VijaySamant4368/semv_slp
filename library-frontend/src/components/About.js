import React from "react";
import "./About.css";


const teamMembers = [
  {
    name: "Alice Sharma",
    role: "Founder & Campaign Lead",
    image:
      "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    name: "Ravi Gupta",
    role: "Program Coordinator",
    image:
      "https://randomuser.me/api/portraits/men/35.jpg"
  },
  {
    name: "Priya Singh",
    role: "Community Outreach",
    image:
      "https://randomuser.me/api/portraits/women/65.jpg"
  },
  {
    name: "Amit Joshi",
    role: "Volunteer Manager",
    image:
      "https://randomuser.me/api/portraits/men/50.jpg"
  },
];

const About = () => (
  <div className="about-container">
    <h1>About Book in Hand Campaign</h1>
    <p>
      The Book in Hand Campaign is a heartfelt initiative by the NGO Cell Foundation,
      passionately dedicated to fostering a love for reading and providing access to quality books for everyone.
      Through this campaign, we strive to bridge the literacy gap by making books readily available to underserved communities, schools, and individuals.
    </p>

    <h2>Our Vision</h2>
    <p>
      We envision a world where every person has the opportunity to explore the world of books,
      regardless of their background or circumstances.
      We firmly believe that access to books is a fundamental right and a key to personal and societal growth.
    </p>

    <h2>History</h2>
    <p>
      Established in 2018, the Book in Hand Campaign evolved from a small, local initiative to a nationwide movement.
      It began with a simple yet powerful idea: to collect gently used books and distribute them to those in need.
      Over the years, we have expanded our reach through strong partnerships with schools, libraries, and community centers,
      positively impacting thousands of lives and nurturing the joy of reading across India.
    </p>

    <h2>Our Team</h2>
    <div className="team-container">
      {teamMembers.map((member, index) => (
        <div key={index} className="team-member">
          <img src={member.image} alt={member.name} />
          <h3>{member.name}</h3>
          <p>{member.role}</p>
        </div>
      ))}
    </div>

  </div>
);

export default About;
