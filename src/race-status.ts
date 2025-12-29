export class RaceStatus {
  private static readonly ID_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  private running = true;
  public readonly raceId = RaceStatus.ID_CHARS[Math.floor(Math.random() * 36)] + RaceStatus.ID_CHARS[Math.floor(Math.random() * 36)];

  public isRunning(): boolean {
    return this.running;
  }

  public setRaceOver() {
    this.running = false;
  }
}
