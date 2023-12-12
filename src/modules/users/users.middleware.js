import { AppError } from "../../common/errors/appError.js";
import { catchAsync } from "../../common/errors/catchAsync.js";
import { envs } from "../../config/enviroments/enviroments.js";
import { UserService } from "./users.service.js";
import jwt from "jsonwebtoken";
//import { promisify } from "util";

export const validateExistUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const user = await UserService.findOne(id);

    if (!user) {
        return next(new AppError(`User with id: ${id} found`, 404));
    }

    req.user = user;
    next();
});

export const protect = catchAsync(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return next(
            new AppError("You are not logged in!, please login to access", 401)
        );
    }

    const decoded = jwt.verify(token, envs.SECRET_JWT_SEED);

    const user = await UserService.findOne(decoded.id);

    if (!user) {
        return next(
            new AppError("The owner of this token in not longer available", 401)
        );
    }

    //

    req.sessionUser = user;
    next();
});
