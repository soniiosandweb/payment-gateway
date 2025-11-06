import axios from "axios";
import razorPayIcon from "./images/razorpay.png";

const RazorpayButton = ({ amount }) => {

  const handlePayment = async () => {

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/razor-create-order`,
        { amount: amount }
      );

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: "INR",
        name: "Demo Store",
        description: "Test Transaction",
        order_id: data.order.id,
        handler: async function (response) {
          const paymentId = response.razorpay_payment_id;

          try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/razorpay-process`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                paymentId,
                amount,
              }),
            });

            const result = await response.json();
            console.log("Server response:", result);
            alert(result.success ? "✅ Payment Successful!" : "❌ Payment Failed");

          } catch (error) {
            console.error("Error processing payment:", error);
            alert("Error processing payment:", error);
          }
        },
        prefill: { email: "test@yopmail.com", contact: "9999999999" },
        theme: { color: "#cc33a6ff" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("Razorpay Error: " + err.message);
    }

  };

  return (
    <button onClick={handlePayment} className="button" style={{backgroundColor: "#cdcdcd", color: "black", borderColor: "black"}}>
      Buy with <img src={razorPayIcon} alt="RazorPay" style={{height: "18px", marginLeft: "10px"}} />
    </button>
  );
};

export default RazorpayButton;
