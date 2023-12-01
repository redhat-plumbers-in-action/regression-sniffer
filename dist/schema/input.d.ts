import { z } from 'zod';
export declare const singleCommitMetadataSchema: z.ZodObject<{
    sha: z.ZodString;
    url: z.ZodString;
    message: z.ZodObject<{
        title: z.ZodString;
        cherryPick: z.ZodArray<z.ZodObject<{
            sha: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            sha: string;
        }, {
            sha: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        title: string;
        cherryPick: {
            sha: string;
        }[];
    }, {
        title: string;
        cherryPick: {
            sha: string;
        }[];
    }>;
}, "strip", z.ZodTypeAny, {
    url: string;
    sha: string;
    message: {
        title: string;
        cherryPick: {
            sha: string;
        }[];
    };
}, {
    url: string;
    sha: string;
    message: {
        title: string;
        cherryPick: {
            sha: string;
        }[];
    };
}>;
export type SingleCommitMetadata = z.infer<typeof singleCommitMetadataSchema>;
export declare const commitMetadataSchema: z.ZodArray<z.ZodObject<{
    sha: z.ZodString;
    url: z.ZodString;
    message: z.ZodObject<{
        title: z.ZodString;
        cherryPick: z.ZodArray<z.ZodObject<{
            sha: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            sha: string;
        }, {
            sha: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        title: string;
        cherryPick: {
            sha: string;
        }[];
    }, {
        title: string;
        cherryPick: {
            sha: string;
        }[];
    }>;
}, "strip", z.ZodTypeAny, {
    url: string;
    sha: string;
    message: {
        title: string;
        cherryPick: {
            sha: string;
        }[];
    };
}, {
    url: string;
    sha: string;
    message: {
        title: string;
        cherryPick: {
            sha: string;
        }[];
    };
}>, "many">;
export type CommitMetadata = z.infer<typeof commitMetadataSchema>;
export declare const pullRequestMetadataSchema: z.ZodObject<{
    number: z.ZodNumber;
    base: z.ZodString;
    url: z.ZodString;
    commits: z.ZodArray<z.ZodObject<{
        sha: z.ZodString;
        url: z.ZodString;
        message: z.ZodObject<{
            title: z.ZodString;
            cherryPick: z.ZodArray<z.ZodObject<{
                sha: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                sha: string;
            }, {
                sha: string;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            title: string;
            cherryPick: {
                sha: string;
            }[];
        }, {
            title: string;
            cherryPick: {
                sha: string;
            }[];
        }>;
    }, "strip", z.ZodTypeAny, {
        url: string;
        sha: string;
        message: {
            title: string;
            cherryPick: {
                sha: string;
            }[];
        };
    }, {
        url: string;
        sha: string;
        message: {
            title: string;
            cherryPick: {
                sha: string;
            }[];
        };
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    number: number;
    url: string;
    base: string;
    commits: {
        url: string;
        sha: string;
        message: {
            title: string;
            cherryPick: {
                sha: string;
            }[];
        };
    }[];
}, {
    number: number;
    url: string;
    base: string;
    commits: {
        url: string;
        sha: string;
        message: {
            title: string;
            cherryPick: {
                sha: string;
            }[];
        };
    }[];
}>;
export type PullRequestMetadata = z.infer<typeof pullRequestMetadataSchema>;
