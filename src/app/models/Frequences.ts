export class Frequences {
  enum = Frequency;
  keys = Object.keys(this.enum).filter(k => typeof this.enum[k as any] === "number"); // ["A", "B"]
  descrs = this.keys.map(k => {
    switch (+this.enum[k as any]) {
      case Frequency.WEEKLY:
        return "Par semaine"
      case Frequency.EVERY_2_WEEKS:
        return "À chaque deux semaine"
      case Frequency.MONTHLY:
        return "Par mois"
      case Frequency.BIMONTHLY:
        return "À chaque deux mois"
      case Frequency.YEARLY:
        return "Par année"
      default:
        return 0
    }
  });
  values = this.keys.map(k => this.enum[k as any]); // [0, 1]
}
export enum Frequency
{
  WEEKLY = 52,
  EVERY_2_WEEKS = 26,
  MONTHLY = 12,
  BIMONTHLY = 6,
  YEARLY = 1,
}
