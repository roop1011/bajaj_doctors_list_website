
import React, { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { Doctor } from "../types/doctor";

interface SearchBarProps {
  doctors: Doctor[];
  onSearch: (doctorName: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ doctors, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Doctor[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);

    if (term.length > 0) {
      const filteredDoctors = doctors
        .filter((doctor) =>
          doctor.name.toLowerCase().includes(term.toLowerCase())
        )
        .slice(0, 3); // Limit to top 3 matches

      setSuggestions(filteredDoctors);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (doctorName: string) => {
    setSearchTerm(doctorName);
    onSearch(doctorName);
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(searchTerm);
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full max-w-3xl" ref={suggestionRef}>
      <form onSubmit={handleSubmit} className="relative">
        <Input
          type="text"
          placeholder="Search Symptoms, Doctors, Specialties, Clinics"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 pr-4 py-2 rounded-md w-full"
          data-testid="autocomplete-input"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          <Search size={18} />
        </button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md overflow-hidden">
          <ul className="py-1">
            {suggestions.map((doctor) => (
              <li key={doctor.id} data-testid="suggestion-item">
                <button
                  className="px-4 py-2 w-full text-left hover:bg-gray-100"
                  onClick={() => handleSelectSuggestion(doctor.name)}
                >
                  {doctor.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
