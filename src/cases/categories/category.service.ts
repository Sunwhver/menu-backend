import { Repository } from "typeorm";
import { Category } from "./category.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category";
import { UpdateCategoryDto } from "./dto/update-category";

export class CategoryService {

    constructor( 
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>
    ) {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>) {
    }

    findAll(): Promise<Category[]> {
        return this.categoryRepository.find({
            order: {name: 'ASC'}
        });
    }

    findOne(): Promise<Category> {
        async findOne(id: string): Promise<Category>{
        const category = await this.categoryRepository.findOneBy({ id })    

        if(!category) {
            throw new NotFoundException('Categoria não encontrada!');
        }

        return category;
    }

    create(): Promise<Category> {
        create(dto: CreateCategoryDto): Promise<Category> {

        const category = this.categoryRepository.create({
            ...dto,
            name: dto.name,
            active: true 
        });

        return this.categoryRepository.save(category);
    }

    update(): Promise<Category> {
        async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
        const category = await this.findOne(id);

        if (dto.name !== undefined) {
            category.name = dto.name;
        }

        if (dto.active !== undefined) {
            category.active = dto.active;
        }

        return this.categoryRepository.save(category);
    }

    remove(): Promise<void>  {
        async remove(id: string): Promise<void>{
        const category = await this.findOne(id);
        await this.categoryRepository.remove(category)
    }

}