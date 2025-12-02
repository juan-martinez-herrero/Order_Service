export function isHealthy(): { status: string, timestamp: Date } {
    return { status: "healthy", timestamp: new Date() };
}
