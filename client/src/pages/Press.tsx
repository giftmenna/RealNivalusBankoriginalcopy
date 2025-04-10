import { Link } from "wouter";

export default function PressPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="bg-[#1F2937] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white dark:text-white">
            Nivalus Bank in the Press
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-white dark:text-gray-200">
            Discover the latest news, awards, and media highlights featuring Nivalus Bank.
          </p>
          <img
            src="https://qbvyjnmyyfkjcxalcfvv.supabase.co/storage/v1/object/public/bankimages//press.JPG"
            alt="Nivalus Bank Press Coverage"
            className="mx-auto rounded-lg shadow-lg max-w-full h-auto md:max-w-2xl"
          />
        </div>
      </section>
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Media Highlights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
                Award-Winning Innovation
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Nivalus Bank was named "Best Digital Bank 2024" for its cutting-edge solutions.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-600 dark:text-green-300 mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
                Community Impact
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Featured in Forbes for our financial literacy program.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-300 mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.656 0 3-1.344 3-3s-1.344-3-3-3-3 1.344-3 3 1.344 3 3 3zm0 2c-2.21 0-4 1.79-4 4v2h8v-2c0-2.21-1.79-4-4-4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
                Customer Trust
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Ranked #1 for customer satisfaction by TechFinance in 2024.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Featured Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
              <img
                src="https://qbvyjnmyyfkjcxalcfvv.supabase.co/storage/v1/object/public/bankimages//press1.JPG"
                alt="Nivalus Bank Digital Banking Innovation"
                className="w-full h-auto rounded-lg shadow-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
                Revolutionizing Digital Banking
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Praised by TechCrunch for our seamless mobile app.
              </p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
              <img
                src="https://qbvyjnmyyfkjcxalcfvv.supabase.co/storage/v1/object/public/bankimages//press2.JPG"
                alt="Nivalus Bank Community Outreach"
                className="w-full h-auto rounded-lg shadow-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
                Supporting Local Communities
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Highlighted in The Financial Times for funding small businesses.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                Leading with Security and Innovation
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6 font-medium">
                Recognized for state-of-the-art security and innovative banking solutions.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2 font-bold">✓</span>
                  <span className="text-gray-800 dark:text-gray-200 font-medium">Top-rated for cybersecurity in 2024</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2 font-bold">✓</span>
                  <span className="text-gray-800 dark:text-gray-200 font-medium">Featured in Wired for AI fraud detection</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2 font-bold">✓</span>
                  <span className="text-gray-800 dark:text-gray-200 font-medium">Partnered with fintech leaders</span>
                </li>
              </ul>
              <Link href="/contact" className="text-[#FFD700] hover:text-yellow-600 dark:hover:text-yellow-300 font-medium">
                Contact Nivalus Bank for Media Inquiries →
              </Link>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
              <img
                src="https://qbvyjnmyyfkjcxalcfvv.supabase.co/storage/v1/object/public/bankimages//press3.JPG"
                alt="Nivalus Bank Security and Innovation"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-[#1F2937] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-white dark:text-white">
            Stay Updated with Nivalus Bank
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-white dark:text-gray-200">
            Follow our journey as we continue to make headlines.
          </p>
          <Link
            href="/"
            className="inline-block bg-[#FFD700] hover:bg-yellow-600 text-gray-900 px-8 py-3 text-lg rounded-md mr-4"
          >
            Back to Home
          </Link>
          <Link
            href="/contact"
            className="inline-block border border-white text-white hover:bg-white hover:text-[#1F2937] px-8 py-3 text-lg rounded-md dark:hover:bg-gray-700 dark:hover:text-white"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}