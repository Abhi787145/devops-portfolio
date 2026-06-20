import React from 'react';
import { ExternalLink, Database, Cpu, Globe, Server, Shield, Layers, MessageSquare, CreditCard } from 'lucide-react';
import './styles/Projects.css';

const Projects = () => {
  const shopNexaTech = [
    { name: 'AWS Lambda', desc: 'Serverless backend logic to sync product inventory.', icon: Cpu },
    { name: 'AWS VPC', desc: 'Secure network subnets shielding application resources.', icon: Shield },
    { name: 'Route53', desc: 'High-availability DNS routing domain queries.', icon: Globe },
    { name: 'MySQL Database', desc: 'Relational data store tracking catalog & status.', icon: Database },
    { name: 'Java / Spring Boot', desc: 'Robust API layer processing transaction requests.', icon: Server },
    { name: 'HTML & Angular', desc: 'Responsive management admin panel layouts.', icon: Layers },
    { name: 'WhatsApp API', desc: 'Automated status notifications sent directly to buyers.', icon: MessageSquare },
    { name: 'Payment Gateway', desc: 'Secure third-party API transaction integrations.', icon: CreditCard }
  ];

  return (
    <section id="projects" className="projects-section container">
      <div className="section-title-wrapper">
        <span className="sec-label">featured work</span>
        <h3 className="sec-title">E-Commerce Projects</h3>
        <p className="sec-desc">Showcasing production-level business sync engines and custom storefront deployments.</p>
      </div>

      <div className="project-highlight-card glass-panel">
        <div className="project-main-info">
          <div className="project-badge">ACTIVE PROJECT</div>
          <h4 className="project-title-name">ShopNexa (Dropshipping Platform)</h4>
          
          <div className="project-description-block">
            <p className="simple-english-desc">
              ShopNexa is a small-scale dropshipping business and project. It functions as a direct manufacturer-to-customer service model. In this setup, the product manufacturer handles the complete product manufacturing process, receives customer orders, and manages deliveries directly to the customer's specified location.
            </p>
            <p className="simple-english-desc">
              To support this workflow, the custom backend system integrates multiple external APIs (such as payment processors and automated messengers) alongside cloud computing resources to keep operational tasks synchronized and customer relations updated in real-time.
            </p>
          </div>

          <div className="project-workflow-visualizer">
            <h5 className="workflow-title">Manufacturer-to-Customer Direct Workflow</h5>
            <div className="workflow-flex-steps">
              <div className="wf-step">
                <div className="wf-circle"><i className="fa-solid fa-industry"></i></div>
                <span>1. Manufacture</span>
                <p>Creator produces inventory</p>
              </div>
              <div className="wf-arrow-next"><i className="fa-solid fa-chevron-right"></i></div>
              <div className="wf-step">
                <div className="wf-circle"><i className="fa-solid fa-cart-shopping"></i></div>
                <span>2. Order Sync</span>
                <p>Buyer places purchase</p>
              </div>
              <div className="wf-arrow-next"><i className="fa-solid fa-chevron-right"></i></div>
              <div className="wf-step">
                <div className="wf-circle"><i className="fa-solid fa-truck-ramp-box"></i></div>
                <span>3. Delivery</span>
                <p>Direct to customer site</p>
              </div>
            </div>
          </div>

          <div className="project-links">
            <a 
              href="https://theshopnexa.smartbiz.in/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-project-link"
            >
              Visit Storefront <ExternalLink size={14} />
            </a>
          </div>
        </div>

        <div className="project-components-grid">
          <h5 className="components-title">System Integration Components</h5>
          <div className="components-list-layout">
            {shopNexaTech.map((item, index) => {
              const CompIcon = item.icon;
              return (
                <div className="comp-card" key={index}>
                  <div className="comp-icon-box">
                    <CompIcon size={16} />
                  </div>
                  <div className="comp-info">
                    <h6>{item.name}</h6>
                    <p>{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
