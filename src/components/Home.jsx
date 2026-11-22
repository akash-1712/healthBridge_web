import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { StreamChat } from 'stream-chat';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { getChatId } from '../../util/getChatId';
import doctorImg from '../assets/images/hb-doctor.svg';
import { useChat } from '../contexts/ChatContext';
import Button from './ui/Button';
import Card from './ui/Card';
import Badge from './ui/Badge';
import { buildApiUrl } from '../util/api';

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { user, token, streamtoken } = useAuth();

  const { setChatClient } = useChat();

  const requestCallToDoctor = async () => {
    if (!user || !token) {
      toast.error('Please login to request a call');
      return;
    }

    setLoading(true);

    try {
      let key = null;
      if (import.meta.env.VITE_NODE_ENV === 'dev') {
        key = import.meta.env.VITE_STREAM_CHAT_KEY;
      } else {
        const keyResponse = await fetch(buildApiUrl('getStreamKey'));
        const keyData = await keyResponse.json();

        if (!keyResponse.ok) {
          throw new Error(keyData.error || 'Failed to fetch Stream key');
        }

        key = keyData.key;
      }

      const chatClient = StreamChat.getInstance(key);
      setChatClient(chatClient);

      await chatClient.connectUser({ id: user.id }, streamtoken);

      const doctorData = await fetch(
        buildApiUrl('getDoctorId'),
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      const doctorJsonData = await doctorData.json();
      if (!doctorData.ok) {
        throw new Error(doctorJsonData);
      }

      const channel = chatClient.channel('messaging', {
        members: [user.id || user.email, doctorJsonData.doctorId],
        name: user.name,
      });

      await channel.watch();

      navigate(`/chat/${getChatId(channel.id, true)}`);
    } catch (error) {
      console.error('Error requesting call:', error);
      toast.error('Failed to request call. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startVisit = () => {
    if (!user || !token) {
      toast.error('Please login to start a visit');
      return;
    }
    navigate('/select-child');
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 via-transparent to-transparent dark:from-primary-900/20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100/50 dark:bg-primary-900/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />

        <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Side - Content */}
            <div className="space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500" />
                </span>
                Available 24/7 • Pediatricians online
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary">
                  Welcome{user && <span className="text-text-secondary">, {user.name || 'Patient'}</span>}
                </h1>

                <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-primary-600 dark:text-primary-400">
                  How can we assist you today?
                </h2>

                <p className="text-lg text-text-secondary max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Talk to a pediatrician, book an appointment, or access care resources in one click!
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                {user ? (
                  <>
                    <Button size="xl" fullWidth={false} onClick={startVisit} className="w-full sm:w-auto">
                      Start Visit
                    </Button>
                    <Button variant="success" size="xl" fullWidth={false} onClick={requestCallToDoctor} disabled={loading} className="w-full sm:w-auto">
                      {loading ? 'Connecting...' : 'Quick Chat'}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button size="xl" fullWidth={false} onClick={() => navigate('/signup')} className="w-full sm:w-auto">
                      Get Started - Free
                    </Button>
                    <Button variant="outline" size="xl" fullWidth={false} onClick={() => navigate('/login')} className="w-full sm:w-auto">
                      Login
                    </Button>
                  </>
                )}
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-text-secondary pt-4 border-t border-border-primary">
                <div className="flex items-center gap-2">
                  <Badge variant="success" dot>24/7 Care</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="info" dot>Licensed Pediatricians</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="warning" dot>Secure & Private</Badge>
                </div>
              </div>
            </div>

            {/* Right Side - Doctor Illustration */}
            <div className="relative lg:order-first">
              <div className="relative mx-auto max-w-lg lg:max-w-xl">
                {/* Background glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-100/50 to-green-100/50 dark:from-primary-900/20 dark:to-green-900/20 rounded-3xl blur-2xl -z-10" />

                <Card variant="elevated" padding="none" className="overflow-hidden bg-transparent border-border-primary/50">
                  <div className="aspect-[4/5] relative">
                    <img
                      src={doctorImg}
                      alt="Pediatrician ready to help"
                      className="w-full h-full object-contain p-8"
                    />
                    {/* Floating badges */}
                    <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-2 justify-center lg:justify-start">
                      <Badge variant="default" className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm shadow-md">
                        👨‍⚕️ Dr. Available
                      </Badge>
                      <Badge variant="info" className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm shadow-md">
                        ⚡ Avg 60s response
                      </Badge>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-bg-secondary/50 border-y border-border-primary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Everything you need for your child's health
            </h3>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Comprehensive pediatric care from the comfort of your home
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🩺', title: 'Video Consultations', desc: 'Face-to-face visits with licensed pediatricians' },
              { icon: '💬', title: 'Secure Messaging', desc: 'Chat with doctors anytime, anywhere' },
              { icon: '📋', title: 'Health Records', desc: 'Track growth, vaccinations, and history' },
              { icon: '🔔', title: 'Smart Reminders', desc: 'Never miss appointments or medications' },
              { icon: '📊', title: 'Growth Charts', desc: 'Monitor development with WHO standards' },
              { icon: '🔒', title: 'HIPAA Compliant', desc: 'Your data is encrypted and secure' },
            ].map((feature, i) => (
              <Card key={i} variant="interactive" padding="lg" className="text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="text-lg font-semibold text-text-primary mb-2">{feature.title}</h4>
                <p className="text-text-secondary">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card variant="elevated" padding="xl" className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-primary-700 text-white">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
            <div className="relative max-w-2xl">
              <h3 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to get started?
              </h3>
              <p className="text-primary-100 mb-8 text-lg">
                Join thousands of parents who trust HealthBridge for their children's healthcare needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                {user ? (
                  <Button variant="secondary" size="lg" onClick={startVisit}>
                    Start a Visit
                  </Button>
                ) : (
                  <>
                    <Button variant="secondary" size="lg" onClick={() => navigate('/signup')}>
                      Create Free Account
                    </Button>
                    <Button variant="outline" size="lg" onClick={() => navigate('/login')} className="border-white/30 text-white hover:bg-white/10">
                      Log In
                    </Button>
                  </>
                )}
              </div>

              {/* Play Store CTA */}
              <div className="pt-6 border-t border-white/20">
                <p className="text-primary-100 text-sm mb-3">Available on your mobile device</p>
                <a
                  href="https://play.google.com/store/apps/details?id=com.Healthbridge.customer&pcampaignid=web_share"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 transition-all duration-300 group"
                >
                  <img
                    src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                    alt="Get it on Google Play"
                    className="h-10 w-auto"
                  />
                  <span className="text-sm font-medium hidden sm:inline">Open in Play Store</span>
                </a>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Play Store Feature Section */}
      <section className="py-16 sm:py-24 bg-bg-secondary/50 border-y border-border-primary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Take HealthBridge Everywhere
            </h3>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Download the HealthBridge app for instant access to pediatric care from your pocket
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Card variant="elevated" padding="xl" className="relative overflow-hidden">
              {/* Phone mockup */}
              <div className="flex justify-center mb-8">
                <div className="relative w-full max-w-xs">
                  {/* Phone frame */}
                  <div className="bg-neutral-900 rounded-[2.5rem] p-2 shadow-2xl border-4 border-neutral-800">
                    <div className="bg-white rounded-[2rem] overflow-hidden relative h-[520px]">
                      {/* Status bar */}
                      <div className="bg-white flex items-center justify-between px-4 py-3 text-neutral-900 border-b border-neutral-200">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-sm">🩺</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium">HealthBridge</div>
                            <div className="text-xs text-neutral-500">Pediatric Care</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center hover:bg-neutral-200 transition-colors">
                            <span className="text-xs">🔔</span>
                          </button>
                          <button className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center hover:bg-neutral-200 transition-colors">
                            <span className="text-xs">⚙️</span>
                          </button>
                        </div>
                      </div>

                      {/* App content */}
                      <div className="p-4 space-y-4 h-[400px] overflow-y-auto bg-neutral-50">
                        {/* Feature cards */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-200 hover:shadow-md transition-shadow group">
                            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                              <span className="text-xl">💬</span>
                            </div>
                            <h4 className="font-semibold text-neutral-900 mb-1">Instant Chat</h4>
                            <p className="text-xs text-neutral-500">Message doctors instantly</p>
                          </div>
                          <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-200 hover:shadow-md transition-shadow group">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                              <span className="text-xl">📹</span>
                            </div>
                            <h4 className="font-semibold text-neutral-900 mb-1">Video Calls</h4>
                            <p className="text-xs text-neutral-500">HD video consultations</p>
                          </div>
                          <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-200 hover:shadow-md transition-shadow group">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                              <span className="text-xl">📋</span>
                            </div>
                            <h4 className="font-semibold text-neutral-900 mb-1">Health Records</h4>
                            <p className="text-xs text-neutral-500">Track growth & history</p>
                          </div>
                          <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-200 hover:shadow-md transition-shadow group">
                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                              <span className="text-xl">🔔</span>
                            </div>
                            <h4 className="font-semibold text-neutral-900 mb-1">Smart Reminders</h4>
                            <p className="text-xs text-neutral-500">Never miss appointments</p>
                          </div>
                        </div>
                      </div>

                      {/* Bottom nav */}
                      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-3">
                        <div className="flex justify-around">
                          <button className="flex flex-col items-center gap-1 text-primary-600">
                            <span className="text-xl">🏠</span>
                            <span className="text-xs font-medium">Home</span>
                          </button>
                          <button className="flex flex-col items-center gap-1 text-neutral-500">
                            <span className="text-xl">💬</span>
                            <span className="text-xs">Chat</span>
                          </button>
                          <button className="flex flex-col items-center gap-1 text-neutral-500">
                            <span className="text-xl">👶</span>
                            <span className="text-xs">Kids</span>
                          </button>
                          <button className="flex flex-col items-center gap-1 text-neutral-500">
                            <span className="text-xl">⚙️</span>
                            <span className="text-xs">Settings</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Play Store CTA */}
              <div className="text-center pt-4">
                <a
                  href="https://play.google.com/store/apps/details?id=com.Healthbridge.customer&pcampaignid=web_share"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold text-base hover:from-primary-700 hover:to-primary-800 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-primary-500/25"
                >
                  <img
                    src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                    alt="Get it on Google Play"
                    className="h-12 w-auto"
                  />
                  <span className="hidden sm:inline">Download on Google Play</span>
                </a>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer Links */}
      <footer className="py-8 border-t border-border-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-text-secondary mb-4">
            <Link to="/terms" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Terms and Conditions
            </Link>
            <Link to="/privacy" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Privacy Policies
            </Link>
            <Link to="/contact" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Contact Us
            </Link>
          </div>
          <div className="flex justify-center">
            <a
              href="https://play.google.com/store/apps/details?id=com.Healthbridge.customer&pcampaignid=web_share"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              <img
                src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                alt="Get it on Google Play"
                className="h-10 w-auto"
              />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}