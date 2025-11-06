import React from "react";
import GooglePayButton from "@google-pay/button-react";

const GooglePayButtonComponent = ({ amount }) => {

  const handlePaymentData = async (paymentData) => {
    try {
      console.log("Payment data loaded:", paymentData);

      // Extract the token string from GPay response
      const token = paymentData.paymentMethodData.tokenizationData.token;

      // Send to backend for processing
      const response = await fetch(`${process.env.REACT_APP_API_URL}/process-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
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
  };

  return (
    <GooglePayButton
      environment="TEST"
      buttonColor="black"
      buttonType="buy"
      paymentRequest={{
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [
          {
            type: "CARD",
            parameters: {
              allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
              allowedCardNetworks: ["MASTERCARD", "VISA"],
            },
            tokenizationSpecification: {
              type: "PAYMENT_GATEWAY",
              parameters: {
                gateway: "stripe",
                "stripe:version": "2020-08-27",
                "stripe:publishableKey": "pk_test_51PNSx7A2nuiqtZl37LIvC5AJQsJzg84hvRtbXSwIUk9u7KF827dUDUx3htyk2h0HKCmxYkpQQFx6gryUpEHJxetx00icrat2gT",
              },
            },
          },
        ],
        merchantInfo: {
          merchantName: "My Demo Store",
        },
        transactionInfo: {
          totalPriceStatus: "FINAL",
          totalPriceLabel: "Total",
          totalPrice: amount.toString(),
          currencyCode: "INR",
          countryCode: "IN",
        },
      }}
      onLoadPaymentData={handlePaymentData}
    />
  );
};

export default GooglePayButtonComponent;
