import { Result } from "true-myth";
import ModelDB from "./db/modelDB";
import { DBModel } from "./db/types";

export enum AvailableModels {
    MODEL_2312 = "GuideU/whisper_wak",
    MODEL_2404 = "GuideU/whisper-mobi-240418",
    TEST = "medium",
}

export const ModelSizes: Map<AvailableModels, number> = new Map([
    [AvailableModels.MODEL_2312, 972263884],
    [AvailableModels.MODEL_2404, 972263884],
    [AvailableModels.TEST, 972263884],
]);

export class Model {
    name: string;
    data: Uint8Array;
    tokenizer: Uint8Array;

    constructor(name: string, data: Uint8Array, tokenizer: Uint8Array) {
        this.name = name;
        this.data = data;
        this.tokenizer = tokenizer;
    }

    static async fromDBModel(
        dbModel: DBModel,
        db: ModelDB
    ): Promise<Result<Model, Error>> {
        const tokenizerResult = await db.getTokenizer(dbModel.ID);
        if (tokenizerResult.isErr) {
            return Result.err(tokenizerResult.error);
        }
        const tokenizerBytes = tokenizerResult.value.bytes;

        return Result.ok(
            new Model(dbModel.name, dbModel.bytes, tokenizerBytes)
        );
    }
}

export interface EncoderDecoder {
    name: string;
    encoder: Model;
    decoder: Model;
    config: Uint8Array;
    tokenizer: Uint8Array;
}
