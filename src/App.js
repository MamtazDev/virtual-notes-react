import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { UserProvider } from "./UserContext";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import AppRoutes from "./components/AppRoutes";

const stripePromise = loadStripe(
  "pk_test_51OB8DwCLw8f7mw14cXDe1ht2xUqECAUD2WtbCSTDy29xoyRXV3k7NlzNtcKi0tBwxv32xMY0ti0uiTQ2AnIRJbHh00yenCXNUW"
);

function App() {
  return (
    <Elements stripe={stripePromise}>
      <UserProvider>
        <Router>
          <AppRoutes />
        </Router>
      </UserProvider>
    </Elements>
  );
}

export default App;
