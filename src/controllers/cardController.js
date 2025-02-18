import { StatusCodes } from "http-status-codes";
import { cardService } from "~/services/cardService";

const createNew = async (req, res, next) => {
  try {
    //  Dieu huong du lieu sang tang Service
    const createdCard = await cardService.createNew(req.body);

    // Co ket qua thi tra ve phia Client
    res.status(StatusCodes.CREATED).json(createdCard);
  } catch (error) {
    next(error);
  }
};

export const cardController = {
  createNew,
};
