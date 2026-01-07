import { HttpResponse } from 'msw';
import { http } from '../http';
import type { ApiSchemas } from '../../schema';
import { verifyTokenOrThrow } from '../session';

let boards: ApiSchemas['Board'][] = [
  {
    id: 'board-1',
    name: 'Marketing Campaign',
  },
  {
    id: 'board-2',
    name: 'Product Roadmap',
  },
];

export const boardsHandlers = [
  http.get('/boards', async ({ request }) => {
    await verifyTokenOrThrow(request);
    return HttpResponse.json(boards);
  }),
  http.post('/boards', async ({ request }) => {
    await verifyTokenOrThrow(request);
    const body = (await request.json()) as ApiSchemas['Board'];
    const newBoard: ApiSchemas['Board'] = {
      id: crypto.randomUUID(),
      name: body.name,
    };
    boards.push(newBoard);
    return HttpResponse.json(newBoard, { status: 201 });
  }),
  http.delete('/boards/{boardId}', async ({ params, request }) => {
    await verifyTokenOrThrow(request);
    const { boardId } = params;
    const board = boards.find(board => board.id === boardId);
    if (!board) {
      return HttpResponse.json({ message: 'Board not found', code: 'NOT_FOUND' }, { status: 404 });
    }
    boards = boards.filter(b => b.id !== boardId);
    return HttpResponse.json(null, { status: 204 });
  }),
  
];
