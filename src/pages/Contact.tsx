
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Heart, ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "couple",
        message: ""
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate sending
        toast.success("Message sent! We'll get back to you shortly.");

        // Open mailto as a fallback/primary action for this static demo
        const subject = `New Inquiry from ${formData.name} (${formData.role})`;
        const body = `Name: ${formData.name}\nEmail: ${formData.email}\nRole: ${formData.role}\n\nMessage:\n${formData.message}`;
        window.location.href = `mailto:Hi@2PlanAWedding.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    const team = [
        {
            name: "Jason",
            role: "Founder & CEO",
            image: "/images/team/jason.png",
            bio: "Building the future of wedding tech."
        },
        {
            name: "Joey",
            role: "Tech Lead",
            image: "/images/team/joey.png",
            bio: "Architecting seamless experiences."
        },
        {
            name: "Jasmin",
            role: "Senior Engineer",
            image: "/images/team/jasmin.png",
            bio: "Crafting beautiful interfaces."
        },
        {
            name: "Jax",
            role: "Chief Morale Officer",
            image: "/images/team/mascot.png",
            bio: "Expert in treats and stress relief."
        }
    ];

    return (
        <div className="min-h-screen bg-background">

            {/* Hero Section */}
            <section className="pt-32 pb-16 bg-muted/30">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="font-serif text-5xl md:text-6xl mb-6">Get in Touch</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Contact Form */}
                    <div>
                        <div className="bg-card p-8 rounded-2xl shadow-sm border border-border">
                            <h2 className="font-serif text-3xl mb-6">Send us a Message</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Name</label>
                                        <Input
                                            placeholder="Your name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Email</label>
                                        <Input
                                            type="email"
                                            placeholder="john@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">I am a...</label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        <option value="couple">Couple</option>
                                        <option value="vendor">Vendor</option>
                                        <option value="venue">Venue</option>
                                        <option value="planner">Planner</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Message</label>
                                    <Textarea
                                        placeholder="How can we help you?"
                                        className="h-32"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        required
                                    />
                                </div>
                                <Button type="submit" size="lg" className="w-full">
                                    Send Message
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </form>

                            <div className="mt-8 pt-8 border-t border-border flex items-center justify-center gap-2 text-muted-foreground">
                                <Mail className="w-4 h-4" />
                                <span>Or email us directly at </span>
                                <a href="mailto:Hi@2PlanAWedding.com" className="text-primary hover:underline font-medium">
                                    Hi@2PlanAWedding.com
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Team & Info */}
                    <div className="space-y-12">
                        {/* Why Section */}
                        <div>
                            <span className="text-primary font-medium tracking-widest uppercase text-sm">Our Mission</span>
                            <h2 className="font-serif text-4xl mt-2 mb-6">Why We Built This</h2>
                            <div className="prose text-muted-foreground">
                                <p className="mb-4">
                                    We believe every couple deserves a dream wedding without the nightmare of planning.
                                    Too often, the industry is cluttered with "ghost leads," hidden fees, and disconnected systems.
                                </p>
                                <p className="mb-4">
                                    Our team is dedicated to bringing <strong>transparency, trust, and technology</strong> to the wedding industry.
                                    We're building a platform where vendors thrive on merit and couples find exactly who they're looking for, stress-free.
                                </p>
                                <p>
                                    Love should be the only thing on your mind. We'll handle the rest.
                                </p>
                            </div>
                        </div>

                        {/* Team Grid */}
                        <div>
                            <h3 className="font-serif text-2xl mb-6">Meet the Team</h3>
                            <div className="grid grid-cols-2 gap-6">
                                {team.map((member) => (
                                    <div key={member.name} className="flex flex-col items-center text-center p-4 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors">
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-24 h-24 rounded-full object-cover mb-3 border-2 border-background shadow-md"
                                        />
                                        <h4 className="font-semibold text-lg">{member.name}</h4>
                                        <span className="text-primary text-sm font-medium mb-1">{member.role}</span>
                                        {/* <p className="text-xs text-muted-foreground">{member.bio}</p> */}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default Contact;
