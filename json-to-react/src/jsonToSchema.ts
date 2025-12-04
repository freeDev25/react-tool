import ComponentSchema from "./schema/Component";
import statCardJson from "./tests/json/StarCard.json";
import complexJson from "./tests/json/Complex.json";

async function main(): Promise<void> {
    console.log("Generating demo components...");

    console.log(`\n1. StatCard: Generated successfully.`);
    const statCard = new ComponentSchema(statCardJson as any);
    statCard.run();

    console.log(`\n2. Dashboard (Complex): Generated successfully.`);
    const dashboard = new ComponentSchema(complexJson as any);
    dashboard.run();

    console.log("\nDemo complete. Check output folder.");
}

main().catch(err => console.error(err));