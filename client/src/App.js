import Home from "./pages/Home";
import Product from "./pages/Product";
import Result from "./pages/Result";
import React from "react";
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import {QueryClient, QueryClientProvider} from 'react-query';
import {loadStripe} from '@stripe/stripe-js';
import { CartProvider } from "use-shopping-cart";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";


function App() {

  const queryClient = new QueryClient();
  const stripePromise = loadStripe('pk_test_51LdbsxFJr75JnFcPwb6HNNonAEPADASHjTkiKmdhRtAjfQ93kE7dWJOAj39FHKRmYGm1huhc2H7sOmx9bK8t9cy2006uR3GHbB');

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider 
        mode="checkout-session"
        stripe={stripePromise}
        currency="USD"
      >
          <BrowserRouter>
            <Navbar />
            <Toaster position="bottom-center" />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/result" component={Result} />
              <Route path="/:productId" component={Product} />
            </Switch>
          </BrowserRouter>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
