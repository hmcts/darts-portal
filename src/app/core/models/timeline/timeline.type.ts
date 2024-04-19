import { User } from '@admin-types/index';
import { DateTime } from 'luxon';

export type TimelineItem = {
  id: number;
  title: string;
  dateTime: DateTime;
  descriptionLines: string[];
  user: Pick<User, 'id' | 'fullName' | 'emailAddress'>;
};
