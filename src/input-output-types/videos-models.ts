
export type VideoInputModel = {
    author: string;
    availableResolutions: Array<string> | undefined;
    canBeDownloaded: boolean | undefined;
    createdAt: Date;
    minAgeRestriction: null | string;
    publicationDate: Date | undefined;
    title: string;
}

export type VideoViewModel = {
    author: string;
    availableResolutions: Array<string> | undefined;
    canBeDownloaded: boolean | undefined;
    createdAt: Date;
    id: number;
    minAgeRestriction: null | string;
    publicationDate: Date | undefined;
    title: string;
}