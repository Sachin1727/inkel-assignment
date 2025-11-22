import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState, useRef, useEffect } from "react";
import CountryFilter from "./CountryFilter";

function InlineCountrySelect({ rowData, countries, onInlineCountryChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentName = rowData.country;
  const currentCountry =
    countries.find((c) => c.name === currentName) || null;
  const currentId = currentCountry ? currentCountry.id : "";

  const handleSelect = (countryId) => {
    if (!countryId || countryId === currentId) {
      setOpen(false);
      return;
    }
    onInlineCountryChange(rowData.id, countryId);
    setOpen(false);
  };

  return (
    <div className="inline-select-wrapper" ref={ref}>
      <button
        type="button"
        className="inline-select-trigger"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="inline-select-label">
          {currentName || "Select"}
        </span>
        <span className="inline-select-arrow">
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
</span>

      </button>

      {open && (
        <div className="inline-select-dropdown">
          {countries.map((c) => {
            const checked = currentId === c.id;
            return (
              <label key={c.id} className="inline-select-option">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleSelect(c.id)}
                />
                <span>{c.name}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}


export default function CustomerTable({
  data,
  countries,
  onEditClick,
  selectedCountryIds,
  onCountryFilterChange,
  onInlineCountryChange,
}) {
  const filteredData = useMemo(() => {
    if (!selectedCountryIds.length) return data;
    const allowedNames = new Set(
      countries
        .filter((c) => selectedCountryIds.includes(c.id))
        .map((c) => c.name)
    );
    return data.filter((row) => allowedNames.has(row.country));
  }, [data, countries, selectedCountryIds]);

  const columns = useMemo(
    () => [
      {
        header: "Entity",
        accessorKey: "name",
        cell: ({ getValue }) => {
            const raw = getValue() || "";
            const formatted = raw
                .split(" ")
                .filter(Boolean)
                .map(
                (word) =>
                    word.charAt(0).toUpperCase() +
                    word.slice(1).toLowerCase()
                )
                .join(" ");

            return <span className="customer-name">{formatted}</span>;
        },
      },
      {
        header: "Gender",
        accessorKey: "gender",
        cell: ({ getValue }) => {
        const raw = getValue() || "";
        const normalized = raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();

        return (
            <span
            className={`badge ${
                normalized === "Male" ? "badge-male" : "badge-female"
            }`}
            >
            {normalized}
            </span>
        );
        },
      },
      {
        header: "Request date",
        accessorKey: "requestDate",
        cell: ({ getValue }) => {
          const raw = getValue();
          const d = raw ? new Date(raw) : null;
          return d
            ? d.toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })
            : "-";
        },
      },
      {
        header: () => (
            <div className="th-country-header">
            <span>Country</span>
            <CountryFilter
                countries={countries}
                selectedIds={selectedCountryIds}
                onChange={onCountryFilterChange}
            />
            </div>
        ),
        accessorKey: "country",
        cell: ({ row }) => (
            <InlineCountrySelect
            rowData={row.original}
            countries={countries}
            onInlineCountryChange={onInlineCountryChange}
            />
        ),
      },

      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
            <button
            className="icon-button"
            onClick={() => onEditClick(row.original)}
            title="Edit"
            >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-pen-icon lucide-square-pen">
            <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/>
            </svg>
            </button>
        ),
    },
    ],
    [onEditClick, countries, onInlineCountryChange, selectedCountryIds, onCountryFilterChange]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="table-card">
      <div className="table-header-row">
        <h1 className="table-title">Customers</h1>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="table-empty">
                    <div className="empty-state">
                    <p>No customers match the current filters.</p>
                    <button
                        className="secondary-button"
                        type="button"
                        onClick={() => onCountryFilterChange([])}
                    >
                        Clear country filters
                    </button>
                    </div>
                </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
