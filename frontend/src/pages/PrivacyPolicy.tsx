import LegalLayout from "@/components/LegalLayout";

export default function PrivacyPolicy() {
  return (
    <LegalLayout title="Privacy Policy">
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      
      <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. Introduction</h2>
      <p>
        Welcome to i4C Construction. We respect your privacy and are committed to protecting your personal data in accordance with the Data Privacy Act of 2012 (Republic Act No. 10173) of the Philippines.
      </p>

      <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. Information We Collect</h2>
      <p>
        When you use our website or contact us for inquiries, we may collect:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Identity Data (Name, Company)</li>
        <li>Contact Data (Email address, Phone/Mobile number)</li>
        <li>Project specifics and requirements you voluntarily provide</li>
        <li>Technical Data (IP address, browser type, usage data via analytics)</li>
      </ul>

      <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. How We Use Your Data</h2>
      <p>
        We use the information we collect primarily to:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Process and respond to your construction project inquiries</li>
        <li>Provide you with accurate cost estimates and proposals</li>
        <li>Improve our website performance and user experience</li>
      </ul>

      <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">4. Data Security</h2>
      <p>
        We implement appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way. Access to your personal data is restricted to employees and contractors who have a business need to know.
      </p>

      <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">5. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy or our privacy practices, please contact us at our Cebu Head Office via the contact information provided on our website.
      </p>
    </LegalLayout>
  );
}
