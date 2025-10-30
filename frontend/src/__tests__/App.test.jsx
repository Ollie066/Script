import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App.jsx'

test('renders navigation links', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  )
  expect(screen.getByText(/Scripts/i)).toBeInTheDocument()
  expect(screen.getByText(/Novels/i)).toBeInTheDocument()
})


