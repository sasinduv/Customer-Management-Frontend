import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";

function CustomerEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    dateOfBirth: "",
    nic: "",
  });

  const [mobiles, setMobiles] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedFamily, setSelectedFamily] = useState([]);
  const [allCustomers, setAllCustomers] = useState([]);

  // ----------------------------
  // LOAD EXISTING CUSTOMER
  // ----------------------------
  useEffect(() => {
    API.get(`/customers/${id}`)
      .then((res) => {
        const data = res.data;

        // Basic fields
        setCustomer({
          name: data.name,
          email: data.email,
          dateOfBirth: data.dob,
          nic: data.nic,
        });

        // Mobiles
        setMobiles(data.mobiles?.map((m) => m.mobile) || [""]);

        // Addresses
        setAddresses(
          data.addresses?.map((a) => ({
            line: a.addressLine,
          })) || [{ line: "" }]
        );

        // Family members
        setSelectedFamily(
          data.familyMembers?.map((f) => f.id.toString()) || []
        );
      })
      .catch((err) => console.error(err));

    // Load all customers for dropdown
    API.get("/customers")
      .then((res) => setAllCustomers(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  // ----------------------------
  // HANDLE INPUT
  // ----------------------------
  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  // ----------------------------
  // MOBILES
  // ----------------------------
  const handleMobileChange = (index, value) => {
    const updated = [...mobiles];
    updated[index] = value;
    setMobiles(updated);
  };

  const addMobile = () => setMobiles([...mobiles, ""]);

  const removeMobile = (index) => {
    const updated = mobiles.filter((_, i) => i !== index);
    setMobiles(updated);
  };

  // ----------------------------
  // ADDRESSES
  // ----------------------------
  const handleAddressChange = (index, value) => {
    const updated = [...addresses];
    updated[index].line = value;
    setAddresses(updated);
  };

  const addAddress = () =>
    setAddresses([...addresses, { line: "" }]);

  const removeAddress = (index) => {
    const updated = addresses.filter((_, i) => i !== index);
    setAddresses(updated);
  };

  // ----------------------------
  // FAMILY MEMBERS
  // ----------------------------
  const handleFamilySelect = (e) => {
    const options = e.target.options;
    let values = [];

    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        values.push(options[i].value);
      }
    }

    setSelectedFamily(values);
  };

  // ----------------------------
  // SUBMIT (UPDATE)
  // ----------------------------
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name: customer.name,
      dob: customer.dateOfBirth,
      nic: customer.nic,
      email: customer.email,
      mobiles: mobiles
        .filter((m) => m.trim() !== "")
        .map((m) => ({ mobile: m })),

      addresses: addresses
        .filter((a) => a.line.trim() !== "")
        .map((a) => ({
          addressLine: a.line,
        })),

      familyMemberIds: selectedFamily.map((id) => Number(id)),
    };

    console.log("UPDATE PAYLOAD:", payload);

    API.put(`/customers/${id}`, payload)
      .then(() => {
        alert("Customer updated successfully");
        navigate("/");
      })
      .catch((err) => {
        console.error(err.response?.data);
        alert(JSON.stringify(err.response?.data));
      });
  };

  // ----------------------------
  // UI
  // ----------------------------
  return (
    <div style={{ padding: "20px" }}>
      <h2>Edit Customer</h2>

      <form onSubmit={handleSubmit}>
        {/* BASIC */}
        <input
          type="text"
          name="name"
          value={customer.name}
          onChange={handleChange}
          placeholder="Name"
        />
        <input
          type="email"
          name="email"
          value={customer.email}
          onChange={handleChange}
          placeholder="Email"
        />

        <input
          type="date"
          name="dateOfBirth"
          value={customer.dateOfBirth}
          onChange={handleChange}
        />

        <input
          type="text"
          name="nic"
          value={customer.nic}
          onChange={handleChange}
        />

        {/* MOBILES */}
        <h4>Mobiles</h4>
        {mobiles.map((m, i) => (
          <div key={i}>
            <input
              value={m}
              onChange={(e) =>
                handleMobileChange(i, e.target.value)
              }
            />
            <button type="button" onClick={() => removeMobile(i)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addMobile}>
          Add Mobile
        </button>

        {/* ADDRESSES */}
        <h4>Addresses</h4>
        {addresses.map((a, i) => (
          <div key={i}>
            <input
              value={a.line}
              onChange={(e) =>
                handleAddressChange(i, e.target.value)
              }
            />
            <button type="button" onClick={() => removeAddress(i)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addAddress}>
          Add Address
        </button>

        {/* FAMILY */}
        <h4>Family Members</h4>
        <select multiple value={selectedFamily} onChange={handleFamilySelect}>
          {allCustomers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.nic})
            </option>
          ))}
        </select>

        <br /><br />
        <button type="submit">Update</button>
      </form>

      <button onClick={() => navigate("/")}>Back</button>
    </div>
  );
}

export default CustomerEdit;