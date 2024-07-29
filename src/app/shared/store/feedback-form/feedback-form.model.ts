import { FormControl } from "@angular/forms";

export interface FeedbackModel {
    id: number;
    question: string;
    isRatingType: number;
    isDeleted: boolean;
    answer: string;
  }

  export interface feedbackSaveModel{
    customerId: number;
    questionAnswer: {
      1: string;
      2: string;
      3: string;
      4: string;
      5: string;
      6: string;
    }
  }

  export function createFeedbackSaveModel({
    customerId = 0,
    questionAnswer = {
      1: "1",
      2: "1",
      3: "1",
      4: "1",
      5: "1",
      6: "1"
    }
  }: Partial<feedbackSaveModel>) {
    return {
      customerId,
      questionAnswer
    } as feedbackSaveModel;
  }

  export function createFeedbackModel({
    id = 0,
    question = "",
    isRatingType = 0,
    answer = ""
  }: Partial<FeedbackModel>) {
    return {
      id,
      question,
      isRatingType,
      answer
    } as FeedbackModel;
  }


  export interface feedbackForm{
    ans1: FormControl<number>;
    ans2: FormControl<number>;
    ans3: FormControl<number>;
    ans4: FormControl<number>;
    ans5: FormControl<string>;
  }