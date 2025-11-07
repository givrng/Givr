"use client";
import React, { useEffect, useState } from "react";

type Props = {
  onChange: (value: { state: string; lga: string }) => void;
    // error: string | boolean;
  error?: { state?: string; lga?: string };
};

const LocationSelect: React.FC<Props> = ({ onChange, error }) => {
  const [states, setStates] = useState<string[]>([]);
  const [lgas, setLgas] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedLga, setSelectedLga] = useState<string>("");

  // Fetch states when component mounts
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await fetch("https://nga-states-lga.onrender.com/fetch");
        const data = await res.json();
        setStates(data);
      } catch (error) {
        console.error("Failed to fetch states:", error);
      }
    };
    fetchStates();
  }, []);

  // Fetch LGAs when a state is selected
  useEffect(() => {
    const fetchLgas = async () => {
      if (selectedState) {
        try {
          const res = await fetch(
            `https://nga-states-lga.onrender.com/?state=${selectedState}`
          );
          const data = await res.json();
          setLgas(data);
        } catch (error) {
          console.error("Failed to fetch LGAs:", error);
        }
      } else {
        setLgas([]);
      }
    };
    fetchLgas();
  }, [selectedState]);

  // Notify parent when changes occur
  useEffect(() => {
    onChange({ state: selectedState, lga: selectedLga });
  }, [selectedState, selectedLga, onChange]);



  return (
    <div className="flex flex-col gap-4">
      {/* State Select */}
      <div className="flex flex-col">
        <label className="text-xs sm:text-sm   text-[#323338]">
          Select State
        </label>
        <select
          value={selectedState}
          onChange={(e) => {
            setSelectedState(e.target.value);
            setSelectedLga("");
          }}
          className={`border rounded-md p-2 text-black ${
            error?.state ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Select State</option>
          {states.map((item, index) => (
            <option key={`${item}-${index}`} value={item}>
              {item}
            </option>
          ))}
        </select>
        {error?.state && (
          <p className="text-red-500 text-sm mt-1">Please select a state.</p>
        )}
      </div>

      {/* LGA Select */}
      <div className="flex flex-col">
        <label className="text-xs sm:text-sm   text-[#323338]">
          Select LGA
        </label>
        <select
          value={selectedLga}
          onChange={(e) => setSelectedLga(e.target.value)}
          disabled={!selectedState}
          className={`border rounded-md p-2 text-black ${
            error?.lga ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Select LGA</option>
          {lgas.map((item, index) => (
            <option key={`${item}-${index}`} value={item}>
              {item}
            </option>
          ))}
        </select>
        {error?.lga && (
          <p className="text-red-500 text-sm mt-1">Please select an LGA.</p>
        )}
      </div>
    </div>
  );
};

export default LocationSelect;
