import React from "react";
import {useLocation} from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatCurrencyString } from 'use-shopping-cart';


function useQueryString() {
  return new URLSearchParams(useLocation().search);
}
export default function Result() {

  const queryString = useQueryString();
  const sessionId = queryString.get('session_id');

  const {data, isLoading, isError} = useQuery('Result', () => sessionId ? axios(`/api/checkout-session/${sessionId}`).then(res => res.data) : null);
  
  if(isLoading) return <LoadingSpinner />

  if(!data && !isLoading) return <div className="text-white font-bold text-center mx-auto">No purchase found.</div>

  if(isError) return <div className="text-red-500 font-bold text-center mx-auto">Error loading result page</div>
  
  const total = formatCurrencyString({
    value : data.amount_total,
    currency : data.currency,
    language : navigator.language
  });
  return (
    <section className="text-gray-400 bg-gray-900 body-font">
      <div className="container px-5 py-24 mx-auto">
        <div className="text-center mb-20">
          <h1 className="sm:text-3xl text-2xl font-medium text-center title-font text-white mb-4">
            Payment Accepted!
          </h1>
          <p className="text-base leading-relaxed xl:w-2/4 lg:w-3/4 text-xl mx-auto">
            Below is your order summary. The items will be shipped to you within
            the next week.
          </p>
          <br />
          <h2 className="text-xl text-indigo-400 tracking-widest font-medium title-font mb-1">
            Order Total: {total}
          </h2>
          <h2 className="text-xl text-indigo-400 tracking-widest font-medium title-font mb-1">
            Email: {data.customer_details.email}
          </h2>
        </div>
      </div>
    </section>
  );
}
