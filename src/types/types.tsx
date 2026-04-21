import { Ref } from "react";

export type UserProps = {
  user: {
    username: string;
    email: string;
    avatar: string;
    provider: string;
    streak: {
      current: number;
      longest: number;
    };
  };
  userActivity: any;
  noOfChallenges: any;
}

export type Activity = {
  date: string;
  count: number;
};

// export type QuestionType = { statement: string };
export type QuestionType = {
  _id: string;
  statement: string;
  solved: boolean;
  result: string;
};

export type SolutionType = {
  challenge: string;
  statement: string;
  solution: string;
};

export type HeaderProps = {
  userInfo: any;
  challenge: any;
  logoutClick: () => void;
};

export type SidebarProps = {
  questionMap: boolean;
  questions: QuestionType[];
  completedQues?: QuestionType[];
  setQues: React.Dispatch<React.SetStateAction<number>>;
  setQuestionMap: React.Dispatch<React.SetStateAction<boolean>>;
};

export type QuestionSidebarProps = {
  questions: QuestionType[];
  completedQues?: { statement: string }[];
  setQues: React.Dispatch<React.SetStateAction<number>>;
};

export type EditorPanelProps = {
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
};

export type PreviewPanelProps = {
  html: string;
  output: string;
  compareSolution: () => Promise<void>;
  iframeRef: Ref<HTMLIFrameElement>;
};