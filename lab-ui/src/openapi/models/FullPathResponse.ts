/* tslint:disable */
/* eslint-disable */
/**
 * Music Lab
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.0.1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface FullPathResponse
 */
export interface FullPathResponse {
    /**
     * 
     * @type {string}
     * @memberof FullPathResponse
     */
    fullPath: string;
}

/**
 * Check if a given object implements the FullPathResponse interface.
 */
export function instanceOfFullPathResponse(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "fullPath" in value;

    return isInstance;
}

export function FullPathResponseFromJSON(json: any): FullPathResponse {
    return FullPathResponseFromJSONTyped(json, false);
}

export function FullPathResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): FullPathResponse {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'fullPath': json['full_path'],
    };
}

export function FullPathResponseToJSON(value?: FullPathResponse | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'full_path': value.fullPath,
    };
}

