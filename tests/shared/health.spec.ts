import { describe, it, expect } from 'vitest';
import { isHealthy } from '../../src/shared/health';

describe('Health', () => {
    it('should return healthy and timestamp when checking if system is healthy', () => {
        const result = isHealthy();
        expect(result.status).toBe("healthy");
        expect(result.timestamp).toBeInstanceOf(Date);
    });

    it('should return current timestamp', () => {
        const before = new Date();
        const result = isHealthy();
        const after = new Date();
    });


});

