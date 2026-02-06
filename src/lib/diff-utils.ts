export const parseDiffStats = (diff: string) => {
    const lines = diff.split('\n');
    let linesAdded = 0;
    let linesRemoved = 0;
    let filesChanged = 0;

    for (const line of lines) {
        // Count files based on git diff header
        if (line.startsWith('diff --git')) {
            filesChanged++;
        }

        // Count additions (exclude file header +++)
        if (line.startsWith('+') && !line.startsWith('+++')) {
            linesAdded++;
        }

        // Count deletions (exclude file header ---)
        if (line.startsWith('-') && !line.startsWith('---')) {
            linesRemoved++;
        }
    }

    // Fallback for non-git diffs or single snippets
    if (filesChanged === 0 && diff.trim().length > 0) {
        filesChanged = 1;
    }

    return { linesAdded, linesRemoved, filesChanged };
};
