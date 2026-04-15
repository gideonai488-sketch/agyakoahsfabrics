import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNavBar from "@/components/BottomNavBar";

const Deletion = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen mesh-bg pb-24">
      <div className="sticky top-0 z-40 flex items-center gap-3 px-4 py-3 backdrop-blur-xl" style={{ background: "hsl(0 0% 100% / 0.6)", borderBottom: "1px solid hsl(0 0% 100% / 0.4)" }}>
        <button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-full active:scale-90" style={{ background: "hsl(0 0% 100% / 0.5)" }}>
          <ArrowLeft className="h-4 w-4 text-foreground" strokeWidth={1.5} />
        </button>
        <h1 className="text-base font-bold text-foreground">Account Deletion</h1>
      </div>

      <div className="px-4 py-6 space-y-6">
        <div className="glass-card space-y-4 text-sm text-foreground leading-relaxed">
          <h2 className="text-lg font-bold">Account & Data Deletion Request</h2>
          <p className="text-xs text-muted-foreground">Last updated: April 15, 2026</p>

          <p>At Agyakoahs Fabrics, we respect your right to control your personal data. You may request the deletion of your account and all associated data at any time.</p>

          <h3 className="text-base font-semibold mt-4">1. How to Request Account Deletion</h3>
          <p>To request deletion of your account and personal data, please use one of the following methods:</p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li><strong>Email:</strong> Send a deletion request to <span className="text-foreground font-medium">support@agyakoahsfabrics.online</span> with the subject line "Account Deletion Request"</li>
            <li><strong>In-App:</strong> Go to Profile → Settings → Delete Account</li>
          </ul>

          <h3 className="text-base font-semibold mt-4">2. What Data Will Be Deleted</h3>
          <p>Upon processing your request, the following data will be permanently deleted:</p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>Your account profile (name, email, phone number, avatar)</li>
            <li>Order history and delivery addresses</li>
            <li>Wishlist and saved items</li>
            <li>Cart data and preferences</li>
            <li>Any other personal information linked to your account</li>
          </ul>

          <h3 className="text-base font-semibold mt-4">3. Data We May Retain</h3>
          <p>Certain data may be retained for legal, regulatory, or legitimate business purposes:</p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>Transaction records required for tax and accounting purposes (up to 7 years)</li>
            <li>Data necessary to comply with legal obligations</li>
            <li>Anonymized or aggregated data that cannot identify you</li>
          </ul>

          <h3 className="text-base font-semibold mt-4">4. Processing Time</h3>
          <p>Account deletion requests will be processed within <strong>30 days</strong> of receipt. You will receive a confirmation email once your account has been successfully deleted.</p>

          <h3 className="text-base font-semibold mt-4">5. Consequences of Deletion</h3>
          <p>Please be aware that once your account is deleted:</p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>You will no longer be able to log in or access your account</li>
            <li>All active orders must be fulfilled or cancelled before deletion</li>
            <li>Any store credit or loyalty points will be forfeited</li>
            <li>This action is <strong>irreversible</strong></li>
          </ul>

          <h3 className="text-base font-semibold mt-4">6. Third-Party Data</h3>
          <p>Payment data processed through Paystack is managed under Paystack's own data policies. We will notify Paystack of your deletion request, but you may also contact Paystack directly regarding payment data they hold.</p>

          <h3 className="text-base font-semibold mt-4">7. Contact Us</h3>
          <p>If you have questions about account deletion or data privacy, please contact us:</p>
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

export default Deletion;
