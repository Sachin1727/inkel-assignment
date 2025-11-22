import { useEffect, useState } from "react";
import "./index.css";
import { fetchTaxes, fetchCountries, updateCustomer } from "./api";
import CustomerTable from "./components/CustomerTable";
import EditCustomerModal from "./components/EditCustomerModal";

function App() {
  const [customers, setCustomers] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [countryFilterIds, setCountryFilterIds] = useState([]);
  const [toast, setToast] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [taxesData, countriesData] = await Promise.all([
        fetchTaxes(),
        fetchCountries(),
      ]);

      const normalizedCustomers = taxesData.map((row) => ({
        ...row,
        requestDate: row.createdAt,
      }));

      setCustomers(normalizedCustomers);
      setCountries(countriesData);

      } catch (err) {
        console.error(err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

    const handleInlineCountryChange = (customerId, countryId) => {
      setError("");

      const country = countries.find((c) => c.id === countryId);
      const previousCustomer = customers.find((c) => c.id === customerId);

      if (!country || !previousCustomer) return;

      const optimisticCustomer = {
        ...previousCustomer,
        country: country.name,
        countryId: country.id,
      };

      setCustomers((prev) =>
        prev.map((c) => (c.id === customerId ? optimisticCustomer : c))
      );

      (async () => {
        try {
          await updateCustomer(customerId, optimisticCustomer);
        } catch (err) {
          console.error(err);
          setError("Failed to update country, reverted.");
          setCustomers((prev) =>
            prev.map((c) => (c.id === customerId ? previousCustomer : c))
          );
        }
      })();
    };


  const handleEditSave = async (updatedCustomer) => {
    try {
      setSaving(true);
      setError("");
      const saved = await updateCustomer(updatedCustomer.id, updatedCustomer);
      setCustomers((prev) =>
        prev.map((c) => (c.id === saved.id ? saved : c))
      );
      setEditingCustomer(null);
      setToast("Customer updated successfully.");
      setTimeout(() => setToast(""), 2000);
    } catch (err) {
      console.error(err);
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <div className="page-inner">
        {toast && <div className="alert alert-success">{toast}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <CustomerTable
            data={customers}
            countries={countries}
            onEditClick={setEditingCustomer}
            selectedCountryIds={countryFilterIds}
            onCountryFilterChange={setCountryFilterIds}
            onInlineCountryChange={handleInlineCountryChange}
          />
        )}

        <EditCustomerModal
          open={Boolean(editingCustomer)}
          onClose={() => setEditingCustomer(null)}
          customer={editingCustomer}
          countries={countries}
          onSave={handleEditSave}
          saving={saving}
        />
      </div>
    </div>
  );
}

export default App;
