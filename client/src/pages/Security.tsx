import { Link } from "wouter";

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="bg-[#1F2937] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white dark:text-white">
            Your Money is Safe with Nivalus Bank
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-white dark:text-gray-200">
            We use industry-leading security measures to protect your finances.
          </p>
          <img
            src="https://qbvyjnmyyfkjcxalcfvv.supabase.co/storage/v1/object/public/bankimages//security1.JPG"
            alt="Cybersecurity Protection"
            className="mx-auto rounded-lg shadow-lg max-w-full h-auto md:max-w-2xl"
          />
        </div>
      </section>
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            How We Keep Your Money Safe
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">End-to-End Encryption</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Your data is encrypted during transmission and storage.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-600 dark:text-green-300 mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">Multi-Factor Authentication</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Multiple verification steps ensure secure access.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-300 mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">Real-Time Fraud Monitoring</h3>
              <p className="text-gray-700 dark:text-gray-300">
                24/7 monitoring for suspicious activity.
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
                Cutting-Edge Security Technology
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6 font-medium">
                Advanced tech secures your data across all devices.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2 font-bold">✓</span>
                  <span className="text-gray-800 dark:text-gray-200 font-medium">Secure cloud infrastructure</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2 font-bold">✓</span>
                  <span className="text-gray-800 dark:text-gray-200 font-medium">Biometric authentication</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2 font-bold">✓</span>
                  <span className="text-gray-800 dark:text-gray-200 font-medium">Regular security audits</span>
                </li>
              </ul>
              <Link href="/contact" className="text-[#FFD700] hover:text-yellow-600 dark:hover:text-yellow-300 font-medium">
                Contact Us for More Information →
              </Link>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
              <img
                src="https://qbvyjnmyyfkjcxalcfvv.supabase.co/storage/v1/object/public/bankimages//security2.JPG"
                alt="Advanced Security Technology"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-[#1F2937] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-white dark:text-white">
            Trust Nivalus Bank with Your Finances
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-white dark:text-gray-200">
            Join millions relying on our robust security.
          </p>
          <Link
            href="/"
            className="inline-block bg-[#FFD700] hover:bg-yellow-600 text-gray-900 px-8 py-3 text-lg rounded-md"
          >
            Back to Home
          </Link>
        </div>
      </section>
    </div>
  );
}