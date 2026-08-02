import { HttpErrorResponse } from '@angular/common/http';

import { ApiError } from '../models/api-error.model';

export function getErrorMessage(
  error: HttpErrorResponse,
  fallbackMessage: string
): string {

  if (error.status === 0) {

    return 'The server is not reachable right now.';

  }

  if (error.status === 500) {

    return 'The server is not responding as expected, an error has occured.';

  }

  const apiError = error.error as ApiError;

  return apiError.message ?? fallbackMessage;

}