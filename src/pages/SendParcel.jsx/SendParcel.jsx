import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { useLoaderData, useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

const SendParcel = () => {
  const {
    register,
    handleSubmit,
    control,
    // formState: { errors },
  } = useForm();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const serviceCenters = useLoaderData();
  const navigate = useNavigate();

  const regionDuplicate = serviceCenters.map((c) => c.region);
  const region = [...new Set(regionDuplicate)];

  const senderRegion = useWatch({ control, name: "senderRegion" });
  const receiverRegion = useWatch({ control, name: "receiverRegion" });

  const districtByRegion = (region) => {
    const regionDistricts = serviceCenters.filter((c) => c.region === region);
    const district = regionDistricts.map((d) => d.district);
    return district;
  };

  const handleSendParcel = (data) => {
    console.log(data);
    const isDocument = data.parcelType === "document";
    const isSameDistrict = data.senderDistrict === data.receiverDistrict;
    const parcelWeight = parseFloat(data.parcelWeight);

    let cost = 0;
    if (isDocument) {
      cost = isSameDistrict ? 60 : 80;
    } else {
      if (parcelWeight < 3) {
        cost = isSameDistrict ? 110 : 150;
      } else {
        const minCharge = isSameDistrict ? 110 : 150;
        const extraWeight = parcelWeight - 3;
        const extraCharge = isSameDistrict
          ? extraWeight * 40
          : extraWeight * 40 + 40;
        cost = minCharge + extraCharge;
      }
    }

    console.log(cost);
    data.cost = cost;
    Swal.fire({
      title: "Agree with the cost?",
      text: `You will be charged ${cost} taka !`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirm and Continue Payment",
    }).then((result) => {
      if (result.isConfirmed) {
        // save the parcel info to the database
        axiosSecure.post("/parcels", data).then((res) => {
          console.log(res.data);
          if (res.data.insertedId) {
            navigate("/dashboard/my-parcels");
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Parcel has created. Please pay",
              showConfirmButton: false,
              timer: 2500,
            });
          }
        });
      }
    });
  };

  return (
    <div>
      <h2 className="text-5xl font-bold">Send A Parcel</h2>
      <form className="mt-12 p-4" onSubmit={handleSubmit(handleSendParcel)}>
        {/* document */}
        <div>
          <label className="label mr-4">
            <input
              type="radio"
              {...register("parcelType")}
              value="document"
              className="radio "
              defaultChecked
            />
            Document
          </label>
          <label className="label">
            <input
              type="radio"
              {...register("parcelType")}
              value="non-document"
              className="radio"
            />
            Non-Document
          </label>
        </div>

        {/* parcel info: name, weight */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
          <fieldset className="fieldset">
            <label className="label">Parcel Name</label>
            <input
              type="text "
              {...register("parcelName")}
              className="input w-full"
              placeholder="Parcel Name"
            />
          </fieldset>
          <fieldset className="fieldset">
            <label className="label">Parcel weight (kg)</label>
            <input
              type="number"
              {...register("parcelWeight")}
              className="input w-full"
              placeholder="Parcel Weight"
            />
          </fieldset>
        </div>

        {/* two column */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* sender Info */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Sender Details</h2>

            {/* sender name */}
            <fieldset className="fieldset">
              <label className="label">sender Name</label>
              <input
                type="text "
                {...register("senderName")}
                defaultValue={user?.displayName}
                className="input w-full"
                placeholder="Sender Name"
              />
            </fieldset>

            {/* sender email */}
            <fieldset className="fieldset">
              <label className="label">sender Email</label>
              <input
                type="email "
                {...register("senderEmail")}
                defaultValue={user?.email}
                className="input w-full"
                placeholder="Sender email"
              />
            </fieldset>

            {/* sender region */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Sender Regions</legend>
              <select
                {...register("senderRegion")}
                defaultValue="Pick a Region"
                className="select"
              >
                <option disabled={true}>Pick a region</option>

                {region.map((r, i) => (
                  <option key={i} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </fieldset>

            {/* sender districts */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Sender District</legend>
              <select
                {...register("senderDistrict")}
                defaultValue="Pick a district"
                className="select"
              >
                <option disabled={true}>Pick a district</option>

                {districtByRegion(senderRegion).map((r, i) => (
                  <option key={i} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </fieldset>

            <fieldset className="fieldset">
              <label className="label">Address</label>
              <input
                type="text "
                {...register("address")}
                className="input w-full"
                placeholder="Address"
              />
            </fieldset>

            <fieldset className="fieldset">
              <label className="label">Sender Phone No</label>
              <input
                type="text "
                {...register("SenderPhoneNo")}
                className="input w-full"
                placeholder="Sender Phone No"
              />
            </fieldset>

            <fieldset className="fieldset">
              <label className="label">Pickup Instruction</label>
              <textarea
                id="message"
                {...register("PickupInstruction")}
                rows="4"
                class="border-gray-300 bg-neutral-secondary-medium border text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full p-3.5 shadow-xs placeholder:text-body rounded-sm"
                placeholder="Write your pickup instruction here..."
              ></textarea>
            </fieldset>
          </div>
          {/* receiver info */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Receiver Details</h2>
            <fieldset className="fieldset">
              <label className="label">Receiver Name</label>
              <input
                type="text "
                {...register("ReceiverName")}
                className="input w-full"
                placeholder="Delivery Name"
              />
            </fieldset>

            <fieldset className="fieldset">
              <label className="label">Receiver Email</label>
              <input
                type="email "
                {...register("receiverEmail")}
                className="input w-full"
                placeholder="Receiver email"
              />
            </fieldset>

            {/* receiver region */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">receiver Regions</legend>
              <select
                {...register("receiverRegion")}
                defaultValue="Pick a Region"
                className="select"
              >
                <option disabled={true}>Pick a region</option>

                {region.map((r, i) => (
                  <option key={i} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </fieldset>

            {/* receiver districts */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">receiver District</legend>
              <select
                {...register("receiverDistrict")}
                defaultValue="Pick a district"
                className="select"
              >
                <option disabled={true}>Pick a district</option>
                {districtByRegion(receiverRegion).map((d, i) => (
                  <option key={i} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </fieldset>

            <fieldset className="fieldset">
              <label className="label">Receiver Address</label>
              <input
                type="text "
                {...register("receiverAddress")}
                className="input w-full"
                placeholder="Address"
              />
            </fieldset>

            <fieldset className="fieldset">
              <label className="label">Receiver Phone No</label>
              <input
                type="text "
                {...register("receiverPhoneNo")}
                className="input w-full"
                placeholder="Delivery Phone No"
              />
            </fieldset>

            <fieldset className="fieldset">
              <label className="label">Delivery Instruction</label>
              <textarea
                id="message"
                {...register("deliveryInstruction")}
                rows="4"
                class="bg-neutral-secondary-medium border border-gray-300 border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full p-3.5 shadow-xs placeholder:text-body rounded-sm"
                placeholder="Write your Delivery instruction here..."
              ></textarea>
            </fieldset>
          </div>
        </div>

        <input
          type="submit"
          className="btn btn-primary text-black"
          value="send parcel"
        />
      </form>
    </div>
  );
};

export default SendParcel;
