import { IdeaNeedEnum } from 'apps/idea-service/src/utils/constants';

export class QueryIdeaVaultDto {
  ideaNeed?: IdeaNeedEnum;
  title?: string;
  spotlight?: boolean;
  category?: string;
  categories?: string[];
  user?: string;
}
