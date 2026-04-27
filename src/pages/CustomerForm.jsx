import { useState, useEffect } from "react";
import API from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

function CustomerForm() {
  const navigate = useNavigate();

  // Main customer fields
  const [customer, setCustomer] = useState({
    name: "",
    dateOfBirth: "",
    nic: "",
  });

  // Dynamic fields
  const [mobiles, setMobiles] = useState([""]);
  const [addresses, setAddresses] = useState([
    { line: "", cityName: "", countryName: "" },
  ]);

  // Family members
  const [allCustomers, setAllCustomers] = useState([]);
  const [selectedFamily, setSelectedFamily] = useState([]);
  const [familyNicSearch, setFamilyNicSearch] = useState("");

  // Load existing customers for family selection
  useEffect(() => {
    API.get("/customers")
      .then((res) => setAllCustomers(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (familyNicSearch.trim() === "") {
      API.get("/customers")
        .then((res) => setAllCustomers(res.data))
        .catch((err) => console.error(err));
      return;
    }

    API.get(`/customers/search?nic=${encodeURIComponent(familyNicSearch)}`)
      .then((res) => setAllCustomers(res.data))
      .catch((err) => console.error(err));
  }, [familyNicSearch]);

  // ----------------------------
  // Handle basic input
  // ----------------------------
  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  // ----------------------------
  // Mobile handlers
  // ----------------------------
  const handleMobileChange = (index, value) => {
    const updated = [...mobiles];
    updated[index] = value;
    setMobiles(updated);
  };

  const addMobile = () => {
    setMobiles([...mobiles, ""]);
  };

  // ----------------------------
  // Address handlers
  // ----------------------------
  const handleAddressChange = (index, field, value) => {
    const updated = [...addresses];
    updated[index][field] = value;
    setAddresses(updated);
  };

  const addAddress = () => {
    setAddresses([...addresses, { line: "", cityName: "", countryName: "" }]);
  };

  // ----------------------------
  // Family members
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
  // Submit
  // ----------------------------
  const handleSubmit = (e) => {
  e.preventDefault();

  const payload = {
    name: customer.name,
    dob: customer.dateOfBirth,
    nic: customer.nic,

    mobiles: mobiles
      .filter((m) => m.trim() !== "")
      .map((m) => ({ mobile: m })),

   
    addresses: addresses
      .filter((a) => a.line.trim() !== "")
      .map((a) => ({
        addressLine: a.line,
        cityName: a.cityName ? a.cityName.trim() : "",
        countryName: a.countryName ? a.countryName.trim() : ""
      })),

    
    familyMemberIds: selectedFamily.map((id) => Number(id)),
  };

  console.log("FINAL PAYLOAD:", payload); 

  API.post("/customers", payload)
    .then(() => {
      alert("Customer created successfully");
      navigate("/");
    })
    .catch((err) => {
      console.error("BACKEND ERROR:", err.response?.data);
      alert(JSON.stringify(err.response?.data));
    });
};

  return (
    <div style={{ padding: "20px" }}>
      <h2>Add Customer</h2>

      <form onSubmit={handleSubmit}>
       
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={customer.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dateOfBirth"
            value={customer.dateOfBirth}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>NIC:</label>
          <input
            type="text"
            name="nic"
            value={customer.nic}
            onChange={handleChange}
            required
          />
        </div>

        {/* MOBILES */}
        <h4>Mobile Numbers</h4>
        {mobiles.map((mobile, index) => (
          <div key={index}>
            <input
              type="text"
              value={mobile}
              onChange={(e) =>
                handleMobileChange(index, e.target.value)
              }
              placeholder="Enter mobile number"
            />
          </div>
        ))}
        <button type="button" onClick={addMobile}>
          Add Mobile
        </button>

        {/* ADDRESSES */}
        <h4>Addresses</h4>
        {addresses.map((addr, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <input
              type="text"
              placeholder="Address Line"
              value={addr.line}
              onChange={(e) =>
                handleAddressChange(index, "line", e.target.value)
              }
              style={{ marginBottom: "5px", display: "block" }}
            />
            <input
              type="text"
              placeholder="City"
              value={addr.cityName || ""}
              onChange={(e) =>
                handleAddressChange(index, "cityName", e.target.value)
              }
              style={{ marginBottom: "5px", display: "block" }}
            />
            <input
              type="text"
              placeholder="Country"
              value={addr.countryName || ""}
              onChange={(e) =>
                handleAddressChange(index, "countryName", e.target.value)
              }
            />
          </div>
        ))}
        <button type="button" onClick={addAddress}>
          Add Address
        </button>

        {/* FAMILY MEMBERS */}
        <h4>Family Members</h4>
        <input
          type="text"
          placeholder="Search family customer by NIC"
          value={familyNicSearch}
          onChange={(e) => setFamilyNicSearch(e.target.value)}
          style={{ marginBottom: "10px", display: "block" }}
        />
        <select multiple onChange={handleFamilySelect}>
          {allCustomers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.nic})
            </option>
          ))}
        </select>

        <br /><br />

        <button type="submit">Save Customer</button>
      </form>

      <button onClick={() => navigate("/")}>
        Back
      </button>
    </div>
  );
}

export default CustomerForm;