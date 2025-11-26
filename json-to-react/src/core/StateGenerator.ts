import { ISchemaStates } from "../schema";

export default class StateGenerator {
    constructor(private indentSize: number = 4) {}
    /**
     * 
     * @param states 
     * @returns 
     * Generates React useState hooks code from schema states definition
     */
    generateStateCode(states: ISchemaStates): string {
        const indent = ' '.repeat(this.indentSize);
        let stateCode = '';
        for (const [stateName, stateDef] of Object.entries(states)) {
            const defaultValue = JSON.stringify(stateDef.default);
            stateCode += `\n${indent}const [${stateName}, set${capitalizeFirstLetter(stateName)}] = React.useState<${stateDef.type}>(${defaultValue});`;
        }
        return stateCode;
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