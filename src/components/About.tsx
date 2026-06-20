import React from 'react';
import './styles/About.css';

const About = () => {
  return (
    <section id="about" className="about-section container">
      <div className="section-title-wrapper">
        <span className="sec-label">profile summary</span>
        <h3 className="sec-title">Operational Core & Background</h3>
        <p className="sec-desc">A deep dive into my operational philosophies and system reliability objectives.</p>
      </div>

      <div className="about-grid">
        <div className="about-left-summary glass-panel">
          <h4 className="summary-title">Profile Summary</h4>
          <p>
            I am a dedicated <strong>DevOps Engineer</strong> with hands-on experience managing and deploying robust cloud infrastructures and orchestrating secure CI/CD build releases. My background bridges the gap between fast-paced feature releases and long-term production uptime.
          </p>
          <p>
            With strong roots in database administration (MS SQL Server) and system monitoring (Azure Alerts, SIEM logging), I specialize in detecting performance bottlenecks, configuring self-healing system triggers, and hardening server security profiles.
          </p>
        </div>

        <div className="about-philosophies">
          <div className="philosophy-card glass-panel">
            <div className="philosophy-icon">
              <i className="fa-solid fa-arrows-spin"></i>
            </div>
            <div className="philosophy-content">
              <h5>Continuous Automation</h5>
              <p>Eliminating operational drag by automating server creation, config audits, and dependency builds via modular IaC blueprints.</p>
            </div>
          </div>

          <div className="philosophy-card glass-panel">
            <div className="philosophy-icon">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <div className="philosophy-content">
              <h5>Reliability Engineering</h5>
              <p>Ensuring system integrity through proactive diagnostic probes, distributed telemetry graphs, and incident alerting limits.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
