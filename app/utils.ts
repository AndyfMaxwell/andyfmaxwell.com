export function formatDate(timestamp: number): string {
    return new Date(timestamp*1000).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}