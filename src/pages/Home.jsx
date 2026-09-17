import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  ArrowUpRight,
  MapPin,
  Bed,
  Bath,
  Maximize,
  ChevronDown,
  ChevronUp,
  Building,
  CheckCircle2,
  ShieldCheck,
  Star,
  Quote,
  PhoneCall,
  Sparkles,
  Award,
  Users,
  Briefcase,
  Key,
} from 'lucide-react';
import { Button } from '../components/common/Button';

export const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If logged-in user is a renter, their home is their dashboard
  if (isAuthenticated && user?.role === 'renter') {
    return <Navigate to="/dashboard" replace />;
  }

  // Search Bar State
  const [transactionType, setTransactionType] = useState('Buy');
  const [selectedCity, setSelectedCity] = useState('Miami');
  const [selectedPrice, setSelectedPrice] = useState('Any Price');
  const [selectedType, setSelectedType] = useState('Show All');

  // Featured Category Filter
  const [activeCategory, setActiveCategory] = useState('All');

  // FAQ Accordion State
  const [expandedFaq, setExpandedFaq] = useState(0);

  const featuredProperties = [
    {
      id: 'prop_1',
      title: 'Modern Waterfront Sanctuary',
      location: 'Coconut Grove, Miami, FL',
      price: '$3,400,000',
      type: 'Villa',
      beds: 5,
      baths: 6,
      sqft: '5,600',
      tag: 'Featured Villa',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 'prop_2',
      title: 'The Skyview Penthouse & Gardens',
      location: 'TriBeCa, New York, NY',
      price: '$4,850,000',
      type: 'Penthouse',
      beds: 4,
      baths: 4.5,
      sqft: '4,200',
      tag: 'New Listing',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 'prop_3',
      title: 'Architectural Hillside Residence',
      location: 'Bel Air, Los Angeles, CA',
      price: '$6,200,000',
      type: 'Residential',
      beds: 6,
      baths: 7,
      sqft: '7,100',
      tag: 'Verified Luxury',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1000&q=80',
    },
  ];

  const filteredProperties =
    activeCategory === 'All'
      ? featuredProperties
      : featuredProperties.filter(
          (p) => p.type.toLowerCase() === activeCategory.toLowerCase()
        );

  const marketArticles = [
    {
      title: 'Role Of Real Estate Investments In A Digital Market',
      category: 'Investment Trends',
      readTime: '4 min read',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'How Interior Planning Impacts Property Appeal',
      category: 'Architecture',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Why Energy-Efficient Smart Homes Lead Valuations',
      category: 'Sustainable Living',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const faqs = [
    {
      q: 'How can I find the right property for my needs?',
      a: 'Our platform lets you filter properties by location, budget, size, and type. You can also explore detailed photos, verified floor plans, amenities, and schedule in-person or guided virtual tours to find the perfect match for your lifestyle.',
    },
    {
      q: 'Are all properties and agent credentials verified?',
      a: 'Yes. Every property listing undergoes thorough title and deed verification before publication. Licensed agents must submit certified state brokerage licenses and maintain a verified compliance rating on TRUSTY.',
    },
    {
      q: 'How do I schedule a physical or virtual viewing tour?',
      a: 'Select any listing, choose your preferred date and time slot from the viewing calendar, and the designated listing agent will immediately confirm your VIP walkthrough.',
    },
    {
      q: 'Can I list my own property or partner as a licensed agent?',
      a: 'Absolutely. Owners can list properties directly with verified ownership documentation, while licensed agents and brokerage agencies can create professional accounts with full CRM and multi-agent management.',
    },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate('/register');
  };

  return (
    <div className="bg-white text-slate-900 font-sans selection:bg-[#0b132b] selection:text-white antialiased">
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        {/* Top Headline & Header Action Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-extrabold text-[#0b132b] tracking-tight leading-[1.08]">
              Discover The Space That Fits Your Lifestyle
            </h1>
            <p className="text-sm sm:text-base text-slate-500 leading-relaxed max-w-lg">
              Step into a world of refined living with modern homes, elegant apartments, and serene cottages, all tailored for comfort and style.
            </p>
          </div>

          <div className="flex-shrink-0">
            <a
              href="#featured-properties"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#0b132b] hover:bg-[#1c2541] text-white text-sm font-semibold shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Explore Property</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Hero Property Image with Floating Search Widget */}
        <div className="relative rounded-[32px] sm:rounded-[40px] overflow-hidden shadow-2xl bg-slate-900 border border-slate-100">
          {/* High-res Modern Villa Image */}
          <div className="h-[460px] sm:h-[560px] lg:h-[620px] w-full relative">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85"
              alt="Luxury Modern Architecture"
              className="w-full h-full object-cover object-center"
            />
            {/* Subtle Gradient Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          </div>

          {/* Floating Search Bar Overlay */}
          <div className="absolute bottom-6 sm:bottom-10 inset-x-4 sm:inset-x-8 lg:inset-x-16 max-w-4xl mx-auto">
            <div className="bg-[#0b132b]/85 backdrop-blur-xl border border-white/20 rounded-[28px] p-4 sm:p-5 shadow-2xl">
              {/* Transaction Tabs */}
              <div className="flex items-center gap-1.5 mb-4">
                {['Buy', 'Rent', 'Sell'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setTransactionType(tab)}
                    className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                      transactionType === tab
                        ? 'bg-white text-[#0b132b] shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Form Selects Row */}
              <form
                onSubmit={handleSearchSubmit}
                className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
              >
                {/* Location */}
                <div className="sm:col-span-4 bg-white/10 rounded-2xl p-2.5 px-4 border border-white/10 text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">
                    Location
                  </span>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full bg-transparent text-white font-semibold text-xs focus:outline-none cursor-pointer mt-0.5"
                  >
                    <option value="Miami" className="bg-[#0b132b] text-white">Miami, FL</option>
                    <option value="New York" className="bg-[#0b132b] text-white">New York, NY</option>
                    <option value="Los Angeles" className="bg-[#0b132b] text-white">Los Angeles, CA</option>
                    <option value="Austin" className="bg-[#0b132b] text-white">Austin, TX</option>
                  </select>
                </div>

                {/* Pricing */}
                <div className="sm:col-span-3 bg-white/10 rounded-2xl p-2.5 px-4 border border-white/10 text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">
                    Pricing
                  </span>
                  <select
                    value={selectedPrice}
                    onChange={(e) => setSelectedPrice(e.target.value)}
                    className="w-full bg-transparent text-white font-semibold text-xs focus:outline-none cursor-pointer mt-0.5"
                  >
                    <option value="Any Price" className="bg-[#0b132b] text-white">Any Price</option>
                    <option value="1M-3M" className="bg-[#0b132b] text-white">$1M - $3M</option>
                    <option value="3M-5M" className="bg-[#0b132b] text-white">$3M - $5M</option>
                    <option value="5M+" className="bg-[#0b132b] text-white">$5M+</option>
                  </select>
                </div>

                {/* Property Type */}
                <div className="sm:col-span-3 bg-white/10 rounded-2xl p-2.5 px-4 border border-white/10 text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">
                    Property Type
                  </span>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full bg-transparent text-white font-semibold text-xs focus:outline-none cursor-pointer mt-0.5"
                  >
                    <option value="Show All" className="bg-[#0b132b] text-white">Show All</option>
                    <option value="Villa" className="bg-[#0b132b] text-white">Villa</option>
                    <option value="Penthouse" className="bg-[#0b132b] text-white">Penthouse</option>
                    <option value="Apartment" className="bg-[#0b132b] text-white">Apartment</option>
                  </select>
                </div>

                {/* Search Button */}
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-[#0b132b] font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg transition-all duration-150 hover:scale-[1.02]"
                  >
                    <Search className="w-4 h-4 text-[#0b132b]" />
                    <span>Search</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS / METRICS BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
          <div className="pt-4 sm:pt-0 sm:px-6 first:pl-0 text-left space-y-1">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#0b132b] tracking-tight">850+</h3>
            <p className="text-xs font-semibold text-slate-500">Property Sold</p>
          </div>

          <div className="pt-4 sm:pt-0 sm:px-6 text-left space-y-1">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#0b132b] tracking-tight">$350M+</h3>
            <p className="text-xs font-semibold text-slate-500">Total Transactions</p>
          </div>

          <div className="pt-4 sm:pt-0 sm:px-6 text-left space-y-1">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#0b132b] tracking-tight">98%</h3>
            <p className="text-xs font-semibold text-slate-500">Customer Satisfaction</p>
          </div>

          <div className="pt-4 sm:pt-0 sm:px-6 text-left space-y-1 hidden lg:block">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#0b132b] tracking-tight">12+</h3>
            <p className="text-xs font-semibold text-slate-500">Years of Trusted Excellence</p>
          </div>
        </div>
      </section>

      {/* 3. EXPLORE THE FEATURED PROPERTY SECTION */}
      <section id="featured-properties" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div className="space-y-1">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0b132b] tracking-tight">
              Explore The Featured Property
            </h2>
            <p className="text-sm text-slate-500">
              Curated premium homes verified for architectural distinction and clear title deeds.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#0b132b] hover:bg-[#1c2541] text-white text-xs font-semibold shadow-sm transition-all"
            >
              <span>View All Projects</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
          {['All', 'Villa', 'Penthouse', 'Residential'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-[#0b132b] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Property Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((prop) => (
            <div
              key={prop.id}
              className="group bg-white rounded-[28px] border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)] transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Card Image */}
              <div className="relative h-64 overflow-hidden rounded-t-[28px]">
                <img
                  src={prop.image}
                  alt={prop.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-bold text-[#0b132b] shadow-sm">
                    {prop.tag}
                  </span>
                </div>
                <div className="absolute bottom-4 right-4">
                  <span className="px-4 py-1.5 rounded-full bg-[#0b132b]/90 backdrop-blur-md text-sm font-extrabold text-white">
                    {prop.price}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {prop.title}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{prop.location}</span>
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 py-3 border-t border-slate-100 text-slate-600 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Bed className="w-4 h-4 text-slate-400" />
                    <span className="font-semibold">{prop.beds} Beds</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Bath className="w-4 h-4 text-slate-400" />
                    <span className="font-semibold">{prop.baths} Baths</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Maximize className="w-4 h-4 text-slate-400" />
                    <span className="font-semibold">{prop.sqft} sq ft</span>
                  </div>
                </div>

                <Link
                  to="/register"
                  className="w-full py-2.5 rounded-full bg-slate-50 hover:bg-[#0b132b] hover:text-white text-slate-800 text-xs font-bold border border-slate-200 transition-all text-center block"
                >
                  Schedule Private Tour
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. CLIENT TESTIMONIAL & SPOTLIGHT (Sarah Daniel style) */}
      <section id="testimonials" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-[#f8fafc] rounded-[36px] border border-slate-100 p-8 sm:p-14 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Quote Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-[#0b132b] text-white flex items-center justify-center shadow-md">
              <Quote className="w-6 h-6" />
            </div>

            <p className="text-xl sm:text-2xl font-semibold text-slate-800 leading-relaxed">
              “Our home-buying journey was so smooth! The verified listings were incredibly detailed, and the interface was completely seamless. We found our dream home in just a few days. I highly recommend TRUSTY to anyone seeking verified property!”
            </p>

            <div className="pt-2">
              <h4 className="text-base font-bold text-[#0b132b]">Sarah Daniel</h4>
              <p className="text-xs font-semibold text-slate-500">CEO, Ordex Foundation</p>
            </div>
          </div>

          {/* Right Agent / Client High-end Photo Spotlight */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white h-80 sm:h-96">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"
                alt="Sarah Daniel"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Verified Buyer</p>
                <p className="text-[11px] text-slate-500">Closed in Miami, FL</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MARKET INSIGHTS & ARTICLES */}
      <section id="market-insights" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div className="space-y-1">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0b132b] tracking-tight">
              Market Insights & Editorial
            </h2>
            <p className="text-sm text-slate-500">
              Expert intelligence, architectural reviews, and local neighborhood valuation forecasts.
            </p>
          </div>

          <Link
            to="/register"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#0b132b] hover:bg-[#1c2541] text-white text-xs font-semibold shadow-sm transition-all"
          >
            <span>View All News</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {marketArticles.map((article, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-[28px] border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-all duration-300 overflow-hidden flex flex-col"
            >
              <div className="relative h-60 overflow-hidden rounded-t-[28px]">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-bold text-slate-800">
                    {article.category}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <span className="text-xs text-slate-400 font-medium block">
                    {article.readTime}
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#0b132b]">
                  <span>Read Article</span>
                  <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-[#0b132b] group-hover:text-white flex items-center justify-center transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section id="faq-section" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0b132b] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-500">
            Answers to common questions regarding verified property transactions, tours, and platform governance.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = expandedFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setExpandedFaq(isOpen ? -1 : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 hover:text-blue-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-700" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-700" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. BOTTOM CTA SECTION */}
      <section id="about-trusty" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="rounded-[36px] bg-[#0b132b] text-white p-10 sm:p-16 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight max-w-2xl mx-auto">
            Ready to Discover Your Next Extraordinary Space?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Join thousands of verified homeowners, licensed agents, and investors enjoying seamless transactions.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white hover:bg-slate-100 text-[#0b132b] text-sm font-bold shadow-lg transition-all hover:scale-[1.02]"
            >
              <span>Get Started Now</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/30 hover:bg-white/10 text-white text-sm font-semibold transition-all"
            >
              <span>Existing User Login</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
