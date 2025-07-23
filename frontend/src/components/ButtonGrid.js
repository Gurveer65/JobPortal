import React from "react";

const operations = [
  "Post Job",
  "Upload Resume",
  "View Jobs",
  "View Resumes",
  "Match Resume to Jobs",
  "Fetch Online Jobs",
  "Profile",
  "Reports",
];

const ButtonGrid = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
      {operations.map((op, index) => (
        <button
          key={index}
          className="bg-blue-600 text-white p-4 rounded shadow hover:bg-blue-700"
        >
          {op}
        </button>
      ))}
    </div>
  );
};

export default ButtonGrid;
