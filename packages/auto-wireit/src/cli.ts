import { binary, run } from 'cmd-ts';
import { app } from './cli/index.js';

await run(binary(app), process.argv);
