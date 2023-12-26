import { Column, Entity } from 'typeorm';

@Entity({
  name: 'currency',
})
export class Currency {
  @Column({
    primary: true,
  })
  id: number;

  @Column({ name: 'name', length: 15, nullable: false })
  name: string;

  @Column({ name: 'code', length: 10, nullable: false })
  code: string;

  constructor(partial: Partial<Currency>) {
    Object.assign(this, partial);
  }
}
