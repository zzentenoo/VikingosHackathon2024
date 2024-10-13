// src/components/Nodo/Nodo.tsx

import React from 'react';

interface Module {
    moduleNumber: number;
    moduleTitle: string;
    moduleDescription: string;
    moduleInformation: string;
}

interface NodoProps {
    module: Module;
    isLast: boolean; // To determine if it's the last node for connector line
}

const Nodo: React.FC<NodoProps> = ({ module, isLast }) => {
    return (
        <div className="relative group flex items-start">
            {/* Connector line */}
            {!isLast && (
                <div className="absolute top-4 left-3 w-1 h-full bg-gray-300"></div>
            )}
            {/* Node */}
            <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {module.moduleNumber}
                </div>
            </div>
            {/* Content */}
            <div className="ml-4 p-4 bg-white rounded shadow hover:bg-gray-50 transition relative">
                <h3 className="text-xl font-semibold">{module.moduleTitle}</h3>
                <p className="text-gray-600 mt-1">{module.moduleDescription}</p>
                {/* Tooltip */}
                <div className="absolute top-0 left-full ml-2 w-64 bg-gray-800 text-white text-sm p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                    {module.moduleInformation}
                </div>
            </div>
        </div>
    );
};

export default Nodo;
