import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNavBar from "@/components/BottomNavBar";

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen mesh-bg pb-24">
      <div className="sticky top-0 z-40 flex items-center gap-3 px-4 py-3 backdrop-blur-xl" style={{ background: "hsl(0 0% 100% / 0.6)", borderBottom: "1px solid hsl(0 0% 100% / 0.4)" }}>
        <button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-full active:scale-90" style={{ background: "hsl(0 0% 100% / 0.5)" }}>
          <ArrowLeft className="h-4 w-4 text-foreground" strokeWidth={1.5} />
        </button>
        <h1 className="text-base font-bold text-foreground">Privacy Policy</h1>
      </div>

      <div className="px-4 py-6 space-y-6">
        <div className="glass-card space-y-4 text-sm text-foreground leading-relaxed">
          <h2 className="text-lg font-bold">Privacy Policy</h2>
          <p className="text-xs text-muted-foreground">Last updated: April 10, 2026</p>

          <p>Welcome to Agyakoahs Fabrics ("we", "our", "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website at agyakoahsfabrics.online and use our mobile application.</p>

          <h3 className="text-base font-semibold mt-4">1. Information We Collect</h3>
          <p>We collect personal information that you voluntarily provide to us when you:</p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>Register an account (name, email address, phone number)</li>
            <li>Place an order (delivery address, city, region, landmark)</li>
            <li>Make a payment (processed securely via Paystack — we do not store card details)</li>
            <li>Contact our support team</li>
            <li>Subscribe to notifications or promotional communications</li>
          </ul>

          <h3 className="text-base font-semibold mt-4">2. How We Use Your Information</h3>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>To process and fulfill your fabric orders</li>
            <li>To manage your account and provide customer support</li>
            <li>To send order confirmations, shipping updates, and delivery notifications</li>
            <li>To personalize your shopping experience with product recommendations</li>
            <li>To process payments securely through Paystack</li>
            <li>To improve our website and services</li>
            <li>To comply with legal obligations</li>
          </ul>

          <h3 className="text-base font-semibold mt-4">3. Payment Security</h3>
          <p>All payment transactions are processed through Paystack, a PCI DSS-compliant payment processor. We do not store, process, or have access to your credit/debit card numbers, Mobile Money PINs, or bank account details. Paystack handles all payment data securely.</p>

          <h3 className="text-base font-semibold mt-4">4. Data Sharing</h3>
          <p>We do not sell, trade, or rent your personal information to third parties. We may share your data only with:</p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li><strong>Paystack:</strong> For payment processing</li>
            <li><strong>Delivery partners:</strong> To fulfill and deliver your orders within Ghana</li>
            <li><strong>Service providers:</strong> Who assist us in operating our platform (hosting, analytics)</li>
            <li><strong>Legal authorities:</strong> When required by law or to protect our rights</li>
          </ul>

          <h3 className="text-base font-semibold mt-4">5. Data Retention</h3>
          <p>We retain your personal information for as long as your account is active or as needed to provide you services, comply with legal obligations, resolve disputes, and enforce our agreements.</p>

          <h3 className="text-base font-semibold mt-4">6. Your Rights</h3>
          <p>You have the right to:</p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your account and associated data</li>
            <li>Opt out of promotional communications</li>
            <li>Withdraw consent at any time</li>
          </ul>

          <h3 className="text-base font-semibold mt-4">7. Cookies & Tracking</h3>
          <p>We use essential cookies and local storage to maintain your session, remember your cart, and provide a smooth shopping experience. We do not use third-party advertising cookies.</p>

          <h3 className="text-base font-semibold mt-4">8. Children's Privacy</h3>
          <p>Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children.</p>

          <h3 className="text-base font-semibold mt-4">9. Changes to This Policy</h3>
          <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.</p>

          <h3 className="text-base font-semibold mt-4">10. Contact Us</h3>
          <p>If you have questions about this Privacy Policy or your personal data, please contact us:</p>
          <ul className="list-none space-y-1 text-muted-foreground">
            <li>📧 Email: support@agyakoahsfabrics.online</li>
            <li>📍 Location: Accra, Ghana</li>
            <li>🌐 Website: agyakoahsfabrics.online</li>
          </ul>
        </div>
      </div>
      <BottomNavBar />
    </div>
  );
};

export default Privacy;
