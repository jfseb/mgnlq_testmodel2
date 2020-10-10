import { IFModel as IFModel } from 'mgnlq_model';
/**
 * Obtain a model instance,
 *
 * note: the model must be closed via
 * Model.releaseModel(theModelInstance)
 */
export declare function getTestModel(): Promise<void | IFModel.IModels>;
