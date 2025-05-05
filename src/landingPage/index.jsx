import React, { useState } from "react";
import {
    FaCheckCircle,
    FaLock,
    FaUserShield,
    FaRobot,
    FaChartBar,
    FaHeadset,
    FaArrowRight,
    FaStar,
    FaChevronDown,
    FaChevronUp,
    FaFacebookF,
    FaTwitter,
    FaLinkedinIn,
    FaEnvelope,
    FaBars,
    FaTimes,
    FaSignInAlt,
    FaUserPlus,
} from "react-icons/fa";
import Icon from "../assets/favicon.png"
import Main from "../assets/main.png"
import Man1 from "../assets/man1.avif"
import Man2 from "../assets/man2.avif"
import Woman from "../assets/woman.avif"

const features = [
    {
        icon: <FaRobot className="text-blue-600 w-10 h-10" />, title: "24/7 AI Support", desc: "Deliver instant, accurate answers to your customers at any time, powered by your data.",
    },
    {
        icon: <FaHeadset className="text-blue-600 w-10 h-10" />, title: "Live Agent Handoff", desc: "Seamlessly connect users to a real person for complex queries.",
    },
    {
        icon: <FaChartBar className="text-blue-600 w-10 h-10" />, title: "Powerful Analytics", desc: "Track and optimize customer interactions with detailed insights.",
    },
    {
        icon: <FaUserShield className="text-blue-600 w-10 h-10" />, title: "Top Security", desc: "AES-256 encryption, GDPR & DPA compliance, and zero-retention data policy.",
    },
];

const steps = [
    { icon: <FaArrowRight className="text-white w-6 h-6" />, label: "Import your data" },
    { icon: <FaArrowRight className="text-white w-6 h-6" />, label: "Customize to match your brand" },
    { icon: <FaArrowRight className="text-white w-6 h-6" />, label: "Easily add ChatNode to your website" },
    { icon: <FaArrowRight className="text-white w-6 h-6" />, label: "Integrate tools and optimize workflows" },
];

const testimonials = [
    {
        name: "Lynette Davidson",
        company: "Legaljoy",
        quote: "We tried others, but none matched how naturally Chatnode interacts with our customers.",
        avatar: Woman,
        rating: 5,
    },
    {
        name: "Connor Jones",
        company: "Monty",
        quote: "With Chatnode, we spend less but actually provide better support, it's been a huge win for us.",
        avatar: Man2,
        rating: 5,
    },
    {
        name: "Arturo Feirrera",
        company: "Upscaile",
        quote: "The most capable customer support AI we've used by far. User-friendly setup and impressive AI accuracy.",
        avatar: Man1,
        rating: 5,
    },
];

const faqs = [
    {
        q: "Can ChatNode AI continuously learn and update itself with my latest data?",
        a: "Yes, ChatNode AI offers an auto-retrain feature that allows your chatbot to refresh its knowledge at set intervals.",
    },
    {
        q: "Does the user have the option to connect to a Live Agent?",
        a: "Yes, users can connect with a Live Agent and talk to a real person when needed.",
    },
    {
        q: "How do message credits work?",
        a: "Each AI response costs a certain number of message credits depending on your chosen model. Most models cost 1 message credit per response.",
    },
];

const socials = [
    { icon: <FaFacebookF />, href: "#" },
    { icon: <FaTwitter />, href: "#" },
    { icon: <FaLinkedinIn />, href: "#" },
    { icon: <FaEnvelope />, href: "mailto:info@chatnode.ai" },
];

function TestimonialCarousel({ testimonials }) {
    const [index, setIndex] = useState(0);
    React.useEffect(() => {
        const timer = setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 5000);
        return () => clearInterval(timer);
    }, [testimonials.length]);
    return (
        <div className="relative max-w-xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center transition-all duration-500">
                <img src={testimonials[index].avatar} alt={testimonials[index].name} className="w-20 h-20 rounded-full mb-4 shadow-lg border-4 border-blue-100" />
                <div className="flex gap-1 mb-2">{Array.from({ length: testimonials[index].rating }).map((_, i) => <FaStar key={i} className="text-yellow-400" />)}</div>
                <p className="text-gray-700 italic mb-4 text-lg">"{testimonials[index].quote}"</p>
                <div className="text-gray-800 font-semibold">{testimonials[index].name}</div>
                <div className="text-gray-500 text-sm">{testimonials[index].company}</div>
            </div>
            <div className="flex justify-center gap-2 mt-4">
                {testimonials.map((_, i) => (
                    <button
                        key={i}
                        className={`w-3 h-3 rounded-full ${i === index ? "bg-blue-600" : "bg-gray-300"}`}
                        onClick={() => setIndex(i)}
                        aria-label={`Go to testimonial ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}

function LandingPage() {
    const [openFaq, setOpenFaq] = useState(null);
    const [email, setEmail] = useState("");
    const [newsletterMsg, setNewsletterMsg] = useState("");
    const [navOpen, setNavOpen] = useState(false);

    const handleNewsletter = (e) => {
        e.preventDefault();
        setNewsletterMsg("Thank you for subscribing!");
        setEmail("");
        setTimeout(() => setNewsletterMsg(""), 3000);
    };

    // Smooth scroll handler
    const handleNavClick = (e, id) => {
        e.preventDefault();
        setNavOpen(false);
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans overflow-x-hidden">
            {/* Sticky Header Navigation */}
            <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur shadow-md">
                <div className="mx-[5%] flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2 justify-center">
                        <img src={Icon} alt="ChatNode Logo" className="w-10 h-10 rounded-full" />
                        <div className="text-2xl font-bold">RAG System</div>
                    </div>
                    <div className="hidden md:flex gap-6 text-gray-700 font-medium">
                        <a href="#features" onClick={e => handleNavClick(e, 'features')} className="hover:text-blue-600 transition">Features</a>
                        <a href="#how" onClick={e => handleNavClick(e, 'how')} className="hover:text-blue-600 transition">How It Works</a>
                        <a href="#testimonials" onClick={e => handleNavClick(e, 'testimonials')} className="hover:text-blue-600 transition">Testimonials</a>
                        <a href="#security" onClick={e => handleNavClick(e, 'security')} className="hover:text-blue-600 transition">Security</a>
                        <a href="#faq" onClick={e => handleNavClick(e, 'faq')} className="hover:text-blue-600 transition">FAQ</a>
                        <a href="#newsletter" onClick={e => handleNavClick(e, 'newsletter')} className="hover:text-blue-600 transition">Newsletter</a>
                    </div>
                    <div className="flex items-center gap-3">
                        <a href="/signin" className="hidden md:flex items-center gap-1 px-4 py-2 rounded-lg text-blue-700 border border-blue-600 hover:bg-blue-50 font-semibold transition text-sm"><FaSignInAlt className="mr-1" />Sign In</a>
                        <a href="/signup" className="hidden md:flex items-center gap-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold transition text-sm"><FaUserPlus className="mr-1" />Sign Up</a>
                        <button className="md:hidden text-2xl text-blue-700" onClick={() => setNavOpen(!navOpen)}>
                            {navOpen ? <FaTimes /> : <FaBars />}
                        </button>
                    </div>
                </div>
                {/* Mobile nav */}
                {navOpen && (
                    <div className="md:hidden bg-white border-t shadow px-4 pb-4 flex flex-col gap-3 animate-fade-in">
                        <a href="#features" onClick={e => handleNavClick(e, 'features')} className="hover:text-blue-600 transition">Features</a>
                        <a href="#how" onClick={e => handleNavClick(e, 'how')} className="hover:text-blue-600 transition">How It Works</a>
                        <a href="#testimonials" onClick={e => handleNavClick(e, 'testimonials')} className="hover:text-blue-600 transition">Testimonials</a>
                        <a href="#security" onClick={e => handleNavClick(e, 'security')} className="hover:text-blue-600 transition">Security</a>
                        <a href="#faq" onClick={e => handleNavClick(e, 'faq')} className="hover:text-blue-600 transition">FAQ</a>
                        <a href="#newsletter" onClick={e => handleNavClick(e, 'newsletter')} className="hover:text-blue-600 transition">Newsletter</a>
                        <a href="/signin" className="flex items-center gap-1 px-4 py-2 rounded-lg text-blue-700 border border-blue-600 hover:bg-blue-50 font-semibold transition text-sm mt-2"><FaSignInAlt className="mr-1" />Sign In</a>
                        <a href="/signup" className="flex items-center gap-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold transition text-sm"><FaUserPlus className="mr-1" />Sign Up</a>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <header className="relative bg-gradient-to-br from-[#2a4ff2] to-[#2a4ff2] text-white py-24 px-4 overflow-hidden">
                {/* Decorative shapes */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 opacity-20 rounded-full blur-3xl -z-10 animate-pulse" style={{ top: '-6rem', left: '-6rem' }} />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400 opacity-20 rounded-full blur-3xl -z-10 animate-pulse" style={{ bottom: '-6rem', right: '-6rem' }} />
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <img src={Main} alt="Main visual" className="mx-auto my-8" />
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg animate-fade-in-up">AI That Solves Support Tickets Before They Open</h1>
                    <p className="text-2xl md:text-3xl mb-10 text-blue-100 animate-fade-in-up delay-100">Turn your website and data into AI that answers customers 24/7 with the highest accuracy.</p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center animate-fade-in-up delay-200">
                        <a href="/signup" className="bg-white text-blue-700 font-bold px-10 py-4 rounded-xl shadow-lg hover:bg-blue-50 transition text-lg animate-bounce">Build Your Free Chatbot</a>
                        <a href="#features" onClick={e => handleNavClick(e, 'features')} className="bg-blue-700 text-white font-bold px-10 py-4 rounded-xl shadow-lg hover:bg-blue-800 transition text-lg flex items-center justify-center gap-2">See Features <FaArrowRight /></a>
                    </div>
                    <div className="mt-8 text-base text-blue-100 animate-fade-in-up delay-300">Free Forever Plan &nbsp;|&nbsp; Cancel Anytime</div>
                </div>
            </header>

            {/* Features Section */}
            <section id="features" className="max-w-6xl mx-auto py-20 px-4 scroll-mt-24">
                <h2 className="text-4xl font-bold text-center mb-14 text-gray-800">Solve Customer Support Challenges with AI</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {features.map((f, i) => (
                        <div key={i} className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center gap-4 hover:scale-105 hover:shadow-2xl transition-transform duration-300 group">
                            <div className="bg-blue-50 rounded-full p-4 mb-2 group-hover:bg-blue-100 transition">{f.icon}</div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-1 text-center">{f.title}</h3>
                            <p className="text-gray-600 text-center">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* How It Works */}
            <section id="how" className="bg-gradient-to-r from-blue-50 to-indigo-50 py-20 px-4 scroll-mt-24">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-12 text-gray-800">Easy, No-Code Setup in Minutes</h2>
                    <div className="flex flex-col md:flex-row justify-center items-center gap-12 relative">
                        {steps.map((step, i) => (
                            <div key={i} className="flex flex-col items-center relative">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-2xl font-bold mb-3 shadow-lg border-4 border-white">{i + 1}</div>
                                <div className="text-gray-700 font-medium text-lg max-w-[180px]">{step.label}</div>
                                {i < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-8 right-[-60px] w-32 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-40 rounded-full"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="max-w-5xl mx-auto py-20 px-4 scroll-mt-24">
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">What Users Say</h2>
                <TestimonialCarousel testimonials={testimonials} />
            </section>

            {/* Security & Compliance */}
            <section id="security" className="bg-white py-16 px-4 scroll-mt-24">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl font-bold mb-8 text-gray-800">Top Quality Security For Your Data</h2>
                    <div className="flex flex-col md:flex-row justify-center items-center gap-12">
                        <div className="flex flex-col items-center">
                            <FaLock className="text-blue-600 w-10 h-10 mb-2" />
                            <div className="font-semibold text-gray-700">AES-256 Encryption</div>
                            <div className="text-gray-500 text-sm">At rest & in transit</div>
                        </div>
                        <div className="flex flex-col items-center">
                            <FaUserShield className="text-blue-600 w-10 h-10 mb-2" />
                            <div className="font-semibold text-gray-700">Zero-Retention Policy</div>
                            <div className="text-gray-500 text-sm">Your data is never used for model training</div>
                        </div>
                        <div className="flex flex-col items-center">
                            <FaCheckCircle className="text-blue-600 w-10 h-10 mb-2" />
                            <div className="font-semibold text-gray-700">GDPR & DPA Compliant</div>
                            <div className="text-gray-500 text-sm">Meets global security standards</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="max-w-3xl mx-auto py-20 px-4 scroll-mt-24">
                <h2 className="text-2xl font-bold text-center mb-10 text-gray-800">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <div key={i} className="bg-white rounded-xl shadow p-6 transition-all duration-300">
                            <button
                                className="w-full text-left flex justify-between items-center font-semibold text-gray-800 text-lg focus:outline-none"
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                            >
                                <span className="flex items-center gap-2">{openFaq === i ? <FaChevronUp /> : <FaChevronDown />} {faq.q}</span>
                            </button>
                            <div
                                className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-40 mt-4 opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <div className="text-gray-600 text-base">{faq.a}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Newsletter & Footer */}
            <footer id="newsletter" className="bg-gradient-to-br from-blue-700 to-indigo-800 text-white py-12 px-4 mt-8 scroll-mt-24">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="mb-8 md:mb-0">
                        <img src={Icon} alt="ChatNode Logo" className="w-14 h-14 rounded-full mb-2" />
                        <div className="text-lg font-bold">ChatNode</div>
                        <div className="text-blue-100 text-sm">AI That Solves Support Tickets Before They Open</div>
                    </div>
                    <form onSubmit={handleNewsletter} className="flex flex-col md:flex-row items-center gap-4">
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="Subscribe to our newsletter"
                            className="px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold transition">Subscribe</button>
                        {newsletterMsg && <span className="text-green-200 ml-2">{newsletterMsg}</span>}
                    </form>
                    <div className="flex gap-4 text-2xl">
                        {socials.map((s, i) => (
                            <a key={i} href={s.href} className="hover:text-blue-300 transition" target="_blank" rel="noopener noreferrer">{s.icon}</a>
                        ))}
                    </div>
                </div>
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 mt-8 border-t border-blue-900 pt-6">
                    <div className="text-blue-100 text-sm">&copy; {new Date().getFullYear()} ChatNode. All rights reserved.</div>
                    <div className="flex gap-4 text-blue-100 text-sm">
                        <a href="/privacy" className="hover:text-white">Privacy Policy</a>
                        <a href="/terms" className="hover:text-white">Terms of Use</a>
                        <a href="/security" className="hover:text-white">Security</a>
                    </div>
                </div>
            </footer>

            {/* Animations (TailwindCSS custom classes, add to your tailwind.config.js if needed) */}
            <style>{`
        html { scroll-behavior: smooth; }
        .animate-fade-in { animation: fadeIn 1s ease; }
        .animate-fade-in-up { animation: fadeInUp 1s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
        </div>
    );
}

export default LandingPage;
