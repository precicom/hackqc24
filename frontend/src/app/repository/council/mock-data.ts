import { DISCUSSION_POINTS } from "../discussion-points/mock-data";
import { Council } from "./classes";

export const MOCK_COUNCILS: Council[] = [
  {
    id: 1,
    title: 'Conseil 1',  
    date: '2021-01-01T00:00:00.000Z',
    youtube_link: 'https://www.youtube.com/watch?v=1',
    generated_summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec odio nec nunc vehicula tincidunt',
    discussion_points: DISCUSSION_POINTS
  },
  {
    id: 2,
    title: 'Conseil 2',  
    date: '2021-01-02T00:00:00.000Z',
    youtube_link: 'https://www.youtube.com/watch?v=2',
    generated_summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec odio nec nunc vehicula tincidunt',
    discussion_points: []
  },
  {
    id: 3,
    title: 'Conseil 3',  
    date: '2021-01-03T00:00:00.000Z',
    youtube_link: 'https://www.youtube.com/watch?v=3',
    generated_summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec odio nec nunc vehicula tincidunt',
    discussion_points: []
  },
  {
    id: 4,
    title: 'Conseil 4',  
    date: '2021-01-04T00:00:00.000Z',
    youtube_link: 'https://www.youtube.com/watch?v=4',
    generated_summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec odio nec nunc vehicula tincidunt',
    discussion_points: []
  },
  {
    id: 5,
    title: 'Conseil 5',  
    date: '2021-01-05T00:00:00.000Z',
    youtube_link: 'https://www.youtube.com/watch?v=5',
    generated_summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec odio nec nunc vehicula tincidunt',
    discussion_points: []
  },
  {
    id: 6,
    title: 'Conseil 6',  
    date: '2021-01-06T00:00:00.000Z',
    youtube_link: 'https://www.youtube.com/watch?v=6',
    generated_summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec odio nec nunc vehicula tincidunt',
    discussion_points: []
  } 
]