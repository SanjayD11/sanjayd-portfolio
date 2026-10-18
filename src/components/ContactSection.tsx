import { motion } from "framer-motion";
import SectionReveal from "./SectionReveal";
import { Github, Linkedin, Mail, Send, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_l7jr9q4";
const TEMPLATE_ID = "template_o7b9vu7";
const PUBLIC_KEY = "fHveuQYI0JLBzpeYl";

const ContactSection = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const lastSent = useRef(0);
  const [honey, setHoney] = useState("");

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honey) return;

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    if (!isValidEmail(form.email.trim())) {
      toast({ title: "Please enter a valid email", variant: "destructive" });
      return;
    }

    const now = Date.now();
    if (now - lastSent.current < 30000) {
      toast({ title: "Please wait before sending another message", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        from_name: form.name.trim(),
        from_email: form.email.trim(),
        message: form.message.trim(),
      }, PUBLIC_KEY);
      lastSent.current = Date.now();
      toast({ title: "Message sent! 🎉", description: "Thanks for reaching out. I'll get back to you soon." });
      setForm({ name: "", email: "", message: "" });
    } catch {
      toast({ title: "Failed to send message", description: "Please try again later.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section-padding">
      <div className="max-w-3xl mx-auto">
        <SectionReveal>
          <p className="text-sm tracking-[0.3em] uppercase text-primary mb-4">Contact</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Let's <span className="text-gradient-animated">Connect</span>
          </h2>
          <p className="text-muted-foreground mb-12">Have a project idea or want to collaborate? Reach out!</p>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <div className="flex justify-center gap-6 mb-12">
            {[
              { icon: Github, href: "https://github.com/SanjayD11", label: "GitHub" },
              { icon: Linkedin, href: "https://www.linkedin.com/in/sanjay-d-354776353", label: "LinkedIn" },
              { icon: Mail, href: "mailto:sanjayraju5164@gmail.com", label: "Email" },
            ].map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                className="glass rounded-xl p-4 text-muted-foreground hover:text-primary transition-all duration-300 border border-border/50 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
                whileHover={{ y: -4, boxShadow: "0 15px 30px hsl(var(--primary) / 0.1)" }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <link.icon size={24} />
              </motion.a>
            ))}
          </div>
        </SectionReveal>

        <SectionReveal delay={0.2}>
          <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-5 border border-border/50">
            <input
              type="text"
              name="website"
              value={honey}
              onChange={(e) => setHoney(e.target.value)}
              className="absolute opacity-0 pointer-events-none h-0 w-0"
              tabIndex={-1}
              autoComplete="off"
            />
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all duration-300"
                placeholder="Your name"
                maxLength={100}
                required
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all duration-300"
                placeholder="your@email.com"
                maxLength={255}
                required
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Message</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={4}
                className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all duration-300 resize-none"
                placeholder="Your message..."
                maxLength={1000}
                required
              />
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
              whileHover={{ scale: loading ? 1 : 1.02, boxShadow: loading ? "none" : "0 8px 25px hsl(var(--primary) / 0.3)" }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Sending...</>
              ) : (
                <><Send size={16} /> Send Message</>
              )}
            </motion.button>
          </form>
        </SectionReveal>
      </div>
    </section>
  );
};

export default ContactSection;
