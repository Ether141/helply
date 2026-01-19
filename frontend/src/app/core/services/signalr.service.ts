import { Injectable } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  IHttpConnectionOptions,
  LogLevel
} from '@microsoft/signalr';

import { environment } from '../../../environments/environment';
import { AuthTokenStorage } from '../auth/auth-token.storage';

@Injectable({ providedIn: 'root' })
export class SignalrService {
  private connection: HubConnection | null = null;

  constructor(private readonly authTokenStorage: AuthTokenStorage) {}

  /**
   * Tworzy i uruchamia połączenie SignalR.
   * Domyślnie łączy się do environment.signalRHubUrl (dev: http://localhost:4200/hubs).
   */
  async start(hubUrl: string = environment.signalRHubUrl): Promise<void> {
    console.log("Starting SignalR...");
    if (!this.connection) {
      this.connection = this.buildConnection(hubUrl);
    }

    if (this.connection.state === HubConnectionState.Connected) {
      return;
    }

    await this.connection.start().finally(() => {
      console.log(`SignalR connected: ${this.connection?.state === HubConnectionState.Connected}`);
    });
    
  }

  async stop(): Promise<void> {
    if (!this.connection) {
      return;
    }

    if (this.connection.state === HubConnectionState.Disconnected) {
      return;
    }

    await this.connection.stop();
  }

  isConnected(): boolean {
    return this.connection?.state === HubConnectionState.Connected;
  }
  
  on<TArgs extends unknown[]>(eventName: string, handler: (...args: TArgs) => void): void {
    const connection = this.getConnection();
    connection.on(eventName, handler as (...args: unknown[]) => void);
  }

  off(eventName: string, handler?: (...args: unknown[]) => void): void {
    const connection = this.getConnection();

    if (handler) {
      connection.off(eventName, handler);
    } else {
      connection.off(eventName);
    }
  }

  invoke<TResult = void>(methodName: string, ...args: unknown[]): Promise<TResult> {
    const connection = this.getConnection();
    return connection.invoke<TResult>(methodName, ...args);
  }

  private buildConnection(hubUrl: string): HubConnection {
    const options: IHttpConnectionOptions = {
      accessTokenFactory: () => this.authTokenStorage.getAccessToken() ?? ''
    };

    const connection = new HubConnectionBuilder()
      .withUrl(hubUrl, options)
      .withAutomaticReconnect()
      .withServerTimeout(10000)
      .build();

    connection.serverTimeoutInMilliseconds = 120_000;
    connection.keepAliveIntervalInMilliseconds = 15_000;
    
    return connection;
  }

  private getConnection(): HubConnection {
    if (!this.connection) {
      throw new Error('SignalR connection not initialized. Call start() first.');
    }

    return this.connection;
  }
}
