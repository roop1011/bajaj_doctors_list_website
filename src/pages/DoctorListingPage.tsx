import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchDoctors } from "../services/doctorService";
import { Doctor } from "../types/doctor";
import { FilterPanel } from "../components/FilterPanel";
import { DoctorCard } from "../components/DoctorCard";
import { SearchBar } from "../components/SearchBar";

const DoctorListingPage = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [specialties, setSpecialties] = useState<string[]>([]);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [consultationType, setConsultationType] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  useEffect(() => {
    const loadDoctors = async () => {
      try {
        setLoading(true);
        const data = await fetchDoctors();
        setDoctors(data);
        setFilteredDoctors(data);
        
        const allSpecialties = new Set<string>();
        data.forEach(doctor => {
          doctor.specialities.forEach(spec => {
            allSpecialties.add(spec.name);
          });
        });
        setSpecialties(Array.from(allSpecialties).sort());
        
        setLoading(false);
      } catch (err) {
        setError("Failed to load doctor data");
        setLoading(false);
        console.error(err);
      }
    };
    
    loadDoctors();
  }, []);
  
  useEffect(() => {
    const specialtiesFromUrl = searchParams.getAll("specialty");
    const consultationFromUrl = searchParams.get("consultation");
    const sortByFromUrl = searchParams.get("sort");
    const searchTermFromUrl = searchParams.get("search");
    
    if (specialtiesFromUrl.length > 0) {
      setSelectedSpecialties(specialtiesFromUrl);
    }
    
    if (consultationFromUrl) {
      setConsultationType(consultationFromUrl);
    }
    
    if (sortByFromUrl) {
      setSortBy(sortByFromUrl);
    }
    
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [searchParams]);
  
  useEffect(() => {
    if (doctors.length === 0) return;
    
    let filtered = [...doctors];
    
    if (searchTerm) {
      filtered = filtered.filter(doctor => 
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedSpecialties.length > 0) {
      filtered = filtered.filter(doctor => 
        doctor.specialities.some(specialty => 
          selectedSpecialties.includes(specialty.name)
        )
      );
    }
    
    if (consultationType === "Video Consult") {
      filtered = filtered.filter(doctor => doctor.video_consult);
    } else if (consultationType === "In Clinic") {
      filtered = filtered.filter(doctor => doctor.in_clinic);
    }
    
    if (sortBy === "fees") {
      filtered.sort((a, b) => parseInt(a.fees.replace(/[^0-9]/g, '')) - parseInt(b.fees.replace(/[^0-9]/g, '')));
    } else if (sortBy === "experience") {
      filtered.sort((a, b) => parseInt(b.experience) - parseInt(a.experience));
    }
    
    setFilteredDoctors(filtered);
    
    const params = new URLSearchParams();
    
    selectedSpecialties.forEach(specialty => {
      params.append("specialty", specialty);
    });
    
    if (consultationType) {
      params.set("consultation", consultationType);
    }
    
    if (sortBy) {
      params.set("sort", sortBy);
    }
    
    if (searchTerm) {
      params.set("search", searchTerm);
    }
    
    setSearchParams(params);
  }, [doctors, selectedSpecialties, consultationType, sortBy, searchTerm, setSearchParams]);
  
  const handleSpecialtyChange = (specialty: string) => {
    setSelectedSpecialties(prev => 
      prev.includes(specialty)
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    );
  };
  
  const handleConsultationTypeChange = (type: string) => {
    setConsultationType(prev => prev === type ? null : type);
  };
  
  const handleSortChange = (sort: string) => {
    setSortBy(prev => prev === sort ? null : sort);
  };
  
  const handleSearch = (doctorName: string) => {
    setSearchTerm(doctorName);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-primary p-4 flex justify-center items-center">
        <SearchBar doctors={doctors} onSearch={handleSearch} />
      </div>
      
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/4">
            <FilterPanel 
              specialties={specialties}
              selectedSpecialties={selectedSpecialties}
              consultationType={consultationType}
              sortBy={sortBy}
              onSpecialtyChange={handleSpecialtyChange}
              onConsultationTypeChange={handleConsultationTypeChange}
              onSortChange={handleSortChange}
            />
          </div>
          
          <div className="lg:w-3/4">
            {loading ? (
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2">Loading doctors...</p>
              </div>
            ) : error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <p>{error}</p>
              </div>
            ) : filteredDoctors.length === 0 ? (
              <div className="bg-white p-10 rounded-lg shadow-sm text-center">
                <p className="text-lg text-gray-600">No doctors found matching your criteria.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDoctors.map(doctor => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorListingPage;
