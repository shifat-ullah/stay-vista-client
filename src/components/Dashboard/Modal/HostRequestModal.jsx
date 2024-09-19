import { useEffect, useState, Fragment } from 'react';
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogTitle,
  DialogPanel,
} from '@headlessui/react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PropTypes from 'prop-types';
import CheckoutForm from './CheckoutFrom';


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const HostModal = ({ closeModal, isOpen, modalHandler }) => {
  const [clientSecret, setClientSecret] = useState("");
  const [isPaymentComplete, setIsPaymentComplete] = useState(false); // Track payment success

  useEffect(() => {
    const price = 5;
    fetch(`http://localhost:8000/create-payment-host`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ price }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      });
  }, []);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={closeModal}>
        <TransitionChild
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black bg-opacity-25' />
        </TransitionChild>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <TransitionChild
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <DialogPanel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                <DialogTitle
                  as='h3'
                  className='text-lg font-medium text-center leading-6 text-gray-900'
                >
                  Become A Host!
                </DialogTitle>
                <div className='mt-2'>
                  <p className='text-sm bg-orange-700 p-2 text-white'>
                    Do you want to be a host? Please pay $5 and press the continue button after successful payment.
                  </p>
                </div>

                {/* Payment form */}
                {clientSecret && !isPaymentComplete && (
                  <Elements options={options} stripe={stripePromise}>
                    <CheckoutForm
                      setIsPaymentComplete={setIsPaymentComplete} // Pass down payment status setter
                    />
                  </Elements>
                )}

                {isPaymentComplete && (
                  <div className="text-green-600">
                    Payment successful! You are now a host.
                  </div>
                )}

                <hr className='mt-8 ' />
                <div className='flex mt-2 justify-around'>
                  <button
                    disabled={!clientSecret || !isPaymentComplete} // Enable after payment is complete
                    onClick={() => {
                      if (isPaymentComplete) {
                        modalHandler(); // Proceed only if payment is complete
                        closeModal();
                      }
                    }}
                    type='button'
                    className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white ${
                      isPaymentComplete ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    Continue
                  </button>
                  <button
                    type='button'
                    className='inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2'
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

HostModal.propTypes = {
  closeModal: PropTypes.func,
  isOpen: PropTypes.bool,
  modalHandler: PropTypes.func,
};

export default HostModal;
