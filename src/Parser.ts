import * as utils from "./utils";

import {
    IRouteParser,
    IRouteParseResult
} from "./types";

const ESCAPED_SYMBOLS = /[.,?\^$\-{}\[\]+\\|#\s]/g;
const TEMPLATE_REGEXP = /(:[\w_]+|\*[\w_]+|[^*:]+)/g;

/**
 * Parse an template route string to regexp + parameters names
 */
export class RouteParser implements IRouteParser {
    public parse(template: string): IRouteParseResult {
        const result = {
            template: "",
            parameters: []
        };

        template = utils.normalizePath(template).replace(ESCAPED_SYMBOLS, "\\$&");
        result.template = template.replace(TEMPLATE_REGEXP, (chunk: string): string => {
            if (chunk[0] === ":") {
                result.parameters.push(chunk.slice(1));
                return "([^\/]+)";
            } else if (chunk[0] === "*") {
                result.parameters.push(chunk.slice(1));
                return "(.*?)";
            }

            return chunk;
        });

        return result;
    }
}