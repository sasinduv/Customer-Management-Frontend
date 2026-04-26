import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";


console.log("CustomerView loaded");
function CustomerView() {
    
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);

  // Load full customer data
  useEffect(() => {
    API.get(`/customers/${id}`)
      .then((res) => setCustomer(res.data))
      .catch((err) => {
        console.error(err);
        alert("Error loading customer");
      });
  }, [id]);

  if (!customer) {
    return <div style={{ padding: "20px" }}>Loading...</div>;
  }

  return (
    
    <div style={{ padding: "20px" }}>
      <h2>Customer Details</h2>

      {/* BASIC DETAILS */}
      <div>
        <p><strong>ID:</strong> {customer.id}</p>
        <p><strong>Name:</strong> {customer.name}</p>
        <p><strong>Email:</strong> {customer.email}</p>
        <p><strong>NIC:</strong> {customer.nic}</p>
        <p><strong>Date of Birth:</strong> {customer.dob}</p>
      </div>

      {/* MOBILES */}
      <h3>Mobile Numbers</h3>
      {customer.mobiles && customer.mobiles.length > 0 ? (
        <ul>
          {customer.mobiles.map((m, index) => (
            <li key={index}>{m.mobile}</li>
          ))}
        </ul>
      ) : (
        <p>No mobile numbers</p>
      )}

      {/* ADDRESSES */}
      <h3>Addresses</h3>
      {customer.addresses && customer.addresses.length > 0 ? (
        <ul>
          {customer.addresses.map((a, index) => (
            <li key={index}>{a.addressLine}</li>
          ))}
        </ul>
      ) : (
        <p>No addresses</p>
      )}

      {/* FAMILY MEMBERS */}
      <h3>Family Members</h3>
      {customer.familyMembers && customer.familyMembers.length > 0 ? (
        <ul>
          {customer.familyMembers.map((f, index) => (
            <li key={index}>
              {f.name} ({f.nic})
            </li>
          ))}
        </ul>
      ) : (
        <p>No family members</p>
      )}

      <br />

      <button onClick={() => navigate("/")}>Back to List</button>
    </div>
  );
}

export default CustomerView;