import { Currency } from '../../../modules/currency/entities/currency.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Exchange {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Currency)
  @JoinColumn()
  fromCurrency: Currency;

  @OneToOne(() => Currency)
  @JoinColumn()
  toCurrency: Currency;

  @Column({
    name: 'exchange_rate',
    type: 'float',
    nullable: false,
  })
  exchangeRate: number;

  constructor(partial: Partial<Exchange>) {
    Object.assign(this, partial);
  }
}
