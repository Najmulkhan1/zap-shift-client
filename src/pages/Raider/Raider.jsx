import React from "react";
import { useForm, useWatch } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useLoaderData } from "react-router";
import Swal from "sweetalert2";

const Raider = () => {
  const {
    register,
    handleSubmit,
    control,
    // formState: { errors },
  } = useForm();

  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const serviceCenters = useLoaderData();

  const regionDuplicate = serviceCenters.map((c) => c.region);
  const region = [...new Set(regionDuplicate)];

  const raiderRegion = useWatch({ control, name: "region" });

  const districtByRegion = (region) => {
    const regionDistricts = serviceCenters.filter((c) => c.region === region);
    const district = regionDistricts.map((d) => d.district);
    return district;
  };

  const handleBeARider = (data) => {
    console.log(data);

    axiosSecure.post('/riders', data)
    .then((res) => {
      if(res.data.insertedId){
        Swal.fire({
                      position: "top-end",
                      icon: "success",
                      title: "Your application has been submitted created. we will reach to you in 7 days",
                      showConfirmButton: false,
                      timer: 2500,
                    });
        
      }
    })
  };

  return (
    <div>
      <h2 className="text-4xl text-primary">Be a Rider</h2>

      <form className="mt-12 p-4" onSubmit={handleSubmit(handleBeARider)}>
        {/* two column */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/*Info */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Raider Details</h2>

            {/*  name */}
            <fieldset className="fieldset">
              <label className="label">Your Name</label>
              <input
                type="text "
                {...register("name")}
                defaultValue={user?.displayName}
                className="input w-full"
                placeholder="Name"
              />
            </fieldset>

            {/*  License */}
            <fieldset className="fieldset">
              <label className="label">Driving License Number</label>
              <input
                type="text "
                {...register("drivingLicense")}
                className="input w-full"
                placeholder="Driving License Number"
              />
            </fieldset>

            {/*  email */}
            <fieldset className="fieldset">
              <label className="label">Your Email</label>
              <input
                type="email "
                {...register("email")}
                defaultValue={user?.email}
                className="input w-full"
                placeholder="email"
              />
            </fieldset>

            {/*  region */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Your Regions</legend>
              <select
                {...register("region")}
                defaultValue=""
                className="select"
              >
                <option value='' disabled={true}>Pick a region</option>

                {region.map((r, i) => (
                  <option key={i} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </fieldset>

            {/* Your districts */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Your District</legend>
              <select
                {...register("district")}
                defaultValue="Pick a district"
                className="select"
              >
                <option disabled={true}>Pick a district</option>

                {districtByRegion(raiderRegion).map((r, i) => (
                  <option key={i} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </fieldset>

            {/* NID no */}
            <fieldset className="fieldset">
              <label className="label">NID No</label>
              <input
                type="text "
                {...register("nidNo")}
                className="input w-full"
                placeholder="NID"
              />
            </fieldset>

            {/* phone number */}
            <fieldset className="fieldset">
              <label className="label">Phone Number</label>
              <input
                type="text "
                {...register("phoneNo")}
                className="input w-full"
                placeholder="Phone Number"
              />
            </fieldset>

            {/*  Bike Brand Model and Year */}
            <fieldset className="fieldset">
              <label className="label">Bike Brand Model and Year</label>
              <input
                type="text "
                {...register("bikeBandAndYear")}
                className="input w-full"
                placeholder="Bike Brand Model and Year"
              />
            </fieldset>

            {/*  Bike Registration Number */}
            <fieldset className="fieldset">
              <label className="label">Bike Registration Number</label>
              <input
                type="text "
                {...register("bikeRegisterNumber")}
                className="input w-full"
                placeholder="Bike Registration Number"
              />
            </fieldset>

            <fieldset className="fieldset">
              <label className="label">Tell Us About Yourself</label>
              <textarea
                id="message"
                {...register("tellUs")}
                rows="4"
                class="border-gray-300 bg-neutral-secondary-medium border text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full p-3.5 shadow-xs placeholder:text-body rounded-sm"
                placeholder="Tell Us About Yourself..."
              ></textarea>
            </fieldset>
          </div>
          
        </div>

        <input
          type="submit"
          className="btn btn-primary text-black"
          value="Apply as a Rider"
        />
      </form>
    </div>
  );
};

export default Raider;
