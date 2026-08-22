import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { HomePage } from '../components/Home/HomePage';
import '@testing-library/jest-dom';

// Mock the framer-motion library
jest.mock('framer-motion', () => {
  const actualFramerMotion = jest.requireActual('framer-motion');
  return {
    ...actualFramerMotion,
    AnimatePresence: ({ children }: any) => <>{children}</>,
    motion: {
      div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
      header: ({ children, ...props }: any) => <header {...props}>{children}</header>,
      h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
      p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    }
  };
});

describe('HomePage', () => {
  it('renders landing page content', () => {
    render(<HomePage onLogin={jest.fn()} />);
    expect(screen.getByText('DAYFLOW.')).toBeInTheDocument();
    expect(screen.getByText(/The all-in-one Human Resource Management System/i)).toBeInTheDocument();
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });

  it('opens login modal and handles routing', () => {
    const mockOnLogin = jest.fn();
    render(<HomePage onLogin={mockOnLogin} />);
    
    // Modal shouldn't be visible initially
    expect(screen.queryByText('Welcome Back')).not.toBeInTheDocument();

    // Click Sign In
    fireEvent.click(screen.getByText('Sign In'));
    
    // Modal should appear
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByText('Employee Portal')).toBeInTheDocument();
    expect(screen.getByText('Admin / HR Portal')).toBeInTheDocument();

    // Click Employee Login
    fireEvent.click(screen.getByText('Employee Portal'));
    expect(mockOnLogin).toHaveBeenCalledWith('Employee');
  });
});
