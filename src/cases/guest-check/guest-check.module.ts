import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GuestCheckController } from "./guest-check.controller";
import { GuestCheckService } from "./guest-check.service";
import { GuestCheck } from "./guest-check.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Spot, GuestCheck])],
    controllers: [GuestCheckController],
    providers: [GuestCheckService],
    exports: [GuestCheckService]
})
export class GuestCheckModule{}