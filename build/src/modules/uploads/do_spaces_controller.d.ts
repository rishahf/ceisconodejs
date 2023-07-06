import * as express from 'express';
declare const upload_file: (req: any, res: express.Response) => Promise<void>;
declare const list_all_files: () => Promise<unknown>;
export { upload_file, list_all_files };
