import { Link } from "wouter";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-[#1F2937] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white dark:text-white">
            About Nivalus Bank
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-white dark:text-gray-200">
            Learn more about our mission, values, and commitment to your financial success.
          </p>
          <img
            src="https://qbvyjnmyyfkjcxalcfvv.supabase.co/storage/v1/object/public/bankimages//aboutus.JPG"
            alt="About Nivalus Bank"
            className="mx-auto rounded-lg shadow-lg max-w-full h-auto md:max-w-2xl"
          />
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            Our Mission
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            At Nivalus Bank, we aim to simplify banking while providing secure, innovative, and accessible financial solutions for everyone. Established in 2020, we’re here to empower your financial future.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">Innovation</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Pioneering digital banking solutions for a seamless experience.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">Security</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Protecting your finances with cutting-edge technology.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">Community</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Supporting local initiatives and financial education.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            Join Our Journey
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-700 dark:text-gray-300">
            Discover how Nivalus Bank can be your trusted partner in financial growth.
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