import LegalLayout from "@/components/LegalLayout";

export default function CookiePolicy() {
  return (
    <LegalLayout title="Cookie Policy">
      <p>Last updated: {new Date().toLocaleDateString()}</p>

      <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. What Are Cookies</h2>
      <p>
        Cookies are small text files that are stored on your computer or mobile device when you visit our website. They help the website remember your actions and preferences over a period of time.
      </p>

      <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. How We Use Cookies</h2>
      <p>
        At i4C Construction, we use cookies for the following purposes:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Essential Cookies:</strong> Required to enable core site functionality and secure access to our Admin dashboard.</li>
        <li><strong>Analytics/Performance:</strong> We use minimal analytics tracking to understand how many people visit our site and which pages are most popular. This helps us improve our online presence.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. Admin Dashboard Cookies</h2>
      <p>
        If you log into the administrative areas of our website, we use secure HTTP-only cookies to persist your authentication session. These are strictly necessary for security and operational purposes.
      </p>

      <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">4. Managing Cookies</h2>
      <p>
        You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed. If you do this, however, you may have to manually adjust some preferences every time you visit a site and some services and functionalities may not work.
      </p>
    </LegalLayout>
  );
}
