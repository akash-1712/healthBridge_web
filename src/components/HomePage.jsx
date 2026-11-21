import React from 'react'

const HomePage = () => {
  return (
    <div className="bg-white overflow-x-hidden">
      {/* Hero Section - More breathable and engaging */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-green-50 overflow-hidden min-h-screen flex items-center py-6">

        {/* Floating chat bubbles animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow-lg animate-float animation-delay-2000">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">💬 Quick response</span>
            </div>
          </div>
          <div className="absolute bottom-20 right-100 bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow-lg animate-float animation-delay-4000">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">🩺 24/7 Available</span>
            </div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 w-full z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content - More spacious */}
            <div className="space-y-8">
              {/* Trust Badge - Enhanced with animation */}
              <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-green-100 text-blue-800 text-sm font-medium px-6 py-3 rounded-full border border-blue-200 shadow-sm">
                <div className="flex items-center">
                  <span className="mr-2 animate-spin-slow">⭐</span>
                  <span>Trusted by 50,000+ Parents • 98% Satisfaction Rate</span>
                </div>
              </div>

              {/* Main Heading - Better spacing */}
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                  <span className="block">Expert Pediatric Care</span>
                  <span className="block text-blue-600 mt-2">Via Chat & Video</span>
                </h1>
                <p className="text-xl lg:text-2xl font-light text-gray-600 leading-relaxed">
                  Connect instantly with board-certified pediatricians through secure chat and video calls
                </p>
              </div>

              {/* Enhanced Description */}
              <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
                No waiting rooms, no appointments needed. Get expert pediatric advice through
                instant messaging and face-to-face video consultations from the comfort of home.
              </p>

              {/* Key Benefits - Animated */}
              <div className="flex flex-wrap gap-4">
                {[
                  { icon: "💬", text: "Instant Chat Support", delay: "0s" },
                  { icon: "📹", text: "HD Video Calls", delay: "0.2s" },
                  { icon: "⚡", text: "60 Second Response", delay: "0.4s" }
                ].map((benefit, index) => (
                  <div key={index}
                    className="flex items-center bg-white/80 backdrop-blur-sm border border-gray-200 px-4 py-3 rounded-full text-gray-700 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 animate-fadeInUp"
                    style={{ animationDelay: benefit.delay }}>
                    <span className="mr-2 text-lg">{benefit.icon}</span>
                    <span className="font-medium">{benefit.text}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons - Enhanced */}
              <div className="pt-4 space-y-4">
                {user ? (
                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={startVisit}
                      className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-2xl text-lg"
                    >
                      <span className="flex items-center">
                        <span className="mr-2">💬</span>
                        Start Consulting
                        <svg className="ml-3 group-hover:translate-x-1 transition-transform" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" />
                        </svg>
                      </span>
                    </button>

                    <button
                      onClick={requestCallToDoctor}
                      disabled={loading}
                      className="px-8 py-4 bg-white/90 text-blue-600 border-2 border-blue-500 rounded-2xl font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-2xl disabled:opacity-50 text-lg backdrop-blur-sm"
                    >
                      <span className="flex items-center">
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                            Connecting...
                          </>
                        ) : (
                          <>
                            {/* <span className="mr-2">💬</span> */}
                            Chat Now
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <button
                      onClick={() => navigate("/signup")}
                      className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-2xl text-lg w-full sm:w-auto"
                    >
                      <span className="flex items-center justify-center">
                        <span className="mr-2">🚀</span>
                        Start Free Consultation
                        <svg className="ml-3 group-hover:translate-x-1 transition-transform" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" />
                        </svg>
                      </span>
                    </button>
                    <p className="text-sm text-gray-500 text-center">No credit card required • Join in 30 seconds</p>
                  </div>
                )}
              </div>

              {/* Stats - Enhanced with animations */}
              <div className="grid grid-cols-3 gap-8 pt-8">
                {[
                  { number: "50K+", label: "Happy Families", icon: "👨‍👩‍👧‍👦" },
                  { number: "60s", label: "Average Response", icon: "⚡" },
                  { number: "24/7", label: "Always Available", icon: "🕐" }
                ].map((stat, index) => (
                  <div key={index} className="text-center group animate-fadeInUp" style={{ animationDelay: `${index * 0.2}s` }}>
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{stat.icon}</div>
                    <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-1 group-hover:scale-105 transition-transform">{stat.number}</div>
                    <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Interactive Chat/Video Interface Mockup */}
            <div className="relative lg:h-[600px] flex items-center justify-center">
              {/* Phone mockup with chat interface */}
              <div className="relative">
                {/* Phone frame */}
                <div className="w-80 h-[600px] bg-gray-900 rounded-[3rem] p-2 shadow-2xl">
                  <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                    {/* Status bar */}
                    <div className="bg-blue-600 h-12 flex items-center justify-between px-4 text-white">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-400 rounded-full mr-3 flex items-center justify-center">
                          <span className="text-xs">👨‍⚕️</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium">Dr. Dutta </div>
                          <div className="text-xs opacity-80">Pediatrician • Online</div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                          <span className="text-xs">📹</span>
                        </button>
                      </div>
                    </div>

                    {/* Chat messages */}
                    <div className="p-4 space-y-4 h-[480px] overflow-y-auto bg-gray-50">
                      {/* Doctor message */}
                      <div className="flex items-start space-x-2 animate-slideInLeft">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs">👨‍⚕️</span>
                        </div>
                        <div className="bg-white p-3 rounded-2xl rounded-tl-md shadow-sm max-w-[70%]">
                          <p className="text-sm text-gray-800">Hi! I'm Dr. Dutta. How can I help your little one today? 😊</p>
                          <div className="text-xs text-gray-500 mt-1">2:34 PM</div>
                        </div>
                      </div>

                      {/* Parent message */}
                      <div className="flex items-start space-x-2 justify-end animate-slideInRight animation-delay-1000">
                        <div className="bg-blue-600 text-white p-3 rounded-2xl rounded-tr-md shadow-sm max-w-[70%]">
                          <p className="text-sm">My 3-year-old has been having a fever since this morning. It's around 101°F. Should I be worried?</p>
                          <div className="text-xs text-blue-100 mt-1">2:35 PM</div>
                        </div>
                      </div>

                      {/* Doctor response */}
                      <div className="flex items-start space-x-2 animate-slideInLeft animation-delay-2000">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs">👨‍⚕️</span>
                        </div>
                        <div className="bg-white p-3 rounded-2xl rounded-tl-md shadow-sm max-w-[70%]">
                          <p className="text-sm text-gray-800">Let's check a few things. Can you tell me if there are any other symptoms? Any cough, runny nose, or loss of appetite?</p>
                          <div className="text-xs text-gray-500 mt-1">2:36 PM</div>
                        </div>
                      </div>

                      {/* Video call suggestion */}
                      <div className="flex items-center justify-center animate-fadeIn animation-delay-3000">
                        <div className="bg-green-100 border border-green-200 p-3 rounded-xl">
                          <div className="flex items-center justify-center space-x-2">
                            <span className="text-green-600">📹</span>
                            <span className="text-sm text-green-700 font-medium">Switch to Video Call?</span>
                          </div>
                        </div>
                      </div>

                      {/* Typing indicator */}
                      <div className="flex items-start space-x-2 animate-pulse animation-delay-4000">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs">👨‍⚕️</span>
                        </div>
                        <div className="bg-white p-3 rounded-2xl rounded-tl-md shadow-sm">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce animation-delay-200"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce animation-delay-400"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Input area */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-100 rounded-full px-4 py-2">
                          <div className="text-sm text-gray-500">Type your message...</div>
                        </div>
                        <button className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">→</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating elements around phone */}
                <div className="absolute -top-20 -left-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl animate-float">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500 text-xl">✓</span>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Instant Response</div>
                      <div className="text-xs text-gray-500">Average 60 seconds</div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-20 -right-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl animate-float animation-delay-2000">
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-500 text-xl">🛡️</span>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Secure & Private</div>
                      <div className="text-xs text-gray-500">HIPAA Compliant</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators Section - Animated */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 animate-fadeInUp">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Trusted by Healthcare Leaders Nationwide
            </h2>
            <p className="text-gray-600">
              Partnered with top medical institutions and certified by leading healthcare authorities
            </p>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center justify-items-center">
            {[
              { icon: "🏥", label: "AIIMS Certified", color: "blue" },
              { icon: "✓", label: "ISO 27001", color: "green" },
              { icon: "🛡️", label: "HIPAA Compliant", color: "purple" },
              { icon: "⭐", label: "4.9/5 Rating", color: "yellow" },
              { icon: "🔒", label: "Data Protected", color: "red" },
              { icon: "👨‍⚕️", label: "MCI Verified", color: "indigo" }
            ].map((badge, index) => (
              <div key={index} className="flex flex-col items-center group animate-fadeInUp hover:scale-110 transition-transform duration-300" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className={`w-16 h-16 bg-${badge.color}-100 rounded-lg flex items-center justify-center mb-2 group-hover:shadow-lg transition-shadow`}>
                  <span className="text-2xl">{badge.icon}</span>
                </div>
                <span className="text-xs text-gray-500 text-center">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - More vibrant with images */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 animate-fadeInUp">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why 50,000+ Parents Choose Chat & Video Care
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of pediatric care through secure messaging and face-to-face video consultations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                // icon: "💬",
                title: "Instant Chat Support",
                desc: "Get immediate responses to your child health concerns through secure messaging with pediatric experts.",
                points: ["24/7 instant messaging", "Quick symptom assessment", "Real-time medical advice"],
                image: "https://images.unsplash.com/photo-1707061229220-ec87359ac0b7?w=400&h=250&fit=crop",
                gradient: "from-blue-10 to-blue-50"
              },
              {
                // icon: "📹",
                title: "HD Video Consultations",
                desc: "Face-to-face consultations with board-certified pediatricians through crystal-clear video calls.",
                points: ["High-definition video quality", "Interactive consultations", "Visual health assessment"],
                image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=250&fit=crop",
                gradient: "from-green-10 to-green-50"
              },
              {
                // icon: "🏠",
                title: "Comfort of Home",
                desc: "No stressful waiting rooms or sick child exposure. Get expert care from your living room.",
                points: ["Zero waiting time", "Familiar environment", "Reduced anxiety for children"],
                image: "https://plus.unsplash.com/premium_photo-1710024588068-91db904837ce?w=400&h=250&fit=crop",
                gradient: "from-purple-50 to-purple-10"
              }
            ].map((feature, index) => (
              <div key={index} className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-gray-100 overflow-hidden animate-fadeInUp" style={{ animationDelay: `${index * 0.2}s` }}>
                {/* Image header */}
                <div className="relative h-48 overflow-hidden">
                  <img src={feature.image} alt={feature.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-80`}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl filter drop-shadow-lg">{feature.icon}</div>
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {feature.desc}
                  </p>
                  <ul className="space-y-2">
                    {feature.points.map((point, pointIndex) => (
                      <li key={pointIndex} className="flex items-center text-sm text-gray-500">
                        <span className="text-green-500 mr-2">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section - New */}
      <section className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-6">
    <div className="text-center mb-16 animate-fadeInUp">
      <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
        See How It Works
      </h2>
      <p className="text-xl text-gray-600">
        From child profile to expert care - get personalized pediatric consultation in minutes
      </p>
    </div>

    <div className="grid lg:grid-cols-2 gap-12 items-center">
      {/* Enhanced Interactive workflow */}
      <div className="space-y-8">
        {/* Step 1 - Add Child Profile */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-2xl border border-pink-100 animate-fadeInLeft hover:shadow-lg transition-all duration-300">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg mt-2">1</div>
            <div className="flex-1">
              <div className="flex items-center mb-3">
                <h3 className="text-xl font-bold text-gray-900">Add Your Child's Profile</h3>
                <div className="ml-3 w-10 h-10 rounded-full overflow-hidden border-2 border-pink-200 shadow-sm">
                  <img src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=40&h=40&fit=crop&crop=face" alt="Cute child" className="w-full h-full object-cover" />
                </div>
              </div>
              <p className="text-gray-600 mb-4">Create a profile with your child's basic information like age, weight, and medical history for personalized care.</p>
              <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                    <span className="text-sm">👶</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">Emma, 4 years old</div>
                    <div className="text-xs text-gray-500">Added to profile</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2 - Select Symptoms */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-2xl border border-blue-100 animate-fadeInLeft animation-delay-300 hover:shadow-lg transition-all duration-300">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg">2</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Select Symptoms & Add Readings</h3>
              <p className="text-gray-600 mb-4">Choose from our symptom checker, add vital readings like temperature, and provide additional details about your child's condition.</p>
              <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-red-50 p-2 rounded-lg text-center">
                    <span className="text-2xl mb-1 block">🤒</span>
                    <div className="text-xs font-medium">Fever</div>
                    <div className="text-xs text-gray-500">101.2°F</div>
                  </div>
                  <div className="bg-yellow-50 p-2 rounded-lg text-center">
                    <span className="text-2xl mb-1 block">😴</span>
                    <div className="text-xs font-medium">Fatigue</div>
                    <div className="text-xs text-gray-500">Since morning</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3 - Start Chat */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-2xl border border-green-100 animate-fadeInLeft animation-delay-600 hover:shadow-lg transition-all duration-300">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg">3</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Chat with Pediatrician</h3>
              <p className="text-gray-600 mb-4">Send your child's symptoms and readings through secure chat. Get instant responses from board-certified pediatricians.</p>
              <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">Dr. Dutta is reviewing Emma's symptoms...</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 4 - Video Call Option */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-2xl border border-purple-100 animate-fadeInLeft animation-delay-900 hover:shadow-lg transition-all duration-300">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg">4</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Switch to Video if Needed</h3>
              <p className="text-gray-600 mb-4">For visual examination or when your child needs face-to-face interaction, seamlessly switch to HD video consultation.</p>
              <button className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 shadow-lg">
                📹 Start Video Call with Emma
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Visual demonstration with child imagery */}
      <div className="relative animate-fadeInRight">
        {/* Main consultation interface */}
        <div className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-3xl p-8 shadow-2xl">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            {/* Header with child info */}
            <div className="flex items-center justify-between mb-6 bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-200 shadow-sm">
                  <img src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=40&h=40&fit=crop&crop=face" alt="Emma" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Emma's Consultation</h3>
                  <div className="text-sm text-gray-500">4 years old • Profile Active</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600 font-medium">Connected</span>
              </div>
            </div>

            {/* Symptom summary */}
            <div className="bg-gray-50 p-4 rounded-xl mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Reported Symptoms:</h4>
              <div className="flex flex-wrap gap-2">
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">🤒 Fever (101.2°F)</span>
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">😴 Fatigue</span>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">🤧 Runny nose</span>
              </div>
            </div>

            {/* Doctor consultation */}
            <div className="space-y-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-xl">
                <div className="flex items-center space-x-3 mb-3">
                  <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=40&h=40&fit=crop&crop=face" alt="Doctor" className="w-10 h-10 rounded-full border-2 border-blue-200" />
                  <div>
                    <div className="font-medium text-gray-900">Dr. Dutta</div>
                    <div className="text-sm text-gray-500">Pediatrician • 15+ years exp.</div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">Hi! I see Emma has fever and fatigue. Based on her age and symptoms, this looks like a common viral infection. Let me ask a few more questions to be sure...</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-xl flex items-center justify-center space-x-2 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg">
                <span>💬</span>
                <span className="text-sm font-medium">Continue Chat</span>
              </button>
              <button className="bg-gradient-to-r from-green-500 to-green-600 text-white p-3 rounded-xl flex items-center justify-center space-x-2 hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg">
                <span>📹</span>
                <span className="text-sm font-medium">Video Call</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>

    {/* Enhanced process summary */}
    <div className="mt-16 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-8 rounded-2xl animate-fadeInUp">
      <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">Complete Care Process</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
            <span className="text-white text-2xl">👶</span>
          </div>
          <div className="text-sm font-medium text-gray-900">Add Child</div>
          <div className="text-xs text-gray-500 mt-1">30 seconds</div>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
            <span className="text-white text-2xl">📋</span>
          </div>
          <div className="text-sm font-medium text-gray-900">Select Symptoms</div>
          <div className="text-xs text-gray-500 mt-1">1-2 minutes</div>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
            <span className="text-white text-2xl">💬</span>
          </div>
          <div className="text-sm font-medium text-gray-900">Chat with Doctor</div>
          <div className="text-xs text-gray-500 mt-1">5-10 minutes</div>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
            <span className="text-white text-2xl">📹</span>
          </div>
          <div className="text-sm font-medium text-gray-900">Video if Needed</div>
          <div className="text-xs text-gray-500 mt-1">Optional</div>
        </div>
      </div>
      
      <div className="text-center mt-8">
        <div className="inline-flex items-center bg-white p-4 rounded-xl shadow-lg border border-gray-200">
          <div className="text-center mr-6">
            <div className="text-xl font-bold text-green-600">Total Time</div>
            <div className="text-2xl font-bold text-gray-900">6-13 min</div>
          </div>
          <div className="w-px h-12 bg-gray-200"></div>
          <div className="text-center ml-6">
            <div className="text-xl font-bold text-blue-600">Success Rate</div>
            <div className="text-2xl font-bold text-gray-900">98%</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


      {/* Enhanced Pricing Section - Corrected */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 animate-fadeInUp">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Transparent, Affordable Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Quality pediatric care through chat and video - no hidden fees, no surprises
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">

            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 rounded-2xl shadow-xl text-white relative animate-fadeInUp animation-delay-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Monthly Unlimited</h3>
                <div className="text-4xl font-bold mb-1">₹1,000</div>
                <div className="text-blue-100 mb-6">per month</div>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Unlimited chat consultations</li>
                  <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Unlimited video calls</li>
                  <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Priority response (30 sec avg)</li>
                  <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> 24/7 emergency chat support</li>
                  <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Family health tracking</li>
                  <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Multiple children support</li>
                </ul>
                <button className="w-full py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
                  Start 7-Day Free Trial
                </button>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <div className="bg-white p-6 rounded-2xl shadow-lg inline-block">
              <p className="text-gray-600 mb-4">
                All plans include secure chat & video consultations with board-certified pediatricians
              </p>
              <div className="flex items-center justify-center space-x-8">
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600">60s</div>
                  <div className="text-sm text-gray-500">Avg Response</div>
                </div>
                <div className="w-px h-8 bg-gray-200"></div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">24/7</div>
                  <div className="text-sm text-gray-500">Available</div>
                </div>
                <div className="w-px h-8 bg-gray-200"></div>
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-600">98%</div>
                  <div className="text-sm text-gray-500">Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials with real photos */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 animate-fadeInUp">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Real Stories from Real Parents
            </h2>
            <p className="text-xl text-gray-600">
              See how chat and video consultations transformed their pediatric care experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                rating: 5,
                text: "The chat feature is amazing! When my daughter had a fever at 3 AM, I got immediate help through messaging. The doctor then did a video call to examine her properly. Saved us a night at the ER!",
                author: "Priya ",
                role: "Mother of 2, Mumbai",
                timeAgo: "2 weeks ago",
                image: "https://images.unsplash.com/photo-1494790108755-2616b612b8a2?w=100&h=100&fit=crop&crop=face",
                gradient: "from-blue-50 to-white"
              },
              {
                rating: 5,
                text: "As a working parent, the chat consultation is perfect. I can quickly message during work breaks and get expert advice. The video calls work seamlessly when needed for thorough check-ups.",
                author: "Rohit Verma",
                role: "Father of 1, Bangalore",
                timeAgo: "1 month ago",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
                gradient: "from-green-50 to-white"
              },
              {
                rating: 5,
                text: "My shy 4-year-old was scared of doctor visits. But through video calls at home, she's now comfortable talking to Dr. Dutta. The chat follow-ups are so convenient too!",
                author: "Anjali Patel",
                role: "Mother of 1, Delhi",
                timeAgo: "3 weeks ago",
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
                gradient: "from-purple-50 to-white"
              }
            ].map((testimonial, index) => (
              <div key={index} className={`bg-gradient-to-br ${testimonial.gradient} p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fadeInUp`} style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">⭐</span>
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-6 italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full mr-4 shadow-md"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.author}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                    <div className="text-xs text-gray-400">{testimonial.timeAgo}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section with animations */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-blue-700 to-green-600 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white/5 rounded-full animate-ping animation-delay-2000"></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="mb-8 animate-fadeInUp">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready for Better Pediatric Care?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join 50,000+ parents who chose expert chat and video consultations over crowded waiting rooms
            </p>
          </div>

          <div className="space-y-6 animate-fadeInUp animation-delay-500">
            <button
              onClick={() => navigate(user ? "/select-child" : "/signup")}
              className="group px-8 py-4 bg-white text-blue-600 rounded-2xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-2xl text-lg"
            >
              <span className="flex items-center justify-center">
                <span className="mr-2">🚀</span>
                {user ? "Start Chat Consultation Now" : "Try Free - Start Chatting Today"}
                <svg className="ml-2 group-hover:translate-x-1 transition-transform" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" />
                </svg>
              </span>
            </button>

            <p className="text-blue-100 text-sm">
              Free consultation to start • Switch to video anytime • Cancel anytime
            </p>
          </div>

          {/* Emergency notice */}
          <div className="mt-12 bg-red-500/20 border border-red-400/30 rounded-lg p-4 animate-fadeInUp animation-delay-1000">
            <p className="text-white text-sm">
              <span className="font-semibold">Medical Emergency?</span> Call 112 immediately. Our service is for non-emergency consultations through chat and video.
            </p>
          </div>
        </div>
      </section>

      {/* Custom CSS for animations */}
      <style jsx>{`
    @keyframes blob {
      0% { transform: translate(0px, 0px) scale(1); }
      33% { transform: translate(30px, -50px) scale(1.1); }
      66% { transform: translate(-20px, 20px) scale(0.9); }
      100% { transform: translate(0px, 0px) scale(1); }
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes fadeInLeft {
      from { opacity: 0; transform: translateX(-30px); }
      to { opacity: 1; transform: translateX(0); }
    }

    @keyframes fadeInRight {
      from { opacity: 0; transform: translateX(30px); }
      to { opacity: 1; transform: translateX(0); }
    }

    @keyframes slideInLeft {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
    }

    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(20px); }
      to { opacity: 1; transform: translateX(0); }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .animate-blob { animation: blob 7s infinite; }
    .animate-float { animation: float 3s ease-in-out infinite; }
    .animate-fadeInUp { animation: fadeInUp 0.8s ease-out; }
    .animate-fadeInLeft { animation: fadeInLeft 0.8s ease-out; }
    .animate-fadeInRight { animation: fadeInRight 0.8s ease-out; }
    .animate-slideInLeft { animation: slideInLeft 0.6s ease-out; }
    .animate-slideInRight { animation: slideInRight 0.6s ease-out; }
    .animate-fadeIn { animation: fadeIn 0.8s ease-out; }
    .animate-bounce-slow { animation: bounce 2s infinite; }
    .animate-spin-slow { animation: spin 3s linear infinite; }

    .animation-delay-200 { animation-delay: 0.2s; }
    .animation-delay-400 { animation-delay: 0.4s; }
    .animation-delay-500 { animation-delay: 0.5s; }
    .animation-delay-1000 { animation-delay: 1s; }
    .animation-delay-2000 { animation-delay: 2s; }
    .animation-delay-3000 { animation-delay: 3s; }
    .animation-delay-4000 { animation-delay: 4s; }
  `}</style>
      {/* </div> */}


      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">Kids Health</h3>
              <p className="text-gray-300 mb-6 max-w-md">
                Providing 24/7 expert pediatric care with cutting-edge technology and compassionate service. Your child's health is our mission.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <span>📘</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <span>🐦</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <span>📷</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Services</h4>
              <ul className="space-y-3 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Virtual Consultations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Emergency Care</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Health Monitoring</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Follow-up Care</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Contact Info</h4>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-center">
                  <span className="mr-2">📧</span>
                  care@kidshealth.com
                </div>
                <div className="flex items-center">
                  <span className="mr-2">📞</span>
                  +91 98765 43210
                </div>
                <div className="flex items-center">
                  <span className="mr-2">🕒</span>
                  Available 24/7
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Kids Health. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage