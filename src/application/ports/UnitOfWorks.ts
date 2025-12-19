import type { Result } from '../../shared/result.ts';
import { AppError } from '../errors.ts';
import type { OrderRepository } from './OrderRepository.ts';

export interface UnitOfWork {
  run<T>(fn: (repos: Repositories) => Promise<T>): Promise<Result<T, AppError>>;
}

export interface Repositories {
  orderRepository: OrderRepository;
}
