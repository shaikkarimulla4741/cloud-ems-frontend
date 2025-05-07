import React from 'react';
import { 
    User, Phone, AlarmClock, Users, Plane,
    Briefcase, DollarSign, BarChart, GraduationCap, Star
  } from 'lucide-react';

const ProfilePageSidebar = ({ activeSection, onSectionChange, employee}) => {
    const sections = [
        { id: 'personal', label: 'Personal Details', icon: User },
        // { id: 'contact', label: 'Contact Details', icon: Phone },
        // { id: 'emergency', label: 'Emergency Contact', icon: AlarmClock },
        // { id: 'dependents', label: 'Dependents', icon: Users },
        // { id: 'immigration', label: 'Immigration', icon: Plane },
        // { id: 'job', label: 'Job', icon: Briefcase },
        // { id: 'salary', label: 'Salary', icon: DollarSign },
        // { id: 'report', label: 'Report-to', icon: BarChart },
        // { id: 'qualifications', label: 'Qualifications', icon: GraduationCap },
        // { id: 'memberships', label: 'Memberships', icon: Star }
    ];

    return (
      <div className='w-64 border-r border-gray-200'style={{
        background: " #bbdefb",
      }}>
        <div className="flex flex-col h-full">
            {/* Profile Header Section */}
            <div className="relative px-6 pt-8 pb-6 text-center border-b border-gray-100">
                <div className="relative mx-auto mb-4">
                    {/* Profile Image */}
                    <div className="relative w-32 h-32 mx-auto">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full opacity-10 animate-pulse" />
                            <div className="relative w-full h-full rounded-full bg-white p-1 ring-2 ring-blue-100 shadow-lg">
                                <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-50 to-white flex items-center justify-center overflow-hidden">
                                    {employee?.profileImage ? (
                                    <img
                                        src={employee.profileImage}
                                        alt={employee?.name}
                                        className="w-full h-full object-cover"
                                    />
                                    ) : (
                                    <User 
                                        className="w-16 h-16 text-gray-400" 
                                        strokeWidth={1.5} 
                                    />
                                    )}
                                </div>
                            </div>
                    </div>

                    {/* Name and Role */}
                    <div className="mt-6">
                        <h2 className="text-lg font-semibold text-gray-900">
                            {employee?.name || 'Loading...'}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {employee?.role || 'Role not specified'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation Section */}
            <nav className="flex-1 overflow-y-auto px-3 py-4">
                <div className="space-y-1">
                    {sections.map(section => {
                        const Icon = section.icon;
                        const isActive = activeSection === section.id;
              
                        return (
                            <button
                                key={section.id}
                                onClick={() => onSectionChange(section.id)}
                                className={`
                                    w-full flex items-center px-3 py-2.5 rounded-lg transition-all duration-200
                                    group relative overflow-hidden
                                    ${isActive 
                                        ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 font-medium' 
                                        : 'text-gray-600 hover:bg-blue-50'
                                    }
                                `}
                            >
                                {/* Hover Effect Background */}
                                <div className={`
                                    absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent
                                    transition-opacity duration-200
                                    ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}
                                `} />
                                {/* Icon and Label Container */}
                                <div className="relative flex items-center w-full">
                                    <div className={`
                                        flex items-center justify-center w-8 h-8 rounded-md mr-3
                                        ${isActive 
                                            ? 'bg-blue-100 text-blue-600' 
                                            : 'text-gray-400 group-hover:text-blue-600'
                                        }
                                    `}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <span className="flex-1">{section.label}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </nav>   
        </div>  
      </div>
    );
}

export default ProfilePageSidebar;