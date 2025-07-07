
export enum HighlightID {
  WORKING_TREE,
  STAGING_AREA,
  LOCAL_REPO,
  REMOTE_TRACKING_REF,
  REMOTE_REPO,
  PULL,
  CHECKOUT,
  MERGE_REBASE
}

export interface StepInfo {
  emoji: string;
  title: string;
  description: string;
  example: string;
  commandLabel: string;
  command: string;
  highlight: HighlightID;
}
