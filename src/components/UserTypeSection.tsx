import { motion } from "framer-motion";
import { Heart, Briefcase, Store, Building2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const userTypes = [
  {
    type: "bride",
    icon: Heart,
    title: "I'm Getting Married",
    description: "Discover vendors, get inspired by real weddings, and plan your perfect day with our powerful tools.",
    cta: "Start Planning",
    features: ["Save favorite vendors", "Create inspiration boards", "Get personalized recommendations"],
    gradient: "from-blush to-blush-dark",
  },
  {
    type: "planner",
    icon: Briefcase,
    title: "I'm a Wedding Planner",
    description: "Access tools to manage clients, discover talent, and showcase your portfolio to engaged couples.",
    cta: "Join as Planner",
    features: ["Build your portfolio", "Connect with vendors", "Manage client projects"],
    gradient: "from-champagne-light to-champagne",
  },
  {
    type: "vendor",
    icon: Store,
    title: "I'm a Wedding Vendor",
    description: "Showcase your work, connect with couples, and grow your wedding business with our platform.",
    cta: "List Your Business",
    features: ["Create a free profile", "Submit real weddings", "Get discovered by couples"],
    gradient: "from-sage-light to-sage",
  },
  {
    type: "venue",
    icon: Building2,
    title: "I'm a Venue",
    description: "Feature your venue to thousands of engaged couples searching for the perfect location.",
    cta: "Feature Your Venue",
    features: ["Showcase your space", "Receive inquiries", "Partner with vendors"],
    gradient: "from-blush to-champagne-light",
  },
];

export const UserTypeSection = () => {
  const navigate = useNavigate();
  return (
    <section className="py-20 md:py-32 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary font-medium tracking-widest uppercase text-sm mb-3">
            Join Our Community
          </p>
          <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-4">
            How Can We Help You?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Whether you're planning your wedding or part of the wedding industry,
            we have the tools and connections you need to succeed.
          </p>
        </motion.div>

        {/* User Type Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15 },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {userTypes.map((user) => {
            const Icon = user.icon;
            return (
              <motion.div
                key={user.type}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5 },
                  },
                }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <div className="h-full bg-card rounded-2xl p-6 shadow-card hover:shadow-elegant transition-all duration-300 flex flex-col">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${user.gradient} flex items-center justify-center mb-5`}>
                    <Icon className="w-7 h-7 text-foreground" />
                  </div>

                  {/* Content */}
                  <h3 className="font-serif text-xl text-foreground font-medium mb-3">
                    {user.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-5 flex-grow">
                    {user.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {user.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Button
                    variant="champagne"
                    className="w-full gap-2 group-hover:gap-3 transition-all"
                    onClick={() => navigate("/auth?mode=signup")}
                  >
                    {user.cta}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
