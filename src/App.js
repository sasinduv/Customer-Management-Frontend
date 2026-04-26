import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CustomerList from "./pages/CustomerList";
import CustomerForm from "./pages/CustomerForm";
import CustomerView from "./pages/CustomerView";
import CustomerEdit from "./pages/CustomerEdit";
import BulkUpload from "./pages/BulkUpload";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CustomerList />} />
        <Route path="/add" element={<CustomerForm />} />
        <Route path="/bulkUpload" element={<BulkUpload />} />
        <Route path="/view/:id" element={<CustomerView />} />
        <Route path="/edit/:id" element={<CustomerEdit />} />
      </Routes>
    </Router>
  )
}

export default App;