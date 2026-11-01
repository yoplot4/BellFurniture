import React from "react";
import { FaShieldHalved, FaTruckFast, FaHammer, FaHeadset } from "react-icons/fa6";

const WhyChooseUs = () => {
  const features = [
    {
      id: 1,
      icon: <FaHammer className="w-6 h-6 text-indigo-600" />,
      title: "Custom & Quality Design",
      description: "We craft custom furniture tailored to your exact space, preference, and high-quality standards.",
    },
    {
      id: 2,
      icon: <FaTruckFast className="w-6 h-6 text-indigo-600" />,
      title: "Fast Delivery & Setup",
      description: "Reliable transportation and professional assembly right inside your home, anywhere you need.",
    },
    {
      id: 3,
      icon: <FaShieldHalved className="w-6 h-6 text-indigo-600" />,
      title: "Trusted Warranty",
      description: "We stand by our craftsmanship, offering solid warranties and durable materials that last for years.",
    },
    {
      id: 4,
      icon: <FaHeadset className="w-6 h-6 text-indigo-600" />,
      title: "Dedicated Support",
      description: "Friendly customer service ready to assist you from your initial order placement to final delivery.",
    },
  ];

  return (
    <div className="w-full bg-slate-50 py-16 px-9 my-12 rounded-3xl shadow-inner">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-bold text-slate-800 animate-fade-in-up [animation-delay:100ms] [animation-fill-mode:both]">
          Why Choose Us?
        </h2>
        <p className="text-slate-500 mt-2 animate-fade-in-up [animation-delay:200ms] [animation-fill-mode:both]">
          Discover what makes Kidus Furniture the preferred choice for custom and quality living spaces.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
        {features.map((item, index) => (
          <div
            key={item.id}
            className="group flex flex-col p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer animate-fade-in-up [animation-fill-mode:both]"
            style={{ animationDelay: `${(index + 1) * 150}ms` }}
          >
            {/* Icon Container */}
            <div className="w-12 h-12 flex items-center justify-center bg-indigo-50 rounded-xl mb-5 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
              {/* Note: Icon color changes on hover via parent group hover class if needed, or keeping icon styled */}
              <div className="group-hover:text-white transition-colors duration-300">
                {item.icon}
              </div>
            </div>

            {/* Title & Description */}
            <h3 className="font-semibold text-slate-800 text-lg mb-2 group-hover:text-indigo-600 transition-colors">
              {item.title}
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyChooseUs;