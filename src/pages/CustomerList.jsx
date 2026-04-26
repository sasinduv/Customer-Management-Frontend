import { useEffect, useState } from "react";
import API from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();

  // Load ONLY basic fields (important for performance)
  useEffect(() => {
    API.get("/customers")
      .then((res) => setCustomers(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Customer List</h2>

      <button onClick={() => navigate("/add")}>
        + Add Customer
      </button>

      <table border="1" cellPadding="10" style={{ marginTop: "20px", width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>NIC</th>
            <th>Date of Birth</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {customers.length === 0 ? (
            <tr>
              <td colSpan="6">No customers found</td>
            </tr>
          ) : (
            customers.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.nic}</td>
                <td>{c.dob}</td>

                <td>
                  <button onClick={() => navigate(`/view/${c.id}`)}>
                    View
                  </button>

                  <button
                    onClick={() => navigate(`/edit/${c.id}`)}
                    style={{ marginLeft: "10px" }}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CustomerList;