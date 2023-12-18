import { AppError } from "../../common/errors/appError.js";
import { catchAsync } from "../../common/errors/catchAsync.js";
import { RepairService } from "./repairs.service.js";

export const validateExistRepair = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const repair = await RepairService.findOne(id, [
        "pending",
        "completed",
        "cancelled",
    ]);

    if (!repair) {
        return next(new AppError(`Repair with id:${id} not found`, 404));
    }

    if (repair?.status !== "pending") {
        if (repair?.status === "completed") {
            return next(
                new AppError("The repair has been already completed", 400)
            );
        } else {
            return next(
                new AppError(`Repair with id:${id} is not pending`, 404)
            );
        }
    }

    req.repair = repair;
    next();
});

export const validateRolUser = catchAsync(async (req, res, next) => {
    const { sessionUser } = req
    
    if (sessionUser.role === 'client') {
        return next(new AppError("You do not have the necessary permissions to access this page", 403))
    }

    next()
})