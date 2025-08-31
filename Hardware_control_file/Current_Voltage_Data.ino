#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"

// *********** CONFIGURE THESE ***********
#define WIFI_SSID      "void"
#define WIFI_PASSWORD  "11223344"
#define API_KEY        "AIzaSyDqPztl4_g4lILzzTMMmz7hTT5g-xBnp_k"
#define DATABASE_URL   "https://microgrid-monitoring-system-default-rtdb.asia-southeast1.firebasedatabase.app/"
#define DEVICE_ID      "esp32-node-01"
// ****************************************

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// ---- SENSOR CONFIG ----
const int VOLTAGE_PIN = 35;   // ADC pin for voltage sensor
const int CURRENT_PIN = 34;   // ADC pin for ACS712

// Calibration constants (tune by testing!)
const float VREF = 3.3;        // ESP32 ADC reference
const int ADC_RES = 4095;      // 12-bit ADC
const float VOLTAGE_DIVIDER_RATIO = 5.0;  // e.g., 25V -> 5V scaling
const float ACS712_SENSITIVITY = 185.0;   // mV per A (185 for ACS712-5A, 100 for 20A, 66 for 30A)
const float ACS_OFFSET = 1.65; // midpoint in volts (half of VREF)


// =================== WIFI ===================
void connectWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("WiFi connecting");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.print("\nWiFi OK, IP: ");
  Serial.println(WiFi.localIP());
}

// =================== TIME ===================
void initTime() {
  configTime(0, 0, "pool.ntp.org", "time.nist.gov");
  Serial.print("Syncing time");
  time_t now = time(nullptr);
  while (now < 1700000000) {
    Serial.print(".");
    delay(500);
    now = time(nullptr);
  }
  Serial.println("\nTime synced.");
}

// =================== READ VOLTAGE ===================
float readVoltage() {
  int raw = analogRead(VOLTAGE_PIN);
  float v_out = (raw * VREF) / ADC_RES;        // ADC -> volts
  float v_in = v_out * VOLTAGE_DIVIDER_RATIO;  // scale back to real voltage
  return v_in;
}

// =================== READ CURRENT ===================
float readCurrent() {
  long sum = 0;
  int samples = 200;

  for (int i = 0; i < samples; i++) {
    int raw = analogRead(CURRENT_PIN);
    sum += raw;
    delayMicroseconds(100);
  }

  float averageRaw = sum / (float)samples;
  float v_out = (averageRaw * VREF) / ADC_RES; // Convert to volts
  float v_diff = v_out - ACS_OFFSET;           // Difference from midpoint
  float current = (v_diff * 1000.0) / ACS712_SENSITIVITY; // in Amps

  if (fabs(current) < 0.05) current = 0; // Noise filter (50mA threshold)
  return current;
}

// =================== SETUP ===================
void setup() {
  Serial.begin(115200);
  delay(200);

  connectWiFi();
  initTime();

  // Firebase config
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;

  // Anonymous sign-in
  Serial.println("Signing in anonymously…");
  if (Firebase.signUp(&config, &auth, "", "")) {
    Serial.println("Anonymous auth OK");
  } else {
    Serial.printf("SignUp error: %s\n", config.signer.signupError.message.c_str());
  }

  config.token_status_callback = tokenStatusCallback;

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
}

// =================== LOOP ===================
void loop() {
  float voltage = readVoltage();
  float current = readCurrent();
  // Debugging
  Serial.print("Voltage: "); Serial.print(voltage); Serial.println(" V");
  Serial.print("Current: "); Serial.print(current); Serial.println(" A");

  FirebaseJson json;
  json.set("ts", (int)time(nullptr));
  json.set("voltage", voltage);
  json.set("current", current);

  String path = String("/devices/") + DEVICE_ID + "/readings";
  if (Firebase.RTDB.pushJSON(&fbdo, path.c_str(), &json)) {
    Serial.printf("Pushed: %s\n", fbdo.pushName().c_str());
  } else {
    Serial.printf("Push failed: %s\n", fbdo.errorReason().c_str());
  }

  delay(5000);
}
