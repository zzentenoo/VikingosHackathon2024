// src/pages/LearningPath/LearningPathPage.tsx

import React from 'react';
import { Tree } from "../../components";
import { LogButton } from "../../components";
import { useNavigate, useLocation } from "react-router-dom";
import {ROUTES} from "../../routes";
import finpalImage from "/pal_icon_happy.png";

// Define the default responseFin object (optional fallback)
const responseFin = {
    "pathType": "Control financiero",
    "path": [
        {
            "moduleNumber": 1,
            "moduleTitle": "Identifica tus gastos hormiga",
            "moduleDescription": "Aprende a identificar los pequeños gastos que se te van sin darte cuenta.",
            "moduleInformation": "En este módulo, aprenderás a identificar los gastos hormiga, aquellos pequeños gastos que se te van sin darte cuenta y que pueden afectar significativamente a tu economía. Aprenderás a clasificarlos y a tomar medidas para reducirlos o eliminarlos."
        },
        // Add more modules as needed
    ]
};

interface Module {
    moduleNumber: number;
    moduleTitle: string;
    moduleDescription: string;
    moduleInformation: string;
}

interface EvaluateContextResponse {
    pathType: string;
    path: Module[];
}

const LearningPathPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Extract data from navigation state
    const state = location.state as { data: EvaluateContextResponse } | undefined;
    const data = state?.data || responseFin; // Use dynamic data or fallback to static

    // Optional: Log the received data for debugging
    console.log("LearningPathPage received data:", data);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 font-rubik bg-gray-100">
            <h1 className="text-4xl mb-6">Learning Path</h1>
            <Tree data={data}/>
            <LogButton
                color="bg-gray-400 text-lg text-white mt-6"
                onClick={() => navigate(-1)}
            >
                BACK
            </LogButton>
            <div
                className="fixed bottom-4 right-4 cursor-pointer"
                onClick={() => navigate(ROUTES.CHATBOT)} // Adjust the route as per your routing setup
            >
                <img src={finpalImage} alt="FinPal" className="w-16 h-16" draggable="false"/>
            </div>
        </div>
    );
};

export default LearningPathPage;
