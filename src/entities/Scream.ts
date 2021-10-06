import { getModelForClass, prop, Ref } from '@typegoose/typegoose';
import { Field, ID, ObjectType } from 'type-graphql'; //Tell Used To Convert Type from Mongodb Model to Graphql Model
import { ScreamStatus } from '../types';
import { __Type } from 'graphql';
import { User } from './User';
import { Comment } from './Comment';


@ObjectType({ description: 'Scream Model'}) //Export Objects To type graphql
export class Scream {
  @Field(() => ID)
  id!: string

  @Field(_type => [String])
  @prop({type: () => [String]})
  videoUrl?: [string];

  @Field(_type => [String])
  @prop({type: () => [String]})
  imageUrl?: [string];

  @Field()
  @prop({required: true, maxlength: 515})
  description?: string;


  @Field(_type => [Comment])
  @prop({required: true, ref: typeof [Comment]})
  comments?: Ref<Comment>[];

  @Field()
  @prop({required: true, default: 0})
  likes?: number;

  @Field()
  @prop({required: true, default: 0})
  shares?: number;

  @Field(() => [String])
  @prop({ type: String, enum: ScreamStatus, default: [ScreamStatus.public] })
  status!: ScreamStatus[]

  @Field()
  @prop({ default: () => Date.now()})
  createdAt!: Date;


  @Field(_type => User)
  @prop({ ref: typeof User, required: true})
  user: Ref<User>
}

export const ScreamModel = getModelForClass(Scream);