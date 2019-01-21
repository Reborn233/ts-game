export interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget
}

export interface FileReaderProgressEvent extends ProgressEvent {
  target: FileReader
}
