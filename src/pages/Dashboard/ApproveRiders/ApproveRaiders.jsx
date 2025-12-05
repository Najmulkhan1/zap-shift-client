import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaUserCheck } from "react-icons/fa";
import { IoPersonRemoveSharp } from "react-icons/io5";
import { FaTrashCan } from "react-icons/fa6";

function ApproveRaiders() {
  const axiosSecure = useAxiosSecure();

  const { refetch, data: riders = [] } = useQuery({
    queryKey: ["riders", "pending"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders");
      return res.data;
    },
  });

  const updateRaiderStatus = (rider, status) => {
    const updateInfo = { status: status, email: rider.email };
    axiosSecure.patch(`/riders/${rider._id}`, updateInfo).then((res) => {
      if (res.data.modifiedCount) {
        refetch();
        console.log("update");
      }
    });
  };

  const handleApproval = (rider) => {
    updateRaiderStatus(rider, "approved");
  };

  const handleRejection = (rider) => {
    updateRaiderStatus(rider, "rejected");
  };

  // const statusClasses =  {
  //   approved: 'text-green-800',
  //   rejected: 'text-red-500',
  //   pending: ''
  // }

  const handleRemove = (id) => {
    axiosSecure.delete(`/riders/${id}`).then((res) => {
      console.log("removed", res);
      refetch()
    });
  };

  return (
    <div>
      <h2>Riders Pending Approval: {riders.length}</h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Email</th>
              <th>District</th>
              <th>Application Status</th>
              <th>Work Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {riders.map((rider, index) => (
              <tr key={index}>
                <th>{index + 1}</th>
                <td>{rider.name}</td>
                <td>{rider.email}</td>
                <td>{rider.district}</td>
                {/* <td className={`${rider.status === 'approved' ? 'text-green-800' : ''} ${rider.status === 'rejected' ? 'text-red-500' : ''}`}>{rider.status}</td>
                <td> */}
                {/* <td className={statusClasses[rider.status]}>{rider.status}</td>
                <td> */}
                <td
                  className={
                    rider.status === "approved"
                      ? "text-green-600"
                      : rider.status === "rejected"
                      ? "text-red-500"
                      : ""
                  }
                >
                  {rider.status}
                </td>

                <td>{rider.workStatus}</td>
                <td>
                  <button onClick={() => handleApproval(rider)} className="btn">
                    <FaUserCheck />
                  </button>
                  <button
                    onClick={() => handleRejection(rider)}
                    className="btn mx-3"
                  >
                    <IoPersonRemoveSharp />
                  </button>
                  <button
                  onClick={() => handleRemove(rider._id)}
                  className="btn">
                    <FaTrashCan />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ApproveRaiders;
