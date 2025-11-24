import * as fs from 'fs';
import * as path from 'path';
import { ISchema } from '../schema';

export interface WriterOptions {
    outputDir: string;
    playgroundDir?: string;
}

export class FileWriter {
    private outputDir: string;
    private playgroundDir?: string;

    constructor(options: WriterOptions) {
        this.outputDir = path.resolve(options.outputDir);
        if (options.playgroundDir) {
            this.playgroundDir = path.resolve(options.playgroundDir);
        }
    }

    public ensureOutputDir(): void {
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }
    }

    public clearOutputFolder(): void {
        if (fs.existsSync(this.outputDir)) {
            fs.rmSync(this.outputDir, { recursive: true, force: true });
        }
        this.ensureOutputDir();
    }

    public saveComponent(componentName: string, content: string, cssContent?: string): void {
        const componentDir = path.join(this.outputDir, componentName);

        if (!fs.existsSync(componentDir)) {
            fs.mkdirSync(componentDir, { recursive: true });
        }

        const filePath = path.join(componentDir, `${componentName}.tsx`);
        fs.writeFileSync(filePath, content, 'utf8');

        if (cssContent) {
            const cssPath = path.join(componentDir, 'style.css');
            fs.writeFileSync(cssPath, cssContent, 'utf8');
        }
    }

    public updateManifest(componentName: string, schema: ISchema): void {
        const manifestPath = path.join(this.outputDir, 'manifest.json');
        let manifest: any = { components: [] };

        if (fs.existsSync(manifestPath)) {
            try {
                const content = fs.readFileSync(manifestPath, 'utf8');
                manifest = JSON.parse(content);
            } catch (err) {
                console.warn('Failed to parse manifest.json, creating new one');
            }
        }

        // Remove existing entry
        manifest.components = manifest.components.filter((c: any) => c.name !== componentName);

        // Add new entry
        manifest.components.push({
            name: componentName,
            type: schema.type,
            generatedAt: new Date().toISOString(),
            path: {
                tsx: `${componentName}/${componentName}.tsx`,
                css: `${componentName}/style.css`
            }
        });

        fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

        if (this.playgroundDir) {
            this.copyManifestToPlayground(manifestPath);
        }
    }

    public resetManifest(): void {
        this.ensureOutputDir();
        const manifestPath = path.join(this.outputDir, 'manifest.json');
        const emptyManifest = { components: [] };
        fs.writeFileSync(manifestPath, JSON.stringify(emptyManifest, null, 2), 'utf8');

        if (this.playgroundDir) {
            this.copyManifestToPlayground(manifestPath);
        }
    }

    private copyManifestToPlayground(manifestPath: string): void {
        if (!this.playgroundDir) return;

        const playgroundManifestPath = path.join(this.playgroundDir, 'manifest.json');
        try {
            if (!fs.existsSync(this.playgroundDir)) {
                fs.mkdirSync(this.playgroundDir, { recursive: true });
            }
            fs.copyFileSync(manifestPath, playgroundManifestPath);
        } catch (err) {
            console.warn('Failed to copy manifest to playground:', err);
        }
    }
}
