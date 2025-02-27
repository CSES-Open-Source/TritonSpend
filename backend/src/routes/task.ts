/**
 * Task route requests.
 */

import express from "express";
import * as TaskController from "src/controllers/task";
import * as TaskValidator from "src/validators/task";

const router = express.Router();

router.get("/:id", TaskController.getTask);
router.get("/transaction", TaskController.getTransaction);
/**
 * TaskValidator.createTask serves as middleware for this route. This means
 * that instead of immediately serving up the route when the request is made,
 * Express firsts passes the request to TaskValidator.createTask.
 * TaskValidator.createTask processes the request and determines whether the
 * request should be sent through or an error should be thrown.
 */
router.post("/", TaskValidator.createTask, TaskController.createTask);
router.delete("/:id", TaskController.removeTask);

export default router;
