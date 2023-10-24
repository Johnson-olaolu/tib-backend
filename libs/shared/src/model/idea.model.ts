import {
  IdeaNeedEnum,
  IdeaTypeEnum,
} from 'apps/idea-service/src/utils/constants';
import { AmountWithCurrency } from '../utils/amount-with-currency.dto';
import { LikeModel } from './like.model';
import { CommentModel } from './comment.model';

export class IdeaModel {
  id: string;

  userId: string;

  title: string;

  description: string;

  categories: string[];

  media: string[];

  collaborators: string[];

  ideaType: IdeaTypeEnum;

  ideaNeed: IdeaNeedEnum;

  location: string;

  website: string;

  role: string;

  competitors: string[];

  additionalAttachment: string[];

  ideaCost: AmountWithCurrency;

  sellingReason: string;

  valuation: AmountWithCurrency;

  estimationCost: AmountWithCurrency;

  ROITimeline: string;

  projectedRevenue: AmountWithCurrency;

  fundingStage: string;

  totalMoneyRaised: AmountWithCurrency;

  executionCost: AmountWithCurrency;

  seeking: string;

  sharesRating: number;

  comments: CommentModel[];

  likes: LikeModel[];

  createdAt: Date;

  updatedAt: Date;
}
