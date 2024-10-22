
export type videoType = {
    author: string;
    availableResolutions: Array<string> | undefined;
    canBeDownloaded: boolean | undefined;
    createdAt: Date;
    id: number;
    minAgeRestriction: null | string;
    publicationDate: Date | undefined;
    title: string;

}