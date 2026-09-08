import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseURL = ConfigService.get<string>('DATABASE_URL');
        const dbSchema = ConfigService.get<string>('DATABASE_SCHEMA', 'public');

        if(!databaseURL) {
          throw new Error('A variável de ambiente DATABASE_URL')
        }

        return {
          type: 'postgres',
          url: databaseURL,
          

        }

      }
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
