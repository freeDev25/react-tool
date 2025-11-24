
import { ComplexSchemas } from "./tests/complex";

async function main(): Promise<void> {
    console.log("Generating demo components...");

    ComplexSchemas.forEach((comp, index) => {
        console.log(`\n${index + 1}. ${comp.getName()}: Generated successfully.`);
        console.log(comp.generate());
    });

    console.log("\nDemo complete. Check output folder.");
}

main().catch(err => console.error(err));
