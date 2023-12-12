import z from "zod";
import { extractValidationData } from "../../common/utils/extractErrorData.js";

const registerSchemaRepairs = z.object({
    date: z
        .string(),
    motorsNumber: z
        .number(),
    description: z
        .string()
        .min(10, { message: "Description must be at least 8 charaters" })
        .max(100, { message: "Description is too long" })
});

export function validateRepair(data) {
    const result = registerSchemaRepairs.safeParse(data);

    const {
        hasError,
        errorMessage,
        data: repairData,
    } = extractValidationData(result);

    return {
        hasError,
        errorMessage,
        repairData,
    };
}