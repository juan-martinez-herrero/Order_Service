export type ValidationError = {
  type: "ValidationError";
  message: string;
  details?: Record<string, string>;
};

export type ConflictError = {
  type: "ConflictError";
  message: string;
};
export type InfrastructureError = {
  type: "InfrastructureError";
  message: string;
};
export type NotFoundError = {
  type: "NotFoundError";
  message: string;
};
export type ApplicationError =
  | ValidationError
  | ConflictError
  | InfrastructureError
  | NotFoundError;

