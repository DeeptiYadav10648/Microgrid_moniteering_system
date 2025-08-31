import { type User, type InsertUser, type EnergyData, type InsertEnergyData, type Alert, type InsertAlert } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getCurrentEnergyData(): Promise<EnergyData | undefined>;
  getEnergyDataHistory(hours?: number): Promise<EnergyData[]>;
  createEnergyData(data: InsertEnergyData): Promise<EnergyData>;
  
  getAlerts(limit?: number): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  markAlertAsRead(id: string): Promise<Alert | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private energyData: Map<string, EnergyData>;
  private alerts: Map<string, Alert>;

  constructor() {
    this.users = new Map();
    this.energyData = new Map();
    this.alerts = new Map();
    
    // Initialize with some sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create initial energy data point
    const initialEnergyData: EnergyData = {
      id: randomUUID(),
      timestamp: new Date(),
      solarGeneration: 12.3,
      windGeneration: 8.7,
      batteryLevel: 84,
      batteryHealth: 96,
      batteryTemperature: 23,
      batteryCycles: 1247,
      gridStatus: true,
      gridLoad: 67,
      gridFrequency: 50.02,
      householdConsumption: 6.8,
      totalGeneration: 21.0,
      totalConsumption: 6.8,
      efficiency: 92.6,
    };
    this.energyData.set(initialEnergyData.id, initialEnergyData);

    // Create sample alerts
    const alerts: Alert[] = [
      {
        id: randomUUID(),
        title: "Battery temperature elevated",
        message: "Battery temperature is above normal range",
        type: "warning",
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        isRead: false,
      },
      {
        id: randomUUID(),
        title: "Peak generation reached",
        message: "Solar panels reached maximum output capacity",
        type: "info",
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        isRead: false,
      },
      {
        id: randomUUID(),
        title: "System optimization complete",
        message: "Energy system optimization has been completed successfully",
        type: "success",
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        isRead: false,
      },
    ];

    alerts.forEach(alert => this.alerts.set(alert.id, alert));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getCurrentEnergyData(): Promise<EnergyData | undefined> {
    const dataArray = Array.from(this.energyData.values());
    return dataArray.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
  }

  async getEnergyDataHistory(hours: number = 24): Promise<EnergyData[]> {
    const now = new Date();
    const cutoff = new Date(now.getTime() - hours * 60 * 60 * 1000);
    
    return Array.from(this.energyData.values())
      .filter(data => data.timestamp >= cutoff)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  async createEnergyData(insertData: InsertEnergyData): Promise<EnergyData> {
    const id = randomUUID();
    const data: EnergyData = { 
      solarGeneration: 0,
      windGeneration: 0,
      batteryLevel: 0,
      batteryHealth: 100,
      batteryTemperature: 25,
      batteryCycles: 0,
      gridStatus: true,
      gridLoad: 0,
      gridFrequency: 50,
      householdConsumption: 0,
      totalGeneration: 0,
      totalConsumption: 0,
      efficiency: 0,
      ...insertData, 
      id, 
      timestamp: new Date(),
    };
    this.energyData.set(id, data);
    return data;
  }

  async getAlerts(limit: number = 10): Promise<Alert[]> {
    return Array.from(this.alerts.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const id = randomUUID();
    const alert: Alert = { 
      ...insertAlert, 
      id, 
      timestamp: new Date(),
      isRead: false,
    };
    this.alerts.set(id, alert);
    return alert;
  }

  async markAlertAsRead(id: string): Promise<Alert | undefined> {
    const alert = this.alerts.get(id);
    if (alert) {
      alert.isRead = true;
      this.alerts.set(id, alert);
    }
    return alert;
  }
}

export const storage = new MemStorage();
