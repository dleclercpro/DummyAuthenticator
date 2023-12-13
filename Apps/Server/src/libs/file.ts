import fs from 'fs';

export const doesFileExist = (filepath: string) => {
    return fs.existsSync(filepath);
}