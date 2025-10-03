import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, FileText, Brain, Share2, Pill, Users } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-health.jpg";

const Landing = () => {
  const features = [
    {
      icon: FileText,
      title: "Unified Health Dashboard",
      description: "Collect and view complete health records from hospitals, clinics, wearables, and personal uploads in one secure place.",
    },
    {
      icon: Brain,
      title: "AI Health Assistant",
      description: "Get summaries in simple language, detect gaps in records, and receive answers to your health questions instantly.",
    },
    {
      icon: Share2,
      title: "Care Coordination",
      description: "Generate time-limited shareable health summaries for doctors to avoid repetitive tests and improve care quality.",
    },
    {
      icon: Pill,
      title: "Medication Management",
      description: "Track prescriptions, set reminders, and check for potential drug interactions with AI-powered insights.",
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description: "Your data is encrypted and stored securely. You control who can access your health information.",
    },
    {
      icon: Users,
      title: "Doctor Collaboration",
      description: "Healthcare providers can view authorized patient summaries with AI-generated insights for faster diagnosis.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              HealthUnify
            </span>
          </div>
          <nav className="flex gap-4">
            <Link to="/auth">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/auth">
              <Button variant="hero">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
        <div className="container mx-auto px-4 py-20 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Your Health Data,{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Unified & Secure
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Collect, view, and share your complete health records from hospitals, clinics, wearables, and personal uploads. AI-powered insights help you understand your health better.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/auth">
                  <Button variant="hero" size="lg">
                    Start Your Journey
                  </Button>
                </Link>
                <Button variant="outline" size="lg">
                  Watch Demo
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src={heroImage}
                alt="Health Data Unification Dashboard"
                className="rounded-2xl shadow-elevated animate-fade-in"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold">
              Everything You Need for{" "}
              <span className="bg-gradient-secondary bg-clip-text text-transparent">
                Better Healthcare
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features to help you take control of your health journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 bg-card"
              >
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-5"></div>
        <div className="container mx-auto px-4 text-center relative">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold">
              Ready to Take Control of Your Health?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of patients and healthcare providers who trust HealthUnify for secure health data management.
            </p>
            <Link to="/auth">
              <Button variant="hero" size="lg" className="text-lg px-12">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold">HealthUnify</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering patients with unified, secure health data management.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Features</li>
                <li>Security</li>
                <li>Pricing</li>
                <li>Demo</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>About Us</li>
                <li>Careers</li>
                <li>Contact</li>
                <li>Blog</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>HIPAA Compliance</li>
                <li>Security</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>© 2025 HealthUnify. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
