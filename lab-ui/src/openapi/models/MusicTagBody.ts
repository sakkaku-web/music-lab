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
import type { TagDto } from './TagDto';
import {
    TagDtoFromJSON,
    TagDtoFromJSONTyped,
    TagDtoToJSON,
} from './TagDto';

/**
 * 
 * @export
 * @interface MusicTagBody
 */
export interface MusicTagBody {
    /**
     * 
     * @type {string}
     * @memberof MusicTagBody
     */
    file: string;
    /**
     * 
     * @type {TagDto}
     * @memberof MusicTagBody
     */
    tag: TagDto;
}

/**
 * Check if a given object implements the MusicTagBody interface.
 */
export function instanceOfMusicTagBody(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "file" in value;
    isInstance = isInstance && "tag" in value;

    return isInstance;
}

export function MusicTagBodyFromJSON(json: any): MusicTagBody {
    return MusicTagBodyFromJSONTyped(json, false);
}

export function MusicTagBodyFromJSONTyped(json: any, ignoreDiscriminator: boolean): MusicTagBody {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'file': json['file'],
        'tag': TagDtoFromJSON(json['tag']),
    };
}

export function MusicTagBodyToJSON(value?: MusicTagBody | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'file': value.file,
        'tag': TagDtoToJSON(value.tag),
    };
}

