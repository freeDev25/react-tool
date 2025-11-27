import { ISchemaFunctions } from "../schema";
import { getConfig } from "./config";

const config = getConfig()

export default class FunctionGenerator {
    public indentSize = config.indentSize;

    constructor() {}
    /**
     * 
     * @param functions 
     * @returns 
     * Generates React useState hooks code from schema states definition
     */
    generateFunctionCode(fns: ISchemaFunctions): string {
        const indent = ' '.repeat(this.indentSize);
        let functionCode = '';
        
        for (const [functionName, functionDef] of Object.entries(fns)) {
            // Generate function parameters
            const params = functionDef.params
                .map(param => `${param.name}: ${param.type}`)
                .join(', ');
            
            // Generate function body with proper indentation
            const bodyLines = functionDef.body.split('\n');
            const indentedBody = bodyLines
                .map(line => line ? `${indent}${indent}${line}` : '')
                .join('\n');
            
            functionCode += `\n${indent}const ${functionName} = (${params}) => {${indentedBody}${indent}};`;
        }
        
        return functionCode;
    }
}

/**
 * 
 * @param string 
 * @returns 
 * Capitalizes the first letter of a string
 */
function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}