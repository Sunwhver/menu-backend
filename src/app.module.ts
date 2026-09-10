import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from './cases/categories/category.module';
import { ProductModule } from './cases/products/product.module';
import { SpotModule } from './cases/spots/spot.module';
import { GuestCheckModule } from './cases/guest-check/guest-check.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseURL = configService.get<string>('DATABASE_URL');
        const dbSchema = configService.get<string>('DATABASE_SCHEMA', 'public');

        if (!databaseURL) {
          throw new Error('A variável de ambiente DATABASE_URL não foi encontrada!');
        }

        return {
          type: 'postgres',
          url: databaseURL,
          schema: dbSchema,
          autoLoadEntities: true,
          synchronize: true,
          ssl: false
        }
      }
    }),
    CategoryModule,
    ProductModule,
    SpotModule,
    GuestCheckModule
  ],
})
export class AppModule {}