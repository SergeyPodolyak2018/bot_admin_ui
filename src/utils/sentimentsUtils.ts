import SmileyIcon from 'assets/svg/smiley.svg';
import SmileyMehIcon from 'assets/svg/smileyMeh.svg';
import SmileySadIcon from 'assets/svg/smileySad.svg';
import { InteractionMessage, Sentiments } from 'types';
export const getSentiment = (sentiment: string) => {
  if (sentiment === 'positive') return SmileyIcon;
  if (sentiment === 'negative') return SmileySadIcon;
  if (sentiment === 'neutral') return SmileyMehIcon;
  return '';
};
1;
export const areAllFieldsNaN = (obj: any) => {
  return Object.values(obj).every((value: any) => isNaN(value));
};

export const calculateSentimentPercentage = (messages: InteractionMessage[]): Sentiments => {
  const totalMessages = messages.length;
  const sentimentCounts = {
    positive: 0,
    neutral: 0,
    negative: 0,
  };

  for (const message of messages) {
    switch (message.sentiment) {
      case 'positive':
        sentimentCounts.positive++;
        break;
      case 'neutral':
        sentimentCounts.neutral++;
        break;
      case 'negative':
        sentimentCounts.negative++;
        break;
      case '':
        sentimentCounts.neutral++;
        break;
      default:
        break;
    }
  }

  const positivePercentage = +((sentimentCounts.positive / totalMessages) * 100).toFixed(2);
  const neutralPercentage = +((sentimentCounts.neutral / totalMessages) * 100).toFixed(2);
  const negativePercentage = +((sentimentCounts.negative / totalMessages) * 100).toFixed(2);

  return { positive: positivePercentage, neutral: neutralPercentage, negative: negativePercentage };
};
