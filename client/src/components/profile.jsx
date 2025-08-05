// import React, { useState } from "react";
// import { FaUserCircle } from "react-icons/fa";

// export default function ProfileDropdown() {
//   const [open, setOpen] = useState(false);

//   return (
//     <div className="relative inline-block text-left">
//       {/* Profile Icon */}
//       <button
//         onClick={() => setOpen(!open)}
//         className="text-3xl text-gray-700 focus:outline-none"
//       >
//         <FaUserCircle />
//       </button>

//       {/* Dropdown Menu */}
//       {open && (
//         <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-50">
//           <ul className="py-2 text-sm text-gray-700">
//             <li>
//               <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
//                 Account Name
//               </button>
//             </li>
//             <li>
//               <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
//                 Plans & Billing
//               </button>
//             </li>
//             <li>
//               <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
//                 Add Account
//               </button>
//             </li>
//             <li>
//               <button className="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600 font-semibold">
//                 Sign Out
//               </button>
//             </li>
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }
