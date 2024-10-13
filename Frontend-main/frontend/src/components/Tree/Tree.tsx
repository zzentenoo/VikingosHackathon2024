// src/components/Tree/Tree.tsx

import React from 'react';
import { Nodo } from "../Nodo";

interface Module {
    moduleNumber: number;
    moduleTitle: string;
    moduleDescription: string;
    moduleInformation: string;
}

interface TreeProps {
    data: {
        pathType: string;
        path: Module[];
    };
}

const Tree: React.FC<TreeProps> = ({ data }) => {
    console.log('Tree component received data:', data); // Debugging statement

    if (!data) {
        return <div>Loading...</div>; // Or any loading indicator
    }

    const { pathType, path } = data;

    if (!Array.isArray(path)) {
        return <div>Error: Path data is not available.</div>;
    }

    return (
        <div className="w-full max-w-2xl">
            <h2 className="text-2xl mb-6 text-center">Tipo de Camino: {pathType}</h2>
            <div className="relative pl-6">
                {/* Vertical line */}
                <div className="absolute top-0 left-3 w-1 bg-gray-300 h-full"></div>
                <div className="space-y-8">
                    {path.length > 0 ? (
                        path.map((module, index) => (
                            <Nodo key={module.moduleNumber} module={module} isLast={index === path.length - 1} />
                        ))
                    ) : (
                        <div>No modules available.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Tree;
