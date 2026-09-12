import JSZip from 'jszip';
import { ProjectFile } from '../types/ide';

export interface ZipExportResult {
  success: boolean;
  fileName: string;
  fileCount: number;
  sizeBytes: number;
}

export interface ZipImportResult {
  success: boolean;
  importedFiles: Record<string, ProjectFile>;
  count: number;
  fileNames: string[];
}

/**
 * Downloads the current workspace files as a compressed .zip archive.
 */
export async function downloadWorkspaceZip(
  files: Record<string, ProjectFile>,
  customName?: string
): Promise<ZipExportResult> {
  const zip = new JSZip();
  const fileEntries = Object.entries(files);

  for (const [path, fileObj] of fileEntries) {
    // Standardize path (remove leading slash if present)
    const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
    zip.file(normalizedPath, fileObj.content);
  }

  // Also include a helpful README inside the zip if not already there
  if (!files['README.md']) {
    zip.file(
      'README.md',
      `# GhostPilot Workspace Export\n\nExported on ${new Date().toISOString()}.\nTotal files: ${fileEntries.length}\n\n## Getting Started\n\`\`\`bash\nnpm install\nnpm test\n\`\`\`\n`
    );
  }

  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  const fileName = customName || `ghostpilot-workspace-${new Date().toISOString().slice(0, 10)}.zip`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  return {
    success: true,
    fileName,
    fileCount: fileEntries.length,
    sizeBytes: blob.size,
  };
}

/**
 * Parses an uploaded ZIP archive or code files into workspace files.
 */
export async function importFilesOrZip(files: FileList | File[]): Promise<ZipImportResult> {
  const importedFiles: Record<string, ProjectFile> = {};
  const names: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    if (file.name.endsWith('.zip')) {
      // Unzip archive
      const zip = new JSZip();
      const loadedZip = await zip.loadAsync(file);

      const entries = Object.entries(loadedZip.files);
      for (const [relativePath, zipEntry] of entries) {
        if (zipEntry.dir || relativePath.startsWith('__MACOSX') || relativePath.includes('.DS_Store')) {
          continue;
        }
        try {
          const content = await zipEntry.async('string');
          const ext = relativePath.split('.').pop()?.toLowerCase() || '';
          const fileName = relativePath.split('/').pop() || relativePath;

          importedFiles[relativePath] = {
            path: relativePath,
            name: fileName,
            extension: ext,
            content,
            initialContent: content,
            isModified: false,
            language:
              ext === 'tsx'
                ? 'tsx'
                : ext === 'ts' || ext === 'js' || ext === 'jsx'
                ? 'typescript'
                : ext === 'json'
                ? 'json'
                : 'markdown',
          };
          names.push(relativePath);
        } catch (err) {
          console.warn(`Could not extract file from zip: ${relativePath}`, err);
        }
      }
    } else {
      // Individual file
      const content = await file.text();
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      const path = file.webkitRelativePath || `src/${file.name}`;

      importedFiles[path] = {
        path,
        name: file.name,
        extension: ext,
        content,
        initialContent: content,
        isModified: false,
        language:
          ext === 'tsx'
            ? 'tsx'
            : ext === 'ts' || ext === 'js' || ext === 'jsx'
            ? 'typescript'
            : ext === 'json'
            ? 'json'
            : 'markdown',
      };
      names.push(path);
    }
  }

  return {
    success: names.length > 0,
    importedFiles,
    count: names.length,
    fileNames: names,
  };
}
