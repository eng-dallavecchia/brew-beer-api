import { db } from "./connection";
import moment from "moment";

export const getById = async (table, id) => {
  const rows = await db(table)
    .select()
    .where({ id, deletedAt: null });
  return rows.length > 0 ? rows[0] : null;
};

export const findAll = async (table, where) => {
  const rows = await db(table)
    .select()
    .where({ ...where, deletedAt: null });
  return rows;
};

export const rawNex = async (query, params) => {
  const result = await db.raw(query);
  if (Array.isArray(result) && result.length > 0) {
    if (Array.isArray(result[0]) && result[0].length > 0) {
      return result[0];
    }
  }
  return [];
};

export const insert = async (table, data) => {
  const res = await db(table).insert({
    ...data,
    date_creation: getCurrentDateTimeSQL()
  });
  return res[0];
};

export const getCurrentDateTimeSQL = () => {
  moment().locale("pt-br");
  return moment().format("YYYY-MM-DD HH:mm:ss");
};
