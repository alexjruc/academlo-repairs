import { AppError } from "../../common/errors/appError.js";
import { catchAsync } from "../../common/errors/catchAsync.js";
import { verifyPassword } from "../../config/plugins/encripted.password.plugins.js";
import generateJWT from "../../config/plugins/generate.jwt.plugin.js";
import {
    validateLoginUser,
    validateUpdateUser,
    validateUser,
} from "./users.schema.js";
import { UserService } from "./users.service.js";

export const register = catchAsync(async (req, res) => {
    const { hasError, errorMessage, userData } = validateUser(req.body);

    if (hasError) {
        return res.status(422).json({
            status: "error",
            message: errorMessage,
        });
    }

    const user = await UserService.create(userData);

    const token = await generateJWT(user.id);

    return res.status(201).json({
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });
});

export const login = catchAsync(async (req, res, next) => {
    const { hasError, errorMessage, userData } = validateLoginUser(req.body);

    if (hasError) {
        return res.status(422).json({
            status: "error",
            message: errorMessage,
        });
    }

    const user = await UserService.findOneByEmail(userData.email);

    if (!user) {
        return next(new AppError("This account does not exit!", 404));
    }

    const isCorrectPassword = await verifyPassword(
        userData.password,
        user.password
    );

    if (!isCorrectPassword) {
        return next(new AppError("Incorrect emil or password", 401));
    }

    const token = await generateJWT(user.id);

    return res.status(200).json({
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });
});

export const findAllUsers = catchAsync(async (req, res) => {
    const users = await UserService.findAll();

    return res.status(200).json(users);
});

export const findOneUser = catchAsync(async (req, res) => {
    const { user } = req;

    return res.status(200).json(user);
});

export const updateUser = catchAsync(async (req, res) => {
    const { user } = req;

    const { hasError, errorMessage, userData } = validateUpdateUser(req.body);

    if (hasError) {
        return res.status(422).json({
            status: "error",
            message: errorMessage,
        });
    }

    const userUpdated = await UserService.update(user, userData);

    return res.status(200).json(userUpdated);
});

export const deleteUser = catchAsync(async (req, res) => {
    const { user } = req;

    await UserService.delete(user);

    return res.status(204).json(null);
});
