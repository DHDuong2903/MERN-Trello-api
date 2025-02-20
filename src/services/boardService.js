/* eslint-disable no-useless-catch */
import { StatusCodes } from "http-status-codes";
import { slugify } from "~/utils/formatters";
import { boardModel } from "~/models/boardModel";
import ApiError from "~/utils/ApiError";
import { cloneDeep } from "lodash";

const createNew = async (reqBody) => {
  try {
    // Xu ly logic du lieu tuy dac thu du an
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title),
    };

    // Goi toi tang Model de xu ly luu ban ghi newBoard vao trong Database
    const createdBoard = await boardModel.createNew(newBoard);

    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId);
    // Lam them cac xu ly logic khac voi cac Collection khac tuy dac thu du an...
    // Ban email, notification ve cho admin khi co 1 cai board moi duoc tao ...

    // Tra ket qua ve, trong Service luon phai co return
    return getNewBoard;
  } catch (error) {
    throw error;
  }
};

const getDetails = async (boardId) => {
  try {
    const board = await boardModel.getDetails(boardId);
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Board not found!");
    }

    // B1: Tao 1 board clone khong anh huong den board ban dau
    const resBoard = cloneDeep(board);

    // B2: Dua card ve dung column cua no
    resBoard.columns.forEach((column) => {
      // Convert ObjectId ve string bang ham toString cua Javascript
      column.cards = resBoard.cards.filter((card) => card.columnId.toString() === column._id.toString());
    });

    // B3: Xoa mang cards khoi board ban dau
    delete resBoard.cards;

    return resBoard;
  } catch (error) {
    throw error;
  }
};

const update = async (boardId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now(),
    };
    const updatedBoard = await boardModel.update(boardId, updateData);

    return updatedBoard;
  } catch (error) {
    throw error;
  }
};

export const boardService = {
  createNew,
  getDetails,
  update,
};
