import ComponentSchema from "./schema/Component";
import statCardJson from "./tests/StarCard.json";

async function main(): Promise<void> {
    console.log("Generating demo components...");

    console.log(`\n1. StatCard: Generated successfully.`);
    const component = new ComponentSchema(statCardJson as any);
    const componentCode = component.run();

    console.log({componentCode});

    console.log("\nDemo complete. Check output folder.");
}

main().catch(err => console.error(err));