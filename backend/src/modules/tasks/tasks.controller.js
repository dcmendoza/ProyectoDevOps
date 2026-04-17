import * as service from './tasks.service.js';

export async function postTask(req, res, next) {
  try {
    const task = await service.createTask(req.params.listId, req.user.id, req.body);
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
}

export async function getTaskById(req, res, next) {
  try {
    const task = await service.getTask(req.params.taskId, req.user.id);
    res.json(task);
  } catch (error) {
    next(error);
  }
}

export async function patchTask(req, res, next) {
  try {
    const task = await service.updateTask(req.params.taskId, req.user.id, req.body);
    res.json(task);
  } catch (error) {
    next(error);
  }
}

export async function removeTask(req, res, next) {
  try {
    const result = await service.deleteTask(req.params.taskId, req.user.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function moveTask(req, res, next) {
  try {
    const task = await service.moveTask(req.params.taskId, req.user.id, req.body);
    res.json(task);
  } catch (error) {
    next(error);
  }
}
