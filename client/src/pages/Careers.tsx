import { Link } from "wouter";

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-[#1F2937] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white dark:text-white">
            Careers at Nivalus Bank
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-white dark:text-gray-200">
            Join our team and help shape the future of banking with innovation and passion.
          </p>
          <img
            src="https://qbvyjnmyyfkjcxalcfvv.supabase.co/storage/v1/object/public/bankimages//career.JPG"
            alt="Careers at Nivalus Bank"
            className="mx-auto rounded-lg shadow-lg max-w-full h-auto md:max-w-2xl"
          />
        </div>
      </section>

      {/* Opportunities Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            Why Work With Us?
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            At Nivalus Bank, we offer a dynamic work environment, competitive benefits, and opportunities to grow while making a real impact in the financial industry.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">Growth</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Advance your career with training and development programs.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">Innovation</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Work on cutting-edge financial technologies.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">Teamwork</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Collaborate with a passionate and diverse team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            Ready to Join Us?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-700 dark:text-gray-300">
            Check back soon for open positions or contact us to express your interest!
          </p>
          <Link
            href="/contact"
            className="inline-block bg-[#FFD700] hover:bg-yellow-600 text-gray-900 px-8 py-3 text-lg rounded-md mr-4"
          >
            Contact Us
          </Link>
          <Link
            href="/"
            className="inline-block border border-gray-500 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 px-8 py-3 text-lg rounded-md"
          >
            Back to Home
          </Link>
        </div>
      </section>
    </div>
  );
}