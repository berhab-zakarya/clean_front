"use client"

import { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Check } from 'lucide-react';
import { CardStack } from '../ui/card-stack';
import { Checkbox } from '../common/Checkbox';
import { RadioGroup, RadioGroupItem } from '../common/RadioGroup';

export default function AlgecomQuestionnaire() {
  const [selections, setSelections] = useState({
    sellingChannels: [],
    businessStage: '',
    productTypes: []
  });
  const [current, setCurrent] = useState(0);

  const steps = [
    {
      id: 'selling-channels',
      title: 'Where would you like to sell?',
      subtitle: "We'll make sure you're set up to sell in these places",
      type: 'checkbox',
      stateKey: 'sellingChannels',
      options: [
        {
          id: 'online-store',
          value: 'where_like_sell_online_store',
          label: 'An online store',
          description: 'Create a fully customizable website'
        },
        {
          id: 'retail-store',
          value: 'where_like_sell_improved_person_at_retail_store',
          label: 'In person at a retail store',
          description: 'Brick-and-mortar stores'
        },
        {
          id: 'events',
          value: 'where_like_sell_improved_person_at_events',
          label: 'In person at events',
          description: 'Markets, fairs, and pop-ups'
        },
        {
          id: 'existing-website',
          value: 'where_like_sell_existing_website_blog',
          label: 'An existing website or blog',
          description: 'Add a Buy Button to your website'
        },
        {
          id: 'social-media',
          value: 'where_like_sell_social_media',
          label: 'Social media',
          description: 'Reach customers on Facebook, Instagram, TikTok, and more'
        },
        {
          id: 'online-marketplaces',
          value: 'where_like_sell_online_marketplaces',
          label: 'Online marketplaces',
          description: 'List products on Etsy, Amazon, and more'
        }
      ]
    },
    {
      id: 'business-stage',
      title: 'Which best describes you?',
      subtitle: 'This helps us suggest the right onboarding',
      type: 'radio',
      stateKey: 'businessStage',
      options: [
        {
          id: 'not-selling',
          value: 'just_starting',
          label: "I'm not selling yet",
          description: null
        },
        {
          id: 'already-selling',
          value: 'already_selling_online_person',
          label: "I'm already selling online or in person",
          description: null
        }
      ]
    },
    {
      id: 'product-types',
      title: 'What do you plan to sell?',
      subtitle: "We'll get you the right features and tools",
      type: 'checkbox',
      stateKey: 'productTypes',
      options: [
        {
          id: 'physical-products',
          value: 'what_plan_sell_first_physical_products',
          label: 'Products I buy or make myself',
          description: 'Shipped by me'
        },
        {
          id: 'digital-products',
          value: 'what_plan_sell_first_digital_products',
          label: 'Digital products',
          description: 'Music, digital art, NFTs'
        },
        {
          id: 'dropshipping',
          value: 'what_plan_sell_first_dropshipping_products',
          label: 'Dropshipping products',
          description: 'Sourced and shipped by a third party'
        },
        {
          id: 'services',
          value: 'what_plan_sell_first_services',
          label: 'Services',
          description: 'Coaching, housekeeping, consulting'
        },
        {
          id: 'print-on-demand',
          value: 'what_plan_sell_first_print_on_demand_products',
          label: 'Print-on-demand products',
          description: 'My designs, printed and shipped by a third party'
        },
        {
          id: 'undecided',
          value: 'what_plan_sell_first_not_sure',
          label: "I'll decide later",
          description: null
        }
      ]
    }
  ];

  const handleCheckboxChange = (stateKey: string, value: string) => {
    setSelections(prev => {
      const currentSelections = [...prev[stateKey]];
      
      if (currentSelections.includes(value)) {
        return {
          ...prev,
          [stateKey]: currentSelections.filter(item => item !== value)
        };
      } else {
        return {
          ...prev,
          [stateKey]: [...currentSelections, value]
        };
      }
    });
  };

  const handleRadioChange = (stateKey: string, value: string) => {
    setSelections(prev => ({
      ...prev,
      [stateKey]: value
    }));
  };

  const CARDS = steps.map((step, index) => ({
    id: step.id,
    content: (() => {
      // البطاقة الأولى
      if (index === 0) {
        return (
          <div className="bg-[#F7F7FA] rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 w-full max-w-full">
            <h3 className="text-xl sm:text-2xl font-bold text-[#22223B] mb-2">{step.title} ?</h3>
            <p className="text-[#8D8BA7] mb-6 sm:mb-8 text-sm sm:text-base">{step.subtitle}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {step.options.map(option => (
                <div
                  key={option.id}
                  className={`flex items-center rounded-[16px] bg-white px-4 py-4 sm:px-6 sm:py-5 border transition-colors w-full
                    ${selections[step.stateKey].includes(option.value)
                      ? "border-[#1E3A8A] shadow"
                      : "border-transparent hover:border-[#1E3A8A]/40"
                    }`}
                  onClick={() => handleCheckboxChange(step.stateKey, option.value)}
                  style={{ cursor: "pointer" }}
                >
                  <Checkbox
                    id={option.id}
                    checked={selections[step.stateKey].includes(option.value)}
                    onCheckedChange={() => handleCheckboxChange(step.stateKey, option.value)}
                    className="mr-4"
                  />
                  <div>
                    <div className="font-semibold text-[#22223B] text-sm sm:text-base">{option.label}</div>
                    {option.description && (
                      <div className="text-[#8D8BA7] text-xs sm:text-sm">{option.description}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                className="bg-[#1E3A8A] text-white rounded-full px-6 sm:px-8 py-2 font-semibold flex items-center gap-2 text-sm sm:text-base"
                onClick={() => setCurrent((prev) => Math.min(prev + 1, steps.length - 1))}
                disabled={current === steps.length - 1}
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      }
      // البطاقة الثانية
      if (index === 1) {
        return (
          <div className="bg-white rounded-xl shadow p-6 w-full max-w-full border border-[#1E3A8A]">
            <h3 className="text-xl font-bold text-[#1E3A8A] mb-4">{step.title}</h3>
            <p className="text-[#8D8BA7] mb-6">{step.subtitle}</p>
            <RadioGroup
              value={selections[step.stateKey]}
              onValueChange={value => handleRadioChange(step.stateKey, value)}
              className="space-y-4"
            >
              {step.options.map(option => (
                <div
                  key={option.id}
                  className={`flex items-center rounded-lg bg-[#F7F7FA] px-4 py-4 border transition-colors w-full
                    ${selections[step.stateKey] === option.value
                      ? "border-[#1E3A8A] shadow"
                      : "border-transparent hover:border-[#1E3A8A]/40"
                    }`}
                  onClick={() => handleRadioChange(step.stateKey, option.value)}
                  style={{ cursor: "pointer" }}
                >
                  <RadioGroupItem
                    id={option.id}
                    value={option.value}
                    checked={selections[step.stateKey] === option.value}
                    className="mr-4"
                  />
                  <div>
                    <div className="font-semibold text-[#22223B]">{option.label}</div>
                    {option.description && (
                      <div className="text-[#8D8BA7] text-sm">{option.description}</div>
                    )}
                  </div>
                </div>
              ))}
            </RadioGroup>
            <div className="flex justify-between mt-8">
              <button
                className="bg-gray-200 text-[#1E3A8A] rounded-full px-6 py-2 font-semibold flex items-center gap-2"
                onClick={() => setCurrent((prev) => Math.max(prev - 1, 0))}
                disabled={current === 0}
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                className="bg-[#1E3A8A] text-white rounded-full px-6 py-2 font-semibold flex items-center gap-2"
                onClick={() => setCurrent((prev) => Math.min(prev + 1, steps.length - 1))}
                disabled={current === steps.length - 1}
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      }
      // البطاقة الثالثة
      if (index === 2) {
        return (
          <div className="bg-gradient-to-br from-[#1E3A8A] to-[#8D8BA7] rounded-2xl shadow-xl p-8 w-full max-w-full text-white">
            <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
            <p className="mb-8">{step.subtitle}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {step.options.map(option => (
                <div
                  key={option.id}
                  className={`flex items-center rounded-xl bg-white/20 px-6 py-5 border transition-colors w-full
                    ${selections[step.stateKey].includes(option.value)
                      ? "border-white shadow-lg"
                      : "border-transparent hover:border-white/60"
                    }`}
                  onClick={() => handleCheckboxChange(step.stateKey, option.value)}
                  style={{ cursor: "pointer" }}
                >
                  <Checkbox
                    id={option.id}
                    checked={selections[step.stateKey].includes(option.value)}
                    onCheckedChange={() => handleCheckboxChange(step.stateKey, option.value)}
                    className="mr-4"
                  />
                  <div>
                    <div className="font-semibold">{option.label}</div>
                    {option.description && (
                      <div className="text-sm">{option.description}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              <button
                className="bg-gray-200 text-[#1E3A8A] rounded-full px-6 py-2 font-semibold flex items-center gap-2"
                onClick={() => setCurrent((prev) => Math.max(prev - 1, 0))}
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                className="bg-white text-[#1E3A8A] rounded-full px-6 py-2 font-semibold flex items-center gap-2"
                onClick={() => {/* Submit or finish logic here */}}
              >
                Finish <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      }
    })(),
  }));

  return (
    <div className="flex items-center justify-center w-full px-2 sm:px-4 md:px-0">
      <CardStack items={CARDS} current={current} setCurrent={setCurrent} />
    </div>
  );
}