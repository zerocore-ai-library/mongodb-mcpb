import { type UserConfig } from "./userConfig.js";
import { defaultParserOptions as defaultArgParserOptions } from "@mongosh/arg-parser/arg-parser";
import { z as z4 } from "zod/v4";
export type ParserOptions = typeof defaultArgParserOptions;
export declare const defaultParserOptions: {
    config: string;
    envPrefix: string;
    configuration: {
        "populate--": true;
        "boolean-negation"?: boolean | undefined;
        "camel-case-expansion"?: boolean | undefined;
        "combine-arrays"?: boolean | undefined;
        "dot-notation"?: boolean | undefined;
        "duplicate-arguments-array"?: boolean | undefined;
        "flatten-duplicate-arrays"?: boolean | undefined;
        "greedy-arrays"?: boolean | undefined;
        "nargs-eats-options"?: boolean | undefined;
        "halt-at-non-option"?: boolean | undefined;
        "negation-prefix"?: string | undefined;
        "parse-numbers"?: boolean | undefined;
        "parse-positional-numbers"?: boolean | undefined;
        "set-placeholder-key"?: boolean | undefined;
        "short-option-groups"?: boolean | undefined;
        "strip-aliased"?: boolean | undefined;
        "strip-dashed"?: boolean | undefined;
        "unknown-options-as-args"?: boolean | undefined;
    };
};
export declare function parseUserConfig({ args, overrides, parserOptions, }: {
    args: string[];
    overrides?: z4.ZodRawShape;
    parserOptions?: ParserOptions;
}): {
    warnings: string[];
    parsed: UserConfig | undefined;
    error: string | undefined;
};
//# sourceMappingURL=parseUserConfig.d.ts.map