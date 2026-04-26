import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const BulkUpload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setError("");
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setError("");

      const response = await axios.post(
        "http://localhost:8080/api/customers/bulk-upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Error uploading file"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h2>Bulk Customer Upload</h2>

      <input type="file" accept=".xlsx" onChange={handleFileChange} />

      <br /><br />

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>

      {error && (
        <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
      )}

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h3>Upload Summary</h3>
          <p>Total Records: {result.totalRecords}</p>
          <p>Success: {result.successCount}</p>
          <p>Failed: {result.failedCount}</p>

          {result.errorRows && result.errorRows.length > 0 && (
            <>
              <h4>Error Rows</h4>
              <ul>
                {result.errorRows.map((err, index) => (
                  <li key={index} style={{ color: "red" }}>
                    {err}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

       <button onClick={() => navigate("/")}>
        Back
      </button>
    </div>
  );
};

export default BulkUpload;