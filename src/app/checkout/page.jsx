import RazorpayButton from "../../components/RazorpayButton";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl mb-4 font-semibold">Checkout</h1>
        <RazorpayButton amount={500} />
      </div>
    </div>
  );
}
