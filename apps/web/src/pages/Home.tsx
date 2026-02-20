import { Link } from 'react-router-dom';
import { Shield, Heart, Brain, Book, MapPin, MessageCircle, Lock, Users, Activity } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-cyan-500 text-white py-20">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80" 
            alt="Healthcare"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Sexual & Reproductive Health for Students
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Your confidential, judgment-free resource for navigating sexual health in university. 
            Get AI-powered assessments, access educational content, and find campus resources.
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              to="/register" 
              className="bg-white text-cyan-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all shadow-lg"
            >
              Get Started Free
            </Link>
            <Link 
              to="/login" 
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-all"
            >
              Sign In
            </Link>
          </div>
          
          {/* Trust Badges */}
          <div className="flex gap-6 justify-center mt-8 text-sm">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span>100% Confidential</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Evidence-Based</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-cyan-500 mb-2">24/7</div>
              <div className="text-gray-600">Available Anytime</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-cyan-500 mb-2">100%</div>
              <div className="text-gray-600">Confidential</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-cyan-500 mb-2">Free</div>
              <div className="text-gray-600">Always Free</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-cyan-500 mb-2">AI</div>
              <div className="text-gray-600">Powered Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Everything You Need for Your Sexual Health</h2>
          <p className="text-xl text-gray-600">Comprehensive, confidential, and designed for university students</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* AI Health Assessments */}
          <div className="bg-white p-8 rounded-xl border-2 hover:border-cyan-400 hover:shadow-lg transition-all">
            <div className="bg-cyan-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Activity className="h-8 w-8 text-cyan-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">AI Health Assessments</h3>
            <p className="text-gray-600 mb-4">
              Take confidential health assessments and get personalized recommendations based on your responses. 
              Private, anonymous, and AI-powered.
            </p>
            <Link to="/register" className="text-cyan-600 font-semibold hover:underline">
              Try Assessment →
            </Link>
          </div>

          {/* Educational Library */}
          <div className="bg-white p-8 rounded-xl border-2 hover:border-purple-500 hover:shadow-lg transition-all">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Book className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Student Health Library</h3>
            <p className="text-gray-600 mb-4">
              Access evidence-based articles about contraception, STIs, relationships, and more. 
              Content specifically tailored for student life.
            </p>
            <Link to="/library" className="text-purple-600 font-semibold hover:underline">
              Browse Articles →
            </Link>
          </div>

          {/* Campus Resources */}
          <div className="bg-white p-8 rounded-xl border-2 hover:border-green-500 hover:shadow-lg transition-all">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <MapPin className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Campus Resources</h3>
            <p className="text-gray-600 mb-4">
              Find on-campus health centers, nearby clinics, and student-friendly healthcare providers. 
              Free and low-cost options available.
            </p>
            <Link to="/resources" className="text-green-600 font-semibold hover:underline">
              Find Services →
            </Link>
          </div>
        </div>

        {/* Additional Features Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-gray-50 rounded-lg border">
            <MessageCircle className="h-8 w-8 text-cyan-500 mb-3" />
            <h4 className="font-semibold mb-2">AI Chat Support</h4>
            <p className="text-sm text-gray-600">Ask questions anonymously and get instant, evidence-based answers</p>
          </div>

          <div className="p-6 bg-gray-50 rounded-lg border">
            <Users className="h-8 w-8 text-purple-600 mb-3" />
            <h4 className="font-semibold mb-2">Common Questions</h4>
            <p className="text-sm text-gray-600">Get answers to questions other students are asking about sexual health</p>
          </div>

          <div className="p-6 bg-gray-50 rounded-lg border">
            <Heart className="h-8 w-8 text-pink-600 mb-3" />
            <h4 className="font-semibold mb-2">Track Your Health</h4>
            <p className="text-sm text-gray-600">Monitor your health journey with personal dashboard and history</p>
          </div>
        </div>
      </div>

      {/* Image Section */}
      <div className="bg-purple-50 py-16 border-t">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80" 
                alt="Healthcare professional"
                className="rounded-2xl shadow-2xl"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Students Choose Stay-Safe</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center font-bold">✓</div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Completely Anonymous</h4>
                    <p className="text-gray-600">No personal information required. Your privacy is our priority.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center font-bold">✓</div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Evidence-Based Information</h4>
                    <p className="text-gray-600">All content reviewed by healthcare professionals and backed by research.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center font-bold">✓</div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Student-Centered Design</h4>
                    <p className="text-gray-600">Built specifically for university students, by people who understand student life.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-cyan-500 text-white py-16 border-t-4 border-cyan-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Take Control of Your Sexual Health?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of students getting confidential, judgment-free sexual health support
          </p>
          <Link 
            to="/register" 
            className="inline-block bg-white text-cyan-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all shadow-lg"
          >
            Get Started Now - It's Free
          </Link>
        </div>
      </div>
    </div>
  );
}