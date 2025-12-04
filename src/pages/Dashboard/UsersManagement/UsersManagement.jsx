import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaUserShield, FaUserSlash } from "react-icons/fa";

function UsersManagement() {
  const axiosSecure = useAxiosSecure();

  const { refetch, data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users`);
      return res.data;
    },
  });

  const handleMakeUser = (user) => {
    const roleInfo = { role: "admin" };

    // must ask for confirmation before proceed
    console.log(user._id);
    
    axiosSecure.patch(`/users/${user._id}`, roleInfo).then((res) => {
      console.log(res.data);

      if (res.data.modifiedCount) {
        refetch();
        console.log("Role Update");
      }
    });
  };

  const handleRemoveAdmin =  (user) => {
    const roleInfo = {role: "user"}
    // must ask for confirmation before proceed
    axiosSecure.patch(`/users/${user._id}`, roleInfo)
    .then(res => {
      console.log(res);
      if(res.data.modifiedCount){
        refetch()
      }
      
    })
  }

  return (
    <div>
      <h2 className="text-4xl">Mange Users: {users.length}</h2>

      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Admin Action</th>
              <th>Other Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <th>{index + 1}</th>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        <img
                          src={user.photoURL}
                          alt="Avatar Tailwind CSS Component"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{user.displayName}</div>
                      <div className="text-sm opacity-50">United States</div>
                    </div>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  {user.role === "admin" ? (
                    <button onClick={()=> handleRemoveAdmin(user)} className="btn ">
                      <FaUserSlash />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleMakeUser(user)}
                      className="btn"
                    >
                      <FaUserShield />
                    </button>
                  )}
                </td>
                <th>
                  <button className="btn btn-ghost btn-xs">Actions</button>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UsersManagement;
