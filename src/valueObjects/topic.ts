import { LogicException } from '../exceptions/logic.exception';

export class Topic {
    public readonly value: string;

    constructor(value: string | Topic) {
        if (value instanceof Topic) {
            this.value = value.value;
            return;
        }

        if (!value) {
            throw new LogicException('topic cannot be empty');
        }

        if (typeof value !== 'string') {
            throw new LogicException('topic must be string');
        }

        this.value = String(value);
    }

    toString(): string {
        return this.value;
    }

    equalsTo(topic: Topic): boolean {
        return this.value === topic.value;
    }
}
