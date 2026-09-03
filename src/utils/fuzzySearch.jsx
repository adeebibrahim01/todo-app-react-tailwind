export function fuzzyMatch(text, query) {
    const normalizedText = text.toLowerCase();
    const normalizedQuery = query.toLowerCase();

    let queryIndex = 0;

    for (const char of normalizedText) {
        if (char === normalizedQuery[queryIndex]) {
            queryIndex++;

            if (queryIndex === normalizedQuery.length) {
                return true;
            }
        }
    }

    return false;
}