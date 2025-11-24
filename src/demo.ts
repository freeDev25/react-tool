
import { ComplexSchemas } from "./tests/complex";

async function main(): Promise<void> {
    console.log("Generating demo components...");

    ComplexSchemas.forEach(async (comp, index) => {
        console.log(`\n${index + 1}. ${comp.getName()}: Generated successfully.`);
        const result = await comp.generate();
        console.log(result);
    });

    console.log("\nDemo complete. Check output folder.");
}

main().catch(err => console.error(err));
