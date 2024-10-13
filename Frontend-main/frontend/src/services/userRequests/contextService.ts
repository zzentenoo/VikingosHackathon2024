
import httpInstance from "../httpInstance.ts";
interface EvaluateContextData {
    email: string;
    text: string;
}

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

export const evaluateContext = async (
    data: EvaluateContextData
): Promise<EvaluateContextResponse> => {
    const response = await httpInstance.post<EvaluateContextResponse>(
        "user/evaluate-context/",
        data
    );
    return response.data;
};
