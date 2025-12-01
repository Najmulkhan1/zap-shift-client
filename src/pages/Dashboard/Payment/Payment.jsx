import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const Payment = () => {
  const { parcelId } = useParams();
  console.log(parcelId);

  const axiosSecure = useAxiosSecure();

  const { isLoading, data: parcel = [] } = useQuery({
    queryKey: ["parcels", parcelId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels/${parcelId}`);
      console.log(res);
      return res.data;
    },
  });

  const handlePayment = async () => {
    const paymentInfo = {
        cost: parcel.cost,
        parcelId: parcel._id,
        senderEmail: parcel.senderEmail,
        parcelName: parcel.parcelName
    }

    const res = await axiosSecure.post('/create-checkout-session', paymentInfo)
    console.log(res.data);

    window.location.href = res.data.url
    
  }

  if (isLoading) {
    <span className="loading loading-spinner text-secondary"></span>;
  }

  return (
    <div>
      <h1>please pay ${parcel.cost} for : {parcel?.parcelName}</h1>
      <button onClick={handlePayment} className="btn btn-primary text-black">pay</button>
    </div>
  );
};

export default Payment;
 