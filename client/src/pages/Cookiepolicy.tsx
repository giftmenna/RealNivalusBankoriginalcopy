import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="150"
              height="50"
              viewBox="0 0 150 50"
              className="h-12 w-36"
            >
              <g fill="none" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20,10 L30,40 M30,10 L20,40 M40,10 L40,40 M50,10 L50,40 M60,10 L70,25 L60,40 M80,10 L75,25 L80,40 M90,10 L90,40 M90,25 L100,25 M110,10 L110,40 L120,40 M130,10 L130,40" />
              </g>
              <text x="20" y="45" fill="#FFD700" fontFamily="Inter, sans-serif" fontSize="8" fontWeight="bold">
                NIVALUS BANK
              </text>
            </svg>
          </Link>
        </div>
        <Link href="/">
          <Button variant="outline" className="border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white">
            Back to Home
          </Button>
        </Link>
      </header>

      {/* Cookie Policy Section */}
      <section className="container mx-auto py-20 px-4">
        <h1 className="text-4xl font-bold mb-12 text-center text-gray-900 dark:text-white">Cookie Policy</h1>
        <div className="max-w-3xl mx-auto text-gray-900 dark:text-white">
            <p className="text-gray-700 dark:text-gray-300 mb-6">
                This Cookie Policy explains how Nivalus Bank uses cookies and similar technologies on our website. By using our site, you consent to the use of cookies in accordance with this policy.</p>
          <h2 className="text-2xl font-semibold mb-4">What Are Cookies?</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Cookies are small text files stored on your device when you visit our website. They help us enhance your experience, analyze site performance, and deliver personalized content.
          </p>
          <h2 className="text-2xl font-semibold mb-4">How We Use Cookies</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            We use cookies for:
          </p>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-6">
            <li><strong>Essential Cookies:</strong> For core functionality like account access.</li>
            <li><strong>Analytics Cookies:</strong> To improve site performance.</li>
            <li><strong>Personalization Cookies:</strong> To tailor your experience.</li>
            <li><strong>Marketing Cookies:</strong> For relevant ads.</li>
          </ul>
          <h2 className="text-2xl font-semibold mb-4">Managing Cookies</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Control cookies via your browser or our account settings. Blocking cookies may limit some features.
          </p>
          <h2 className="text-2xl font-semibold mb-4">Third-Party Cookies</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            We use third-party services like Google Analytics, which set their own cookies.
          </p>
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Questions? Visit our <Link href="/contact" className="text-[#FFD700] hover:underline">Contact Page</Link>.
          </p>
          <div className="text-center">
            <Link href="/privacypolicy">
              <Button variant="outline" className="border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-gray-900">
                View Privacy Policy
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}