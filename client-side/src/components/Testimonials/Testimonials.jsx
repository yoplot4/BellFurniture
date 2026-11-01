import React from "react";
import { FaStar, FaQuoteLeft } from "react-icons/fa6";

const Testimonials = () => {
  // የደንበኞች አስተያየቶች ናሙና (ከ Database ወይም API መቀበል ይቻላል)
  const reviews = [
    {
      id: 1,
      name: "Abebe Kebede",
      role: "Homeowner, Addis Ababa",
      comment: "Kidus Furniture crafted a custom velvet sofa and dining table for my living room. The quality and finishing exceeded my expectations completely!",
      rating: 5,
    },
    {
      id: 2,
      name: "Tigist Mamo",
      role: "Interior Designer",
      comment: "As an interior designer, finding reliable custom furniture makers in Ethiopia is key. Their attention to detail and on-time delivery is amazing.",
      rating: 5,
    },
    {
      id: 3,
      name: "Dawit Bekele",
      role: "Business Owner",
      comment: "Ordered an executive office desk and chairs. Very professional service, solid wood materials, and great customer support from start to finish.",
      rating: 5,
    },
  ];

  return (
    <div className="w-full px-9 my-16">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="inline-block bg-indigo-50 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-3 animate-fade-in-up [animation-delay:100ms] [animation-fill-mode:both]">
          Happy Customers
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 animate-fade-in-up [animation-delay:200ms] [animation-fill-mode:both]">
          What Our Clients Say
        </h2>
        <p className="text-slate-500 mt-2 animate-fade-in-up [animation-delay:300ms] [animation-fill-mode:both]">
          Read genuine feedback from customers who transformed their spaces with Kidus Furniture.
        </p>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {reviews.map((item, index) => (
          <div
            key={item.id}
            className="relative flex flex-col justify-between p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 animate-fade-in-up [animation-fill-mode:both]"
            style={{ animationDelay: `${(index + 1) * 200}ms` }}
          >
            {/* Quote Icon Background Accent */}
            <div className="absolute top-6 right-6 text-indigo-100">
              <FaQuoteLeft className="w-10 h-10" />
            </div>

            {/* Rating Stars */}
            <div className="flex items-center gap-1 mb-4 text-amber-400">
              {[...Array(item.rating)].map((_, i) => (
                <FaStar key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>

            {/* Comment */}
            <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-6 relative z-10 italic">
              "{item.comment}"
            </p>

            {/* Customer Info */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
                {item.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 text-sm">{item.name}</h4>
                <p className="text-slate-400 text-xs">{item.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;