import { describe, it, expect } from 'vitest';
import { Generator } from '../core/Generator';
import { Schema } from '../schema';

describe('Generator - Imports', () => {
    it('should generate imports for nested components inside divs', () => {
        const schema: Schema = {
            type: 'component',
            name: 'Parent',
            children: [
                {
                    type: 'node',
                    nodeType: 'div',
                    children: [
                        {
                            type: 'component',
                            name: 'ChildComponent'
                        }
                    ]
                }
            ]
        };

        const generator = new Generator();
        const result = generator.generate(schema);

        expect(result.componentCode).toContain("import ChildComponent from '../ChildComponent/ChildComponent';");
    });

    it('should deduplicate imports', () => {
        const schema: Schema = {
            type: 'component',
            name: 'Parent',
            children: [
                { type: 'component', name: 'ChildComponent' },
                { type: 'component', name: 'ChildComponent' }
            ]
        };

        const generator = new Generator();
        const result = generator.generate(schema);

        const matches = result.componentCode.match(/import ChildComponent/g);
        expect(matches).toHaveLength(1);
    });
});
