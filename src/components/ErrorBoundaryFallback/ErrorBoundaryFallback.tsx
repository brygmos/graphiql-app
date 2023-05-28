import React, { FC } from 'react';
import { Alert } from '@mui/material';

type Props = {
  error: { message: string };
  resetErrorBoundary: () => void;
};

export const ErrorBoundaryFallback: FC<Props> = ({ error, resetErrorBoundary }) => {
  return (
    <div role="alert" style={{ textAlign: 'center', margin: 'auto' }}>
      <Alert icon={false} severity="error">
        <strong>Something went wrong:</strong> {error.message}
        {error.message}
      </Alert>
      {error && error.message && <pre>{error.message}</pre>}
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
};
