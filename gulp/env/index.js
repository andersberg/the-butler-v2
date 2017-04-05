/**
 * Export all different environment variables.
 */
export const DEBUG = process.env.npm_config_debug || false;
export const PRD = process.env.npm_config_prd || false;
export const STG = process.env.npm_config_stg || false;
export const DEV = process.env.npm_config_dev || (!PRD && !STG);
export const ENV = _getEnvironment();


/**
 * Returns the current environment as a string
 */
function _getEnvironment() {
    let environment = `DEV`;
    if (STG) {
        environment = `STG`;
    } else if (PRD) {
        environment = `PRD`;
    }
    return environment;
}