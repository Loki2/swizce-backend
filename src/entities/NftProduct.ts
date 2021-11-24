import { getModelForClass, prop, Ref } from '@typegoose/typegoose'
import { Field, ID, ObjectType } from 'type-graphql'; //Tell Used To Convert Type from Mongodb Model to Graphql Model
import { __Type } from 'graphql';
import { User } from './User';
// import { Typeservice } from './Typeservice';


@ObjectType({ description: 'NFT Product Model'}) //Export Objects To type graphql
export class Nftproduct {

  @Field(() => ID)
  id!: string;


  @Field()
  @prop({required: true})
  pub_key?: string;


  @Field()
  @prop({required: true})
  pri_key?: string;

  @Field(_type => [String])
  @prop({type: () => [String]})
  enc_info?: [string];


  @Field()
  @prop({required: true})
  price?: number;


  @Field()
  @prop({required: true, default: true })
  status?: boolean;

  @Field(_type => User)
  @prop({ ref: typeof User, required: true})
  user: Ref<User>;
}

export const NftproductModel = getModelForClass(Nftproduct);