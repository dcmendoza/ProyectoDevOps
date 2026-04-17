import * as service from './lists.service.js';

export async function getLists(req, res, next) {
  try {
    const lists = await service.getBoardLists(req.params.boardId, req.user.id);
    res.json(lists);
  } catch (error) {
    next(error);
  }
}

export async function postList(req, res, next) {
  try {
    const list = await service.createList(req.params.boardId, req.user.id, req.body);
    res.status(201).json(list);
  } catch (error) {
    next(error);
  }
}

export async function patchList(req, res, next) {
  try {
    const list = await service.updateList(req.params.listId, req.user.id, req.body);
    res.json(list);
  } catch (error) {
    next(error);
  }
}

export async function removeList(req, res, next) {
  try {
    const result = await service.deleteList(req.params.listId, req.user.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
}
