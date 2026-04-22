export function mergeConveyorThroughput(...throughputSections) {
    const combined = [];

    for (const section of throughputSections) {
        for (const value of section) {
            combined.push(value);
        }
    }

    combined.sort((a, b) => b - a);

    return combined.join(' ');
}
