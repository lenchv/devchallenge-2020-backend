import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppExceptionsFilter } from './app-exceptions.filter';
import { AppController } from './app.controller';
import { MongoPeopleRepository } from './repositories/mongo/mongo-people.repository';
// import { MemoryPeopleRepository } from './repositories/memory/memory-people.repository';
// import { Neo4jPeopleRepository } from './repositories/neo4j/neo4j-people.repository';
// import { Neo4jModule } from 'nest-neo4j';
import { MessageService } from './services/message.service';
import { NotificationService } from './services/notification.service';
import { PeopleService } from './services/people.service';
import { Person, PersonSchema } from './models/person.model';

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRootAsync({
            useFactory: () => ({
                uri: process.env.MONGODB_URI,
            }),
        }),
        // Neo4jModule.forRootAsync({
        //     useFactory: () => ({
        //         scheme: process.env.NEO4J_SCHEME,
        //         host: process.env.NEO4J_HOST,
        //         port: process.env.NEO4J_PORT,
        //         username: process.env.NEO4J_USER,
        //         password: process.env.NEO4J_PASSWORD,
        //     }),
        // }),
        MongooseModule.forFeature([{ name: Person.name, schema: PersonSchema }]),
    ],
    controllers: [AppController],
    providers: [
        MessageService,
        NotificationService,
        PeopleService,
        {
            provide: 'PeopleRepository',
            useClass: MongoPeopleRepository,
        },
        {
            provide: APP_FILTER,
            useClass: AppExceptionsFilter,
        },
    ],
})
export class AppModule {}
