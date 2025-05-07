import React from 'react';

const FormField = ({ 
    label, 
    value, 
    required, 
    type = 'text',
    className = '',
  }) => (
    <div className={`mb-6 ${className}`}>
        <label className='block text-lg font-bold text-gray-700 mb-1'>
            {label}
            {required && <span className='text-red-500 ml-1'></span>}
        </label>
        <input
          type={type}
          value={value || ''}
          readOnly
          className="w-full py-2 bg-transparent text-gray-700 focus:outline-none focus:ring-0 "
        />
    </div>
);

export default FormField;





// import React from 'react';
// import { Calendar } from 'lucide-react';

// const FormField = ({ 
//     label, 
//     value, 
//     required, 
//     type = 'text',
//     className = '',
//     hasCalendar = false,
//     hasDropdown = false 
//   }) => (
//     <div className={`mb-6 ${className}`}>
//         <label className='block text-sm font-medium text-gray-700 mb-1'>
//             {label}
//             {required && <span className='text-red-500 ml-1'></span>}
//         </label>
//         <div className="relative">
//         <input
//           type={type}
//           value={value || ''}
//           readOnly
//           className={`w-full px-3 py-2 border border-gray-200 rounded-md bg-white text-gray-700
//             ${hasCalendar || hasDropdown ? 'pr-10' : ''}`}
//         />
//         {hasCalendar && (
//           <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
//         )}
//         {hasDropdown && (
//           <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//             </svg>
//           </div>
//         )}
//       </div>
//     </div>
// )

// export default FormField;