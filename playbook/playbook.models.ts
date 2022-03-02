export interface PlaybookSettings {
  playerColor: string;
  playerSize: number;
  pathStrokeColor: string;
}

export interface PlaybookPlayer {
  /// should be used as unique identifier
  id: number;
  // x-coordinate inside canvas
  x: number;
  // y-coordinate inside canvas
  y: number;
  /// is draggable inside canvas
  draggable: boolean;
  /// title
  title: string;

  //
  active: boolean;
}
