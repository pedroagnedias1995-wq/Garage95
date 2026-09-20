import type { Finding } from '../contracts';
export const uxDesignAgent = {
  name: 'ux-design',
  inspect(files: readonly string[], contents: Readonly<Record<string, string>>): Finding[] {
    const matches = files.filter((file) => /\.(tsx|jsx)$/.test(file) && /<img\b(?![^>]*alt=)/.test(contents[file] ?? ''));
    return matches.length ? [{ id: 'ux-image-alt', agent: this.name, severity: 'warning', title: 'Image without alt text', detail: 'Add meaningful alt text or document why the image is decorative.', files: matches.slice(0, 3), plannedAction: 'propose' }] : [];
  },
};
