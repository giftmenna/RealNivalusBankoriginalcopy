import { Link } from "wouter";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="bg-[#1F2937] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white dark:text-white">
            Your Privacy Matters at Nivalus Bank
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-white dark:text-gray-200">
            We are committed to protecting your personal information and ensuring your trust.
          </p>
          <img
            src="https://qbvyjnmyyfkjcxalcfvv.supabase.co/storage/v1/object/public/bankimages//privacy1.JPG"
            alt="Privacy Protection at Nivalus Bank"
            className="mx-auto rounded-lg shadow-lg max-w-full h-auto md:max-w-2xl"
          />
        </div>
      </section>
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Our Privacy Practices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">Data Security</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Advanced encryption protects your personal and financial data.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-600 dark:text-green-300 mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">Limited Data Collection</h3>
              <p className="text-gray-700 dark:text-gray-300">
                We only collect what’s necessary and never sell your data.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-300 mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">Compliance</h3>
              <p className="text-gray-700 dark:text-gray-300">
                We follow GDPR, CCPA, and other privacy laws.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                Transparency and Control
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6 font-medium">
                Manage your privacy settings and review your data with ease.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2 font-bold">✓</span>
                  <span className="text-gray-800 dark:text-gray-200 font-medium">Access to privacy settings</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2 font-bold">✓</span>
                  <span className="text-gray-800 dark:text-gray-200 font-medium">Clear data usage info</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2 font-bold">✓</span>
                  <span className="text-gray-800 dark:text-gray-200 font-medium">Opt-out options</span>
                </li>
              </ul>
              <Link href="/contact" className="text-[#FFD700] hover:text-yellow-600 dark:hover:text-yellow-300 font-medium">
                Learn More About Your Privacy Options →
              </Link>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
              <img
                src="https://qbvyjnmyyfkjcxalcfvv.supabase.co/storage/v1/object/public/bankimages//privacy2.JPG"
                alt="Transparency in Privacy"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            Have Privacy Questions?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-700 dark:text-gray-300">
            Contact us for more information about how we protect your data.
          </p>
          <img
            src="https://qbvyjnmyyfkjcxalcfvv.supabase.co/storage/v1/object/public/bankimages//privacy.JPG"
            alt="Contact Us for Privacy Inquiries"
            className="mx-auto rounded-lg shadow-lg max-w-full h-auto md:max-w-2xl mb-8"
          />
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