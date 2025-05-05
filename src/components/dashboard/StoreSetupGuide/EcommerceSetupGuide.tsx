'use client'
import { useState } from 'react';
import { X } from 'lucide-react';
import { SetupSection as SetupSectionComponent } from './components/SetupSection';
import { setupSections } from './data/setupGuideData';

export default function EcommerceSetupGuide() {
  const [expandedSections, setExpandedSections] = useState({
    setup: true,
    name: true,
    domain: true,
    product: true,
    shipping: false,
    payment: false,
    testOrder: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const completedTasks = setupSections.filter(section => section.isCompleted).length;

  return (
    <div className="font-sans max-w-5xl mx-auto">
      {/* Banner */}
      <div className="bg-blue-800 text-white p-4 flex justify-between items-center">
        <p className="text-lg">Select a plan to get 3 months for $1/month</p>
        <div className="flex gap-4 items-center">
          <button className="bg-white text-blue-800 px-4 py-2 rounded-full font-medium">
            Select a plan
          </button>
          <X className="cursor-pointer" size={24} />
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Get ready to sell</h1>
        <p className="text-gray-600 mb-6">
          Here's your guide to get started. You'll receive new tips and information here as your business grows.
        </p>

        {/* Setup Progress */}
        <SetupSectionComponent
          section={{ id: 'setup', title: 'Setup guide', isCompleted: false }}
          isExpanded={expandedSections.setup}
          onToggle={() => toggleSection('setup')}
        >
          <p className="text-gray-600 mb-4">Use this personalized guide to get your store up and running</p>
          <div className="flex items-center mb-4">
            <div className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center mr-2">
              <span className="text-sm">{completedTasks}</span>
            </div>
            <span className="text-gray-700">of {setupSections.length} tasks completed</span>
          </div>
        </SetupSectionComponent>

        {/* Setup Sections */}
        {setupSections.map(section => (
          <SetupSectionComponent
            key={section.id}
            section={section}
            isExpanded={expandedSections[section.id]}
            onToggle={() => toggleSection(section.id)}
          >
            {section.description && (
              <>
                <p className="text-gray-600 mb-6">{section.description}</p>
                <button className="bg-blue-800 text-white px-6 py-3 rounded-md">
                  {`Set up ${section.title.toLowerCase()}`}
                </button>
              </>
            )}
          </SetupSectionComponent>
        ))}
      </div>
    </div>
  );
}