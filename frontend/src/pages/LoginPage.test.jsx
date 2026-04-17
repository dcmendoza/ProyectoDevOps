import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import LoginPage from './LoginPage.jsx';
import { AuthProvider } from '../context/AuthContext.jsx';

vi.mock('../services/authService.js', () => ({
  authService: {
    login: vi.fn(async () => ({ token: 't', user: { id: '1', name: 'A', email: 'a@a.com' } })),
    me: vi.fn(async () => ({ id: '1', name: 'A', email: 'a@a.com' }))
  }
}));

describe('LoginPage', () => {
  beforeEach(() => localStorage.clear());

  it('permite enviar formulario', async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Entrar'));
    expect(await screen.findByText('Iniciar sesión')).toBeInTheDocument();
  });
});
