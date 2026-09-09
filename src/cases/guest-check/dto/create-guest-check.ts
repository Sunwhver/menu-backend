import { IsNotEmpty, IsString, IsUUID, MaxLength } from "class-validator";

export class CreateGestCheckDto{
    @IsUUID()
    spotId: string;
}