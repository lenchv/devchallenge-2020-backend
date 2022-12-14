import { Topic } from '../../../valueObjects/topic';
import { Criteria } from '../../criteria';

export class TopicsCriteria implements Criteria<string> {
    constructor(private topics: Topic[]) {}

    query(filter: string): string {
        if (this.topics.length === 0) {
            return '';
        }
        return `all(word IN ["${this.topics.join('", "')}"] WHERE word in m.topics)`;
    }
}
