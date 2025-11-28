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
      CELL Foundation is a not-for-profit organization founded by socially committed youth, working across diverse aspects of human development through creative, inclusive, and community-driven initiatives. Registered under the Indian Trusts Act in March 2023 and listed on the NITI Aayog's Darpan portal, the Foundation promotes grassroots movements led by people - especially the youth - to foster sustained and inclusive change.
    </p>

    <h2>Introduction: Book in Hand Campaign</h2>
    <p>
      The Book in Hand Campaign is a flagship initiative by CELL Foundation. It is a youth-led social initiative that has been running consistently since August 2023, commit committed to creating a community where every individual has the opportunity to learn and grow. </p>
      
      <p>The campaign operates Free Community Libraries across Delhi to ensure that books and knowledge are freely accessible to all without any barriers. Currently, there are six Free Community Libraries, including two dedicated to children from slum communitites.

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
