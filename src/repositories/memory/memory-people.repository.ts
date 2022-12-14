import { Injectable } from '@nestjs/common';
import { Relation } from '../../entities/relation';
import { Person } from '../../entities/person';
import { Id } from '../../valueObjects/id';
import { Criteria } from '../criteria';
import { Topic } from '../../valueObjects/topic';
import { TopicsCriteria } from './criterions/topics.criteria';
import { Level } from '../../valueObjects/level';
import { PersonCriteria } from './criterions/person.criteria';

@Injectable()
export class MemoryPeopleRepository {
    people: Person[] = [];

    async findById(id: Id): Promise<Person | undefined> {
        return this.people.find((person) => person.id.equalsTo(id));
    }

    async addPerson(person: Person): Promise<Person> {
        this.people.push(person);

        return person;
    }

    async updatePerson(person: Person): Promise<Person> {
        const p = await this.findById(person.id);

        p.setTopics(person.topics.map(String));

        return p;
    }

    async addPeople(people: Person[]): Promise<void> {
        this.people = this.people.concat(people);
    }

    async addRelations(person: Person, relations: Relation[]): Promise<Person> {
        person.setRelations(relations);

        return person;
    }

    async findByCriteria(criterions: Criteria<Person[]>[]): Promise<Person[]> {
        return criterions.reduce((people, criteria) => {
            return criteria.query(people);
        }, this.people);
    }

    async queryGraphForBroadcast(topics: Topic[], minTrustLevel: Level): Promise<Person[]> {
        return await this.findByCriteria([new TopicsCriteria(topics)]);
    }

    async getShortestPathIterator(
        personId: Id,
        topics: Topic[],
        minTrustLevel: Level,
    ): Promise<(id: []) => Promise<Person[]>> {
        return async (ids: Id[]) => {
            return this.findByCriteria([new PersonCriteria(ids)]);
        };
    }

    async wipe(): Promise<void> {
        this.people = [];
    }
}
