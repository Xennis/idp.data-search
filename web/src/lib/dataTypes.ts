export type IdpEntry = {
    tm: string;
    sourceFiles: string[];
    terms: string[];
    title: string[];
    material: string[];
    originDatesWhen?: string[];
    originDatesNotbefore?: string[];
    originDatesNotafter?: string[];
    originPlaces: string[];
    provenancesLocated: string[];
    mainLang?: string[];
    sourceAuthority: string[];
    sourceAvailability: string[];
};
