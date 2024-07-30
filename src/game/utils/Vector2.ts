export class Vector2 {
  constructor(public x: number, public y: number) {}

  static from(v: { x: number; y: number }): Vector2 {
    return new Vector2(v.x, v.y);
  }

  add(v: Vector2): Vector2 {
    return new Vector2(this.x + v.x, this.y + v.y);
  }

  subtract(v: Vector2): Vector2 {
    return new Vector2(this.x - v.x, this.y - v.y);
  }

  multiply(scalar: number): Vector2 {
    return new Vector2(this.x * scalar, this.y * scalar);
  }

  divide(scalar: number): Vector2 {
    return new Vector2(this.x / scalar, this.y / scalar);
  }

  magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize(): Vector2 {
    const mag = this.magnitude();
    return mag > 0 ? this.divide(mag) : new Vector2(0, 0);
  }

  rotate(angle: number): Vector2 {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Vector2(
      this.x * cos - this.y * sin,
      this.x * sin + this.y * cos
    );
  }

  static dot(a: Vector2, b: Vector2): number {
    return a.x * b.x + a.y * b.y;
  }

  static sqrMagnitude(v: Vector2): number {
    return v.x * v.x + v.y * v.y;
  }

  static distance(a: Vector2, b: Vector2): number {
    return Vector2.from(b).subtract(a).magnitude();
  }

  static angleBetween(a: Vector2, b: Vector2): number {
    return Math.atan2(b.y - a.y, b.x - a.x);
  }
}
