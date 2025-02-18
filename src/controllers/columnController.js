import { StatusCodes } from "http-status-codes";
import { columnService } from "~/services/columnService";

const createNew = async (req, res, next) => {
  try {
    //  Dieu huong du lieu sang tang Service
    const createdColumn = await columnService.createNew(req.body);

    // Co ket qua thi tra ve phia Client
    res.status(StatusCodes.CREATED).json(createdColumn);
  } catch (error) {
    next(error);
  }
};

export const columnController = {
  createNew,
};
