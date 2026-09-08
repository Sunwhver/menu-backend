import { Repository } from "typeorm";
import { Product } from "./product.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product";
import { UpdateProductDto } from "./dto/update-product";
import { Category } from "./category.entity";

@Injectable()
export class ProductService {

    constructor(
        @InjectRepository(Product) 
        private readonly productRepository: Repository<Product>,

        @InjectRepository(Category) 
        private readonly categoryRepository: Repository<Category>,
    ) {

    }

    findAll(): Promise<Product[]> {
        return this.productRepository.find({
            order: { name: 'ASC' },
            relations: { category: true }
        });
    }

    async findOne(id: string): Promise<Product> {
        const product = await this.productRepository.findOne({
            where: { id },            
            relations: { category: true }
        });
        
        if (!product) {
            throw new NotFoundException('Produto não encontrada!');
        }

        return product;
    }

    async create(dto: CreateProductDTO): Promise<Product> {

        const category = dto.categoryId ? await this.getActiveCategory(dto.categoryId) : null;

        const product = this.productRepository.create({ 
            name: dto.name?.trim(),
            description: dto.description,
            price: dto.price,
            picture: dto.picture,
            active: true,
            category
         });

         return this.productRepository.save(product);
    }

    async update(id: string, dto: UpdateProductDTO): Promise<Product> {
        const product = await this.findOne(id);

        if (dto.name !== undefined) {
            product.name = dto.name;
        }

        if (dto.description !== undefined) {
            product.description = dto.description;
        }

        if (dto.price !== undefined) {
            product.price = dto.price;
        }

        if (dto.picture !== undefined) {
            product.picture = dto.picture;
        }

        if (dto.active !== undefined) {
            product.active = dto.active;
        }

        if (dto.categoryId !== undefined) {
            product.category = dto.categoryId ? await this.getActiveCategory(dto.categoryId) : null;
        }

        return this.productRepository.save(product);
    }

    async remove(id: string): Promise<void> {
        const product = await this.findOne(id);

        await this.productRepository.save(product);
    }

    private async getActiveCategory(id: string): Promise<Category> {
        const category = await this.categoryRepository.findOneBy({ id, active: true });

        if (!category) {
            throw new NotFoundException("Nenhuma categoria ativa foi encontrada!");
        }
        
        return category
    }
}