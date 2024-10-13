import httpInstance from "../httpInstance.ts";

interface SignUpData {
    email: string;
    password: string;
}

interface SignUpResponse {
    message: string;
    user_id: string;
}

interface LogInData {
    email: string;
    password: string;
}

interface LogInResponse {
    message: string;
    user_id: string;
}

export const signUp = async (data: SignUpData): Promise<SignUpResponse> => {
    const response = await httpInstance.post<SignUpResponse>("user/signup/", data);
    return response.data;
};

export const logIn = async (data: LogInData): Promise<LogInResponse> => {
    const response = await httpInstance.post<LogInResponse>("user/login/", data);
    return response.data;
};
