import {
  IdeaNeedEnum,
  IdeaTypeEnum,
} from 'apps/idea-service/src/utils/constants';
import { AmountWithCurrency } from '../utils/amount-with-currency.dto';
import { LikeModel } from './like.model';
import { CommentModel } from './comment.model';
import { UserModel } from './user.model';
import { FileModel } from './file.model';
import { ShareModel } from './share.model';

export class IdeaModel {
  id: string;

  userId: string;

  user?: UserModel;

  title: string;

  description: string;

  categories: string[];

  media: FileModel[];

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
  shares: ShareModel[];

  createdAt: Date;

  updatedAt: Date;
}
