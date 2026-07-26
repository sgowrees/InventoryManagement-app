const { execSync } = require("child_process");

function run(command) {
    console.log(`\nRunning: ${command}\n`);

    try {
        execSync(command, {
            stdio: "inherit"
        });
    } catch (error) {
        console.error(`Failed: ${command}`);
        process.exit(1);
    }
}

console.log("Starting Test Automation");


run("npm run test:unit");

run("npm run test:integration");

run("npm run test:api");

run("npm run test:e2e");


console.log("\nAll tests completed successfully");