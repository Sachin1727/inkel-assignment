import { useState, useRef, useEffect } from "react";

export default function CountryFilter({
  countries,
  selectedIds,
  onChange,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const toggleCountry = (id) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((x) => x !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  return (
    <div className="filter-wrapper" ref={ref}>
      <button
        type="button"
        className={`icon-button filter-button ${
            selectedIds.length ? "filter-active" : ""
        }`}
        onClick={() => setOpen((o) => !o)}
        title="Filter by country"
        >
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
       <path d="M3 4h18l-7 8v6l-4 2v-8L3 4z" />
    </svg>
    </button>


      {open && (
        <div className="filter-popover">
          {countries.map((c) => (
            <label key={c.id} className="filter-option">
              <input
                type="checkbox"
                checked={selectedIds.includes(c.id)}
                onChange={() => toggleCountry(c.id)}
              />
              <span>{c.name}</span>
            </label>
          ))}
          {countries.length === 0 && (
            <div className="filter-empty">No countries</div>
          )}
        </div>
      )}
    </div>
  );
}
