import { describe, it, expect } from 'vitest';
import { Generator } from '../core/Generator';
import { Schema } from '../schema';

describe('Generator - PropsWithChildren', () => {
    it('should use PropsWithChildren when schema has no children', () => {
        const schema: Schema = {
            type: 'component',
            name: 'WrapperComponent',
            styles: { padding: '20px' }
            // No children defined
        };

        const generator = new Generator();
        const result = generator.generate(schema);

        expect(result.componentCode).toContain('interface WrapperComponentProps extends React.PropsWithChildren');
        expect(result.componentCode).toContain('{props.children}');
    });

    it('should NOT use PropsWithChildren when schema HAS children', () => {
        const schema: Schema = {
            type: 'component',
            name: 'ContainerComponent',
            children: [
                { type: 'text', children: ['Hello'] }
            ]
        };

        const generator = new Generator();
        const result = generator.generate(schema);

        expect(result.componentCode).not.toContain('extends React.PropsWithChildren');
        expect(result.componentCode).not.toContain('{props.children}');
    });

    it('should use Fragment when schema has no children AND no styles', () => {
        const schema: Schema = {
            type: 'component',
            name: 'CleanWrapper'
            // No children, no styles
        };

        const generator = new Generator();
        const result = generator.generate(schema);

        expect(result.componentCode).toContain('<>');
        expect(result.componentCode).toContain('</>');
        expect(result.componentCode).toContain('{props.children}');
        expect(result.componentCode).not.toContain('<div');
    });
});
