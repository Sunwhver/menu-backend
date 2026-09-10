import { Repository } from 'typeorm';
import { InjectRepository } from "@nestjs/typeorm";
import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { GuestCheck, GuestCheckStatus } from "./guest-check.entity";
import { Spot } from "../spots/spot.entity";

@Injectable()
export class GuestCheckService {
    
    constructor(
        @InjectRepository(GuestCheck)
        private readonly guestCheckRepository: Repository<GuestCheck>,
        
        @InjectRepository(Spot)
        private readonly spotRepository: Repository<Spot>

    ) {}

    async create(dto: CreateGuestCheckDto): Promise<GuestCheck> {

        // Regra #1: Não se abre comanda em mesa inexistente
        const spot = await this.spotRepository.findOneBy ({
            id: dto.spotId,
            active: true
        });

        if (!spot) {
            throw new NotFoundException('Não foi encontrada uma mesa ativa com esse ID');
        }

        // Regra #2: Não se abre comanda em mesa que EXISTA uma comanda aberta
        const opened = await this.guestCheckRepository.exists({
            where: { spot : { id: dto.spotId }, status: GuestCheckStatus.OPENED }
        })

        if (opened) {
            throw new ConflictException('A mesa já possuí uma comanda em aberto');
        }

        // Ao chegar aqui, funcionou e irá gravar o registro
        const GuestCheck = this.guestCheckRepository.create({
            spot: Spot,
            status: GuestCheckStatus.OPENED
        });

        return this.guestCheckRepository.save(GuestCheck);

    }

    async findOne(id: string): Promise<GuestCheck>{
        const spot = await this.guestCheckRepository.findOneBy({ id })    

        if(!GuestCheck) {
            throw new NotFoundException('Comanda não encontrada!');
        }

        return GuestCheck;
    }

    close(id: string): Promise<GuestCheck> {
        const GuestCheck = await this.findOne(id);

        // Regra #1: Só pode fechar uma comanda aberta
        if (GuestCheck.status === GuestCheckStatus.CLOSED) {
            throw new BadRequestException('A comanda já está fechada');
        }

        // Regra #2: Não é possível fechar uma comanda com pedidos que não foram entregues
        //TO_DO: Implementar isso depois (dívida técnica)

        // Se chegou aqui, deu certo!
        GuestCheck.status = GuestCheckStatus.CLOSED;

        return this.guestCheckRepository.save(GuestCheck);
    }

    findOpenedBySpotId(spotId: string): Promise<GuestCheck | null> {
        return this.guestCheckRepository.findOne({
            where: {
                spot: { id: spotId },
                status: GuestCheckStatus.OPENED
            },
            relations: { spot: true }
        })
    }

    async findOrCreateOpened(spotId: string): promise<GuestCheck> {
        const opened = await this.findOpenedBySpotId(spotId);

        // Fluxo do SIM
        if (opened) {
            return: opened;
        }

        return this.create({ spotId })

    }

}