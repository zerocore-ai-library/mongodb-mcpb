import { z, type ZodString } from "zod";
export declare const NO_UNICODE_ERROR = "String cannot contain special characters or Unicode symbols";
export declare const ALLOWED_USERNAME_CHARACTERS_ERROR = "Username can only contain letters, numbers, dots, hyphens, and underscores";
export declare const ALLOWED_REGION_CHARACTERS_ERROR = "Region can only contain letters, numbers, hyphens, and underscores";
export declare const ALLOWED_CLUSTER_NAME_CHARACTERS_ERROR = "Cluster names can only contain ASCII letters, numbers, and hyphens.";
export declare const ALLOWED_PROJECT_NAME_CHARACTERS_ERROR = "Project names can't be longer than 64 characters and can only contain letters, numbers, spaces, and the following symbols: ( ) @ & + : . _ - ' ,";
export declare const CommonArgs: {
    string: () => ZodString;
    objectId: (fieldName: string) => z.ZodString;
};
export declare const AtlasArgs: {
    projectId: () => z.ZodString;
    organizationId: () => z.ZodString;
    clusterName: () => z.ZodString;
    connectionType: () => z.ZodDefault<z.ZodEnum<["standard", "private", "privateEndpoint"]>>;
    projectName: () => z.ZodString;
    username: () => z.ZodString;
    ipAddress: () => z.ZodString;
    cidrBlock: () => z.ZodString;
    region: () => z.ZodString;
    password: () => z.ZodString;
};
export declare function zEJSON(): z.AnyZodObject;
//# sourceMappingURL=args.d.ts.map