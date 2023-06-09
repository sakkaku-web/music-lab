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
import type { MusicItemDto } from './MusicItemDto';
import {
    MusicItemDtoFromJSON,
    MusicItemDtoFromJSONTyped,
    MusicItemDtoToJSON,
} from './MusicItemDto';

/**
 * 
 * @export
 * @interface MusicListResponse
 */
export interface MusicListResponse {
    /**
     * 
     * @type {Array<MusicItemDto>}
     * @memberof MusicListResponse
     */
    music: Array<MusicItemDto>;
}

/**
 * Check if a given object implements the MusicListResponse interface.
 */
export function instanceOfMusicListResponse(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "music" in value;

    return isInstance;
}

export function MusicListResponseFromJSON(json: any): MusicListResponse {
    return MusicListResponseFromJSONTyped(json, false);
}

export function MusicListResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): MusicListResponse {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'music': ((json['music'] as Array<any>).map(MusicItemDtoFromJSON)),
    };
}

export function MusicListResponseToJSON(value?: MusicListResponse | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'music': ((value.music as Array<any>).map(MusicItemDtoToJSON)),
    };
}

