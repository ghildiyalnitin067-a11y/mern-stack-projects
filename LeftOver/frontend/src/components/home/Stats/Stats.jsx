import React from 'react';
import { Utensils, Users, Leaf } from 'lucide-react';
import './Stats.css';

const Stats = () => {
  const statsData = [
    {
      id: 1,
      icon: <Utensils size={28} className="stat-icon green" />,
      value: "50k+",
      label: "Meals Shared"
    },
    {
      id: 2,
      icon: <Users size={28} className="stat-icon orange" />,
      value: "12k+",
      label: "Active Users"
    },
    {
      id: 3,
      icon: <Leaf size={28} className="stat-icon green" />,
      value: "20 Tons",
      label: "Food Saved"
    }
  ];

  return (
    <section className="stats-section">
      <div className="stats-container">
        {statsData.map((stat) => (
          <div key={stat.id} className="stat-card">
            <div className="stat-icon-wrapper">
              {stat.icon}
            </div>
            <h3 className="stat-value">{stat.value}</h3>
            <p className="stat-label">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;
