import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-white dark:bg-gray-800 py-12 md:py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-gray-900 dark:text-gray-100 mb-6">
              Banking Made <span className="text-primary-600 dark:text-primary-300">Simple</span> for Everyone
            </h1>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-8 md:mb-10">
              Experience seamless financial management with Nivalus Bank’s secure and intuitive banking platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link href={user?.role === 'admin' ? '/admin' : '/dashboard'}>
                  <Button size="lg" className="px-6 py-5 md:px-8 md:py-6 text-base md:text-lg bg-primary-700 hover:bg-primary-800 text-white w-full sm:w-auto">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                   <Link href="/login" className="w-full sm:w-auto">
                    <Button size="lg" variant="outline" className="px-6 py-5 md:px-8 md:py-6 text-base md:text-lg border-2 text-gray-900 dark:text-gray-100 border-gray-900 dark:border-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 w-full">
                      Get Started
                    </Button>
                  </Link>
                  <Link href="/signup" className="w-full sm:w-auto">
                    <Button size="lg" variant="outline" className="px-6 py-5 md:px-8 md:py-6 text-base md:text-lg border-2 text-gray-900 dark:text-gray-100 border-gray-900 dark:border-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 w-full">
                      Open an Account
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="container mx-auto px-4 mt-12">
            <div className="rounded-xl bg-primary-100 dark:bg-primary-900 p-8 flex items-center justify-center">
              <img
                src="https://qbvyjnmyyfkjcxalcfvv.supabase.co/storage/v1/object/public/bankimages//IMG_8839.JPG"
                alt="Banking Image"
                className="w-full max-w-md h-auto object-cover rounded-lg"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-10 md:py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-center text-gray-900 dark:text-gray-100 mb-8 md:mb-12">
              Why Choose Nivalus Bank?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 md:p-6 text-center transition-transform hover:scale-105">
                <CardContent className="p-6 flex flex-col items-center">
                  <div className="rounded-full bg-primary-100 dark:bg-primary-900 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <i className="ri-shield-check-line text-primary-600 dark:text-primary-300 text-xl md:text-2xl"></i>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 md:mb-3">Enhanced Security</h3>
                  <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                    Bank with confidence knowing your funds and information are protected with advanced encryption.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 md:p-6 text-center transition-transform hover:scale-105">
                <CardContent className="p-6 flex flex-col items-center">
                  <div className="rounded-full bg-primary-100 dark:bg-primary-900 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <i className="ri-send-plane-line text-primary-600 dark:text-primary-300 text-xl md:text-2xl"></i>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 md:mb-3">Fast Transactions</h3>
                  <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                    Send and receive money instantly with real-time updates and various transfer methods.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 md:p-6 text-center transition-transform hover:scale-105">
                <CardContent className="p-6 flex flex-col items-center">
                  <div className="rounded-full bg-primary-100 dark:bg-primary-900 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <i className="ri-24-hours-line text-primary-600 dark:text-primary-300 text-xl md:text-2xl"></i>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 md:mb-3">Cross-Platform Access</h3>
                  <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                    Manage your finances anytime, anywhere on any device with our always-on platform.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Multiple Ways to Transfer */}
            <div className="mt-12 md:mt-16 text-center">
              <h3 className="text-xl md:text-2xl font-display font-bold text-gray-900 dark:text-gray-100 mb-4">
                Multiple Ways to Transfer
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm flex flex-col items-center">
                  <i className="ri-user-received-line text-primary-600 dark:text-primary-300 text-2xl mb-2"></i>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Direct</span>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm flex flex-col items-center">
                  <i className="ri-bank-line text-primary-600 dark:text-primary-300 text-2xl mb-2"></i>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Bank</span>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm flex flex-col items-center">
                  <i className="ri-bank-card-line text-primary-600 dark:text-primary-300 text-2xl mb-2"></i>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Card</span>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm flex flex-col items-center">
                  <i className="ri-send-plane-fill text-primary-600 dark:text-primary-300 text-2xl mb-2"></i>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Wire</span>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm flex flex-col items-center col-span-2 sm:col-span-1">
                  <i className="ri-user-shared-line text-primary-600 dark:text-primary-300 text-2xl mb-2"></i>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">P2P</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Highlights Section */}
        <section className="container mx-auto py-20 px-4 bg-gray-100 dark:bg-gray-800">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-12">Our Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <img
                  src="https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Checking Account"
                  className="h-38 w-full rounded-lg object-cover mb-4 border-4 border-white dark:border-gray-700"
                />
                <h3 className="text-xl font-bold mb-2 text-blue-800 dark:text-blue-200">Checking Accounts</h3>
                <ul className="text-gray-700 dark:text-gray-300 mb-4 text-left space-y-2">
                  <li className="flex items-center">
                    <i className="ri-money-dollar-circle-line text-blue-600 mr-2"></i>
                    No monthly maintenance fees
                  </li>
                  <li className="flex items-center">
                    <i className="ri-smartphone-line text-blue-600 mr-2"></i>
                    Mobile banking with instant transfers
                  </li>
                  <li className="flex items-center">
                    <i className="ri-atm-line text-blue-600 mr-2"></i>
                    Free ATM access nationwide
                  </li>
                  <li className="flex items-center">
                    <i className="ri-eye-line text-blue-600 mr-2"></i>
                    Real-time balance updates
                  </li>
                </ul>
                <Button variant="outline" className="border-blue-600 text-blue-600 dark:text-blue-200 bg-transparent hover:bg-blue-600 hover:text-white">
                  <Link href="/accounts">Explore Now</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <img
                  src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Credit and Debit Cards"
                  className="h-38 w-full rounded-lg object-cover mb-4 border-4 border-white dark:border-gray-700"
                />
                <h3 className="text-xl font-bold mb-2 text-green-800 dark:text-green-200">Cards</h3>
                <ul className="text-gray-700 dark:text-gray-300 mb-4 text-left space-y-2">
                  <li className="flex items-center">
                    <i className="ri-bank-card-line text-green-600 mr-2"></i>
                    Instant virtual card issuance
                  </li>
                  <li className="flex items-center">
                    <i className="ri-star-line text-green-600 mr-2"></i>
                    Earn rewards on every purchase
                  </li>
                  <li className="flex items-center">
                    <i className="ri-smartphone-line text-green-600 mr-2"></i>
                    Contactless payment support
                  </li>
                  <li className="flex items-center">
                    <i className="ri-lock-line text-green-600 mr-2"></i>
                    Advanced fraud protection
                  </li>
                </ul>
                <Button variant="outline" className="border-green-600 text-green-600 dark:text-green-200 bg-transparent hover:bg-green-600 hover:text-white">
                  <Link href="/cards">Discover More</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <img
                  src="https://qbvyjnmyyfkjcxalcfvv.supabase.co/storage/v1/object/public/bankimages//IMG_8838.JPG"
                  alt="Personal Loans"
                  className="h-38 w-full rounded-lg object-cover mb-4 border-4 border-white dark:border-gray-700"
                />
                <h3 className="text-xl font-bold mb-2 text-purple-800 dark:text-purple-200">Loans</h3>
                <ul className="text-gray-700 dark:text-gray-300 mb-4 text-left space-y-2">
                  <li className="flex items-center">
                    <i className="ri-money-dollar-box-line text-purple-600 mr-2"></i>
                    Competitive interest rates
                  </li>
                  <li className="flex items-center">
                    <i className="ri-calendar-line text-purple-600 mr-2"></i>
                    Flexible repayment terms
                  </li>
                  <li className="flex items-center">
                    <i className="ri-check-line text-purple-600 mr-2"></i>
                    Quick approval process
                  </li>
                  <li className="flex items-center">
                    <i className="ri-briefcase-line text-purple-600 mr-2"></i>
                    Options for personal and business needs
                  </li>
                </ul>
                <Button variant="outline" className="border-purple-600 text-purple-600 dark:text-purple-200 bg-transparent hover:bg-purple-600 hover:text-white">
                  <Link href="/loans">Learn More</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Nivalus Cards Section */}
        <section className="container mx-auto py-20 px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Nivalus Cards</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6 font-medium">
                Our cards offer security, flexibility, and rewards for an unmatched banking experience.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2 font-bold">✓</span>
                  <span className="text-gray-900 dark:text-gray-100 font-medium">Instant virtual card issuance</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2 font-bold">✓</span>
                  <span className="text-gray-900 dark:text-gray-100 font-medium">Customizable physical cards</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2 font-bold">✓</span>
                  <span className="text-gray-900 dark:text-gray-100 font-medium">Contactless payments</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2 font-bold">✓</span>
                  <span className="text-gray-900 dark:text-gray-100 font-medium">Rewards on every purchase</span>
                </li>
              </ul>
              <Button className="bg-primary-700 text-white hover:bg-primary-800 px-6 py-2">
                <Link href="/cards">Explore Our Cards</Link>
              </Button>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg flex justify-center">
              <div
                className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg transform transition-transform duration-300 hover:rotate-0 w-80 h-48"
                style={{ transform: 'rotate(3deg)' }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'rotate(0deg)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'rotate(3deg)')}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="text-[#FFD700] font-bold text-lg">Nivalus Bank</div>
                  <div className="text-white text-sm">Premium</div>
                </div>
                <div className="mb-4">
                  <div className="w-10 h-6 bg-yellow-100 rounded opacity-80"></div>
                </div>
                <div className="text-white text-base tracking-widest mb-4">**** **** **** 1234</div>
                <div className="flex justify-between text-gray-300 text-xs">
                  <div>
                    <div>VALID THRU</div>
                    <div>12/28</div>
                  </div>
                  <div>
                    <div>CARD HOLDER</div>
                    <div>JOHN DOE</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-gray-50 dark:bg-gray-900 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-12">What Our Customers Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Testimonial 1: Akira Hinata */}
              <Card className="bg-white dark:bg-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-4">
                      <i className="ri-user-line text-primary-600 dark:text-primary-300"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">Akira Hinata</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">Loyal Member</p>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    "I’m so happy with the experience. I was overwhelmed with the process at first, but Christi was so helpful and made the process seamless."
                  </p>
                </CardContent>
              </Card>

              {/* Testimonial 2: Smith U. */}
              <Card className="bg-white dark:bg-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-4">
                      <i className="ri-user-line text-primary-600 dark:text-primary-300"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">Smith U.</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">Loyal Member</p>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    "It was a pleasure to deal with Nivalus Bank that takes pride in working with 'the person,' not just an application with a number!"
                  </p>
                </CardContent>
              </Card>

              {/* Testimonial 3: Linda O. */}
              <Card className="bg-white dark:bg-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-4">
                      <i className="ri-user-line text-primary-600 dark:text-primary-300"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">Linda O.</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">Loyal Member</p>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    "I often wonder how I managed my business banking BEFORE I became a Nivalus Bank customer. It’s all so easy now, and the customer service I receive with my Free Business Checking account is absolutely outstanding. I get to talk to a real person when I need assistance!"
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="container mx-auto py-20 px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Ready to Experience Better Banking?</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have made the switch to Nivalus Bank.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <Link href="/signup" className="w-full sm:w-auto">
                    <Button size="lg" variant="outline" className="px-6 py-5 md:px-8 md:py-6 text-base md:text-lg border-2 text-gray-900 dark:text-gray-100 border-gray-900 dark:border-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 w-full">
                      Open an Account
                    </Button>
                  </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="px-8 border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">
                Contact Us
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}