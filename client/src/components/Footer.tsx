import React from 'react';
import { Link } from 'wouter';

export default function Footer() {
  return (
    <footer className="site-footer mt-8">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-3 md:mb-4">
              {/* Replaced icon and span with your SVG logo */}
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
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-3 md:mb-4">
              Providing secure, reliable banking services since 2010. Your trusted financial partner for a brighter future.
            </p>
            <div className="flex space-x-4 mb-4">
              <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-primary transition-colors">
                <i className="ri-facebook-fill text-xl"></i>
              </a>
              <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-primary transition-colors">
                <i className="ri-twitter-fill text-xl"></i>
              </a>
              <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-primary transition-colors">
                <i className="ri-instagram-fill text-xl"></i>
              </a>
              <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-primary transition-colors">
                <i className="ri-linkedin-fill text-xl"></i>
              </a>
            </div>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">
              © 2025 Nivalus Bank. All rights reserved.
            </p>
          </div>
          
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-gray-900 dark:text-white">Services</h3>
            <ul className="space-y-2 text-sm md:text-base">
              <li>
                <Link href="/login" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  Online Banking
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  Money Transfers
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  Savings Accounts
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  Investments
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-gray-900 dark:text-white">Company</h3>
            <ul className="space-y-2 text-sm md:text-base">
              <li>
                <Link href="/aboutus" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  Press
                </Link>
              </li>
              <li>
                <Link href="/security" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  Security
                </Link>
              </li> 
              <li>
                <Link href="/privacypolicy" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookiepolicy" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  Cookies Policy 
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">
            Nivalus Bank is a registered trademark. All rights reserved.
          </p>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">
            Nivalus Bank is a fictitious brand created for educational purposes only.
          </p>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">
            This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
          </p>
        </div>
      </div>
    </footer>
  );
}