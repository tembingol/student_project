
export type videoType = {
    author: string;
    availableResolutions: string[] | undefined;
    canBeDownloaded: boolean | undefined;
    createdAt: Date;
    id: number;
    minAgeRestriction: null | string;
    publicationDate: Date;
    title: string;

}