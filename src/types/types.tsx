export type UserProps = {
    username: string;
    email: string;
    avatar: string;
    challenges: string[];
    streak: {
      current: number;
      longest: number;
    };
    activity: {
      date: string;
      active: boolean;
      count: number;
    };
}

export type QuestionType = { statement: string };
export type SolutionType = { statement: string; solution: string };

export type HeaderProps = {
  userInfo: any;
  questions: string[];
  ques: number;
  setQues: React.Dispatch<React.SetStateAction<number>>;
  completedQues: QuestionType[];
  questionMap: boolean;
  setQuestionMap: React.Dispatch<React.SetStateAction<boolean>>;
  logoutClick: () => void;
  nextClick: () => void;
  prevClick: () => void;
};

export type SidebarProps = {
  questionMap: boolean;
  questions: string[];
  completedQues: QuestionType[];
  setQues: React.Dispatch<React.SetStateAction<number>>;
  setQuestionMap: React.Dispatch<React.SetStateAction<boolean>>;
};

export type QuestionSidebarProps = {
  questions: string[];
  completedQues: { statement: string }[];
  setQues: React.Dispatch<React.SetStateAction<number>>;
};

export type EditorPanelProps = {
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  questions: string[];
  ques: number;
  completedQues: QuestionType[];
  solutions: SolutionType[];
};

export type PreviewPanelProps = {
  html: string;
  output: string;
  compareSolution: () => Promise<void>;
};