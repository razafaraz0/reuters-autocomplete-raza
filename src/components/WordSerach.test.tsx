import React from 'react';
import { render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import axios from 'axios';
import WordSearch from './WordSearch';


vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};


describe('Word Search Component: Core Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Should render Word Search component and also display input value as user types', async () => {
    renderWithProviders(<WordSearch />);
    
    const input = screen.getByLabelText(/search words/i);
    expect(input).toBeInTheDocument();
    
    // Test input state
    await userEvent.type(input, 'hello');
    expect(input).toHaveValue('hello');
  });

  it('Should test debounce input API calls', async () => {
    const mockWords = ['test'];
    mockedAxios.get.mockResolvedValue({ data: mockWords });

    renderWithProviders(<WordSearch />);
    
    const input = screen.getByLabelText(/search words/i);
    

    await userEvent.type(input, 'test');

    await waitFor(() => {

      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    }, { timeout: 1000 });
  });

  it('Should display list of results successfully', async () => {
    const mockWords = ['apple', 'application', 'apply'];
    mockedAxios.get.mockResolvedValueOnce({ data: mockWords });

    renderWithProviders(<WordSearch />);
    
    const input = screen.getByLabelText(/search words/i);
    await userEvent.type(input, 'apple');

    await waitFor(() => {
      expect(screen.getByText('apple')).toBeInTheDocument();
      expect(screen.getByText('application')).toBeInTheDocument();
      expect(screen.getByText('apply')).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('Should display "No matching word found" when search enters Wrong data', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });

    renderWithProviders(<WordSearch />);
    
    const input = screen.getByLabelText(/search words/i);
    await userEvent.type(input, '213INEWREEWQ');

    await waitFor(() => {
      expect(screen.getByText(/no matching word found/i)).toBeInTheDocument();
    }, { timeout: 1000 });
  });



  it('Should display loading spinner while fetching data', async () => {

    mockedAxios.get.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ data: ['test'] }), 1000))
    );

    renderWithProviders(<WordSearch />);
    
    const input = screen.getByLabelText(/search words/i);
    await userEvent.type(input, 'test');


    await waitFor(() => {
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    }, { timeout: 600 });
  });

  
});
