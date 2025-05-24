"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { CardStack } from "../ui/card-stack";
import { Checkbox } from "../common/Checkbox";
import { RadioGroup, RadioGroupItem } from "../common/RadioGroup";
import { usePlans } from "@/hooks/usePlans";
import Button from "../common/Button";
import { useRouter } from "next/navigation";

type Plan = {
  id: number;
  name: string;
  description: string;
  price: number;
  is_popular: boolean;
  features: {
    features: string[];
  };
};

export default function AlgecomQuestionnaire() {
  const router = useRouter();
  const [selections, setSelections] = useState({
    sellingChannels: [],
    businessStage: "",
    productTypes: [],
  });
  const [current, setCurrent] = useState(0);
  const { plans, loading, error } = usePlans();
  const steps = [
    {
      id: "selling-channels",
      title: "Where would you like to sell?",
      subtitle: "We'll make sure you're set up to sell in these places",
      type: "checkbox",
      stateKey: "sellingChannels",
      options: [
        {
          id: "online-store",
          value: "where_like_sell_online_store",
          label: "An online store",
          description: "Create a fully customizable website",
        },
        {
          id: "retail-store",
          value: "where_like_sell_improved_person_at_retail_store",
          label: "In person at a retail store",
          description: "Brick-and-mortar stores",
        },
        {
          id: "events",
          value: "where_like_sell_improved_person_at_events",
          label: "In person at events",
          description: "Markets, fairs, and pop-ups",
        },
        {
          id: "existing-website",
          value: "where_like_sell_existing_website_blog",
          label: "An existing website or blog",
          description: "Add a Buy Button to your website",
        },
        {
          id: "social-media",
          value: "where_like_sell_social_media",
          label: "Social media",
          description:
            "Reach customers on Facebook, Instagram, TikTok, and more",
        },
        {
          id: "online-marketplaces",
          value: "where_like_sell_online_marketplaces",
          label: "Online marketplaces",
          description: "List products on Etsy, Amazon, and more",
        },
      ],
    },
    {
      id: "business-stage",
      title: "Which best describes you?",
      subtitle: "This helps us suggest the right onboarding",
      type: "radio",
      stateKey: "businessStage",
      options: [
        {
          id: "not-selling",
          value: "just_starting",
          label: "I'm not selling yet",
          description: null,
        },
        {
          id: "already-selling",
          value: "already_selling_online_person",
          label: "I'm already selling online or in person",
          description: null,
        },
      ],
    },
    {
      id: "product-types",
      title: "What do you plan to sell?",
      subtitle: "We'll get you the right features and tools",
      type: "checkbox",
      stateKey: "productTypes",
      options: [
        {
          id: "physical-products",
          value: "what_plan_sell_first_physical_products",
          label: "Products I buy or make myself",
          description: "Shipped by me",
        },
        {
          id: "digital-products",
          value: "what_plan_sell_first_digital_products",
          label: "Digital products",
          description: "Music, digital art, NFTs",
        },
        {
          id: "dropshipping",
          value: "what_plan_sell_first_dropshipping_products",
          label: "Dropshipping products",
          description: "Sourced and shipped by a third party",
        },
        {
          id: "services",
          value: "what_plan_sell_first_services",
          label: "Services",
          description: "Coaching, housekeeping, consulting",
        },
        {
          id: "print-on-demand",
          value: "what_plan_sell_first_print_on_demand_products",
          label: "Print-on-demand products",
          description: "My designs, printed and shipped by a third party",
        },
        {
          id: "undecided",
          value: "what_plan_sell_first_not_sure",
          label: "I'll decide later",
          description: null,
        },
      ],
    },
  ];

  const handleCheckboxChange = (stateKey: string, value: string) => {
    setSelections((prev) => {
      const currentSelections = [...prev[stateKey]];

      if (currentSelections.includes(value)) {
        return {
          ...prev,
          [stateKey]: currentSelections.filter((item) => item !== value),
        };
      } else {
        return {
          ...prev,
          [stateKey]: [...currentSelections, value],
        };
      }
    });
  };

  const handleRadioChange = (stateKey: string, value: string) => {
    setSelections((prev) => ({
      ...prev,
      [stateKey]: value,
    }));
  };

  const handlePlanClick = (planId: number) => {
    router.push(`/dashboard/invoice?planId=${planId}`);
  };

  const CARDS = steps.map((step, index) => ({
    id: step.id,
    content: (() => {
      // البطاقة الأولى
      if (index === 0) {
        return (
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 w-full max-w-full">
            <h3 className="text-xl sm:text-2xl font-[500] text-[#22223B] mb-2">
              {step.title} ?
            </h3>
            <p className="text-[#8D8BA7] mb-6 sm:mb-8 text-sm sm:text-base">
              {step.subtitle}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {step.options.map((option) => (
                <div
                  key={option.id}
                  className={`flex items-center rounded-[16px] bg-[#F6F7F9] px-4 py-4 sm:px-6 sm:py-5 border transition-colors w-full
                    ${
                      selections[step.stateKey].includes(option.value)
                        ? "border-[#1E3A8A] shadow"
                        : "border-transparent hover:border-[#1E3A8A]/40"
                    }`}
                  onClick={() =>
                    handleCheckboxChange(step.stateKey, option.value)
                  }
                  style={{ cursor: "pointer" }}
                >
                  <Checkbox
                    id={option.id}
                    checked={selections[step.stateKey].includes(option.value)}
                    onCheckedChange={() =>
                      handleCheckboxChange(step.stateKey, option.value)
                    }
                    className="mr-4"
                  />
                  <div>
                    <div className="font-[500] text-[#1E3A8A] text-[20px] sm:text-base">
                      {option.label}
                    </div>
                    {option.description && (
                      <div className="text-[#828282] text-[16px] font-[400] sm:text-sm">
                        {option.description}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                className="bg-[#1E3A8A] text-white rounded-full px-6 sm:px-8 py-2 font-semibold flex items-center gap-2 text-sm sm:text-base"
                onClick={() =>
                  setCurrent((prev) => Math.min(prev + 1, steps.length - 1))
                }
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
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-full">
            <h3 className="text-xl sm:text-2xl font-bold text-[#22223B] mb-2">
              {step.title} ?
            </h3>
            <p className="text-[#8D8BA7] mb-6 sm:mb-8 text-sm sm:text-base">
              {step.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {step.options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`
                    flex-1 rounded-2xl px-4 py-6 text-lg font-semibold transition
                    ${selections[step.stateKey] === option.value
                      ? "bg-[#F7F7FA] text-[#1E3A8A] shadow border-2 border-[#1E3A8A]"
                      : "bg-[#F7F7FA] text-[#1E3A8A] border-2 border-transparent hover:border-[#1E3A8A]/40"}
                  `}
                  onClick={() => handleRadioChange(step.stateKey, option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="flex justify-between mt-4">
              <button
                className="text-[#1E3A8A] rounded-full px-6 py-2 font-semibold flex items-center gap-2 text-base"
                onClick={() => setCurrent((prev) => Math.max(prev - 1, 0))}
                disabled={current === 0}
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                className="bg-[#1E3A8A] text-white rounded-full px-6 py-2 font-semibold flex items-center gap-2 text-base"
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
        let basic = plans.find((p) => !p.is_popular);
        let popular = plans.find((p) => p.is_popular);
        let premium = plans
          .filter((p) => !p.is_popular && p.id !== basic?.id)
          .find((p) => p.price > (popular?.price || 0));
        
        const displayPlans = [basic, popular, premium].filter(Boolean).slice(0, 3);

        return (
          <div className="bg-white rounded-3xl shadow-xl p-6 w-full max-w-4xl mx-auto text-[#1E3A8A] border border-[#C7C7D1]">
            <h2 className="text-2xl font-semibold mb-1">
              Choose the best plan for you
            </h2>
            <p className="text-gray-400 mb-4 text-base">
              You can change or cancel anytime
            </p>
            {loading ? (
              <div className="text-[#1E3A8A] py-8 text-center">
                Loading plans...
              </div>
            ) : error ? (
              <div className="text-red-500 py-8 text-center">
                Error loading plans: {error.message}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {displayPlans.map((plan: Plan | undefined) => (
                  plan && (
                    <div
                      key={plan.id}
                      className={`relative flex flex-col border rounded-xl px-4 py-6 bg-white ${
                        plan.is_popular
                          ? "border-[#1E3A8A] shadow-lg"
                          : "border-[#C7C7D1]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xl font-bold">{plan.name}</span>
                        {plan.is_popular && (
                          <span className="bg-[#FF914D] text-white text-xs font-semibold px-3 py-1 rounded-full">
                            Most Popular
                          </span>
                        )}
                      </div>
                      <span className="text-gray-400 text-sm mb-2 line-clamp-2">
                        {plan.description}
                      </span>
                      <div className="flex items-baseline gap-1 mb-2">
                        <span className="text-2xl font-bold text-[#1E3A8A]">
                          {plan.price} DZD
                        </span>
                        <span className="text-sm text-gray-400">/month</span>
                      </div>
                      <hr className="my-2" />
                      <ul className="mb-4 space-y-2 flex-grow">
                        {plan.features?.features
                          ?.slice(0, 4)
                          .map((feature: string, i: number) => (
                            <li
                              key={i}
                              className="flex items-center gap-2 text-sm"
                            >
                              <span className="text-[#FF914D]">★</span>
                              <span className="font-medium text-[#1E3A8A]">
                                {feature}
                              </span>
                            </li>
                          ))}
                      </ul>
                      <Button 
                        className="w-full bg-[#1E3A8A] text-white rounded-full py-2 text-sm font-medium"
                        onClick={() => handlePlanClick(plan.id)}
                      >
                        Try {plan.name}
                      </Button>
                    </div>
                  )
                ))}
              </div>
            )}
            <div className="flex justify-between items-center mt-4 flex-wrap gap-2">
              <button
                className="bg-white text-[#1E3A8A] rounded-full px-4 py-2 font-[500] flex items-center gap-1 text-[16px]"
                onClick={() => setCurrent((prev) => Math.max(prev - 1, 0))}
              >
                 View plan details
              </button>
              <button
                className="bg-white text-[#1E3A8A] font-[500] rounded-full px-4 py-2 flex items-center gap-1 text-[16px]"
                onClick={() => {
                  /* Submit or finish logic here */
                }}
              >
                Skip, I&apos;ll decide later<ArrowRight className="w-4 h-4" />
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
