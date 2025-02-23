/* eslint-disable no-useless-catch */
import { boardModel } from "~/models/boardModel";
import { columnModel } from "~/models/columnModel";
import { cardModel } from "~/models/cardModel";
import ApiError from "~/utils/ApiError";
import { StatusCodes } from "http-status-codes";

const createNew = async (reqBody) => {
  try {
    // Xu ly logic du lieu tuy dac thu du an
    const newColumn = {
      ...reqBody,
    };

    // Goi toi tang Model de xu ly luu ban ghi newBoard vao trong Database
    const createdColumn = await columnModel.createNew(newColumn);
    const getNewColumn = await columnModel.findOneById(createdColumn.insertedId);

    if (getNewColumn) {
      // Xu ly cau truc data o day truoc khi tra du lieu ve
      getNewColumn.cards = [];

      // Cap nhat lai mang columnOrderIds trong table board
      await boardModel.pushColumnOrderIds(getNewColumn);
    }

    return getNewColumn;
  } catch (error) {
    throw error;
  }
};

const update = async (columnId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now(),
    };
    const updatedColumn = await columnModel.update(columnId, updateData);

    return updatedColumn;
  } catch (error) {
    throw error;
  }
};

const deleteItem = async (columnId) => {
  try {
    const targetColumn = await columnModel.findOneById(columnId);

    if (!targetColumn) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Column not found!");
    }
    // Xoa Column
    await columnModel.deleteOneById(columnId);

    // Xoa Cards thuoc Column tren
    await cardModel.deleteManyByColumnId(columnId);

    // Xoa columnId trong mang columnOrderIds cua Board chua no
    await boardModel.pullColumnOrderIds(targetColumn);

    return { deleteResult: "Column and its Cards deleted successfully!" };
  } catch (error) {
    throw error;
  }
};

export const columnService = {
  createNew,
  update,
  deleteItem,
};
