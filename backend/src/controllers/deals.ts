import { RequestHandler } from "express";
import client from "../db/db";

export const getDeals: RequestHandler = async (req, res) => {
  const { category } = req.query;
  try {
    let result;
    if (category && category !== "All") {
      result = await client.query(
        "SELECT * FROM deals WHERE category = $1 ORDER BY is_ucsd_specific DESC, name ASC;",
        [category]
      );
    } else {
      result = await client.query(
        "SELECT * FROM deals ORDER BY is_ucsd_specific DESC, name ASC;"
      );
    }
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching deals:", error);
    res.status(500).json({ error: `Internal server error: ${error}` });
  }
};
