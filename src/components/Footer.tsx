import { Link } from "react-router-dom";
import { Heart, Instagram, Facebook, Twitter, Youtube, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const footerLinks = {
  discover: [
    { name: "Real Weddings", href: "/weddings" },
    { name: "Find Vendors", href: "/vendors" },
    { name: "Browse Venues", href: "/venues" },
  ],
  forProfessionals: [
    { name: "List Your Business", href: "/join-vendor" },
    { name: "List Your Venue", href: "/list-venue" },
    { name: "Partner With Us", href: "/partner" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
  ],
};

export const Footer = () => {
  const { isAuthenticated } = useAuth();

  return (
    <footer className="bg-foreground text-primary-foreground overflow-hidden w-full">
      {/* Newsletter Section - Only for logged out users */}
      {!isAuthenticated && (
        <div className="border-b border-primary-foreground/10">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="font-serif text-2xl md:text-3xl mb-3">
                Get Wedding Inspiration Delivered
              </h3>
              <p className="text-primary-foreground mb-6">
                Subscribe to receive the latest real weddings, planning tips, and exclusive offers.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 h-12 px-4 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:border-primary-foreground/40"
                />
                <Button variant="champagne" size="lg">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Heart className="w-6 h-6 text-rose-gold fill-rose-gold" />
              <span className="font-serif text-xl font-semibold">
                2Plan<span className="text-champagne">A</span>Wedding
              </span>
            </Link>
            <p className="text-primary-foreground text-sm mb-6">
              Connecting couples with the best wedding professionals to create unforgettable celebrations.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-primary-foreground hover:text-primary-foreground transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-foreground hover:text-primary-foreground transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-foreground hover:text-primary-foreground transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-foreground hover:text-primary-foreground transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Discover */}
          <div>
            <h4 className="font-semibold mb-4">Discover</h4>
            <ul className="space-y-2">
              {footerLinks.discover.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground hover:text-primary-foreground text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Professionals */}
          <div>
            <h4 className="font-semibold mb-4">For Professionals</h4>
            <ul className="space-y-2">
              {footerLinks.forProfessionals.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground hover:text-primary-foreground text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground hover:text-primary-foreground text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground hover:text-primary-foreground text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground text-sm">
            © {new Date().getFullYear()} 2PlanAWedding. All rights reserved.
          </p>
          <p className="text-primary-foreground text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-rose-gold fill-rose-gold" /> for couples everywhere
          </p>
        </div>
      </div>
    </footer>
  );
};
