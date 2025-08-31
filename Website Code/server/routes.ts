import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEnergyDataSchema, insertAlertSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get current energy data
  app.get("/api/energy/current", async (req, res) => {
    try {
      const data = await storage.getCurrentEnergyData();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch current energy data" });
    }
  });

  // Get energy data history
  app.get("/api/energy/history", async (req, res) => {
    try {
      const hours = parseInt(req.query.hours as string) || 24;
      const data = await storage.getEnergyDataHistory(hours);
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch energy data history" });
    }
  });

  // Create new energy data point
  app.post("/api/energy", async (req, res) => {
    try {
      const validatedData = insertEnergyDataSchema.parse(req.body);
      const data = await storage.createEnergyData(validatedData);
      res.json(data);
    } catch (error) {
      res.status(400).json({ message: "Invalid energy data" });
    }
  });

  // Get alerts
  app.get("/api/alerts", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const alerts = await storage.getAlerts(limit);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });

  // Create new alert
  app.post("/api/alerts", async (req, res) => {
    try {
      const validatedAlert = insertAlertSchema.parse(req.body);
      const alert = await storage.createAlert(validatedAlert);
      res.json(alert);
    } catch (error) {
      res.status(400).json({ message: "Invalid alert data" });
    }
  });

  // Mark alert as read
  app.patch("/api/alerts/:id/read", async (req, res) => {
    try {
      const alert = await storage.markAlertAsRead(req.params.id);
      if (!alert) {
        return res.status(404).json({ message: "Alert not found" });
      }
      res.json(alert);
    } catch (error) {
      res.status(500).json({ message: "Failed to update alert" });
    }
  });

  // Simulate real-time data updates
  app.post("/api/energy/simulate", async (req, res) => {
    try {
      const current = await storage.getCurrentEnergyData();
      if (!current) {
        return res.status(404).json({ message: "No current data found" });
      }

      // Generate realistic fluctuations
      const newData = {
        solarGeneration: Math.max(0, current.solarGeneration + (Math.random() - 0.5) * 2),
        windGeneration: Math.max(0, current.windGeneration + (Math.random() - 0.5) * 1.5),
        batteryLevel: Math.max(0, Math.min(100, current.batteryLevel + (Math.random() - 0.5) * 1)),
        batteryHealth: current.batteryHealth,
        batteryTemperature: Math.max(15, Math.min(35, current.batteryTemperature + (Math.random() - 0.5) * 0.5)),
        batteryCycles: current.batteryCycles,
        gridStatus: Math.random() > 0.05, // 95% uptime
        gridLoad: Math.max(0, Math.min(100, current.gridLoad + (Math.random() - 0.5) * 5)),
        gridFrequency: 50 + (Math.random() - 0.5) * 0.1,
        householdConsumption: Math.max(0, current.householdConsumption + (Math.random() - 0.5) * 1),
        totalGeneration: 0,
        totalConsumption: 0,
        efficiency: 0,
      };

      newData.totalGeneration = newData.solarGeneration + newData.windGeneration;
      newData.totalConsumption = newData.householdConsumption;
      newData.efficiency = newData.totalConsumption > 0 
        ? Math.min(100, (newData.totalGeneration / newData.totalConsumption) * 100) 
        : 100;

      const data = await storage.createEnergyData(newData);
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to simulate data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
