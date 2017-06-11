import { IFModel as IFModel } from 'mgnlq_model';
export interface OldCategoryDesc {
    name: string;
    description?: string;
    key?: string;
    QBE?: boolean;
    defaultWidth?: number;
    importance: number;
    LUNRIndex: boolean;
    QBEInclude: boolean;
}
export interface IOldModel {
    domain: string;
    bitindex: number;
    description?: string;
    tool?: any;
    toolhidden?: boolean;
    synonyms?: {
        [key: string]: string[];
    };
    categoryDescribed: OldCategoryDesc[];
    category: string[];
    columns?: string[];
    wordindex: string[];
    exactmatch?: string[];
    hidden: string[];
}
export declare function makeMongoName(s: string): string;
export declare function readFileAsJSON(filename: string): any;
export declare function loadModel(modelPath: string, sModelName: string): IOldModel;
export declare function loadModelData(modelPath: string, sModelName: string): any[];
export declare function calcMongoCats(cats: string[]): string[];
export declare function getTextIndexCategories(oMdl: IOldModel): string[];
export declare function makeModelDoc(sModelName: string, oMdl: IOldModel): IFModel.IModelDoc;
export declare function isArrayTransform(domain: string, category: string): boolean;
export declare function getPropsTypeRecord(props: any, newcat: string, category: string, domain: string): any;
export declare function mergeModelJson(sModelName: string, oMdl: IOldModel): {
    props: {};
    index: {};
};
export declare function transFormType(domain: string, category: string, val: any): any;
export declare function mapOne(o: any, props: {
    [key: string]: string;
}, domain: string): any;
export declare function makeDocuments(data: any, oMdl: IOldModel): any;
