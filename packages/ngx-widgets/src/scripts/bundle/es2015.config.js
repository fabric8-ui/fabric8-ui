import { config, LIB_NAME, PATH_DIST } from './rollup.config';

config.output.format = 'es';
config.output.file = `${PATH_DIST + LIB_NAME}.esm.js`;

export default config;
