import React from "react";
import Sofa from '../../assets/Sofa.jfif';
import Table from '../../assets/Table.jfif';
import Chair from '../../assets/Chair.jfif';
import Bed from '../../assets/Bed.jfif';
import Door from '../../assets/Door.jfif';
import Bufe from '../../assets/Bufe.webp';

const Category = () => {
  return (
    <div className="flex flex-col w-full h-auto px-9">
      {/* Heading with fade down animation */}
      <h2 className="text-center font-bold text-3xl mb-6 animate-fade-in-up [animation-delay:100ms] [animation-fill-mode:both]"> 
        Categories 
      </h2>

      <div className="grid grid-cols-1 gap-4 p-4 bg-slate-50 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 rounded-xl shadow-inner">
        
        {/* Card 1: Sofa */}
        <div 
          className="flex flex-col items-center justify-between p-6 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer animate-fade-in-up [animation-delay:200ms] [animation-fill-mode:both]"
        >
          <div className="h-28 flex items-center justify-center">
            <img src={Sofa} alt="Sofa image" className="max-h-full object-contain rounded-2xl hover:scale-105 transition-transform duration-300" />
          </div>
          <span className="font-semibold text-slate-700 py-3">Sofa</span>
          <span className="font-medium m-3 hover:text-blue-600 mt-auto transition-colors">See More ...</span>
        </div>

        {/* Card 2: Table */}
        <div 
          className="flex flex-col items-center justify-between p-6 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer animate-fade-in-up [animation-delay:300ms] [animation-fill-mode:both]"
        >
          <div className="h-28 flex items-center justify-center">
            <img src={Table} alt="Table image" className="max-h-full object-contain rounded-2xl hover:scale-105 transition-transform duration-300" />
          </div>
          <span className="font-semibold text-slate-700 py-3">Table</span>
          <span className="font-medium m-3 hover:text-blue-600 mt-auto transition-colors">See More ...</span>
        </div>

        {/* Card 3: Chair */}
        <div 
          className="flex flex-col items-center justify-between p-6 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer animate-fade-in-up [animation-delay:400ms] [animation-fill-mode:both]"
        >
          <div className="h-28 flex items-center justify-center">
            <img src={Chair} alt="Chair image" className="max-h-full object-contain rounded-2xl hover:scale-105 transition-transform duration-300" />
          </div>
          <span className="font-semibold text-slate-700 py-3">Chair</span>
          <span className="font-medium m-3 hover:text-blue-600 mt-auto transition-colors">See More ...</span>
        </div>

        {/* Card 4: Bed */}
        <div 
          className="flex flex-col items-center justify-between p-6 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer animate-fade-in-up [animation-delay:500ms] [animation-fill-mode:both]"
        >
          <div className="h-28 flex items-center justify-center">
            <img src={Bed} alt="Bed image" className="max-h-full object-contain rounded-2xl hover:scale-105 transition-transform duration-300" />
          </div>
          <span className="font-semibold text-slate-700 py-3">Bed</span>
          <span className="font-medium m-3 hover:text-blue-600 mt-auto transition-colors">See More ...</span>
        </div>

        {/* Card 5: Door */}
        <div 
          className="flex flex-col items-center justify-between p-6 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer animate-fade-in-up [animation-delay:600ms] [animation-fill-mode:both]"
        >
          <div className="h-28 flex items-center justify-center">
            <img src={Door} alt="Door image" className="max-h-full object-contain rounded-2xl hover:scale-105 transition-transform duration-300" />
          </div>
          <span className="font-semibold text-slate-700 py-3">Door</span>
          <span className="font-medium m-3 hover:text-blue-600 mt-auto transition-colors">See More ...</span>
        </div>

        {/* Card 6: Bufe */}
        <div 
          className="flex flex-col items-center justify-between p-6 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer animate-fade-in-up [animation-delay:700ms] [animation-fill-mode:both]"
        >
          <div className="h-28 flex items-center justify-center">
            <img src={Bufe} alt="Bufe image" className="max-h-full object-contain rounded-2xl hover:scale-105 transition-transform duration-300" />
          </div>
          <span className="font-semibold text-slate-700 py-3">Bufe</span>
          <span className="font-medium m-3 hover:text-blue-600 mt-auto transition-colors">See More ...</span>
        </div>

      </div>
    </div>
  );
};

export default Category;