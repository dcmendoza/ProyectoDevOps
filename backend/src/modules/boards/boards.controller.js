import * as service from './boards.service.js';

export async function getBoards(req, res, next) {
  try {
    const boards = await service.getUserBoards(req.user.id);
    res.json(boards);
  } catch (error) {
    next(error);
  }
}

export async function createBoard(req, res, next) {
  try {
    const board = await service.createBoard(req.user.id, req.body);
    res.status(201).json(board);
  } catch (error) {
    next(error);
  }
}

export async function getBoard(req, res, next) {
  try {
    const board = await service.getBoardDetail(req.params.boardId, req.user.id);
    res.json(board);
  } catch (error) {
    next(error);
  }
}

export async function patchBoard(req, res, next) {
  try {
    const board = await service.updateBoard(req.params.boardId, req.user.id, req.body);
    res.json(board);
  } catch (error) {
    next(error);
  }
}

export async function removeBoard(req, res, next) {
  try {
    const result = await service.deleteBoard(req.params.boardId, req.user.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function postMember(req, res, next) {
  try {
    const member = await service.addMember(req.params.boardId, req.user.id, req.body.email);
    res.status(201).json(member);
  } catch (error) {
    next(error);
  }
}

export async function getMembers(req, res, next) {
  try {
    const members = await service.listMembers(req.params.boardId, req.user.id);
    res.json(members);
  } catch (error) {
    next(error);
  }
}
