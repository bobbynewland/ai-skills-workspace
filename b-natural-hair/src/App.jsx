import React, { useState, useEffect } from 'react';

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', service: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#FDF8F3]/98 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="text-2xl font-serif font-bold text-[#4A3728]">
            B <span className="text-[#D4A574]">Natural</span>
          </div>
          <div className="hidden md:flex gap-10 text-sm font-medium text-[#4A3728]/80">
            <a href="#services" className="hover:text-[#D4A574] transition-colors">Services</a>
            <a href="#about" className="hover:text-[#D4A574] transition-colors">About</a>
            <a href="#testimonials" className="hover:text-[#D4A574] transition-colors">Stories</a>
            <a href="#contact" className="px-5 py-2 bg-[#4A3728] text-white rounded-full hover:bg-[#D4A574] transition-colors">Book Now</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1920&q=80')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-b from-[#4A3728]/60 via-[#4A3728]/40 to-[#4A3728]/70"></div>
        </div>
        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
          <p className="text-[#D4A574] font-medium tracking-[0.3em] uppercase mb-6 animate-fade-in">Premium Natural Hair Care</p>
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight">
            Embrace Your <span className="text-[#D4A574]">Natural</span> Beauty
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-2xl mx-auto">
            Luxury hair treatments designed to unlock your hair's full potential. Where science meets nature.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#contact" className="px-8 py-4 bg-[#D4A574] text-[#4A3728] font-bold rounded-full hover:bg-white transition-all transform hover:scale-105">
              Schedule Consultation
            </a>
            <a href="#services" className="px-8 py-4 border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-all">
              Explore Services
            </a>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#D4A574] font-medium tracking-widest uppercase mb-3">What We Offer</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#4A3728]">Our Services</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Deep Conditioning Therapy', price: '$95', desc: 'Intensive moisture infusion that restores luster and vitality to dry, damaged hair.', icon: '💧' },
              { title: 'Protein Reconstruction', price: '$110', desc: 'Advanced bond-building treatment that repairs hair from within.', icon: '✨' },
              { title: 'Scalp Detox & Revival', price: '$85', desc: 'Purifying treatment that removes buildup and promotes healthy growth.', icon: '🌱' },
              { title: 'Signature Natural Style', price: '$135', desc: 'Expert styling that celebrates your unique texture and curl pattern.', icon: '👑' },
              { title: 'Luxury Color Care', price: '$175', desc: 'Ammonia-free, plant-based color that adds vibrancy without damage.', icon: '🎨' },
              { title: 'Personalized Consultation', price: '$60', desc: 'Comprehensive hair analysis with custom care roadmap.', icon: '📋' }
            ].map((service, i) => (
              <div key={i} className="group p-8 bg-[#FDF8F3] rounded-3xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-[#D4A574]/10">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-[#4A3728] mb-2">{service.title}</h3>
                <p className="text-[#D4A574] font-bold text-2xl mb-4">{service.price}</p>
                <p className="text-[#4A3728]/70 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24 px-6 bg-[#4A3728]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 relative">
            <div className="absolute -top-4 -left-4 w-full h-full border-2 border-[#D4A574] rounded-3xl"></div>
            <img src="https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800&q=80" alt="Natural hair care" className="relative rounded-3xl shadow-2xl w-full object-cover h-[500px]" />
          </div>
          <div className="flex-1 text-white">
            <p className="text-[#D4A574] font-medium tracking-widest uppercase mb-3">Our Story</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Naturally <span className="text-[#D4A574]">Beautiful</span></h2>
            <p className="text-white/70 text-lg mb-6 leading-relaxed">
              At B Natural, we believe your hair tells a story. Our mission is to help you write it with confidence. Founded by certified specialists, we blend ancient hair wisdom with cutting-edge science.
            </p>
            <p className="text-white/70 text-lg mb-10 leading-relaxed">
              Every treatment is personalized to your unique hair profile. We don't just care for your hair—we celebrate it.
            </p>
            <div className="grid grid-cols-3 gap-8">
              {[
                { num: '500+', label: 'Clients' },
                { num: '8+', label: 'Years' },
                { num: '98%', label: 'Satisfaction' }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-4xl font-bold text-[#D4A574]">{stat.num}</p>
                  <p className="text-white/60 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6 bg-[#FDF8F3]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#D4A574] font-medium tracking-widest uppercase mb-3">Client Stories</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#4A3728]">What They Say</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Tamara J.', role: 'Client since 2023', text: 'My hair has never been healthier. The deep conditioning transformed my routine. I finally embrace my natural texture every day.', avatar: '👩🏾' },
              { name: 'Keisha M.', role: 'Client since 2022', text: 'The scalp detox was life-changing. Less breakage, more growth. The team truly understands natural hair.', avatar: '👩🏿' },
              { name: 'Ashley R.', role: 'Client since 2024', text: 'Best investment in my hair journey. Professional, knowledgeable, and the results speak for themselves.', avatar: '👩🏾‍🦱' }
            ].map((testimonial, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map((_, j) => (
                    <svg key={j} className="w-5 h-5 text-[#D4A574]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-[#4A3728]/80 mb-6 italic leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#D4A574]/20 flex items-center justify-center text-2xl">{testimonial.avatar}</div>
                  <div>
                    <p className="font-bold text-[#4A3728]">{testimonial.name}</p>
                    <p className="text-sm text-[#4A3728]/50">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-6 bg-gradient-to-r from-[#4A3728] to-[#6B4F3A]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Ready to Transform Your Hair Journey?</h2>
          <p className="text-white/80 mb-8 text-lg">Book your consultation today and discover the B Natural difference.</p>
          <a href="#contact" className="inline-block px-10 py-4 bg-[#D4A574] text-[#4A3728] font-bold rounded-full hover:bg-white transition-all transform hover:scale-105">
            Start Your Journey
          </a>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#D4A574] font-medium tracking-widest uppercase mb-3">Get In Touch</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#4A3728]">Book Your Visit</h2>
          </div>
          
          {submitted ? (
            <div className="bg-[#D4A574]/10 border border-[#D4A574] rounded-3xl p-12 text-center">
              <div className="text-6xl mb-4">💛</div>
              <h3 className="text-2xl font-bold text-[#4A3728] mb-2">Thank You!</h3>
              <p className="text-[#4A3728]/70">We'll be in touch within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#4A3728] mb-2">Name</label>
                  <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-6 py-4 bg-[#FDF8F3] border border-[#D4A574]/20 rounded-xl focus:outline-none focus:border-[#D4A574] text-[#4A3728]" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#4A3728] mb-2">Email</label>
                  <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-6 py-4 bg-[#FDF8F3] border border-[#D4A574]/20 rounded-xl focus:outline-none focus:border-[#D4A574] text-[#4A3728]" placeholder="your@email.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4A3728] mb-2">Service</label>
                <select required value={form.service} onChange={e => setForm({...form, service: e.target.value})} className="w-full px-6 py-4 bg-[#FDF8F3] border border-[#D4A574]/20 rounded-xl focus:outline-none focus:border-[#D4A574] text-[#4A3728]">
                  <option value="">Select a service</option>
                  <option>Deep Conditioning Therapy</option>
                  <option>Protein Reconstruction</option>
                  <option>Scalp Detox & Revival</option>
                  <option>Signature Natural Style</option>
                  <option>Luxury Color Care</option>
                  <option>Personalized Consultation</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4A3728] mb-2">Message</label>
                <textarea required rows="4" value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="w-full px-6 py-4 bg-[#FDF8F3] border border-[#D4A574]/20 rounded-xl focus:outline-none focus:border-[#D4A574] text-[#4A3728]" placeholder="Tell us about your hair goals..."></textarea>
              </div>
              <button type="submit" className="w-full py-4 bg-[#4A3728] text-white font-bold rounded-xl hover:bg-[#D4A574] transition-colors text-lg">
                Send Message
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#4A3728] text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-serif font-bold mb-4">B <span className="text-[#D4A574]">Natural</span></h3>
              <p className="text-white/60 max-w-md">Atlanta's premier destination for natural hair care. Where luxury meets authenticity.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-white/60">
                <li><a href="#services" className="hover:text-[#D4A574] transition-colors">Services</a></li>
                <li><a href="#about" className="hover:text-[#D4A574] transition-colors">About</a></li>
                <li><a href="#testimonials" className="hover:text-[#D4A574] transition-colors">Testimonials</a></li>
                <li><a href="#contact" className="hover:text-[#D4A574] transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-white/60">
                <li>📍 Atlanta, GA</li>
                <li>📞 (404) 555-HAIR</li>
                <li>✉️ hello@bnatural.com</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-sm">© 2026 B Natural Hair Care. All rights reserved.</p>
            <div className="flex gap-6">
              {['Instagram', 'Facebook', 'TikTok'].map(social => (
                <a key={social} href="#" className="text-white/40 hover:text-[#D4A574] transition-colors text-sm">{social}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
