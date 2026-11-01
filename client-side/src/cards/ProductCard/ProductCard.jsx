import React from "react";
// እንደየፋይልህ አቀማመጥ (Path) የምርት ምስሎቹን ማስተካከል ትችላለህ
import Sofa from '../../assets/Sofa.jfif';
import Table from '../../assets/Table.jfif';
import Chair from '../../assets/Chair.jfif';
import Bed from '../../assets/Bed.jfif';

const FeaturedProducts = () => {
  // የናሙና ምርቶች መረጃ (ከ Database ወይም API መተካት ይቻላል)
  const products = [
    {
      id: 1,
      name: "Modern Velvet Sofa",
      price: "18,500 ETB",
      image: Sofa,
      category: "Sofa",
    },
    {
      id: 2,
      name: "Minimalist Wooden Table",
      price: "9,200 ETB",
      image: Table,
      category: "Table",
    },
    {
      id: 3,
      name: "Executive Office Chair",
      price: "4,500 ETB",
      image: Chair,
      category: "Chair",
    },
    {
      id: 4,
      name: "Luxury Queen Size Bed",
      price: "24,000 ETB",
      image: Bed,
      category: "Bed",
    },
  ];

  return (
    <div className="flex flex-col w-full h-auto px-9 my-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 animate-fade-in-up [animation-delay:100ms] [animation-fill-mode:both]">
            Featured Products
          </h2>
          <p className="text-slate-500 mt-1">
            Explore our top-rated custom furniture built for your comfort.
          </p>
        </div>
        <button className="mt-4 md:mt-0 text-indigo-600 font-semibold hover:text-indigo-800 transition-colors cursor-pointer">
          View All Products &rarr;
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="group flex flex-col justify-between p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer animate-fade-in-up [animation-fill-mode:both]"
            style={{ animationDelay: `${(index + 1) * 150}ms` }}
          >
            {/* Image Container */}
            <div className="relative h-48 w-full bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center mb-4">
              <span className="absolute top-3 left-3 bg-indigo-600/90 text-white text-xs font-medium px-2.5 py-1 rounded-full z-10">
                {product.category}
              </span>
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col flex-grow">
              <h3 className="font-semibold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">
                {product.name}
              </h3>
              <p className="text-indigo-600 font-bold text-lg mt-2">
                {product.price}
              </p>
            </div>

            {/* Add to Cart Button */}
            <button className="mt-5 w-full py-2.5 bg-slate-900 text-white font-medium rounded-xl hover:bg-indigo-600 transition-colors duration-300 shadow-md cursor-pointer">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;