export enum Role {
    MANAGER = 'MANAGER',
    EMPLOYEE = 'EMPLOYEE',

}

export enum Department {
    DEVELOPER = 'DEVELOPER',
    SALES = 'SALES',
    ACCOUNTS = 'ACCOUNTS',
    TECHNICIAN = 'TECHNICIAN',
    HR = 'HR'
}

export interface RegisterRequest {
    firstname?: string;
    lastname?: string;
    email?: string;
    password?: string;
    mfaEnabled?: boolean;
    role?: Role;
    department?: Department;
}


export interface AuthenticationRequest {
    email?: string;
    password?: string;
}

export interface AuthenticationResponse {
    success?: boolean;
    statusCode?: string;
    message?: string;
    data?: {
        accessToken?: string;
        mfaEnabled?: boolean;
        secretImageUri?: string;
    }
}

export interface VerificationRequest {
    email?: string;
    code?: string;
}
