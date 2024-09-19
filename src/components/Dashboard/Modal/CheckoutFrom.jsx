/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { toast } from 'react-hot-toast';

const CheckoutForm = ({ setIsPaymentComplete, formData, setFormData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentSucceeded, setIsPaymentSucceeded] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get("payment_intent_client_secret");

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          toast.success('Payment successful!'); // Show success toast
          setIsPaymentComplete(true); // Set payment complete
          setIsPaymentSucceeded(true); // Mark payment as succeeded
          break;
        case "processing":
          setMessage("Your payment is processing");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again");
          break;
        default:
          setMessage("Something went wrong");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {},
      redirect: 'if_required', // Prevent automatic redirection
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message);
      } else {
        setMessage("An unexpected error occurred.");
      }
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setMessage("Payment succeeded!");
      toast.success('Payment successful!');
      setIsPaymentComplete(true);
      setIsPaymentSucceeded(true);
    } else if (paymentIntent && paymentIntent.status === "processing") {
      setMessage("Your payment is processing.");
    } else if (paymentIntent && paymentIntent.status === "requires_payment_method") {
      setMessage("Payment failed. Please try again.");
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs",
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="flex flex-col items-center">
      {!isPaymentSucceeded ? (
        <>
          <PaymentElement id="payment-element" options={paymentElementOptions} />
          <button
            disabled={isLoading || !stripe || !elements} // Disable button when loading or payment incomplete
            id="submit"
            className={`pay-button mt-4 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} transition duration-300 ease-in-out transform hover:scale-105`}
          >
            <span id="button-text">
              {isLoading ? (
                <div className="spinner"></div>
              ) : (
                <span className="bg-green-900 text-white p-2 rounded mx-auto">Pay Now</span>
              )}
            </span>
          </button>
        </>
      ) : (
        <div id="payment-message" className="text-green-600 mt-4">{message}</div> // Show success message
      )}
    </form>
  );
};

export default CheckoutForm;
