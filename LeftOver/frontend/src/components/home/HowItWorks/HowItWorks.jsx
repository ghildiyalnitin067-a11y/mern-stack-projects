import React from 'react';
import { Camera, Share2, MessageSquare, Smile } from 'lucide-react';
import './HowItWorks.css';

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      icon: <Camera size={22} className="step-icon" />,
      title: "1. Snap",
      description: "Take a photo of your extra food and add a brief description."
    },
    {
      id: 2,
      icon: <Share2 size={22} className="step-icon" />,
      title: "2. Share",
      description: "Post it to the local feed so neighbors can discover it."
    },
    {
      id: 3,
      icon: <MessageSquare size={22} className="step-icon" />,
      title: "3. Connect",
      description: "Message interested neighbors to arrange a convenient pickup."
    },
    {
      id: 4,
      icon: <Smile size={22} className="step-icon" />,
      title: "4. Enjoy",
      description: "Feel good knowing you reduced waste and helped someone out."
    }
  ];

  return (
    <section className="how-it-works-section">
      <div className="how-it-works-container">
        <h2 className="how-it-works-title">How it Works</h2>

        <div className="steps-wrapper">
          <div className="steps-connector-line"></div>
          <div className="steps-grid">
            {steps.map((step) => (
              <div key={step.id} className="step-item">
                <div className="step-badge">
                  {step.icon}
                </div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
