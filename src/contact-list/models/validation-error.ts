/**
 * Shape of a Contact List validation failure, for example a `POST /contacts`
 * with an invalid email address. The API keys the errors by field name.
 */
export interface ValidationErrorResponse {
  errors: Record<string, { message: string }>;
}
