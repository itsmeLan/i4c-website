import LegalLayout from "@/components/LegalLayout";

export default function TermsOfService() {
  return (
    <LegalLayout title="Terms of Service">
      <p>Last updated: {new Date().toLocaleDateString()}</p>

      <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. Agreement to Terms</h2>
      <p>
        By accessing and using the i4C Construction website, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access our website or services.
      </p>

      <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. Intellectual Property</h2>
      <p>
        The website and its original content, features, and functionality (including but not limited to portfolio images, text, and design) are owned by i4C Construction and are protected by international copyright, trademark, and other intellectual property laws.
      </p>

      <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. Project Inquiries & Quotations</h2>
      <p>
        Any quotations, estimates, or project timelines provided through our website's inquiry forms are preliminary and non-binding. Formal construction agreements and contracts must be executed physically or via certified digital signatures before project commencement.
      </p>

      <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">4. Limitation of Liability</h2>
      <p>
        i4C Construction shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your access to or use of our website.
      </p>

      <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">5. Governing Law</h2>
      <p>
        These Terms shall be governed and construed in accordance with the laws of the Republic of the Philippines, without regard to its conflict of law provisions.
      </p>
    </LegalLayout>
  );
}
