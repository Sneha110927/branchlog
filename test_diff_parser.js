const parseDiffStats = (diff) => {
    const lines = diff.split('\n');
    let linesAdded = 0;
    let linesRemoved = 0;
    let filesChanged = 0;

    for (const line of lines) {
        if (line.startsWith('diff --git')) {
            filesChanged++;
        }
        if (line.startsWith('+') && !line.startsWith('+++')) {
            linesAdded++;
        }
        if (line.startsWith('-') && !line.startsWith('---')) {
            linesRemoved++;
        }
    }

    if (filesChanged === 0 && diff.trim().length > 0) {
        filesChanged = 1;
    }

    return { linesAdded, linesRemoved, filesChanged };
};

const diff = `diff --git a/test.txt b/test.txt
index 83db48f..bf269f4 100644
--- a/test.txt
+++ b/test.txt
@@ -1,3 +1,3 @@
-Hello
+Hello World
+New Line`;

console.log("Testing Diff Stats:");
console.log(JSON.stringify(parseDiffStats(diff), null, 2));
