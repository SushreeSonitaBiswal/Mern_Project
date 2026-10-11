import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, Calendar, Clock, ShieldCheck, ArrowRight, Star } from 'lucide-react';

const Home = () => {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/60 to-white pt-16 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Connect with Expert Doctors, <span className="text-emerald-600">Instantly.</span>
              </h1>
              <p className="text-lg text-slate-600 max-w-xl">
                Experience seamless appointment booking, real-time availability checks, electronic prescriptions, and personalized healthcare management in one unified platform.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/doctors"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 transition-all hover:scale-105"
                >
                  <span>Find a Doctor</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-all shadow-xs"
                >
                  Patient Sign Up
                </Link>
              </div>
            </div>

            {/* Quick Metrics Card */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900">50+</div>
                <div className="text-sm font-medium text-slate-500 mt-1">Verified Specialists</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900">24/7</div>
                <div className="text-sm font-medium text-slate-500 mt-1">Real-time Booking</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900">10k+</div>
                <div className="text-sm font-medium text-slate-500 mt-1">Consultations Done</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                  <Star className="w-6 h-6" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900">4.9/5</div>
                <div className="text-sm font-medium text-slate-500 mt-1">Patient Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
