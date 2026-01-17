import React from "react";

const Footer: React.FC = () => {
  return (
    <div className="text-center py-4 text-gray-400 text-sm border-t border-gray-800 mt-24">
      Copyright &copy; {new Date().getFullYear()} Gensite - STACKbyArnold. All
      rights reserved.
    </div>
  );
};

export default Footer;
