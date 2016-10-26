import { IRouteParser, IRouteParseResult } from "./types";
/**
 * Parse an template route string to regexp + parameters names
 */
export declare class RouteParser implements IRouteParser {
    parse(template: string): IRouteParseResult;
}
