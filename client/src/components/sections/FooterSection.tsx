import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Send } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function FooterSection() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const subscribeMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success("you are in! welcome to the capy fam 🐾");
        setEmail("");
      } else {
        toast.error("hmm something went wrong. try again?");
      }
      setSubmitting(false);
    },
    onError: () => {
      toast.error("hmm something went wrong. try again?");
      setSubmitting(false);
    },
  });

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    subscribeMutation.mutate({ email: email.trim() });
  };

  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="container">
        {/* Newsletter */}
        <div className="max-w-lg mx-auto text-center mb-12">
          <Mail className="h-8 w-8 mx-auto mb-3 opacity-80" />
          <h3 className="text-xl font-bold mb-2">join the capy newsletter</h3>
          <p className="text-sm opacity-70 mb-5">
            get weekly capybara content delivered straight to your inbox. no spam, just vibes.
          </p>
          <form onSubmit={handleNewsletter} className="flex gap-2 max-w-sm mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your email"
              required
              className="flex-1 px-4 py-2.5 rounded-full bg-white/15 border border-white/20 text-primary-foreground placeholder:text-primary-foreground/50 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            <Button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-white text-primary hover:bg-white/90 px-5"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>

        {/* Footer links */}
        <div className="border-t border-white/20 pt-8 text-center space-y-3">
          <div className="flex justify-center gap-6 text-sm opacity-70">
            <a href="#about" className="hover:opacity-100 no-underline text-primary-foreground">about</a>
            <a href="#gallery" className="hover:opacity-100 no-underline text-primary-foreground">gallery</a>
            <a href="#quiz" className="hover:opacity-100 no-underline text-primary-foreground">quiz</a>
            <a href="#pet-laws" className="hover:opacity-100 no-underline text-primary-foreground">pet laws</a>
          </div>
          <p className="text-sm opacity-60">
            made with love by Alex Peterson
          </p>
          <p className="text-xs opacity-40">
            baravibes 2025. all capybaras are perfect and deserve the world.
          </p>
        </div>
      </div>
    </footer>
  );
}
