import request from 'supertest';
import { beforeAll, describe, expect, it, vi } from 'vitest';

vi.mock('../src/utils/prisma.js', () => ({
  prisma: {
    user: {},
    board: {},
    boardMember: {},
    list: {},
    task: {}
  }
}));

let app;
beforeAll(async () => {
  ({ app } = await import('../src/app.js'));
});

describe('health endpoint', () => {
  it('should return ok', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });
});
