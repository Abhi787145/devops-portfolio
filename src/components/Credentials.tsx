import React from 'react';
import { Award, GraduationCap, Calendar, Landmark, BookOpen } from 'lucide-react';
import './styles/Credentials.css';

const Credentials = () => {
  const certifications = [
    {
      title: 'MS Azure - AZ-900',
      issuer: 'Microsoft',
      date: 'Oct 2025',
      badge: 'Cloud'
    },
    {
      title: 'Generative AI Foundation',
      issuer: 'upGrad — Microsoft',
      date: 'June 2025',
      badge: 'Artificial Intelligence'
    },
    {
      title: 'AWS Certified Course',
      issuer: 'Cloud&DevOpsHUB',
      date: 'March 2026',
      badge: 'DevOps'
    },
    {
      title: 'Cyber Security Tools & Attacks',
      issuer: 'Coursera',
      date: 'Aug 2020',
      badge: 'Security'
    },
    {
      title: 'MNA + CloudV2',
      issuer: 'Jetking',
      date: 'June 2019',
      badge: 'Systems Infrastructure'
    }
  ];

  return (
    <section id="credentials" className="credentials-section container">
      <div className="section-title-wrapper">
        <span className="sec-label">verification gate</span>
        <h3 className="sec-title">Certifications & Education</h3>
        <p className="sec-desc">Verify my formal education, degree credentials, and professional cloud operations certifications.</p>
      </div>

      <div className="credentials-layout-grid">
        <div className="certifications-column">
          <h4 className="column-title"><Award size={18} /> Professional Certifications</h4>
          <div className="certs-list">
            {certifications.map((cert, index) => (
              <div className="certification-card glass-panel" key={index}>
                <div className="cert-header">
                  <span className="cert-badge">{cert.badge}</span>
                  <span className="cert-date"><Calendar size={12} /> {cert.date}</span>
                </div>
                <h5 className="cert-title">{cert.title}</h5>
                <p className="cert-issuer">Issued by: {cert.issuer}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="education-column">
          <h4 className="column-title"><GraduationCap size={18} /> Formal Education</h4>
          <div className="education-card-wrapper glass-panel">
            <div className="edu-header">
              <Landmark className="edu-icon" size={24} />
              <div>
                <h5>Pune Vidyarthi Griha's College of Engineering & S. S. Dhamankar Institute of Management</h5>
                <span className="edu-duration"><Calendar size={12} /> 2020 - 2024</span>
              </div>
            </div>

            <div className="edu-body">
              <div className="edu-meta-row">
                <BookOpen size={16} className="edu-meta-icon" />
                <div>
                  <h6>BE in Information Technology</h6>
                  <p>Bachelor of Engineering, specialization in systems development & database designs.</p>
                </div>
              </div>

              <div className="edu-gpa-container">
                <span className="gpa-label">Cumulative GPA</span>
                <span className="gpa-value">8.63 / 10.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Credentials;
