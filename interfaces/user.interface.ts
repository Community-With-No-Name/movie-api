export interface CreateUserType {
    full_name: string;
    email: string;
    password: string;
}

export interface LoginType {
    email: string;
    password: string;
}