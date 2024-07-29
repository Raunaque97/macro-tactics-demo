export class HealthComponent {
  maxHealth: number;
  currentHealth: number;

  constructor(maxHealth: number) {
    this.maxHealth = maxHealth;
    this.currentHealth = maxHealth;
  }

  takeDamage(amount: number) {
    this.currentHealth = Math.max(0, this.currentHealth - amount);
  }

  heal(amount: number) {
    this.currentHealth = Math.min(this.maxHealth, this.currentHealth + amount);
  }
}

export class ResourceComponent {
  amount: number;
  productionRate: number;

  constructor(initialAmount: number, productionRate: number) {
    this.amount = initialAmount;
    this.productionRate = productionRate;
  }

  update(delta: number) {
    this.amount += this.productionRate * (delta / 1000);
  }

  consume(amount: number): boolean {
    if (this.amount >= amount) {
      this.amount -= amount;
      return true;
    }
    return false;
  }
}
