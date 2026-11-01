import React from "react";
import Banner from "../../assets/banner.webp";
import SideImage from "../../assets/sideBare.webp";
import { ArrowRight } from "lucide-react";
import Category from "../../cards/CategoriesCard/Category";
import FeaturedProducts from "../../cards/ProductCard/ProductCard";
import WhyChooseUs from "../Chose/WhyChooseUs";
import SpecialOffer from "../SpecialOffer/SpecialOffer";
import Testimonials from "../Testimonials/Testimonials";

const Home = () => {
	return (
		<>
			<div className="flex flex-col md:flex-row gap-6 px-6 md:px-10 py-6 items-center justify-center">
				{/* Main Banner Section */}
				<section
					className="relative w-full md:w-[1000px] h-[400px] md:h-[500px] flex items-center justify-center text-center rounded-2xl overflow-hidden shadow-lg transition-transform duration-700 ease-out hover:scale-[1.01]"
					style={{
						backgroundImage: `url(${Banner})`,
						backgroundSize: "cover",
						backgroundPosition: "center",
						borderRadius: "18px",
					}}
				>
					{/* Overlay with subtle animation on load */}
					<div className="absolute inset-0 bg-black/45 rounded-2xl transition-opacity duration-1000 ease-out" />

					{/* Text content container with smooth animations */}
					<div className="relative z-10 max-w-2xl px-4 flex flex-col items-center">
						{/* Subheading / Tag badge */}
						<span className="animate-fade-in-up [animation-delay:100ms] [animation-fill-mode:both] inline-block bg-white/10 text-white backdrop-blur-md px-4 py-1.5 rounded-full text-xs md:text-sm font-medium tracking-wider uppercase mb-4 border border-white/20">
							Premium Living Spaces
						</span>

						{/* Heading with drop shadow and clean slide up */}
						<h1 className="animate-fade-in-up [animation-delay:350ms] [animation-fill-mode:both] text-4xl md:text-6xl font-bold text-white tracking-tight drop-shadow-xl">
							Welcome to Kidus Furniture
						</h1>

						{/* Body paragraph text */}
						<p className="animate-fade-in-up [animation-delay:550ms] [animation-fill-mode:both] mt-4 text-lg md:text-xl text-gray-200/90 font-light max-w-lg">
							Stylish, modern, and affordable furniture for your home.
						</p>

						{/* Call-to-action button with modern scale & hover feedback */}
						<div className="animate-fade-in-up [animation-delay:750ms] [animation-fill-mode:both]">
							<button className="mt-8 px-8 py-3.5 bg-indigo-600 text-amber-50 hover:bg-indigo-800 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 ease-out cursor-pointer tracking-wide">
								Shop Now
							</button>
						</div>
					</div>
				</section>

				{/* Side Image Section */}
				<section
					className="relative w-full md:w-[300px] h-[300px] md:h-[500px] flex items-center justify-center text-center rounded-2xl overflow-hidden shadow-lg group"
					style={{
						backgroundImage: `url(${SideImage})`,
						backgroundSize: "cover",
						backgroundPosition: "center",
						borderRadius: "18px",
					}}
				>
					<div className="absolute inset-0 bg-black/45 rounded-2xl transition-opacity duration-1000 ease-out group-hover:bg-black/55" />

					<div className="relative z-10 max-w-2xl px-4 flex flex-col items-center">
						{/* Heading with smooth fade-in and hover movement */}
						<h2 className="font-bold text-2xl text-amber-50 flex items-center gap-2 hover:text-amber-200 cursor-pointer transition-colors animate-fade-in-up [animation-delay:300ms] [animation-fill-mode:both]">
							Feature Product
							<ArrowRight
								size={20}
								className="transition-transform duration-300 group-hover:translate-x-1.5"
							/>
						</h2>

						{/* Explore button with smooth fade-in */}
						<div className="animate-fade-in-up [animation-delay:600ms] [animation-fill-mode:both]">
							<button className="font-semibold text-amber-50 mt-10 hover:text-amber-200 transition-colors cursor-pointer underline underline-offset-8">
								Explore More ...
							</button>
						</div>
					</div>
				</section>
			</div>
			<Category />
			<FeaturedProducts/>
			<WhyChooseUs/>
			<SpecialOffer/>
			<Testimonials/>
		</>
	);
};

export default Home;
