import { useEffect, useState, useRef } from "react";

function CountryDropdown({ countries, countryId, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selectedCountry =
    countries.find((c) => c.id === countryId) || null;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (id) => {
    onChange(id);
    setOpen(false);
  };

  return (
    <div className="country-dd-wrapper" ref={ref}>
      <button
        type="button"
        className="text-input country-dd-trigger"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="country-dd-label">
          {selectedCountry ? selectedCountry.name : "Select country"}
        </span>
        <span className="country-dd-arrow">▾</span>
      </button>

      {open && (
        <div className="country-dd-panel">
          {countries.map((c) => (
            <button
              key={c.id}
              type="button"
              className="country-dd-option"
              onClick={() => handleSelect(c.id)}
            >
              <span className="country-dd-icon" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin-icon lucide-map-pin">
                <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
                <circle cx="12" cy="10" r="3"/>
                </svg>
              </span>
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


export default function EditCustomerModal({
  open,
  onClose,
  customer,
  countries,
  onSave,
  saving,
}) {
  const [name, setName] = useState("");
  const [countryId, setCountryId] = useState("");

  useEffect(() => {
    if (customer) {
      setName(customer.name ?? "");
      if (customer.countryId) {
        setCountryId(customer.countryId);
      } else if (customer.country) {
        const match =
          countries.find((c) => c.name === customer.country) || null;
        setCountryId(match ? match.id : "");
      } else {
        setCountryId("");
      }
    }
  }, [customer, countries]);

  if (!open || !customer) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedCountry = countries.find((c) => c.id === countryId) || null;
    onSave({
      ...customer,
      name,
      country: selectedCountry ? selectedCountry.name : customer.country,
      countryId: selectedCountry ? selectedCountry.id : customer.countryId,
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Edit Customer</h2>
          <button className="icon-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label>
              Name <span className="required">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-input"
              placeholder="Customer name"
              required
            />
          </div>

          <div className="form-group">
            <label>Country</label>
            <CountryDropdown
                countries={countries}
                countryId={countryId}
                onChange={(id) => setCountryId(id)}
            />
        </div>




          <div className="modal-footer">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button type="submit" className="primary-button" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
