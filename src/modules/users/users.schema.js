import z from "zod";
import { extractValidationData } from "../../common/utils/extractErrorData.js";

const registerSchemaUsers = z.object({
    name: z
        .string({
            invalid_type_error: "Name must be a correct format!",
            required_error: "Name is required!",
        })
        .min(2, { message: "Name is too short" })
        .max(50, { message: "Name is too long" }),

    email: z.string().email({ message: "Invalid email" }),

    password: z
        .string()
        .min(8, { message: "Password must be at least 8 charaters" })
        .max(20, { message: "Password is too long" }),
    
    role: z.enum(['client', 'employee'])
});

const updateSchemaUsers = z.object({
    name: z
        .string({
            invalid_type_error: "Name must be a correct format!",
            required_error: "Name is required!",
        })
        .min(2, { message: "Name is too short" })
        .max(50, { message: "Name is too long" }),

    email: z.string().email({ message: "Invalid email" }),
});

const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email" }),

    password: z
        .string()
        .min(8, { message: "Password must be at least 8 charaters" })
        .max(20, { message: "Password is too long" }),
});

export function validateUser(data) {
    const result = registerSchemaUsers.safeParse(data);

    const {
        hasError,
        errorMessage,
        data: userData,
    } = extractValidationData(result);

    return {
        hasError,
        errorMessage,
        userData,
    };
}

export function validateUpdateUser(data) {
    const result = updateSchemaUsers.safeParse(data);

    const {
        hasError,
        errorMessage,
        data: userData,
    } = extractValidationData(result);

    return {
        hasError,
        errorMessage,
        userData,
    };
}

export function validateLoginUser(data) {
    const result = loginSchema.safeParse(data);

    const {
        hasError,
        errorMessage,
        data: userData,
    } = extractValidationData(result);

    return {
        hasError,
        errorMessage,
        userData,
    };
}


