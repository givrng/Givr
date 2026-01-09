import React from 'react';
import heroImage from "../assets/hero-image.svg"
import { BulletIcon, DigitalCertificate, FileXIcon, GreenCheck, LockIcon, SearchTimeIcon, ShieldIcon, StarIcon, UsersIcon, VerifiedIcon, YelloBadge } from '../components/icons';
import { Button, FeatureCard, PlatformCategory } from '../components/ReuseableComponents';
import type { FeatureCardProps, BasicNatigationProps } from '../interface/interfaces';
import { GenericHeader } from '../components/Volunteer/landingHeader';

// --- Section Components ---

// HeroSection rewritten to match the provided structure and image styling
const HeroSection: React.FC<BasicNatigationProps> = ({ onToVolunteerSignUp, onToOrgSignUp }) => (
  <section className="mt-21 pb-16 bg-[#F7FAFC] min-h-[85vh] flex items-center">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
      {/* Left Content Column */}
      <div className="max-w-lg">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 text-gray-900">
          <span className="block">Welcome to Givr</span>
          <span className="block text-[#1A73E8]">Create Lasting Impact</span>
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Whether you are volunteering or managing a project, get skill-matched opportunities,seamless coordination, meaningful recognition, and a smarter way to drive community service on Givr.
        </p>

        {/* Call to action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
          {/* Sign up as a volunteer (Primary Button) */}
          <Button variant="primary" className="text-base" onClick={onToVolunteerSignUp}>Sign up as a volunteer</Button>
          {/* Post a project (Secondary/Outline Button) */}
          <Button variant="secondary" className="text-base" onClick={onToOrgSignUp}>Post a project</Button>
        </div>

        {/* Verification Badges (Styled like LabeledIcons) */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
          <div className="flex items-center text-gray-600">
            <VerifiedIcon className="w-5 h-5 mr-1.5 m-1" /> Verified Organizations
          </div>
          <div className="flex items-center text-gray-600">
            <DigitalCertificate className="w-5 h-5 mr-1.5" /> Digital Certificates
          </div>
        </div>
      </div>

      {/* Right Image Column */}
      <div className="relative">
        {/* Placeholder for the group image with map overlay */}
        <img
          src={heroImage}
          alt="Group of volunteers shaking hands over a map"
          className="rounded-3xl shadow-2xl w-full h-auto"

        />
      </div>
    </div>
  </section>
);


const ProblemSection: React.FC = () => {
  const problemData = [
    {
      title: 'Trust Issues',
      description: 'Volunteers struggle to verify if organizations are legitimate or if their help will be used properly.',
      icon: <ShieldIcon />,
      color: 'red' as const,
    },
    {
      title: 'Discovery Gap',
      description: 'Hard to find genuine opportunities that match your skills and availability.',
      icon: <SearchTimeIcon />,
      color: 'red' as const,
    },
    {
      title: 'No Recognition',
      description: 'Volunteer work goes unrecognized, with no credentials for future opportunities.',
      icon: <FileXIcon />,
      color: 'red' as const,
    },
    {
      title: 'Poor Coordination',
      description: 'WhatsApp groups and informal networks sometimes lead to confusion and wasted effort.',
      icon: <UsersIcon />,
      color: 'red' as const,
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900">
          Volunteering in Nigeria needs a better system
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-16">
          Current volunteering efforts face serious challenges that prevent
          meaningful impact
        </p>

        {/* Problem Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {problemData.map((item, index) => (
            <FeatureCard key={index} {...item} />
          ))}
        </div>

        {/* Solution Block (Central White Box) */}
        <div className="max-w-5xl mx-auto p-8 md:p-12 bg-white rounded-3xl shadow-2xl border border-gray-100">
          <h3 className="text-3xl font-extrabold mb-4 text-gray-900">
            Givr.ng fixes this by making volunteering <br />
            <span className="text-[#1A73E8]">easy</span>,
            <span className="text-[#34A853]">credible</span>, and
            <span className="text-[#FBBC05]">rewarding</span>
          </h3>
          <p className="text-[#676879] max-w-2xl mx-auto">
            Our platform connects trusted volunteers with verified organizations
            through a transparent, gamified system that recognizes your
            contributions.
          </p>
        </div>
      </div>
    </section>
  );
};

const MoreInfoSection: React.FC<BasicNatigationProps> = ({ onToOrgSignUp, onToVolunteerSignUp }) => {

  const platformCategories: Array<FeatureCardProps> = [
    {
      title: "For Volunteers",
      description: [
        "Sign up with basic verification",
        "Browse verfied opportunities by location and skills",
        "Apply and get approved",
        "Complete service and earn digital certificates"
      ],
      color: 'blue',
      cta: "Sign up as a volunteer",
      action: onToVolunteerSignUp
    },
    {
      title: "For Organization",
      description: [
        "Register and get verified by our team",
        "Post projects with clear requirements",
        "Review volunteer with clear requirements",
        "Rate volunteer and build relationships"
      ],
      color: 'green',
      cta: "Sign up as an Organization",
      action: onToOrgSignUp
    }

  ]

  return (<section className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900">
        How Givr works <br />
      </h2>
      <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-16">
        Two simple pathways to make volunteering work for everyone
      </p>

      {/* Feature Cards Grid */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {platformCategories.map((category, index) => <PlatformCategory key={index} {...category} />)}
        </div>
      </div>
    </div>
  </section>)
}

const CredibilitySection: React.FC = () => {
  const featureData = [
    {
      title: 'Verified Organizations',
      description: 'Every organization goes through our verification process before posting opportunities.',
      icon: <VerifiedIcon className="w-12 h-12" />,
      color: 'blue' as const,
    },
    {
      title: 'Rating System',
      description: 'Transparent ratings help volunteers and organizations build trust and reputation.',
      icon: <StarIcon className="w-12 h-12" />,
      color: 'yellow' as const,
    },
    {
      title: 'Digital Certificates',
      description: 'Earn verifiable certificates for completed volunteer work that boost your profile.',
      icon: <FileXIcon className="w-12 h-12" />, // Reusing File icon
      color: 'green' as const,
    },
    {
      title: 'Admin Oversight',
      description: 'Trusted community members ensure safety and quality in every interaction.',
      icon: <LockIcon className="w-12 h-12" />,
      color: 'lock' as const,
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900">
          We make <span className="text-[#1877F2]">credibility visible</span> and <br className="hidden sm:inline" />
          <span className="text-green-600">impact measurable</span>
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
          Built-in trust and recognition systems that reward genuine contribution
        </p>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featureData.map((item, index) => (
            // Apply distinct styling for this section's cards
            <div key={index} className="bg-white p-6 border border-gray-100 rounded-xl shadow-md text-left transition duration-300 hover:shadow-lg">
              <FeatureCard {...item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- New CTA Section ---

const CTASection: React.FC<BasicNatigationProps> = ({ onToOrgSignUp, onToVolunteerSignUp }) => (
  <section className="bg-[#1C212A] py-8 text-center">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">
        Ready to get more
      </h2>
      <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10">
        Join thousands of Nigerians making real impact in their communities. Start your volunteering journey today.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center mb-8">
        <Button variant="primary" className="text-base shadow-lg" onClick={onToVolunteerSignUp}>Sign up as a volunteer</Button>
        <Button variant="secondary" className="text-base shadow-lg" onClick={onToOrgSignUp}>Post a project</Button>
      </div>


      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium justify-center">
        <div className="flex items-center text-gray-300">
          <GreenCheck className="w-5 h-5 mr-1.5" /> Free to join
        </div>
        <div className="flex items-center text-gray-300">
          <YelloBadge className="w-5 h-5 mr-1.5" /> Verified and Trusted
        </div>
        <div className="flex items-center text-gray-300">
          <BulletIcon className="w-5 h-5 mr-1.5" /> Recognized impact
        </div>
      </div>
    </div>
  </section>
);

// --- Footer ---

const Footer: React.FC = () => (
  <footer className="bg-[#1C212A] pt-8 pb-8 text-white ">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
      <hr className="border-gray-400 my-8" />
      {/* Footer Content Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 pb-10 ">
        {/* Column 1: Givr Info */}
        <div className="col-span-2 md:col-span-1">
          <h4 className="text-lg font-bold mb-4 text-white">Givr</h4>
          <p className="text-sm text-gray-400 leading-relaxed">
            Making volunteering in Nigeria trusted, transparent, and rewarding.
          </p>
        </div>

        {/* Column 2: Platform Links */}
        <div>
          <h4 className="text-lg font-bold mb-4 text-white">Platform</h4>
          <ul className="space-y-3">
            <li><a href="#opportunities" className="text-sm text-gray-400 hover:text-[#1877F2] transition">Opportunities</a></li>
            <li><a href="#organizations" className="text-sm text-gray-400 hover:text-[#1877F2] transition">Organizations</a></li>
            <li><a href="#certificates" className="text-sm text-gray-400 hover:text-[#1877F2] transition">Certificates</a></li>
          </ul>
        </div>

        {/* Column 3: Support Links */}
        <div>
          <h4 className="text-lg font-bold mb-4 text-white">Support</h4>
          <ul className="space-y-3">
            <li><a href="#about" className="text-sm text-gray-400 hover:text-[#1877F2] transition">About Us</a></li>
            <li><a href="#help" className="text-sm text-gray-400 hover:text-[#1877F2] transition">Help Center</a></li>
            <li><a href="#contact" className="text-sm text-gray-400 hover:text-[#1877F2] transition">Contact</a></li>
          </ul>
        </div>
      </div>
      <hr className="border-gray-400 my-8" />

      {/* Copyright */}
      <div className="text-center text-xs text-[#676879]">
        &copy; {new Date().getFullYear()} Givr.ng. All rights reserved. Built for Nigerian communities.
      </div>
    </div>
  </footer>
);

// --- Main Application Component ---

export default function LandingPage(navigation: BasicNatigationProps) {
  return (
    <div className="min-h-screen font-[Inter] antialiased">
      <GenericHeader onToSignIn={navigation.onToSignIn} onToSignUp={navigation.onToSignUp} />
      <main>
        <HeroSection onToOrgSignUp={navigation.onToOrgSignUp} onToVolunteerSignUp={navigation.onToVolunteerSignUp} />
        <ProblemSection />
        <MoreInfoSection onToOrgSignUp={navigation.onToOrgSignUp} onToVolunteerSignUp={navigation.onToVolunteerSignUp}  />
        <CredibilitySection />
        <CTASection onToOrgSignUp={navigation.onToOrgSignUp} onToVolunteerSignUp={navigation.onToVolunteerSignUp} />
        <Footer />
      </main>
    </div>
  );
}
