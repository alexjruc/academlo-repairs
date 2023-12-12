import { AppError } from "../../common/errors/appError.js";
import { catchAsync } from "../../common/errors/catchAsync.js";
import { validateRepair } from "./repairs.schema.js";
import { RepairService } from "./repairs.service.js";

export const createRepair = catchAsync(async (req, res) => {
    const { hasError, errorMessage, repairData } = validateRepair(req.body);

    if (hasError) {
        return res.status(422).json({
            status: "error",
            message: errorMessage,
        });
    }
    const { date, userId, motorsNumber, description } = req.body;

    const repair = await RepairService.create({
        date,
        userId,
        motorsNumber,
        description,
    });

    return res.status(201).json(repair);
});

export const findAllRepairs = catchAsync(async(req, res, next) => {

        const repairs = await RepairService.findAll();
    
        return res.status(200).json(repairs);
    

});

export const findOneRepair = catchAsync(async(req, res, next) => {
        const { repair } = req;
    
        return res.status(200).json(repair);
});

export const updateRepair = catchAsync(async (req, res) => {
    const { repair } = req;

    const repairUpdated = await RepairService.update(repair);

    return res.status(200).json(repairUpdated);
});

export const deleteRepair = catchAsync(async (req, res) => {
    const { repair } = req;

    await RepairService.delete(repair);

    return res.status(204).json(null);
});
