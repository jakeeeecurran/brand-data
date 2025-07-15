import React, { useState } from "react";

const REGIONS = [
  { label: "Sunshine Coast", value: "sunshine_coast" },
  { label: "Kingaroy", value: "kingaroy" },
  { label: "Hervey Bay", value: "hervey_bay" },
];

const SUNSHINE_LOCATIONS = [
  { label: "Maroochydore", value: "maroochydore" },
  { label: "Caloundra", value: "caloundra" },
];

const BRANDS = {
  maroochydore: [
    "Audi", "Volvo", "MG", "LDV", "Cupra", "Hyundai", "Nissan", "GMSV", "Used", "Mahindra", "Polaris", "Jeep", "IM by MG", "Chery", "Polestar", "Leapmotor"
  ],
  caloundra: [
    "Hyundai", "Nissan", "LDV", "MG", "Chery", "Used"
  ],
  kingaroy: [
    "Ford", "Hyundai", "Nissan", "GWM", "Mitsubishi", "Used"
  ],
  hervey_bay: [
    "Nissan", "GWM", "Isuzu", "Kia", "Mahindra", "Honda", "Used"
  ]
};

const initialState = {
  region: "",
  location: "",
  brand: "",
  stockNumber: "",
  vehicleDescription: "",
  buildCompliance: "",
  kilometres: "",
  timeInStock: "",
  feature1: "",
  feature2: "",
  feature3: "",
  feature4: "",
  wasPrice: "",
  nowPrice: "",
  callToAction: "",
};

function App() {
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const region = e.target.value;
    setForm((prev) => ({ ...prev, region, location: "", brand: "" }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const location = e.target.value;
    setForm((prev) => ({ ...prev, location, brand: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // TODO: Replace with Google Sheets or webhook endpoint
    await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSubmitting(false);
    setSubmitted(true);
    setForm(initialState);
  };

  // Determine which brand options to show
  let brandOptions: string[] = [];
  if (form.region === "sunshine_coast" && form.location) {
    brandOptions = BRANDS[form.location as keyof typeof BRANDS] || [];
  } else if (form.region === "kingaroy") {
    brandOptions = BRANDS.kingaroy;
  } else if (form.region === "hervey_bay") {
    brandOptions = BRANDS.hervey_bay;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-2">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Dealership Radio Ad Data</h1>
        {submitted && (
          <div className="mb-4 p-2 bg-green-100 text-green-800 rounded text-center">
            Form submitted successfully!
          </div>
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Region */}
          <div>
            <label className="block font-medium mb-1">Dealership Region</label>
            <select
              name="region"
              value={form.region}
              onChange={handleRegionChange}
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
            >
              <option value="">Select region...</option>
              {REGIONS.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          {/* Location (if Sunshine Coast) */}
          {form.region === "sunshine_coast" && (
            <div>
              <label className="block font-medium mb-1">Location</label>
              <select
                name="location"
                value={form.location}
                onChange={handleLocationChange}
                required
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              >
                <option value="">Select location...</option>
                {SUNSHINE_LOCATIONS.map((loc) => (
                  <option key={loc.value} value={loc.value}>{loc.label}</option>
                ))}
              </select>
            </div>
          )}

          {/* Brand */}
          {brandOptions.length > 0 && (
            <div>
              <label className="block font-medium mb-1">Brand</label>
              <select
                name="brand"
                value={form.brand}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              >
                <option value="">Select brand...</option>
                {brandOptions.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          )}

          {/* Show rest of form only after brand is selected */}
          {form.brand && (
            <>
              <div>
                <label className="block font-medium mb-1">Stock Number</label>
                <input
                  type="text"
                  name="stockNumber"
                  value={form.stockNumber}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Vehicle Description (Brand, Model, Spec)</label>
                <input
                  type="text"
                  name="vehicleDescription"
                  value={form.vehicleDescription}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1">
                  <label className="block font-medium mb-1">Build & Compliance</label>
                  <input
                    type="text"
                    name="buildCompliance"
                    value={form.buildCompliance}
                    onChange={handleChange}
                    required
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="flex-1">
                  <label className="block font-medium mb-1">Kilometres</label>
                  <input
                    type="number"
                    name="kilometres"
                    value={form.kilometres}
                    onChange={handleChange}
                    required
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1">
                  <label className="block font-medium mb-1">Time in Stock</label>
                  <input
                    type="text"
                    name="timeInStock"
                    value={form.timeInStock}
                    onChange={handleChange}
                    required
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium mb-1">Feature 1</label>
                  <input
                    type="text"
                    name="feature1"
                    value={form.feature1}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Feature 2</label>
                  <input
                    type="text"
                    name="feature2"
                    value={form.feature2}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Feature 3</label>
                  <input
                    type="text"
                    name="feature3"
                    value={form.feature3}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Feature 4</label>
                  <input
                    type="text"
                    name="feature4"
                    value={form.feature4}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1">
                  <label className="block font-medium mb-1">Was Price</label>
                  <input
                    type="text"
                    name="wasPrice"
                    value={form.wasPrice}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="flex-1">
                  <label className="block font-medium mb-1">Now Price</label>
                  <input
                    type="text"
                    name="nowPrice"
                    value={form.nowPrice}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1">Call to Action / ARMS</label>
                <textarea
                  name="callToAction"
                  value={form.callToAction}
                  onChange={handleChange}
                  rows={2}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default App;
