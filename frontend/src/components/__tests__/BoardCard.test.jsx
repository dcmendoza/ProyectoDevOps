import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BoardCard from '../BoardCard.jsx';
import { describe, it, expect } from 'vitest';

describe('BoardCard', () => {
  it('renderiza nombre y link', () => {
    render(
      <MemoryRouter>
        <BoardCard board={{ id: '1', name: 'Board Demo', description: 'Desc', _count: { lists: 2 } }} />
      </MemoryRouter>
    );

    expect(screen.getByText('Board Demo')).toBeInTheDocument();
    expect(screen.getByText('2 listas')).toBeInTheDocument();
  });
});
