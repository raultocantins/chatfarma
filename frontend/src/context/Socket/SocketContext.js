import { createContext } from "react";
import openSocket from "socket.io-client";
import { getBackendUrl } from "../../config.js";
import { isExpired } from "react-jwt";

class ManagedSocket {
  constructor(socketManager) {
    this.socketManager = socketManager;
    this.socket = socketManager.currentSocket;
    this.callbacks = [];
    this.joins = [];

    this.socket.on("connect", () => {
      if (this.socket.io.opts.query?.r && !this.socket.recovered) {
        const refreshJoinsOnReady = () => {
          for (const j of this.joins) {
            console.debug("refreshing join", j);
            this.socket.emit(`join${j.event}`, ...j.params);
          }
          this.socket.off("ready", refreshJoinsOnReady);
        };
        for (const j of this.callbacks) {
          this.socket.off(j.event, j.callback);
          this.socket.on(j.event, j.callback);
        }

        this.socket.on("ready", refreshJoinsOnReady);
      }
    });
  }

  on(event, callback) {
    if (event === "ready" || event === "connect") {
      return this.socketManager.onReady(callback);
    }
    this.callbacks.push({ event, callback });
    return this.socket.on(event, callback);
  }

  off(event, callback) {
    const i = this.callbacks.findIndex((c) => c.event === event && c.callback === callback);
    this.callbacks.splice(i, 1);
    return this.socket.off(event, callback);
  }

  emit(event, ...params) {
    if (event.startsWith("join")) {
      this.joins.push({ event: event.substring(4), params });
      console.log("Joining", { event: event.substring(4), params });
    }
    return this.socket.emit(event, ...params);
  }

  disconnect() {
    for (const j of this.joins) {
      this.socket.emit(`leave${j.event}`, ...j.params);
    }
    this.joins = [];
    for (const c of this.callbacks) {
      this.socket.off(c.event, c.callback);
    }
    this.callbacks = [];
  }
}

class DummySocket {
  on(..._) { }
  off(..._) { }
  emit(..._) { }
  disconnect() { }
}

const socketManager = {
  currentUserId: -1,
  currentSocket: null,
  socketReady: false,

  GetSocket: function () {
    let userId = localStorage.getItem("userId");

    if (!userId && !this.currentSocket) {
      return new DummySocket();
    }

    if (userId !== this.currentUserId) {
      if (this.currentSocket) {
        console.warn("closing old socket - user changed");
        this.currentSocket.removeAllListeners();
        this.currentSocket.disconnect();
        this.currentSocket = null;
        this.currentUserId = null;
      }

      let token = JSON.parse(localStorage.getItem("token"));
      if (!token) {
        return new DummySocket();
      }

      if (isExpired(token)) {
        console.warn("Expired token, waiting for refresh");
        setTimeout(() => {
          const currentToken = JSON.parse(localStorage.getItem("token"));
          if (isExpired(currentToken)) {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
          }
          window.location.reload();
        }, 1000);
        return new DummySocket();
      }

      this.currentUserId = userId;

      this.currentSocket = openSocket(getBackendUrl(), {
        transports: ["websocket"],
        pingTimeout: 18000,
        pingInterval: 18000,
        query: { token },
      });

      this.currentSocket.io.on("reconnect_attempt", () => {
        this.currentSocket.io.opts.query.r = 1;
        token = JSON.parse(localStorage.getItem("token"));
        if (isExpired(token)) {
          console.warn("Refreshing");
          window.location.reload();
        } else {
          console.warn("Using new token");
          this.currentSocket.io.opts.query.token = token;
        }
      });

      this.currentSocket.on("disconnect", (reason) => {
        console.warn(`socket disconnected because: ${reason}`);
        if (reason.startsWith("io server disconnect")) {
          console.warn("trying to reconnect", this.currentSocket);
          token = JSON.parse(localStorage.getItem("token"));

          if (isExpired(token)) {
            console.warn("Expired token - refreshing");
            window.location.reload();
            return;
          }
          console.warn("Reconnecting using refreshed token");
          this.currentSocket.io.opts.query.token = token;
          this.currentSocket.io.opts.query.r = 1;
          this.currentSocket.connect();
        }
      });

      this.currentSocket.on("connect", (...params) => {
        console.warn("socket connected", params);
      });

      this.currentSocket.onAny((event, ...args) => {
        console.debug("Event: ", { socket: this.currentSocket, event, args });
      });

      this.onReady(() => {
        this.socketReady = true;
      });
    }

    return new ManagedSocket(this);
  },

  onReady: function (callbackReady) {
    if (this.socketReady) {
      callbackReady();
      return;
    }

    if (!this.currentSocket) {
      return;
    }

    this.currentSocket.once("ready", () => {
      callbackReady();
    });
  },

  onConnect: function (callbackReady) {
    this.onReady(callbackReady);
  },
};

const SocketContext = createContext();

export { SocketContext, socketManager };

