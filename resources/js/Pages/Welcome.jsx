import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="BoniLMS - Online Learning Platform" />

            {/* Header */}
            <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-primary-blue to-primary-green bg-clip-text text-transparent">
                                BoniLMS
                            </Link>
                        </div>

                        {/* Navigation */}
                        <nav className="hidden md:flex space-x-8">
                            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-primary-blue transition-colors">Home</Link>
                            <Link href="/courses" className="text-gray-700 dark:text-gray-300 hover:text-primary-blue transition-colors">Courses</Link>
                            <Link href="/instructors" className="text-gray-700 dark:text-gray-300 hover:text-primary-blue transition-colors">Instructors</Link>
                            <Link href="/blog" className="text-gray-700 dark:text-gray-300 hover:text-primary-blue transition-colors">Blog</Link>
                            <Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-primary-blue transition-colors">About</Link>
                            <Link href="/contact" className="text-gray-700 dark:text-gray-300 hover:text-primary-blue transition-colors">Contact</Link>
                        </nav>

                        {/* Auth Buttons and Language Switcher */}
                        <div className="flex items-center space-x-4">
                            {/* Language Switcher */}
                            <select className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm">
                                <option>EN</option>
                                <option>BN</option>
                            </select>

                            {/* Auth Buttons */}
                            {auth.user ? (
                                <Link href="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-primary-blue transition-colors">Dashboard</Link>
                            ) : (
                                <>
                                    <Link href="/login" className="text-gray-700 dark:text-gray-300 hover:text-primary-blue transition-colors">Login</Link>
                                    <Link href="/register" className="bg-gradient-to-r from-primary-blue to-primary-green text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity">Sign Up</Link>
                                </>
                            )}

                            {/* Mobile Menu Button */}
                            <button className="md:hidden text-gray-700 dark:text-gray-300">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary-blue/10 to-primary-green/10 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                            Learn Anytime, <span className="bg-gradient-to-r from-primary-blue to-primary-green bg-clip-text text-transparent">Anywhere</span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                            Join thousands of students & instructors worldwide. Access quality education from the comfort of your home.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-gradient-to-r from-primary-blue to-primary-green text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                                Browse Courses
                            </button>
                            <button className="border-2 border-primary-blue text-primary-blue px-8 py-3 rounded-lg font-semibold hover:bg-primary-blue hover:text-white transition-colors">
                                Become an Instructor
                            </button>
                        </div>
                    </div>
                </div>
                {/* Hero Image Placeholder */}
                <div className="mt-12 max-w-4xl mx-auto">
                    <div className="bg-gradient-to-r from-primary-blue to-primary-green h-64 rounded-lg opacity-20"></div>
                </div>
            </section>

            {/* Course Categories */}
            <section className="py-16 bg-white dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Explore Categories</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {[
                            { name: 'IT & Software', icon: '💻' },
                            { name: 'Business', icon: '💼' },
                            { name: 'Design', icon: '🎨' },
                            { name: 'Marketing', icon: '📈' },
                            { name: 'Languages', icon: '🌍' },
                            { name: 'Health', icon: '🏥' }
                        ].map((category, index) => (
                            <div key={index} className="text-center p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-blue transition-colors cursor-pointer">
                                <div className="text-4xl mb-3">{category.icon}</div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">{category.name}</h3>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-8">
                        <button className="text-primary-blue hover:text-primary-green transition-colors font-semibold">
                            Explore All Categories →
                        </button>
                    </div>
                </div>
            </section>

            {/* Featured Courses */}
            <section className="py-16 bg-gray-50 dark:bg-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Featured Courses</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((course) => (
                            <div key={course} className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
                                <div className="h-48 bg-gradient-to-r from-primary-blue to-primary-green"></div>
                                <div className="p-6">
                                    <div className="flex items-center mb-2">
                                        <span className="bg-primary-green text-white px-2 py-1 rounded text-sm">Featured</span>
                                        <div className="ml-auto flex text-yellow-400">★★★★★</div>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Course Title {course}</h3>
                                    <p className="text-gray-600 dark:text-gray-300 mb-4">By Instructor Name</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-2xl font-bold text-primary-blue">$49.99</span>
                                        <button className="bg-primary-blue text-white px-4 py-2 rounded hover:bg-primary-blue/90 transition-colors">
                                            Enroll Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-16 bg-white dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Student Path */}
                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary-blue rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-white text-2xl">👨‍🎓</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">For Students</h3>
                            <div className="space-y-3 text-gray-600 dark:text-gray-300">
                                <div className="flex items-center">
                                    <span className="w-8 h-8 bg-primary-green rounded-full flex items-center justify-center mr-3 text-white font-bold">1</span>
                                    Browse Courses
                                </div>
                                <div className="flex items-center">
                                    <span className="w-8 h-8 bg-primary-green rounded-full flex items-center justify-center mr-3 text-white font-bold">2</span>
                                    Learn Online
                                </div>
                                <div className="flex items-center">
                                    <span className="w-8 h-8 bg-primary-green rounded-full flex items-center justify-center mr-3 text-white font-bold">3</span>
                                    Get Certified
                                </div>
                            </div>
                        </div>

                        {/* Instructor Path */}
                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary-green rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-white text-2xl">👨‍🏫</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">For Instructors</h3>
                            <div className="space-y-3 text-gray-600 dark:text-gray-300">
                                <div className="flex items-center">
                                    <span className="w-8 h-8 bg-primary-blue rounded-full flex items-center justify-center mr-3 text-white font-bold">1</span>
                                    Create Content
                                </div>
                                <div className="flex items-center">
                                    <span className="w-8 h-8 bg-primary-blue rounded-full flex items-center justify-center mr-3 text-white font-bold">2</span>
                                    Publish Course
                                </div>
                                <div className="flex items-center">
                                    <span className="w-8 h-8 bg-primary-blue rounded-full flex items-center justify-center mr-3 text-white font-bold">3</span>
                                    Earn Money
                                </div>
                            </div>
                        </div>

                        {/* Admin Path */}
                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-white text-2xl">⚙️</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">For Admins</h3>
                            <div className="space-y-3 text-gray-600 dark:text-gray-300">
                                <div className="flex items-center">
                                    <span className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3 text-white font-bold">1</span>
                                    Manage Platform
                                </div>
                                <div className="flex items-center">
                                    <span className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3 text-white font-bold">2</span>
                                    Monitor Analytics
                                </div>
                                <div className="flex items-center">
                                    <span className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3 text-white font-bold">3</span>
                                    Optimize Performance
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Instructor Highlight */}
            <section className="py-16 bg-gradient-to-r from-primary-blue/10 to-primary-green/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Become an Instructor</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                            Share your knowledge, build your audience, and earn money while making a difference in students' lives.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-primary-blue rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-white text-xl">💰</span>
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">Earn Money</h3>
                                <p className="text-gray-600 dark:text-gray-300">Get paid for every student who enrolls in your courses</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-primary-green rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-white text-xl">📚</span>
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">Share Knowledge</h3>
                                <p className="text-gray-600 dark:text-gray-300">Help students learn and grow in their careers</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-white text-xl">🌟</span>
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">Grow Your Audience</h3>
                                <p className="text-gray-600 dark:text-gray-300">Build a community of learners around your expertise</p>
                            </div>
                        </div>
                        <button className="bg-gradient-to-r from-primary-blue to-primary-green text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                            Start Teaching Today
                        </button>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-16 bg-white dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">What Our Students Say</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((testimonial) => (
                            <div key={testimonial} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-primary-blue to-primary-green rounded-full flex items-center justify-center mr-4">
                                        <span className="text-white font-bold">S{testimonial}</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white">Student {testimonial}</h4>
                                        <div className="flex text-yellow-400">★★★★★</div>
                                    </div>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 italic">
                                    "This platform has transformed my learning experience. The courses are excellent and the instructors are knowledgeable."
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Blog Section */}
            <section className="py-16 bg-gray-50 dark:bg-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Latest from Our Blog</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((post) => (
                            <div key={post} className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
                                <div className="h-48 bg-gradient-to-r from-primary-blue to-primary-green"></div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Blog Post Title {post}</h3>
                                    <p className="text-gray-600 dark:text-gray-300 mb-4">Learn about the latest trends in online education and technology...</p>
                                    <button className="text-primary-blue hover:text-primary-green transition-colors font-semibold">
                                        Read More →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="py-16 bg-gradient-to-r from-primary-blue to-primary-green">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
                    <p className="text-white/80 mb-8">Subscribe to our newsletter for the latest courses and educational insights.</p>
                    <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white"
                        />
                        <button className="bg-white text-primary-blue px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                            Subscribe
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-primary-blue to-primary-green bg-clip-text text-transparent">BoniLMS</h3>
                            <p className="text-gray-400">Empowering learners worldwide with quality online education.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                                <li><Link href="/courses" className="hover:text-white transition-colors">Courses</Link></li>
                                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Support</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Connect</h4>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">📘</a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">🐦</a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">📷</a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">💼</a>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2024 BoniLMS. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </>
    );
}
