/* eslint-disable no-useless-catch */
import { columnModel } from "~/models/columnModel";
import { boardModel } from "~/models/boardModel";

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
      await boardModel.pushColumnOrderIds(getNewColumn)
    }

    return getNewColumn;
  } catch (error) {
    throw error;
  }
};

export const columnService = {
  createNew,
};
