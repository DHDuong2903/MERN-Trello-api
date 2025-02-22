/* eslint-disable no-useless-catch */
import { StatusCodes } from "http-status-codes";
import { slugify } from "~/utils/formatters";
import { boardModel } from "~/models/boardModel";
import { columnModel } from "~/models/columnModel";
import { cardModel } from "~/models/cardModel";
import ApiError from "~/utils/ApiError";
import { cloneDeep } from "lodash";
import { ObjectId } from "mongodb";

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

    // Bien doi lien quan den ObjectId
    if (updateData.columnOrderIds) {
      updateData.columnOrderIds = updateData.columnOrderIds.map((_id) => new ObjectId(_id));
    }

    const updatedBoard = await boardModel.update(boardId, updateData);

    return updatedBoard;
  } catch (error) {
    throw error;
  }
};

const moveCardToDifferentColumn = async (reqBody) => {
  try {
    // B1: Cap nhat mang cardOrderIds cua Column ban dau chua no (xoa _id cua Card ra khoi mang)
    await columnModel.update(reqBody.prevColumnId, {
      cardOrderIds: reqBody.prevCardOrderIds,
      updatedAt: Date.now(),
    });
    // B2: Cap nhat mang cardOrderIds cua Column tiep theo (them _id cua Card vao mang)
    await columnModel.update(reqBody.nextColumnId, {
      cardOrderIds: reqBody.nextCardOrderIds,
      updatedAt: Date.now(),
    });
    // B3: Cap nhat lai truong columnId moi cua cai Card da keo
    await cardModel.update(reqBody.currentCardId, {
      columnId: reqBody.nextColumnId,
    });

    return { updateResult: "Successfully!" };
  } catch (error) {
    throw error;
  }
};

export const boardService = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn,
};
