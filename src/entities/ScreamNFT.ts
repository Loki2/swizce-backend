import { getModelForClass, prop, Ref } from '@typegoose/typegoose'
import { Field, ID, ObjectType } from 'type-graphql'; //Tell Used To Convert Type from Mongodb Model to Graphql Model
import { __Type } from 'graphql';
import { User } from './User';
import { Scream } from './Scream';
// import { Typeservice } from './Typeservice';


@ObjectType({ description: 'Scream NFT Model'}) //Export Objects To type graphql
export class Screamnft {

  @Field(() => ID)
  id!: string;


  @Field()
  @prop({required: true, maxlength: 120})
  pub_key?: string;


  @Field()
  @prop({required: true})
  pri_key?: string;


  @Field()
  @prop({required: true})
  price?: number;


  @Field()
  @prop({required: true, default: true })
  status?: boolean;

  @Field(_type => Scream)
  @prop({ ref: typeof Scream, required: true})
  scream_nft: Ref<Scream>;

  @Field(_type => User)
  @prop({ ref: typeof User, required: true})
  user: Ref<User>;
}

export const ScreamnftModel = getModelForClass(Screamnft);