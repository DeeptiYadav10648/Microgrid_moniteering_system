#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"

// Wi-Fi credentials
#define WIFI_SSID "void"
#define WIFI_PASSWORD "11223344"

// Firebase project details
#define API_KEY "AIzaSyDqPztl4_g4lILzzTMMmz7hTT5g-xBnp_k"
#define DATABASE_URL "https://microgrid-monitoring-system-default-rtdb.asia-southeast1.firebasedatabase.app/"  // RTDB URL

// Define Firebase Data object
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// Relay pins
#define RELAY1 25
#define RELAY2 26
#define RELAY3 27
#define RELAY4 14

#define RELAY_ON  LOW
#define RELAY_OFF HIGH

unsigned long sendDataPrevMillis = 0;

void setup()
{
  Serial.begin(115200);

  pinMode(RELAY1, OUTPUT);
  pinMode(RELAY2, OUTPUT);
  pinMode(RELAY3, OUTPUT);
  pinMode(RELAY4, OUTPUT);

  digitalWrite(RELAY1, RELAY_OFF);
  digitalWrite(RELAY2, RELAY_OFF);
  digitalWrite(RELAY3, RELAY_OFF);
  digitalWrite(RELAY4, RELAY_OFF);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println(" connected.");

  // Firebase config
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;

  // Anonymous login
  if (Firebase.signUp(&config, &auth, "", "")) {
    Serial.println("Firebase sign up success");
  } else {
    Serial.printf("Firebase sign up failed: %s\n", config.signer.signupError.message.c_str());
  }

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
}

void loop()
{
  // Read relay states from Firebase every 1s
  if (Firebase.ready() && (millis() - sendDataPrevMillis > 1000 || sendDataPrevMillis == 0))
  {
    sendDataPrevMillis = millis();

    if (Firebase.RTDB.getInt(&fbdo, "/relays/relay1")) {
      digitalWrite(RELAY1, fbdo.intData() ? RELAY_ON : RELAY_OFF);
      Serial.printf("Relay1: %d\n", fbdo.intData());
    }

    if (Firebase.RTDB.getInt(&fbdo, "/relays/relay2")) {
      digitalWrite(RELAY2, fbdo.intData() ? RELAY_ON : RELAY_OFF);
      Serial.printf("Relay2: %d\n", fbdo.intData());
    }

    if (Firebase.RTDB.getInt(&fbdo, "/relays/relay3")) {
      digitalWrite(RELAY3, fbdo.intData() ? RELAY_ON : RELAY_OFF);
      Serial.printf("Relay3: %d\n", fbdo.intData());
    }

    if (Firebase.RTDB.getInt(&fbdo, "/relays/relay4")) {
      digitalWrite(RELAY4, fbdo.intData() ? RELAY_ON : RELAY_OFF);
      Serial.printf("Relay4: %d\n", fbdo.intData());
    }
  }
}
