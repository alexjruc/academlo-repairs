import { envs } from "../../config/enviroments/enviroments.js";
import { AppError } from "./appError.js";
import Error from "./errors.model.js";

const handleCastError23505 = () => {
    return new AppError("Duplicated field value, please another value!", 400);
};

const sendErrorDev = (err, res) => {
    return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        err,
    });
};

const sendErrorProd = async(err, res) => {

    await Error.create({
        status: err.status,
        message: err.message,
        stack: err.stack,
    })

    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        console.log("ERROR 💥", err);
        return res.status(500).json({
            status: "fail",
            message: "Something went very wrong!💥",
        });
    }
};

export const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "fail";

    if (envs.NODE_ENV === "development") {
        sendErrorDev(err, res);
    }
    if (envs.NODE_ENV === "production") {
        let error = err;
        if (err.parent?.code === "23505") error = handleCastError23505();
        
        sendErrorProd(error, res);
    }
};
