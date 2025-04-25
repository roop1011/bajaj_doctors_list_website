
import React from "react";
import { Doctor } from "../types/doctor";
import { Button } from "./ui/button";

interface DoctorCardProps {
  doctor: Doctor;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  return (
    <div 
      className="bg-white p-4 rounded-lg shadow-sm mb-4 flex flex-col md:flex-row justify-between"
      data-testid="doctor-card"
    >
      <div className="flex">
        <div className="mr-4">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            <img 
              src={doctor.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=random`} 
              alt={doctor.name} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div>
          <h3 className="font-bold text-lg" data-testid="doctor-name">
            {doctor.name}
          </h3>
          <p className="text-gray-600" data-testid="doctor-specialty">
            {doctor.specialities.map(spec => spec.name).join(", ")}
          </p>
          <p className="text-gray-600">{doctor.doctor_introduction}</p>
          <p className="text-gray-600" data-testid="doctor-experience">
            {doctor.experience}
          </p>
          <div className="mt-2 flex flex-col sm:flex-row">
            <div className="flex items-center mr-4 text-sm mb-2 sm:mb-0">
              <svg className="w-4 h-4 mr-1 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>{doctor.clinic.name}</span>
            </div>
            <div className="flex items-center text-sm">
              <svg className="w-4 h-4 mr-1 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{doctor.clinic.address.locality}, {doctor.clinic.address.city}</span>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {doctor.video_consult && (
              <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-1">Video Consult</span>
            )}
            {doctor.in_clinic && (
              <span className="text-xs bg-green-100 text-green-800 rounded-full px-2 py-1">In Clinic</span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 md:mt-0 flex flex-col items-end justify-between">
        <div className="font-bold text-lg" data-testid="doctor-fee">{doctor.fees}</div>
        <Button className="mt-2 bg-primary text-white hover:bg-primary/90">
          Book Appointment
        </Button>
      </div>
    </div>
  );
};
