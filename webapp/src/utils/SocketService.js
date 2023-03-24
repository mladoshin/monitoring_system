import { io } from "socket.io-client";

export default class SocketService {
  static instance;

  constructor() {
    if (SocketService.instance) {
      return SocketService.instance;
    }

    this.socket = io("ws://localhost:3000", {
      reconnectionDelayMax: 10000,
    });

    SocketService.instance = this
  }
}
