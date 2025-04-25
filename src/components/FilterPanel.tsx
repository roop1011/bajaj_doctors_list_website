
import React from "react";
import { Checkbox } from "./ui/checkbox";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FilterPanelProps {
  specialties: string[];
  selectedSpecialties: string[];
  consultationType: string | null;
  sortBy: string | null;
  onSpecialtyChange: (specialty: string) => void;
  onConsultationTypeChange: (type: string) => void;
  onSortChange: (sort: string) => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  specialties,
  selectedSpecialties,
  consultationType,
  sortBy,
  onSpecialtyChange,
  onConsultationTypeChange,
  onSortChange,
}) => {
  const [specialtiesOpen, setSpecialtiesOpen] = React.useState(true);
  const [consultationOpen, setConsultationOpen] = React.useState(true);
  const [sortOpen, setSortOpen] = React.useState(true);

  return (
    <div className="w-full lg:w-64 bg-white rounded-md p-4 shadow">
      <h2 className="font-bold text-lg mb-4">Filters</h2>

      {/* Specialties Filter */}
      <div className="mb-4 border-b pb-2">
        <div 
          className="flex justify-between items-center cursor-pointer mb-2"
          onClick={() => setSpecialtiesOpen(!specialtiesOpen)}
          data-testid="filter-header-speciality"
        >
          <h3 className="font-medium">Specialities</h3>
          {specialtiesOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
        
        {specialtiesOpen && (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {specialties.map((specialty) => (
              <div key={specialty} className="flex items-center space-x-2">
                <Checkbox 
                  id={`filter-specialty-${specialty}`}
                  checked={selectedSpecialties.includes(specialty)}
                  onCheckedChange={() => onSpecialtyChange(specialty)}
                  data-testid={`filter-specialty-${specialty}`}
                />
                <Label 
                  htmlFor={`filter-specialty-${specialty}`}
                  className="text-sm"
                >
                  {specialty}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Consultation Type Filter */}
      <div className="mb-4 border-b pb-2">
        <div 
          className="flex justify-between items-center cursor-pointer mb-2"
          onClick={() => setConsultationOpen(!consultationOpen)}
          data-testid="filter-header-moc"
        >
          <h3 className="font-medium">Mode of consultation</h3>
          {consultationOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
        
        {consultationOpen && (
          <RadioGroup 
            value={consultationType || ""} 
            onValueChange={onConsultationTypeChange}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem 
                value="Video Consult" 
                id="video-consult"
                data-testid="filter-video-consult" 
              />
              <Label htmlFor="video-consult" className="text-sm">Video Consult</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem 
                value="In Clinic" 
                id="in-clinic"
                data-testid="filter-in-clinic" 
              />
              <Label htmlFor="in-clinic" className="text-sm">In Clinic</Label>
            </div>
          </RadioGroup>
        )}
      </div>

      {/* Sort Filter */}
      <div className="mb-4">
        <div 
          className="flex justify-between items-center cursor-pointer mb-2"
          onClick={() => setSortOpen(!sortOpen)}
          data-testid="filter-header-sort"
        >
          <h3 className="font-medium">Sort by</h3>
          {sortOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
        
        {sortOpen && (
          <RadioGroup 
            value={sortBy || ""} 
            onValueChange={onSortChange}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem 
                value="fees" 
                id="sort-fees"
                data-testid="sort-fees" 
              />
              <Label htmlFor="sort-fees" className="text-sm">Fees (Low to High)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem 
                value="experience" 
                id="sort-experience"
                data-testid="sort-experience" 
              />
              <Label htmlFor="sort-experience" className="text-sm">Experience (High to Low)</Label>
            </div>
          </RadioGroup>
        )}
      </div>
    </div>
  );
};
